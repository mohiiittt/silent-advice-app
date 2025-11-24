import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Dimensions,
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
 * The settings screen provides controls for theme, notifications, privacy and
 * preferences.  It uses a clean minimal design with subtle animations and
 * floating shapes, matching the look of the home screen.  The selected
 * theme persists via AsyncStorage and is loaded on mount.  Custom
 * toggles mirror the style of the cards and adapt to dark/light mode.
 */

const { width, height } = Dimensions.get('window');

type ThemeMode = 'dark' | 'light';
type NotificationLevel = 'all' | 'important' | 'none';
type PrivacyLevel = 'public' | 'friends' | 'private';

export default function SettingsScreen() {
  const [theme, setTheme] = useState<ThemeMode>('dark');
  const [notificationLevel, setNotificationLevel] = useState<NotificationLevel>('all');
  const [privacyLevel, setPrivacyLevel] = useState<PrivacyLevel>('private');
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [autoConnect, setAutoConnect] = useState(false);
  const [dataPreference, setDataPreference] = useState(false);

  // Switch animations (unused but reserved for future enhancements)
  const soundSwitchAnim = useRef(new Animated.Value(1)).current;
  const autoConnectSwitchAnim = useRef(new Animated.Value(0)).current;
  const dataSwitchAnim = useRef(new Animated.Value(0)).current;

  // Entrance animations
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideUp = useRef(new Animated.Value(50)).current;
  const wheelRotation = useRef(new Animated.Value(0)).current;
  const themeTransition = useRef(new Animated.Value(0)).current;

  // Floating particles
  const particle1 = useRef(new Animated.Value(0)).current;
  const particle2 = useRef(new Animated.Value(0)).current;
  const particle3 = useRef(new Animated.Value(0)).current;

  const isDark = theme === 'dark';
  const colors = {
    bg: isDark ? '#000' : '#fff',
    text: isDark ? '#fff' : '#000',
    textSecondary: isDark ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.6)',
    border: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
    cardBg: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)',
    accent: isDark ? '#fff' : '#000',
  };

  // Load theme from AsyncStorage on mount
  useEffect(() => {
    const loadTheme = async () => {
      try {
        const storedTheme = await AsyncStorage.getItem('themePreference');
        if (storedTheme === 'light' || storedTheme === 'dark') {
          setTheme(storedTheme as ThemeMode);
          themeTransition.setValue(storedTheme === 'dark' ? 0 : 1);
          wheelRotation.setValue(storedTheme === 'dark' ? 0 : 1);
        }
      } catch (_) {
        // ignore errors
      }
    };
    loadTheme();
  }, []);

  // Entrance animations and particles
  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(slideUp, {
        toValue: 0,
        duration: 800,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start();
    startParticleAnimations();
  }, []);

  const startParticleAnimations = () => {
    [particle1, particle2, particle3].forEach((particle, index) => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(particle, {
            toValue: 1,
            duration: 6000 + index * 800,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: true,
          }),
          Animated.timing(particle, {
            toValue: 0,
            duration: 6000 + index * 800,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: true,
          }),
        ])
      ).start();
    });
  };

  // Toggle theme and persist preference
  const handleThemeToggle = async () => {
    const newTheme: ThemeMode = theme === 'dark' ? 'light' : 'dark';
    // Animate wheel rotation and theme transition
    Animated.parallel([
      Animated.spring(wheelRotation, {
        toValue: newTheme === 'dark' ? 0 : 1,
        tension: 80,
        friction: 10,
        useNativeDriver: true,
      }),
      Animated.timing(themeTransition, {
        toValue: newTheme === 'dark' ? 0 : 1,
        duration: 400,
        easing: Easing.bezier(0.4, 0, 0.2, 1),
        useNativeDriver: false,
      }),
    ]).start();
    setTheme(newTheme);
    try {
      await AsyncStorage.setItem('themePreference', newTheme);
    } catch (_) {
      // ignore errors
    }
  };

  const handleNotificationWheel = () => {
    const levels: NotificationLevel[] = ['all', 'important', 'none'];
    const currentIndex = levels.indexOf(notificationLevel);
    const nextIndex = (currentIndex + 1) % levels.length;
    setNotificationLevel(levels[nextIndex]);
  };

  const handlePrivacyWheel = () => {
    const levels: PrivacyLevel[] = ['public', 'friends', 'private'];
    const currentIndex = levels.indexOf(privacyLevel);
    const nextIndex = (currentIndex + 1) % levels.length;
    setPrivacyLevel(levels[nextIndex]);
  };

  const wheelRotate = wheelRotation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg'],
  });
  const bgColor = themeTransition.interpolate({
    inputRange: [0, 1],
    outputRange: ['#000000', '#ffffff'],
  });
  const particle1Y = particle1.interpolate({ inputRange: [0, 1], outputRange: [0, -40] });
  const particle2Y = particle2.interpolate({ inputRange: [0, 1], outputRange: [0, 30] });
  const particle3Y = particle3.interpolate({ inputRange: [0, 1], outputRange: [0, -25] });

  return (
    <Animated.View style={[styles.container, { backgroundColor: bgColor }]}> 
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
      {/* Floating shapes */}
      <Animated.View
        style={[
          styles.floatingShape,
          styles.shape1,
          {
            borderColor: colors.border,
            transform: [
              { translateY: particle1Y },
              {
                rotate: particle1.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '90deg'] }),
              },
            ],
            opacity: particle1.interpolate({ inputRange: [0, 0.5, 1], outputRange: [0.05, 0.1, 0.05] }),
          },
        ]}
      />
      <Animated.View
        style={[
          styles.floatingShape,
          styles.shape2,
          {
            borderColor: colors.border,
            transform: [{ translateY: particle2Y }],
            opacity: particle2.interpolate({ inputRange: [0, 0.5, 1], outputRange: [0.08, 0.15, 0.08] }),
          },
        ]}
      />
      <Animated.View
        style={[
          styles.floatingShape,
          styles.shape3,
          {
            borderColor: colors.border,
            transform: [{ translateY: particle3Y }],
            opacity: particle3.interpolate({ inputRange: [0, 0.5, 1], outputRange: [0.06, 0.12, 0.06] }),
          },
        ]}
      />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <Animated.View
          style={[
            styles.header,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideUp }],
            },
          ]}
        >
          <TouchableOpacity style={styles.backButton} activeOpacity={0.7}> 
            <Ionicons name="arrow-back" size={24} color={colors.text} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: colors.text }]}>SETTINGS</Text>
          <View style={styles.placeholder} />
        </Animated.View>
        {/* Theme wheel */}
        <Animated.View
          style={[
            styles.section,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideUp }],
            },
          ]}
        >
          <Text style={[styles.sectionTitle, { color: colors.text }]}>APPEARANCE</Text>
          <TouchableOpacity
            activeOpacity={0.9}
            onPress={handleThemeToggle}
            style={[styles.wheelCard, { backgroundColor: colors.cardBg, borderColor: colors.border }]}
          >
            <View style={styles.wheelContent}>
              <View style={styles.wheelInfo}>
                <Text style={[styles.wheelLabel, { color: colors.text }]}>Theme</Text>
                <Text style={[styles.wheelValue, { color: colors.textSecondary }]}> 
                  {theme === 'dark' ? 'Dark Mode' : 'Light Mode'}
                </Text>
              </View>
              <Animated.View
                style={[
                  styles.themeWheel,
                  {
                    borderColor: colors.border,
                    transform: [{ rotate: wheelRotate }],
                  },
                ]}
              >
                <View style={[styles.wheelHalf, styles.wheelDark]}> 
                  <Ionicons name="moon" size={20} color="#fff" />
                </View>
                <View style={[styles.wheelHalf, styles.wheelLight]}> 
                  <Ionicons name="sunny" size={20} color="#000" />
                </View>
              </Animated.View>
            </View>
          </TouchableOpacity>
        </Animated.View>
        {/* Notifications */}
        <Animated.View
          style={[
            styles.section,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideUp }],
            },
          ]}
        >
          <Text style={[styles.sectionTitle, { color: colors.text }]}>NOTIFICATIONS</Text>
          <TouchableOpacity
            activeOpacity={0.9}
            onPress={handleNotificationWheel}
            style={[styles.wheelCard, { backgroundColor: colors.cardBg, borderColor: colors.border }]}
          >
            <View style={styles.wheelContent}>
              <View style={styles.wheelInfo}>
                <Text style={[styles.wheelLabel, { color: colors.text }]}>Notification Level</Text>
                <Text style={[styles.wheelValue, { color: colors.textSecondary }]}> 
                  {notificationLevel === 'all'
                    ? 'All Notifications'
                    : notificationLevel === 'important'
                    ? 'Important Only'
                    : 'None'}
                </Text>
              </View>
              <View style={[styles.circularWheel, { borderColor: colors.border }]}> 
                <View style={styles.wheelIndicators}>
                  <View
                    style={[
                      styles.indicator,
                      notificationLevel === 'all' && styles.indicatorActive,
                      {
                        backgroundColor:
                          notificationLevel === 'all' ? colors.accent : colors.border,
                      },
                    ]}
                  />
                  <View
                    style={[
                      styles.indicator,
                      notificationLevel === 'important' && styles.indicatorActive,
                      {
                        backgroundColor:
                          notificationLevel === 'important' ? colors.accent : colors.border,
                      },
                    ]}
                  />
                  <View
                    style={[
                      styles.indicator,
                      notificationLevel === 'none' && styles.indicatorActive,
                      {
                        backgroundColor:
                          notificationLevel === 'none' ? colors.accent : colors.border,
                      },
                    ]}
                  />
                </View>
                <Ionicons
                  name={
                    notificationLevel === 'all'
                      ? 'notifications'
                      : notificationLevel === 'important'
                      ? 'notifications-outline'
                      : 'notifications-off-outline'
                  }
                  size={22}
                  color={colors.text}
                />
              </View>
            </View>
          </TouchableOpacity>
        </Animated.View>
        {/* Privacy */}
        <Animated.View
          style={[
            styles.section,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideUp }],
            },
          ]}
        >
          <Text style={[styles.sectionTitle, { color: colors.text }]}>PRIVACY</Text>
          <TouchableOpacity
            activeOpacity={0.9}
            onPress={handlePrivacyWheel}
            style={[styles.wheelCard, { backgroundColor: colors.cardBg, borderColor: colors.border }]}
          >
            <View style={styles.wheelContent}>
              <View style={styles.wheelInfo}>
                <Text style={[styles.wheelLabel, { color: colors.text }]}>Privacy Level</Text>
                <Text style={[styles.wheelValue, { color: colors.textSecondary }]}> 
                  {privacyLevel === 'public'
                    ? 'Public Profile'
                    : privacyLevel === 'friends'
                    ? 'Friends Only'
                    : 'Private'}
                </Text>
              </View>
              <View style={[styles.circularWheel, { borderColor: colors.border }]}> 
                <View style={styles.wheelIndicators}>
                  <View
                    style={[
                      styles.indicator,
                      privacyLevel === 'public' && styles.indicatorActive,
                      {
                        backgroundColor:
                          privacyLevel === 'public' ? colors.accent : colors.border,
                      },
                    ]}
                  />
                  <View
                    style={[
                      styles.indicator,
                      privacyLevel === 'friends' && styles.indicatorActive,
                      {
                        backgroundColor:
                          privacyLevel === 'friends' ? colors.accent : colors.border,
                      },
                    ]}
                  />
                  <View
                    style={[
                      styles.indicator,
                      privacyLevel === 'private' && styles.indicatorActive,
                      {
                        backgroundColor:
                          privacyLevel === 'private' ? colors.accent : colors.border,
                      },
                    ]}
                  />
                </View>
                <Ionicons
                  name={
                    privacyLevel === 'public'
                      ? 'globe-outline'
                      : privacyLevel === 'friends'
                      ? 'people-outline'
                      : 'lock-closed-outline'
                  }
                  size={22}
                  color={colors.text}
                />
              </View>
            </View>
          </TouchableOpacity>
        </Animated.View>
        {/* Preferences */}
        <Animated.View
          style={[
            styles.section,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideUp }],
            },
          ]}
        >
          <Text style={[styles.sectionTitle, { color: colors.text }]}>PREFERENCES</Text>
          <View style={[styles.settingCard, { backgroundColor: colors.cardBg, borderColor: colors.border }]}> 
            {/* Sound toggle */}
            <View style={styles.settingRow}>
              <View style={styles.settingInfo}>
                <Ionicons name="volume-high-outline" size={20} color={colors.text} />
                <Text style={[styles.settingLabel, { color: colors.text }]}>Sound Effects</Text>
              </View>
              <TouchableOpacity
                onPress={() => setSoundEnabled(!soundEnabled)}
                style={[
                  styles.customSwitch,
                  soundEnabled && styles.customSwitchActive,
                  {
                    backgroundColor: soundEnabled ? colors.accent : colors.border,
                  },
                ]}
                activeOpacity={0.8}
              >
                <Animated.View
                  style={[
                    styles.switchThumb,
                    {
                      backgroundColor: soundEnabled
                        ? isDark
                          ? '#000'
                          : '#fff'
                        : colors.textSecondary,
                      transform: [{ translateX: soundEnabled ? 20 : 0 }],
                    },
                  ]}
                />
              </TouchableOpacity>
            </View>
            <View style={[styles.divider, { backgroundColor: colors.border }]} />
            {/* Auto-connect toggle */}
            <View style={styles.settingRow}>
              <View style={styles.settingInfo}>
                <Ionicons name="flash-outline" size={20} color={colors.text} />
                <Text style={[styles.settingLabel, { color: colors.text }]}>Auto-Connect</Text>
              </View>
              <TouchableOpacity
                onPress={() => setAutoConnect(!autoConnect)}
                style={[
                  styles.customSwitch,
                  autoConnect && styles.customSwitchActive,
                  {
                    backgroundColor: autoConnect ? colors.accent : colors.border,
                  },
                ]}
                activeOpacity={0.8}
              >
                <Animated.View
                  style={[
                    styles.switchThumb,
                    {
                      backgroundColor: autoConnect
                        ? isDark
                          ? '#000'
                          : '#fff'
                        : colors.textSecondary,
                      transform: [{ translateX: autoConnect ? 20 : 0 }],
                    },
                  ]}
                />
              </TouchableOpacity>
            </View>
            <View style={[styles.divider, { backgroundColor: colors.border }]} />
            {/* Data Saver toggle */}
            <View style={styles.settingRow}>
              <View style={styles.settingInfo}>
                <Ionicons name="cellular-outline" size={20} color={colors.text} />
                <Text style={[styles.settingLabel, { color: colors.text }]}>Data Saver</Text>
              </View>
              <TouchableOpacity
                onPress={() => setDataPreference(!dataPreference)}
                style={[
                  styles.customSwitch,
                  dataPreference && styles.customSwitchActive,
                  {
                    backgroundColor: dataPreference ? colors.accent : colors.border,
                  },
                ]}
                activeOpacity={0.8}
              >
                <Animated.View
                  style={[
                    styles.switchThumb,
                    {
                      backgroundColor: dataPreference
                        ? isDark
                          ? '#000'
                          : '#fff'
                        : colors.textSecondary,
                      transform: [{ translateX: dataPreference ? 20 : 0 }],
                    },
                  ]}
                />
              </TouchableOpacity>
            </View>
          </View>
        </Animated.View>
        {/* Action buttons */}
        <Animated.View
          style={[
            styles.section,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideUp }],
            },
          ]}
        >
          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: colors.cardBg, borderColor: colors.border }]}
            activeOpacity={0.7}
          >
            <Ionicons name="help-circle-outline" size={20} color={colors.text} />
            <Text style={[styles.actionButtonText, { color: colors.text }]}>Help & Support</Text>
            <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: colors.cardBg, borderColor: colors.border }]}
            activeOpacity={0.7}
          >
            <Ionicons name="document-text-outline" size={20} color={colors.text} />
            <Text style={[styles.actionButtonText, { color: colors.text }]}>Terms & Privacy</Text>
            <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: colors.cardBg, borderColor: colors.border }]}
            activeOpacity={0.7}
          >
            <Ionicons name="information-circle-outline" size={20} color={colors.text} />
            <Text style={[styles.actionButtonText, { color: colors.text }]}>About</Text>
            <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
          </TouchableOpacity>
        </Animated.View>
        {/* Logout */}
        <Animated.View
          style={[
            styles.section,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideUp }],
            },
          ]}
        >
          <TouchableOpacity
            style={[styles.logoutButton, { borderColor: colors.border }]}
            activeOpacity={0.7}
          >
            <Ionicons name="log-out-outline" size={20} color={colors.text} />
            <Text style={[styles.logoutText, { color: colors.text }]}>Log Out</Text>
          </TouchableOpacity>
        </Animated.View>
        {/* Version */}
        <View style={styles.versionContainer}>
          <Text style={[styles.versionText, { color: colors.textSecondary }]}>Version 1.0.0</Text>
        </View>
      </ScrollView>
    </Animated.View>
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
    top: '12%',
    right: '8%',
  },
  shape2: {
    width: 60,
    height: 60,
    top: '50%',
    left: '5%',
  },
  shape3: {
    width: 70,
    height: 70,
    borderRadius: 35,
    bottom: '15%',
    right: '10%',
  },
  scrollContent: {
    paddingBottom: 40,
  },
  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingHorizontal: 24,
    marginBottom: 40,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 2,
  },
  placeholder: {
    width: 40,
  },
  // Sections
  section: {
    paddingHorizontal: 24,
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1.5,
    marginBottom: 16,
    opacity: 0.5,
  },
  // Wheel cards
  wheelCard: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 20,
  },
  wheelContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  wheelInfo: {
    flex: 1,
  },
  wheelLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  wheelValue: {
    fontSize: 13,
  },
  themeWheel: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 2,
    overflow: 'hidden',
    flexDirection: 'row',
  },
  wheelHalf: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  wheelDark: {
    backgroundColor: '#000',
  },
  wheelLight: {
    backgroundColor: '#fff',
  },
  circularWheel: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  wheelIndicators: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  indicator: {
    position: 'absolute',
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  indicatorActive: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  // Preferences card
  settingCard: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 20,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  settingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  settingLabel: {
    fontSize: 15,
    fontWeight: '500',
  },
  divider: {
    height: 1,
    marginVertical: 12,
  },
  // Custom switches
  customSwitch: {
    width: 48,
    height: 28,
    borderRadius: 14,
    padding: 2,
    justifyContent: 'center',
  },
  customSwitchActive: {
    justifyContent: 'center',
  },
  switchThumb: {
    width: 24,
    height: 24,
    borderRadius: 12,
  },
  // Action buttons
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 18,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 12,
    gap: 12,
  },
  actionButtonText: {
    flex: 1,
    fontSize: 15,
    fontWeight: '500',
  },
  // Logout
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 18,
    borderRadius: 12,
    borderWidth: 1,
    gap: 12,
  },
  logoutText: {
    fontSize: 15,
    fontWeight: '600',
  },
  // Version
  versionContainer: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 20,
  },
  versionText: {
    fontSize: 12,
  },
});