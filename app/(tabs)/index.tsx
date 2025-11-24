import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import { Href, useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Easing,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

/*
 * The home screen is presented when the app launches.  It shares
 * design language with the Settings page, using soft cards and
 * floating shapes, and it honours the dark/light preference stored
 * in AsyncStorage (set by the Settings page).  On the very first
 * run, the header, stats, role selection and connect button all
 * slide and fade into view; subsequent visits skip the animation
 * for a snappy experience.  A settings icon in the header
 * navigates to the settings page.  Selecting a role updates the
 * highlighted card.
 */

type ThemeMode = 'dark' | 'light';
type UserRole = 'advisor' | 'listener';

export default function HomeScreen() {
  const router = useRouter();
  // Theme preference; default to dark until loaded from storage
  const [theme, setTheme] = useState<ThemeMode>('dark');
  // Which role is currently selected
  const [selectedRole, setSelectedRole] = useState<UserRole>('advisor');
  // Track whether we've animated the entrance before
  const [hasAnimated, setHasAnimated] = useState(false);

  // Colours tied to theme
  const isDark = theme === 'dark';
  const colors = {
    bg: isDark ? '#000' : '#fff',
    cardBg: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)',
    border: isDark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.12)',
    text: isDark ? '#fff' : '#000',
    textSecondary: isDark ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.6)',
    accent: isDark ? '#fff' : '#000',
  };

  // Animated values for header, stats, roles, and connect button
  const fadeHeader = useRef(new Animated.Value(0)).current;
  // Horizontal slide animations. Start off‑screen to the left for the
  // initial reveal.  We intentionally use negative values here to
  // produce a left‑to‑right movement on the first app launch.
  const slideHeader = useRef(new Animated.Value(-40)).current;
  const fadeStats = useRef(new Animated.Value(0)).current;
  const slideStats = useRef(new Animated.Value(-40)).current;
  const fadeRoles = useRef(new Animated.Value(0)).current;
  const slideRoles = useRef(new Animated.Value(-40)).current;
  const fadeButton = useRef(new Animated.Value(0)).current;
  const slideButton = useRef(new Animated.Value(-40)).current;

  // Floating shapes animations
  const particle1 = useRef(new Animated.Value(0)).current;
  const particle2 = useRef(new Animated.Value(0)).current;
  const particle3 = useRef(new Animated.Value(0)).current;

  // Initial load: get theme preference and run entrance animation if needed
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const storedTheme = await AsyncStorage.getItem('themePreference');
        if (storedTheme === 'light' || storedTheme === 'dark') {
          setTheme(storedTheme as ThemeMode);
        }
        const animatedFlag = await AsyncStorage.getItem('homeAnimated');
        if (!animatedFlag) {
          runEntranceAnimations();
          await AsyncStorage.setItem('homeAnimated', 'true');
          setHasAnimated(true);
        } else {
          // Immediately show content without animation
          fadeHeader.setValue(1);
          slideHeader.setValue(0);
          fadeStats.setValue(1);
          slideStats.setValue(0);
          fadeRoles.setValue(1);
          slideRoles.setValue(0);
          fadeButton.setValue(1);
          slideButton.setValue(0);
          setHasAnimated(true);
        }
      } catch (err) {
        // If AsyncStorage fails, just run animations
        runEntranceAnimations();
      }
    };
    loadSettings();
    // Start floating shapes
    [particle1, particle2, particle3].forEach((particle, index) => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(particle, {
            toValue: 1,
            duration: 7000 + index * 800,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: true,
          }),
          Animated.timing(particle, {
            toValue: 0,
            duration: 7000 + index * 800,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: true,
          }),
        ])
      ).start();
    });
  }, []);

  // Whenever this screen becomes active, ensure we pick up the latest theme
  useFocusEffect(
    React.useCallback(() => {
      const syncTheme = async () => {
        try {
          const storedTheme = await AsyncStorage.getItem('themePreference');
          if (storedTheme === 'light' || storedTheme === 'dark') {
            setTheme(storedTheme as ThemeMode);
          }
        } catch (_) {
          // ignore any errors
        }
      };
      syncTheme();
    }, [])
  );

  // Function to run entrance animations in sequence
  const runEntranceAnimations = () => {
    Animated.stagger(150, [
      Animated.parallel([
        Animated.timing(fadeHeader, {
          toValue: 1,
          duration: 600,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(slideHeader, {
          toValue: 0,
          duration: 600,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
      ]),
      Animated.parallel([
        Animated.timing(fadeStats, {
          toValue: 1,
          duration: 600,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(slideStats, {
          toValue: 0,
          duration: 600,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
      ]),
      Animated.parallel([
        Animated.timing(fadeRoles, {
          toValue: 1,
          duration: 600,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(slideRoles, {
          toValue: 0,
          duration: 600,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
      ]),
      Animated.parallel([
        Animated.timing(fadeButton, {
          toValue: 1,
          duration: 600,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(slideButton, {
          toValue: 0,
          duration: 600,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
      ]),
    ]).start();
  };

  // Floating shape transforms
  const particle1Y = particle1.interpolate({ inputRange: [0, 1], outputRange: [0, -35] });
  const particle2Y = particle2.interpolate({ inputRange: [0, 1], outputRange: [0, 30] });
  const particle3Y = particle3.interpolate({ inputRange: [0, 1], outputRange: [0, -25] });

  return (
    <View style={[styles.container, { backgroundColor: colors.bg }]}> 
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
      {/* Floating shapes */}
      <Animated.View
        style={[styles.floatingShape, styles.shape1, { borderColor: colors.border, transform: [{ translateY: particle1Y }], opacity: particle1.interpolate({ inputRange: [0, 0.5, 1], outputRange: [0.05, 0.1, 0.05] }), }]}
      />
      <Animated.View
        style={[styles.floatingShape, styles.shape2, { borderColor: colors.border, transform: [{ translateY: particle2Y }], opacity: particle2.interpolate({ inputRange: [0, 0.5, 1], outputRange: [0.07, 0.14, 0.07] }), }]}
      />
      <Animated.View
        style={[styles.floatingShape, styles.shape3, { borderColor: colors.border, transform: [{ translateY: particle3Y }], opacity: particle3.interpolate({ inputRange: [0, 0.5, 1], outputRange: [0.06, 0.12, 0.06] }), }]}
      />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
        {/* Header */}
        <Animated.View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingTop: Platform.OS === 'ios' ? 60 : 40,
            paddingHorizontal: 24,
            marginBottom: 28,
            opacity: fadeHeader,
            transform: [{ translateX: slideHeader }],
          }}
        >
          {/* Profile info */}
          <TouchableOpacity activeOpacity={0.8} style={styles.profileContainer}>
            <View style={[styles.profileAvatar, { backgroundColor: colors.cardBg, borderColor: colors.border }]}> 
              <Text style={{ color: colors.text, fontSize: 20, fontWeight: '700' }}>P</Text>
            </View>
            <View style={{ marginLeft: 12 }}>
              <Text style={{ color: colors.text, fontSize: 14, fontWeight: '600' }}>Welcome</Text>
              <Text style={{ color: colors.textSecondary, fontSize: 12 }}>Priyanshu</Text>
            </View>
          </TouchableOpacity>
          {/* Settings icon */}
          <TouchableOpacity
            activeOpacity={0.8}
            // When using Expo Router with the `(tabs)` group, navigate to
            // the settings screen by including the group prefix.
            onPress={() => router.push('/(tabs)/settings')}
            style={styles.settingsButton}
          >
            <Ionicons name="settings-outline" size={24} color={colors.text} />
          </TouchableOpacity>
        </Animated.View>
        {/* Title */}
        <Animated.View
          style={{ paddingHorizontal: 24, opacity: fadeHeader, transform: [{ translateX: slideHeader }] }}
        >
          <Text style={{ color: colors.text, fontSize: 28, fontWeight: '700', marginBottom: 4 }}>Join a conversation</Text>
          <Text style={{ color: colors.textSecondary, fontSize: 14 }}>Choose your role and start connecting</Text>
        </Animated.View>
        {/* Stats */}
        <Animated.View
          style={{ flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 24, marginTop: 32, opacity: fadeStats, transform: [{ translateX: slideStats }] }}
        >
          <View style={[styles.statCard, { backgroundColor: colors.cardBg, borderColor: colors.border }] }>
            <Ionicons name="people" size={20} color={colors.accent} />
            <Text style={{ color: colors.text, fontSize: 18, fontWeight: '700', marginTop: 6 }}>12.5k</Text>
            <Text style={{ color: colors.textSecondary, fontSize: 12 }}>Online</Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: colors.cardBg, borderColor: colors.border }] }>
            <Ionicons name="chatbubbles" size={20} color={colors.accent} />
            <Text style={{ color: colors.text, fontSize: 18, fontWeight: '700', marginTop: 6 }}>2.8k</Text>
            <Text style={{ color: colors.textSecondary, fontSize: 12 }}>Active</Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: colors.cardBg, borderColor: colors.border }] }>
            <Ionicons name="heart" size={20} color={colors.accent} />
            <Text style={{ color: colors.text, fontSize: 18, fontWeight: '700', marginTop: 6 }}>98%</Text>
            <Text style={{ color: colors.textSecondary, fontSize: 12 }}>Satisfaction</Text>
          </View>
        </Animated.View>
        {/* Role selection */}
        <Animated.View
          style={{ paddingHorizontal: 24, marginTop: 32, opacity: fadeRoles, transform: [{ translateX: slideRoles }] }}
        >
          <Text style={{ color: colors.text, fontSize: 20, fontWeight: '600', marginBottom: 12 }}>Choose your role</Text>
          <TouchableOpacity
            activeOpacity={0.9}
            onPress={() => setSelectedRole('advisor')}
            style={[styles.roleCard, { backgroundColor: colors.cardBg, borderColor: selectedRole === 'advisor' ? colors.accent : colors.border }]}
          >
            <Ionicons name="mic-outline" size={32} color={colors.text} style={{ marginRight: 16 }} />
            <View style={{ flex: 1 }}>
              <Text style={{ color: colors.text, fontSize: 18, fontWeight: '600' }}>Advisor</Text>
              <Text style={{ color: colors.textSecondary, fontSize: 12 }}>Share your wisdom</Text>
              {/* Features row */}
              <View style={{ flexDirection: 'row', marginTop: 8 }}>
                <View
                  style={[
                    styles.featureItem,
                    {
                      backgroundColor: isDark
                        ? 'rgba(255,255,255,0.05)'
                        : 'rgba(0,0,0,0.05)',
                      borderColor: colors.border,
                    },
                  ]}
                >
                  <Ionicons name="mic" size={14} color={colors.accent} />
                  <Text style={[styles.featureText, { color: colors.textSecondary }]}>Voice Chat</Text>
                </View>
                <View
                  style={[
                    styles.featureItem,
                    {
                      backgroundColor: isDark
                        ? 'rgba(255,255,255,0.05)'
                        : 'rgba(0,0,0,0.05)',
                      borderColor: colors.border,
                    },
                  ]}
                >
                  <Ionicons name="time" size={14} color={colors.accent} />
                  <Text style={[styles.featureText, { color: colors.textSecondary }]}>Unlimited</Text>
                </View>
              </View>
            </View>
            {selectedRole === 'advisor' && <Ionicons name="checkmark-circle" size={24} color={colors.text} />}
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.9}
            onPress={() => setSelectedRole('listener')}
            style={[styles.roleCard, { backgroundColor: colors.cardBg, borderColor: selectedRole === 'listener' ? colors.accent : colors.border }]}
          >
            <Ionicons name="ear-outline" size={32} color={colors.text} style={{ marginRight: 16 }} />
            <View style={{ flex: 1 }}>
              <Text style={{ color: colors.text, fontSize: 18, fontWeight: '600' }}>Listener</Text>
              <Text style={{ color: colors.textSecondary, fontSize: 12 }}>Hear experiences</Text>
              {/* Features row */}
              <View style={{ flexDirection: 'row', marginTop: 8 }}>
                <View
                  style={[
                    styles.featureItem,
                    {
                      backgroundColor: isDark
                        ? 'rgba(255,255,255,0.05)'
                        : 'rgba(0,0,0,0.05)',
                      borderColor: colors.border,
                    },
                  ]}
                >
                  <Ionicons name="ear" size={14} color={colors.accent} />
                  <Text style={[styles.featureText, { color: colors.textSecondary }]}>Listen Mode</Text>
                </View>
                <View
                  style={[
                    styles.featureItem,
                    {
                      backgroundColor: isDark
                        ? 'rgba(255,255,255,0.05)'
                        : 'rgba(0,0,0,0.05)',
                      borderColor: colors.border,
                    },
                  ]}
                >
                  <Ionicons name="shield-checkmark" size={14} color={colors.accent} />
                  <Text style={[styles.featureText, { color: colors.textSecondary }]}>Anonymous</Text>
                </View>
              </View>
            </View>
            {selectedRole === 'listener' && <Ionicons name="checkmark-circle" size={24} color={colors.text} />}
          </TouchableOpacity>
        </Animated.View>
        {/* Connect button */}
        <Animated.View
          style={{ paddingHorizontal: 24, marginTop: 32, opacity: fadeButton, transform: [{ translateX: slideButton }] }}
        >
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={() => router.push('/connecting' as Href)}
            style={[styles.connectButton, { backgroundColor: colors.cardBg, borderColor: colors.border }] }
          >
            <Ionicons
              name={selectedRole === 'advisor' ? 'mic' : 'ear'}
              size={20}
              color={colors.text}
              style={{ marginRight: 12 }}
            />
            <Text style={{ color: colors.text, fontSize: 16, fontWeight: '600' }}>Start Connection</Text>
            <Ionicons name="arrow-forward" size={20} color={colors.text} style={{ marginLeft: 12 }} />
          </TouchableOpacity>
        </Animated.View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  floatingShape: {
    position: 'absolute',
    borderWidth: 1,
  },
  shape1: {
    width: 80,
    height: 80,
    borderRadius: 40,
    top: '10%',
    right: '8%',
  },
  shape2: {
    width: 70,
    height: 70,
    borderRadius: 35,
    top: '50%',
    left: '6%',
  },
  shape3: {
    width: 90,
    height: 90,
    borderRadius: 45,
    bottom: '15%',
    right: '15%',
  },
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
  },
  settingsButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statCard: {
    flex: 1,
    borderRadius: 16,
    borderWidth: 1,
    paddingVertical: 12,
    paddingHorizontal: 14,
    alignItems: 'center',
    marginHorizontal: 4,
  },
  roleCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 20,
    paddingVertical: 16,
    paddingHorizontal: 18,
    marginBottom: 12,
  },
  connectButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderRadius: 22,
    paddingVertical: 16,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 12,
    borderWidth: 1,
    marginRight: 8,
  },
  featureText: {
    fontSize: 12,
    marginLeft: 4,
  },
});