import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Href, useLocalSearchParams, useRouter } from 'expo-router';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
    Animated,
    Easing,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

/*
 * The call screen is presented once the backend pairs two users and a room
 * has been created.  It shows a large animated circle representing the
 * ongoing audio stream and provides controls for muting, toggling the
 * speaker/earpiece, skipping to the next partner, and ending the call.
 * On end call, the user is taken to a review screen.
 *
 * Note: The actual media handling is left as pseudo‑code, because it
 * requires integrating mediasoup-client with react-native-webrtc.  See
 * mediasoup documentation for detailed instructions on how to create
 * transports and producers/consumers in React Native【277649905340826†L12-L21】.
 */

type ThemeMode = 'dark' | 'light';

export default function CallScreen() {
  const router = useRouter();
  // Extract params from the route: roomId and role
  const params = useLocalSearchParams<{ roomId?: string; role?: string }>();
  const roomId = params?.roomId ?? '';
  const roleParam = params?.role === 'listener' ? 'listener' : 'advisor';
    
  // Theme state
  const [theme, setTheme] = useState<ThemeMode>('dark');
  const isDark = theme === 'dark';
  const colors = {
    bg: isDark ? '#0a0118' : '#f5f5f5',
    text: isDark ? '#fff' : '#000',
    textSecondary: isDark ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.7)',
    accent: '#a855f7', // purple accent for call screen
    cardBg: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)',
    border: isDark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.15)',
  };

  // Call controls state
  const [muted, setMuted] = useState(false);
  const [speakerOn, setSpeakerOn] = useState(true);
  const [callTime, setCallTime] = useState(0);
  // Animated values for pulsing circle
  const pulse = useRef(new Animated.Value(0)).current;

  // Load theme on mount
  useEffect(() => {
    const loadTheme = async () => {
      const storedTheme = await AsyncStorage.getItem('themePreference');
      if (storedTheme === 'light' || storedTheme === 'dark') {
        setTheme(storedTheme as ThemeMode);
      }
    };
    loadTheme();
  }, []);

  useEffect(() => {
    let timerId: ReturnType<typeof setInterval>;
    let cancelled = false;
    const startCall = async () => {
      // Pseudo‑code for mediasoup integration.  In a real implementation you
      // would import registerGlobals from mediasoup-client and call it
      // before creating a new Device.  Then you would create a send
      // transport, produce your microphone track, create a receive
      // transport, and consume the remote audio track.  See the docs
      // referenced for guidance【277649905340826†L12-L21】.  For example:
      //
      // import { Device } from 'mediasoup-client';
      // import { registerGlobals } from 'mediasoup-client/ReactNative';
      // import { mediaDevices } from 'react-native-webrtc';
      // registerGlobals();
      // const device = new Device({ handlerName: 'ReactNative' });
      // await device.load({ routerRtpCapabilities: params.rtpCapabilities });
      // const transport = device.createSendTransport(...);
      // const stream = await mediaDevices.getUserMedia({ audio: true, video: false });
      // const track = stream.getAudioTracks()[0];
      // const producer = await transport.produce({ track });
      // etc.
      //
      // For mute/unmute you can call track.enabled = !muted;
      // For speaker toggle you can use a library such as react-native-incall-manager.
      // Start call timer
      
      timerId = setInterval(() => {
        setCallTime((t) => t + 1);
      }, 1000);
    };
    startCall();
    // Start pulsing animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, {
          toValue: 1,
          duration: 2000,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(pulse, {
          toValue: 0,
          duration: 0,
          useNativeDriver: true,
        }),
      ])
    ).start();
    return () => {
      cancelled = true;
      clearInterval(timerId);
      // Clean up media resources here: close transports, producers, consumers
    };
  }, []);

  // Helper to format call time in mm:ss
  const formatTime = useCallback((t: number) => {
    const minutes = Math.floor(t / 60)
      .toString()
      .padStart(2, '0');
    const seconds = (t % 60).toString().padStart(2, '0');
    return `${minutes}:${seconds}`;
  }, []);

  // Handlers for controls
  const toggleMute = () => {
    setMuted((m) => !m);
    // In a real call, toggle the enabled property on the outgoing track
  };
  const toggleSpeaker = () => {
    setSpeakerOn((s) => !s);
    // Use react-native-incall-manager to set speaker/earpiece audio route
  };
  const handleSkip = () => {
    // Navigate back to connecting screen with same role
    router.push('/connecting' as Href);
  };
  const handleEndCall = () => {
    // Navigate to review screen and stop call
    router.push('/review' as Href);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.bg }]}> 
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
      {/* Header */}
      <View style={styles.header}>
        <Text style={{ color: colors.textSecondary, fontSize: 14 }}>Anonymous Call</Text>
        <Text style={{ color: colors.text, fontSize: 18, fontWeight: '600' }}>{formatTime(callTime)}</Text>
      </View>
      {/* Pulsing circle */}
      <View style={styles.centerArea}>
        <Animated.View
          style={[
            styles.pulseCircle,
            {
              backgroundColor: colors.accent,
              opacity: pulse.interpolate({ inputRange: [0, 1], outputRange: [0.6, 0.3] }),
              transform: [
                {
                  scale: pulse.interpolate({ inputRange: [0, 1], outputRange: [1, 2] }),
                },
              ],
            },
          ]}
        />
        <View
          style={[
            styles.innerCircle,
            { backgroundColor: colors.accent },
          ]}
        >
          <Ionicons
            name={roleParam === 'advisor' ? (muted ? 'mic-off' : 'mic') : 'ear'}
            size={40}
            color={colors.bg}
          />
        </View>
      </View>
      {/* Controls */}
      <View style={styles.controlsRow}>
        {/* Mute */}
        <TouchableOpacity
          onPress={toggleMute}
          activeOpacity={0.8}
          style={[styles.controlButton, { backgroundColor: muted ? colors.accent : colors.cardBg, borderColor: colors.border }]}
        >
          <Ionicons
            name={muted ? 'mic-off' : 'mic'}
            size={24}
            color={muted ? colors.bg : colors.text}
          />
          <Text style={{ color: muted ? colors.bg : colors.text, marginTop: 4, fontSize: 12 }}>Mute</Text>
        </TouchableOpacity>
        {/* Speaker toggle */}
        <TouchableOpacity
          onPress={toggleSpeaker}
          activeOpacity={0.8}
          style={[styles.controlButton, { backgroundColor: speakerOn ? colors.cardBg : colors.cardBg, borderColor: colors.border }]}
        >
          <Ionicons
            name={speakerOn ? 'volume-high' : 'headset'}
            size={24}
            color={colors.text}
          />
          <Text style={{ color: colors.text, marginTop: 4, fontSize: 12 }}>Speaker</Text>
        </TouchableOpacity>
        {/* Skip */}
        <TouchableOpacity
          onPress={handleSkip}
          activeOpacity={0.8}
          style={[styles.controlButton, { backgroundColor: colors.cardBg, borderColor: colors.border }]}
        >
          <Ionicons name="play-skip-forward" size={24} color={colors.text} />
          <Text style={{ color: colors.text, marginTop: 4, fontSize: 12 }}>Skip</Text>
        </TouchableOpacity>
        {/* End Call */}
        <TouchableOpacity
          onPress={handleEndCall}
          activeOpacity={0.8}
          style={[styles.controlButton, { backgroundColor: colors.accent, borderColor: colors.border }]}
        >
          <Ionicons name="call" size={24} color={colors.bg} />
          <Text style={{ color: colors.bg, marginTop: 4, fontSize: 12 }}>End</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
  },
  centerArea: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  pulseCircle: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
  },
  innerCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  controlsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 20,
  },
  controlButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderWidth: 1,
    borderRadius: 16,
    marginHorizontal: 4,
  },
});