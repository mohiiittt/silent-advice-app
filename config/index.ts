/**
 * App Configuration
 * Update these values according to your setup
 */

export const config = {
  // Server Configuration
  server: {
    // TODO: Replace with your actual server URL
    url: 'http://localhost:3000',
    // url: 'https://your-production-server.com',
    
    // Socket.IO options
    socketOptions: {
      transports: ['websocket'],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      timeout: 10000,
    },
  },

  // Audio Configuration
  audio: {
    // Audio constraints for getUserMedia
    constraints: {
      echoCancellation: true,
      noiseSuppression: true,
      autoGainControl: true,
      sampleRate: 48000,
      channelCount: 1,
    },

    // MediaSoup codec options
    codecOptions: {
      opusStereo: false,
      opusDtx: true,
      opusFec: true,
      opusPtime: 20,
      opusMaxPlaybackRate: 48000,
    },
  },

  // Matching Configuration
  matching: {
    // Timeout for finding a match (milliseconds)
    timeout: 60000, // 60 seconds

    // Available languages
    languages: [
      { code: 'en', name: 'English' },
      { code: 'es', name: 'Spanish' },
      { code: 'fr', name: 'French' },
      { code: 'de', name: 'German' },
      { code: 'hi', name: 'Hindi' },
      { code: 'zh', name: 'Chinese' },
      { code: 'ar', name: 'Arabic' },
      { code: 'pt', name: 'Portuguese' },
      { code: 'ru', name: 'Russian' },
      { code: 'ja', name: 'Japanese' },
    ],

    // Default language
    defaultLanguage: 'en',
  },

  // UI Configuration
  ui: {
    // Theme colors
    colors: {
      background: {
        primary: '#1a1a2e',
        secondary: '#16213e',
        tertiary: '#0f3460',
      },
      advisor: {
        primary: '#e94560',
        secondary: '#ff6b9d',
      },
      listener: {
        primary: '#4ecca3',
        secondary: '#45b7d1',
      },
      text: {
        primary: '#ffffff',
        secondary: '#a0a0c0',
        disabled: '#6a6a8a',
      },
      card: {
        active: '#2a2a3e',
        inactive: '#1f1f2e',
      },
    },

    // Animation durations (milliseconds)
    animations: {
      fadeIn: 800,
      scalePress: 100,
      pulseExpand: 1000,
      pulseContract: 1000,
    },

    // Spacing
    spacing: {
      xs: 4,
      sm: 8,
      md: 16,
      lg: 20,
      xl: 30,
      xxl: 40,
    },

    // Border radius
    borderRadius: {
      small: 10,
      medium: 20,
      large: 30,
      circle: 9999,
    },
  },

  // Call Configuration
  call: {
    // Maximum call duration (milliseconds)
    maxDuration: 1800000, // 30 minutes

    // Warning before call ends (milliseconds)
    warningBeforeEnd: 60000, // 1 minute

    // Auto-disconnect on inactivity (milliseconds)
    inactivityTimeout: 300000, // 5 minutes
  },

  // Feature Flags
  features: {
    enableLanguageSelection: true,
    enableCallRecording: false, // Privacy: Keep disabled
    enableReporting: true,
    enableRating: true,
    enableCallHistory: false, // Privacy: Keep disabled
  },

  // Development Configuration
  dev: {
    // Enable debug logging
    enableLogging: __DEV__,
    
    // Mock server responses (for testing without backend)
    mockMode: false,
    
    // Simulated connection delay (milliseconds)
    simulatedDelay: 2000,
  },

  // App Information
  app: {
    name: 'Anonymous Voice',
    version: '1.0.0',
    description: 'Connect. Listen. Advise.',
  },
};

// Helper function to get server URL based on environment
export const getServerUrl = (): string => {
  if (__DEV__) {
    return config.server.url;
  }
  // In production, use the production URL
  return config.server.url;
};

// Helper function to check if feature is enabled
export const isFeatureEnabled = (feature: keyof typeof config.features): boolean => {
  return config.features[feature];
};

// Helper function to get language options
export const getLanguageOptions = () => {
  return config.matching.languages;
};

export default config;
