import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Href, useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
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
 * A transient screen shown while the app is connecting the user to a random
 * partner.  It measures network latency, calls a backend API to create or
 * join a room and displays a pulsing loader.  When the connection
 * completes successfully it navigates to the call screen with the
 * associated room id.  Users can cancel the search at any time.
 */

type ThemeMode = 'dark' | 'light';

export default function ConnectingScreen() {
  const router = useRouter();
  // role passed from the home screen (advisor or listener)
  const params = useLocalSearchParams<{ role?: string }>();
  const role = (params?.role === 'listener' ? 'listener' : 'advisor') as
    | 'advisor'
    | 'listener';
  // theme state
  const [theme, setTheme] = useState<ThemeMode>('dark');
  // status message displayed under the loader
  const [status, setStatus] = useState('');
  // animated values for pulsing circles
  const pulse1 = useRef(new Animated.Value(0)).current;
  const pulse2 = useRef(new Animated.Value(0)).current;
  const pulse3 = useRef(new Animated.Value(0)).current;
  // track whether we've attempted to connect
  const [connecting, setConnecting] = useState(false);

  // derive colours based on theme
  const isDark = theme === 'dark';
  const colors = {
    bg: isDark ? '#000' : '#fff',
    text: isDark ? '#fff' : '#000',
    textSecondary: isDark ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.7)',
    accent: '#a855f7', // purple accent on connecting screen
    cardBg: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)',
    border: isDark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.15)',
  };

  // Load theme preference on mount
  useEffect(() => {
    const loadTheme = async () => {
      const storedTheme = await AsyncStorage.getItem('themePreference');
      if (storedTheme === 'light' || storedTheme === 'dark') {
        setTheme(storedTheme as ThemeMode);
      }
    };
    loadTheme();
  }, []);

  // Kick off network checks and connection when component mounts
  useEffect(() => {
    let cancelled = false;
    const performConnection = async () => {
      setConnecting(true);
      setStatus('Checking connection quality…');
      // Measure latency via a simple ping to the backend; adjust the URL to your server
      const baseUrl = 'http://localhost:3000';
      const token = await AsyncStorage.getItem('userToken');
      try {
        const pingStart = Date.now();
        await fetch(baseUrl + '/ping');
        const latency = Date.now() - pingStart;
        if (!cancelled) {
          if (latency > 1500) {
            // latency in ms – adjust threshold to suit your needs
            setStatus('Slow network detected. Trying anyway…');
          } else {
            setStatus('Network OK. Finding partner…');
          }
          // Call backend to create or join a room.  Pass role and token for auth.
          const resp = await fetch(baseUrl + '/connect', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: token ? `Bearer ${token}` : '',
            },
            body: JSON.stringify({ role }),
          });
          if (!resp.ok) throw new Error('Server error');
          const data = await resp.json();
          // `data.roomId` and `data.joinParams` should come from your backend
          const { roomId, joinParams } = data;
          setStatus('Connecting…');
          // Navigate to call screen with room info; using replace to not allow back
          router.push('/call' as Href);
        }
      } catch (e) {
        if (!cancelled) {
          setStatus('Connection failed. Please try again.');
          setConnecting(false);
        }
      }
    };
    performConnection();
    // Start the pulsing animations
    [pulse1, pulse2, pulse3].forEach((pulse, index) => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulse, {
            toValue: 1,
            duration: 2000,
            delay: index * 400,
            easing: Easing.out(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(pulse, {
            toValue: 0,
            duration: 0,
            useNativeDriver: true,
          }),
        ])
      ).start();
    });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <View style={[styles.container, { backgroundColor: colors.bg }]}> 
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
      <View style={styles.centerArea}>
        {/* Pulsing ripples */}
        <Animated.View
          style={[
            styles.ripple,
            {
              borderColor: colors.accent,
              opacity: pulse1.interpolate({ inputRange: [0, 1], outputRange: [0.4, 0] }),
              transform: [
                {
                  scale: pulse1.interpolate({ inputRange: [0, 1], outputRange: [1, 3] }),
                },
              ],
            },
          ]}
        />
        <Animated.View
          style={[
            styles.ripple,
            {
              borderColor: colors.accent,
              opacity: pulse2.interpolate({ inputRange: [0, 1], outputRange: [0.4, 0] }),
              transform: [
                {
                  scale: pulse2.interpolate({ inputRange: [0, 1], outputRange: [1, 3] }),
                },
              ],
            },
          ]}
        />
        <Animated.View
          style={[
            styles.ripple,
            {
              borderColor: colors.accent,
              opacity: pulse3.interpolate({ inputRange: [0, 1], outputRange: [0.4, 0] }),
              transform: [
                {
                  scale: pulse3.interpolate({ inputRange: [0, 1], outputRange: [1, 3] }),
                },
              ],
            },
          ]}
        />
        {/* Central icon with spinning animation */}
        <View style={styles.centerIconWrapper}>
          <Ionicons name={role === 'advisor' ? 'mic' : 'ear'} size={48} color={colors.bg} />
        </View>
      </View>
      {/* Status and cancel button */}
      <View style={{ alignItems: 'center', marginTop: 32 }}>
        <Text style={{ color: colors.text, fontSize: 20, fontWeight: '600', marginBottom: 8 }}>Connecting…</Text>
        <Text style={{ color: colors.textSecondary, fontSize: 14, textAlign: 'center' }}>{status}</Text>
        <TouchableOpacity
          onPress={() => {
            // Cancel and go back to home
            // Navigate back to the home screen.  The root route '/' maps
            // to the index.tsx in the (tabs) group.
            router.replace('/' as Href);
          }}
          style={[styles.cancelButton, { borderColor: colors.border, backgroundColor: colors.cardBg }]}
          activeOpacity={0.8}
        >
          <Ionicons name="close" size={20} color={colors.text} style={{ marginRight: 8 }} />
          <Text style={{ color: colors.text, fontSize: 16, fontWeight: '600' }}>Cancel</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  centerArea: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 200,
    width: 200,
  },
  ripple: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    borderWidth: 2,
  },
  centerIconWrapper: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#a855f7',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cancelButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 24,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 20,
    borderWidth: 1,
  },
});