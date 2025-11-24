import { Device } from 'mediasoup-client';
import { Transport, Producer, Consumer } from 'mediasoup-client/lib/types';
import io, { Socket } from 'socket.io-client';

// Replace with your server URL
const SERVER_URL = 'http://your-server-url:3000';

export interface MediasoupConfig {
  userRole: 'advisor' | 'listener';
  userId: string;
  language: string;
}

export class MediasoupService {
  private socket: Socket | null = null;
  private device: Device | null = null;
  private producerTransport: Transport | null = null;
  private consumerTransport: Transport | null = null;
  private producer: Producer | null = null;
  private consumer: Consumer | null = null;
  private config: MediasoupConfig | null = null;
  private isConnected: boolean = false;

  // Event callbacks
  public onConnectionStateChange: ((state: string) => void) | null = null;
  public onPeerConnected: ((peerId: string) => void) | null = null;
  public onPeerDisconnected: (() => void) | null = null;
  public onError: ((error: Error) => void) | null = null;

  /**
   * Initialize the MediaSoup connection
   */
  async connect(config: MediasoupConfig): Promise<void> {
    try {
      this.config = config;
      this.updateConnectionState('Connecting to server...');

      // Initialize Socket.IO connection
      this.socket = io(SERVER_URL, {
        transports: ['websocket'],
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
      });

      // Set up socket event listeners
      this.setupSocketListeners();

      // Wait for socket connection
      await this.waitForSocketConnection();

      // Create MediaSoup device
      this.device = new Device();

      // Get router RTP capabilities from server
      this.updateConnectionState('Getting server capabilities...');
      const rtpCapabilities = await this.getRtpCapabilities();
      
      // Load device with RTP capabilities
      await this.device.load({ routerRtpCapabilities: rtpCapabilities });

      // Create transports for sending and receiving audio
      this.updateConnectionState('Creating transport...');
      await this.createTransports();

      // Start finding a match
      this.updateConnectionState('Finding a match...');
      this.findMatch();

      this.isConnected = true;
    } catch (error) {
      console.error('Connection error:', error);
      this.handleError(error as Error);
      throw error;
    }
  }

  /**
   * Set up Socket.IO event listeners
   */
  private setupSocketListeners(): void {
    if (!this.socket) return;

    this.socket.on('connect', () => {
      console.log('Socket connected');
      this.updateConnectionState('Connected to server');
    });

    this.socket.on('disconnect', () => {
      console.log('Socket disconnected');
      this.updateConnectionState('Disconnected');
    });

    this.socket.on('error', (error: any) => {
      console.error('Socket error:', error);
      this.handleError(new Error(error.message || 'Socket error'));
    });

    // Match found event
    this.socket.on('match-found', async (data: { peerId: string }) => {
      console.log('Match found:', data.peerId);
      this.updateConnectionState('Match found! Connecting...');
      
      if (this.onPeerConnected) {
        this.onPeerConnected(data.peerId);
      }

      // Start producing and consuming audio
      await this.startAudioExchange();
    });

    // Peer disconnected event
    this.socket.on('peer-disconnected', () => {
      console.log('Peer disconnected');
      this.updateConnectionState('Peer disconnected');
      
      if (this.onPeerDisconnected) {
        this.onPeerDisconnected();
      }
    });

    // Consumer created event
    this.socket.on('new-consumer', async (data: any) => {
      await this.consumeAudio(data);
    });
  }

  /**
   * Wait for socket connection
   */
  private waitForSocketConnection(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.socket) {
        reject(new Error('Socket not initialized'));
        return;
      }

      if (this.socket.connected) {
        resolve();
        return;
      }

      const timeout = setTimeout(() => {
        reject(new Error('Socket connection timeout'));
      }, 10000);

      this.socket.once('connect', () => {
        clearTimeout(timeout);
        resolve();
      });

      this.socket.once('connect_error', (error: Error) => {
        clearTimeout(timeout);
        reject(error);
      });
    });
  }

  /**
   * Get RTP capabilities from server
   */
  private getRtpCapabilities(): Promise<any> {
    return new Promise((resolve, reject) => {
      if (!this.socket) {
        reject(new Error('Socket not initialized'));
        return;
      }

      this.socket.emit('get-rtp-capabilities', {}, (response: any) => {
        if (response.error) {
          reject(new Error(response.error));
        } else {
          resolve(response.rtpCapabilities);
        }
      });
    });
  }

  /**
   * Create producer and consumer transports
   */
  private async createTransports(): Promise<void> {
    if (!this.socket || !this.device) {
      throw new Error('Socket or device not initialized');
    }

    // Create producer transport (for sending audio)
    const producerTransportData = await this.createTransport('producer');
    this.producerTransport = this.device.createSendTransport(producerTransportData);

    // Create consumer transport (for receiving audio)
    const consumerTransportData = await this.createTransport('consumer');
    this.consumerTransport = this.device.createRecvTransport(consumerTransportData);

    // Set up transport event handlers
    this.setupTransportHandlers();
  }

  /**
   * Create a transport on the server
   */
  private createTransport(type: 'producer' | 'consumer'): Promise<any> {
    return new Promise((resolve, reject) => {
      if (!this.socket) {
        reject(new Error('Socket not initialized'));
        return;
      }

      this.socket.emit('create-transport', { type }, (response: any) => {
        if (response.error) {
          reject(new Error(response.error));
        } else {
          resolve(response);
        }
      });
    });
  }

  /**
   * Set up transport event handlers
   */
  private setupTransportHandlers(): void {
    if (!this.producerTransport || !this.consumerTransport || !this.socket) {
      return;
    }

    // Producer transport events
    this.producerTransport.on('connect', async ({ dtlsParameters }, callback, errback) => {
      try {
        await this.emitSocket('connect-transport', {
          transportId: this.producerTransport!.id,
          dtlsParameters,
        });
        callback();
      } catch (error) {
        errback(error as Error);
      }
    });

    this.producerTransport.on('produce', async ({ kind, rtpParameters }, callback, errback) => {
      try {
        const { id } = await this.emitSocket('produce', {
          transportId: this.producerTransport!.id,
          kind,
          rtpParameters,
        });
        callback({ id });
      } catch (error) {
        errback(error as Error);
      }
    });

    // Consumer transport events
    this.consumerTransport.on('connect', async ({ dtlsParameters }, callback, errback) => {
      try {
        await this.emitSocket('connect-transport', {
          transportId: this.consumerTransport!.id,
          dtlsParameters,
        });
        callback();
      } catch (error) {
        errback(error as Error);
      }
    });
  }

  /**
   * Find a match with another user
   */
  private findMatch(): void {
    if (!this.socket || !this.config) return;

    this.socket.emit('find-match', {
      role: this.config.userRole,
      language: this.config.language,
      userId: this.config.userId,
    });
  }

  /**
   * Start audio exchange (produce and consume)
   */
  private async startAudioExchange(): Promise<void> {
    try {
      // Get user's audio stream
      const stream = await this.getUserAudioStream();
      const audioTrack = stream.getAudioTracks()[0];

      // Produce audio
      if (this.producerTransport && audioTrack) {
        this.producer = await this.producerTransport.produce({
          track: audioTrack,
          codecOptions: {
            opusStereo: true,
            opusDtx: true,
          },
        });

        console.log('Audio producer created:', this.producer.id);
        this.updateConnectionState('Connected! You can now talk.');
      }

      // Request to consume peer's audio
      if (this.socket) {
        this.socket.emit('request-consume', {
          rtpCapabilities: this.device!.rtpCapabilities,
        });
      }
    } catch (error) {
      console.error('Error starting audio exchange:', error);
      this.handleError(error as Error);
    }
  }

  /**
   * Get user's audio stream
   */
  private async getUserAudioStream(): Promise<MediaStream> {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
        video: false,
      });
      return stream;
    } catch (error) {
      console.error('Error getting audio stream:', error);
      throw new Error('Could not access microphone. Please grant permission.');
    }
  }

  /**
   * Consume audio from peer
   */
  private async consumeAudio(data: any): Promise<void> {
    try {
      if (!this.consumerTransport || !this.device) {
        throw new Error('Consumer transport or device not initialized');
      }

      const { producerId, id, kind, rtpParameters } = data;

      this.consumer = await this.consumerTransport.consume({
        id,
        producerId,
        kind,
        rtpParameters,
      });

      // Get the audio track and play it
      const { track } = this.consumer;
      const stream = new MediaStream([track]);
      
      // Create audio element to play the stream
      const audioElement = new Audio();
      audioElement.srcObject = stream;
      audioElement.play().catch(e => console.error('Error playing audio:', e));

      console.log('Audio consumer created:', this.consumer.id);
    } catch (error) {
      console.error('Error consuming audio:', error);
      this.handleError(error as Error);
    }
  }

  /**
   * Mute/unmute microphone
   */
  public toggleMute(): boolean {
    if (this.producer) {
      if (this.producer.paused) {
        this.producer.resume();
        return false; // Not muted
      } else {
        this.producer.pause();
        return true; // Muted
      }
    }
    return false;
  }

  /**
   * End the call and disconnect
   */
  public async disconnect(): Promise<void> {
    try {
      // Close producer
      if (this.producer) {
        this.producer.close();
        this.producer = null;
      }

      // Close consumer
      if (this.consumer) {
        this.consumer.close();
        this.consumer = null;
      }

      // Close transports
      if (this.producerTransport) {
        this.producerTransport.close();
        this.producerTransport = null;
      }

      if (this.consumerTransport) {
        this.consumerTransport.close();
        this.consumerTransport = null;
      }

      // Disconnect socket
      if (this.socket) {
        this.socket.emit('leave-room');
        this.socket.disconnect();
        this.socket = null;
      }

      this.isConnected = false;
      this.updateConnectionState('Disconnected');
    } catch (error) {
      console.error('Error disconnecting:', error);
      this.handleError(error as Error);
    }
  }

  /**
   * Helper method to emit socket events with promise
   */
  private emitSocket(event: string, data: any): Promise<any> {
    return new Promise((resolve, reject) => {
      if (!this.socket) {
        reject(new Error('Socket not initialized'));
        return;
      }

      this.socket.emit(event, data, (response: any) => {
        if (response.error) {
          reject(new Error(response.error));
        } else {
          resolve(response);
        }
      });
    });
  }

  /**
   * Update connection state
   */
  private updateConnectionState(state: string): void {
    console.log('Connection state:', state);
    if (this.onConnectionStateChange) {
      this.onConnectionStateChange(state);
    }
  }

  /**
   * Handle errors
   */
  private handleError(error: Error): void {
    console.error('MediaSoup service error:', error);
    if (this.onError) {
      this.onError(error);
    }
  }

  /**
   * Check if connected
   */
  public getIsConnected(): boolean {
    return this.isConnected;
  }

  /**
   * Get current config
   */
  public getConfig(): MediasoupConfig | null {
    return this.config;
  }
}

// Export singleton instance
export const mediasoupService = new MediasoupService();
