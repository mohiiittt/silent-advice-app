export type UserRole = 'advisor' | 'listener';

export interface User {
  id: string;
  role: UserRole;
  language: string;
  isAnonymous: boolean;
}

export interface ConnectionState {
  status: 'idle' | 'connecting' | 'connected' | 'disconnected' | 'error';
  message: string;
  peerId?: string;
}

export interface AudioSettings {
  echoCancellation: boolean;
  noiseSuppression: boolean;
  autoGainControl: boolean;
}

export interface MatchPreferences {
  language: string;
  role: UserRole;
}
