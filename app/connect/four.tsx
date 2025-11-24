import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
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
 * A second take on the anonymous connect screen with a fresh layout and
 * refined colour palette.  This version trades the floating orbs and
 * dramatic 3D card flips for a calmer, card‑based design with
 * subtle animations.  Each element has been simplified for clarity while
 * maintaining an inviting, professional feel.  You can reuse the same
 * state and connection logic from the original screen: select a role
 * and initiate a connection to be matched with another participant.
 */

const { width } = Dimensions.get('window');
type UserRole = 'advisor' | 'listener' | null;

export default function ConnectScreenVariant() {
  const router = useRouter();
  const [selectedRole, setSelectedRole] = useState<UserRole>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState('');

  // Basic animations for screen entrance and cards
  const fadeIn = useRef(new Animated.Value(0)).current;
  const slideIn = useRef(new Animated.Value(40)).current;
  const cardScaleAdvisor = useRef(new Animated.Value(1)).current;
  const cardScaleListener = useRef(new Animated.Value(1)).current;
  const buttonPulse = useRef(new Animated.Value(1)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;

  // Stats animations
  const statsAnim1 = useRef(new Animated.Value(0)).current;
  const statsAnim2 = useRef(new Animated.Value(0)).current;
  const statsAnim3 = useRef(new Animated.Value(0)).current;

  // Connecting state animations
  const rippleAnim1 = useRef(new Animated.Value(0)).current;
  const rippleAnim2 = useRef(new Animated.Value(0)).current;
  const rippleAnim3 = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const rotateConnect = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Entrance animation
    Animated.sequence([
      Animated.parallel([
        Animated.timing(fadeIn, {
          toValue: 1,
          duration: 800,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(slideIn, {
          toValue: 0,
          duration: 800,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
      ]),
      Animated.stagger(200, [
        Animated.timing(statsAnim1, {
          toValue: 1,
          duration: 600,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: false,
        }),
        Animated.timing(statsAnim2, {
          toValue: 1,
          duration: 600,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: false,
        }),
        Animated.timing(statsAnim3, {
          toValue: 1,
          duration: 600,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: false,
        }),
      ]),
    ]).start();

    // Button pulse (idle state)
    Animated.loop(
      Animated.sequence([
        Animated.timing(buttonPulse, {
          toValue: 1.05,
          duration: 1000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(buttonPulse, {
          toValue: 1,
          duration: 1000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Settings icon rotation
    Animated.timing(rotateAnim, {
      toValue: 1,
      duration: 1000,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  }, []);

  useEffect(() => {
    if (isConnecting) {
      // Ripples around the connecting icon
      [rippleAnim1, rippleAnim2, rippleAnim3].forEach((anim, index) => {
        Animated.loop(
          Animated.sequence([
            Animated.delay(index * 500),
            Animated.timing(anim, {
              toValue: 1,
              duration: 2400,
              easing: Easing.out(Easing.ease),
              useNativeDriver: true,
            }),
            Animated.timing(anim, {
              toValue: 0,
              duration: 0,
              useNativeDriver: true,
            }),
          ])
        ).start();
      });
      // Central pulse and rotation
      Animated.loop(
        Animated.parallel([
          Animated.sequence([
            Animated.timing(pulseAnim, {
              toValue: 1.2,
              duration: 1200,
              easing: Easing.inOut(Easing.ease),
              useNativeDriver: true,
            }),
            Animated.timing(pulseAnim, {
              toValue: 1,
              duration: 1200,
              easing: Easing.inOut(Easing.ease),
              useNativeDriver: true,
            }),
          ]),
          Animated.timing(rotateConnect, {
            toValue: 1,
            duration: 4000,
            easing: Easing.linear,
            useNativeDriver: true,
          }),
        ])
      ).start();
    } else {
      // reset values on exit
      pulseAnim.setValue(1);
      rotateConnect.setValue(0);
    }
  }, [isConnecting]);

  const handleRoleSelect = (role: UserRole) => {
    setSelectedRole(role);
    // scale animation on selection
    const selectedScale = role === 'advisor' ? cardScaleAdvisor : cardScaleListener;
    const otherScale = role === 'advisor' ? cardScaleListener : cardScaleAdvisor;
    Animated.parallel([
      Animated.spring(selectedScale, {
        toValue: 1.03,
        tension: 200,
        friction: 8,
        useNativeDriver: true,
      }),
      Animated.spring(otherScale, {
        toValue: 0.98,
        tension: 200,
        friction: 8,
        useNativeDriver: true,
      }),
    ]).start(() => {
      // return to normal scale
      Animated.parallel([
        Animated.spring(selectedScale, {
          toValue: 1,
          tension: 150,
          friction: 8,
          useNativeDriver: true,
        }),
        Animated.spring(otherScale, {
          toValue: 1,
          tension: 150,
          friction: 8,
          useNativeDriver: true,
        }),
      ]).start();
    });
  };

  const handleConnect = () => {
    if (!selectedRole) return;
    setIsConnecting(true);
    setConnectionStatus('Initializing secure connection...');
    setTimeout(() => setConnectionStatus('Connecting to global network...'), 1000);
    setTimeout(() => setConnectionStatus('Finding perfect match...'), 2400);
    setTimeout(() => {
      setConnectionStatus('Connected successfully!');
      setTimeout(() => setIsConnecting(false), 1500);
    }, 4800);
  };

  // Rotation values for icons
  const settingsRotation = rotateAnim.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '180deg'] });
  const connectingRotation = rotateConnect.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '360deg'] });
  // Accent colours depending on role
  const accent = selectedRole === 'listener' ? '#6fcf97' : '#4e9fd1';

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      {/* Background gradient with slight variation */}
      <LinearGradient
        colors={['#0b2545', '#122c54', '#0b2545']}
        style={styles.background}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 40 }}
        >
          {!isConnecting ? (
            <>
              {/* Top bar */}
              <Animated.View
                style={{
                  opacity: fadeIn,
                  transform: [{ translateY: slideIn }],
                  paddingTop: Platform.OS === 'ios' ? 60 : 40,
                  paddingHorizontal: 20,
                  marginBottom: 20,
                }}
              >
                <View style={styles.topBar}>
                  {/* Profile */}
                  <TouchableOpacity
                    style={{ flex: 1, marginRight: 12 }}
                    activeOpacity={0.8}
                  >
                    <LinearGradient
                      colors={['rgba(255, 255, 255, 0.12)', 'rgba(255, 255, 255, 0.06)']}
                      style={styles.profileBox}
                    >
                      <View style={styles.profileAvatarWrapper}>
                        <LinearGradient
                          colors={['#4e9fd1', '#4e74c5']}
                          style={styles.profileAvatar}
                        >
                          <Text style={styles.avatarInitial}>A</Text>
                        </LinearGradient>
                        <View style={styles.profileOnlineIndicator} />
                      </View>
                      <View style={{ flex: 1 }}>
                        <Text style={styles.profileGreeting}>Welcome back</Text>
                        <Text style={styles.profileName}>Anonymous User</Text>
                      </View>
                    </LinearGradient>
                  </TouchableOpacity>
                  <View style={{ flexDirection: 'row', gap: 8 }}>
                    {/* Notifications */}
                    <TouchableOpacity activeOpacity={0.8} style={styles.iconWrapper}>
                      <LinearGradient
                        colors={['rgba(255, 255, 255, 0.12)', 'rgba(255, 255, 255, 0.04)']}
                        style={styles.iconButton}
                      >
                        <Ionicons name="notifications" size={20} color="#fff" />
                        <View style={styles.notificationDot}>
                          <Text style={styles.dotLabel}>3</Text>
                        </View>
                      </LinearGradient>
                    </TouchableOpacity>
                    {/* Settings */}
                    <TouchableOpacity activeOpacity={0.8} style={styles.iconWrapper}>
                      <Animated.View style={{ transform: [{ rotate: settingsRotation }] }}>
                        <LinearGradient
                          colors={['rgba(255, 255, 255, 0.12)', 'rgba(255, 255, 255, 0.04)']}
                          style={styles.iconButton}
                        >
                          <Ionicons name="settings" size={20} color="#fff" />
                        </LinearGradient>
                      </Animated.View>
                    </TouchableOpacity>
                  </View>
                </View>
              </Animated.View>
              {/* Title */}
              <Animated.View
                style={{
                  opacity: fadeIn,
                  transform: [{ translateY: slideIn }],
                  alignItems: 'center',
                  paddingHorizontal: 20,
                  marginBottom: 30,
                }}
              >
                <LinearGradient
                  colors={['#4e9fd1', '#4e74c5', '#6fcf97']}
                  style={styles.logoBox}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  <Ionicons name="chatbubbles" size={28} color="#fff" />
                </LinearGradient>
                <Text style={styles.title}>Anonymous Voice</Text>
                <Text style={styles.subtitle}>
                  Connect anonymously with real people and share your journey
                </Text>
              </Animated.View>
              {/* Stats */}
              <View style={styles.statsRow}>
                {/* Online Now */}
                <LinearGradient
                  colors={['rgba(78, 159, 209, 0.15)', 'rgba(78, 159, 209, 0.05)']}
                  style={styles.statBox}
                >
                  <Ionicons name="people" size={20} color="#4e9fd1" />
                  <Animated.View style={{ opacity: statsAnim1 }}>
                    <Text style={styles.statValue}>12.5k</Text>
                  </Animated.View>
                  <Text style={styles.statLabel}>Online</Text>
                </LinearGradient>
                {/* Active chats */}
                <LinearGradient
                  colors={['rgba(111, 207, 151, 0.15)', 'rgba(111, 207, 151, 0.05)']}
                  style={styles.statBox}
                >
                  <Ionicons name="chatbubbles" size={20} color="#6fcf97" />
                  <Animated.View style={{ opacity: statsAnim2 }}>
                    <Text style={styles.statValue}>2.8k</Text>
                  </Animated.View>
                  <Text style={styles.statLabel}>Chats</Text>
                </LinearGradient>
                {/* Satisfaction */}
                <LinearGradient
                  colors={['rgba(242, 201, 76, 0.15)', 'rgba(242, 201, 76, 0.05)']}
                  style={styles.statBox}
                >
                  <Ionicons name="heart" size={20} color="#f2c94c" />
                  <Animated.View style={{ opacity: statsAnim3 }}>
                    <Text style={styles.statValue}>98%</Text>
                  </Animated.View>
                  <Text style={styles.statLabel}>Happy</Text>
                </LinearGradient>
              </View>
              {/* Role section header */}
              <View style={{ paddingHorizontal: 20, marginTop: 30, marginBottom: 10 }}>
                <Text style={styles.sectionHeader}>Choose your role</Text>
                <Text style={styles.sectionSubheader}>
                  How would you like to participate?
                </Text>
              </View>
              {/* Role cards */}
              <View style={styles.rolesContainer}>
                {/* Advisor */}
                <Animated.View
                  style={{ transform: [{ scale: cardScaleAdvisor }] }}
                >
                  <TouchableOpacity
                    style={[styles.roleCard, selectedRole === 'advisor' && styles.roleCardSelected]}
                    activeOpacity={0.9}
                    onPress={() => handleRoleSelect('advisor')}
                  >
                    <View style={[styles.roleAccentBar, { backgroundColor: '#4e9fd1' }]} />
                    <View style={styles.roleContent}>
                      <View style={styles.roleIconBox}>
                        <Ionicons name="mic" size={28} color="#4e9fd1" />
                      </View>
                      <View style={{ flex: 1 }}>
                        <Text style={styles.roleTitle}>Advisor</Text>
                        <Text style={styles.roleDesc}>
                          Share your knowledge, insight and support others
                        </Text>
                      </View>
                      {selectedRole === 'advisor' && (
                        <Ionicons name="checkmark-circle" size={24} color="#4e9fd1" />
                      )}
                    </View>
                  </TouchableOpacity>
                </Animated.View>
                {/* Listener */}
                <Animated.View
                  style={{ transform: [{ scale: cardScaleListener }] }}
                >
                  <TouchableOpacity
                    style={[styles.roleCard, selectedRole === 'listener' && styles.roleCardSelected]}
                    activeOpacity={0.9}
                    onPress={() => handleRoleSelect('listener')}
                  >
                    <View style={[styles.roleAccentBar, { backgroundColor: '#6fcf97' }]} />
                    <View style={styles.roleContent}>
                      <View style={styles.roleIconBox}>
                        <Ionicons name="ear" size={28} color="#6fcf97" />
                      </View>
                      <View style={{ flex: 1 }}>
                        <Text style={styles.roleTitle}>Listener</Text>
                        <Text style={styles.roleDesc}>
                          Seek advice anonymously and find comfort in shared stories
                        </Text>
                      </View>
                      {selectedRole === 'listener' && (
                        <Ionicons name="checkmark-circle" size={24} color="#6fcf97" />
                      )}
                    </View>
                  </TouchableOpacity>
                </Animated.View>
              </View>
              {/* Connect button */}
              <View style={{ paddingHorizontal: 20, marginTop: 30 }}>
                <TouchableOpacity
                  activeOpacity={0.85}
                  onPress={handleConnect}
                  disabled={!selectedRole}
                  style={{ opacity: selectedRole ? 1 : 0.5 }}
                >
                  <Animated.View
                    style={{ transform: [{ scale: selectedRole ? buttonPulse : 1 }] }}
                  >
                    <LinearGradient
                      colors={selectedRole ? ['#4e9fd1', '#4e74c5', '#6fcf97'] : ['rgba(255,255,255,0.1)', 'rgba(255,255,255,0.05)']}
                      style={styles.connectBtn}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                    >
                      <Ionicons
                        name={selectedRole === 'advisor' ? 'mic' : 'ear'}
                        size={24}
                        color="#fff"
                      />
                      <Text style={styles.connectBtnText}>
                        {selectedRole ? 'Start connection' : 'Select a role'}
                      </Text>
                      <Ionicons name="arrow-forward" size={24} color="#fff" />
                    </LinearGradient>
                  </Animated.View>
                </TouchableOpacity>
                {selectedRole && (
                  <Text style={styles.connectHint}>
                    You'll be matched with a random {selectedRole === 'advisor' ? 'listener' : 'advisor'}
                  </Text>
                )}
              </View>
              {/* Footer */}
              <View style={styles.footerRow}>
                <View style={styles.footerItem}>
                  <Ionicons name="shield-checkmark" size={16} color="rgba(255,255,255,0.7)" />
                  <Text style={styles.footerText}>Anonymous</Text>
                </View>
                <View style={styles.footerDivider} />
                <View style={styles.footerItem}>
                  <Ionicons name="lock-closed" size={16} color="rgba(255,255,255,0.7)" />
                  <Text style={styles.footerText}>Encrypted</Text>
                </View>
                <View style={styles.footerDivider} />
                <View style={styles.footerItem}>
                  <Ionicons name="time" size={16} color="rgba(255,255,255,0.7)" />
                  <Text style={styles.footerText}>24/7</Text>
                </View>
              </View>
            </>
          ) : (
            /* Connecting overlay */
            <View style={styles.connectingOverlay}>
              {/* Ripples */}
              {[rippleAnim1, rippleAnim2, rippleAnim3].map((anim, idx) => (
                <Animated.View
                  key={`ripple-${idx}`}
                  style={[
                    styles.connectRipple,
                    {
                      borderColor: accent,
                      opacity: anim.interpolate({ inputRange: [0, 1], outputRange: [0.5, 0] }),
                      transform: [
                        {
                          scale: anim.interpolate({ inputRange: [0, 1], outputRange: [1, 2.5] }),
                        },
                      ],
                    },
                  ]}
                />
              ))}
              {/* Central icon */}
              <Animated.View
                style={{
                  transform: [
                    { scale: pulseAnim },
                    { rotate: connectingRotation },
                  ],
                }}
              >
                <LinearGradient
                  colors={['#4e9fd1', '#4e74c5', '#6fcf97']}
                  style={styles.connectingIcon}
                >
                  <Ionicons
                    name={selectedRole === 'advisor' ? 'mic' : 'ear'}
                    size={48}
                    color="#fff"
                  />
                </LinearGradient>
              </Animated.View>
              <View style={{ alignItems: 'center', marginTop: 40 }}>
                <Text style={styles.connectingTitle}>Connecting…</Text>
                <Text style={styles.connectingStatus}>{connectionStatus}</Text>
              </View>
              <TouchableOpacity
                style={{ width: '80%', marginTop: 40 }}
                activeOpacity={0.8}
                onPress={() => {
                  setIsConnecting(false);
                  setConnectionStatus('');
                }}
              >
                <LinearGradient
                  colors={['rgba(255,255,255,0.15)', 'rgba(255,255,255,0.05)']}
                  style={styles.cancelBtn}
                >
                  <Text style={styles.cancelBtnText}>Cancel</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          )}
        </ScrollView>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    flex: 1,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  profileBox: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  profileAvatarWrapper: {
    position: 'relative',
    marginRight: 12,
  },
  profileAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  avatarInitial: {
    fontSize: 20,
    color: '#fff',
    fontWeight: '700',
  },
  profileOnlineIndicator: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#6fcf97',
    borderWidth: 2,
    borderColor: '#0b2545',
  },
  profileGreeting: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 12,
    marginBottom: 2,
  },
  profileName: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  iconWrapper: {},
  iconButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    position: 'relative',
  },
  notificationDot: {
    position: 'absolute',
    top: -2,
    right: -2,
    backgroundColor: '#4e9fd1',
    borderRadius: 10,
    minWidth: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#0b2545',
  },
  dotLabel: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '700',
  },
  logoBox: {
    width: 72,
    height: 72,
    borderRadius: 36,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 3,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  title: {
    fontSize: 34,
    fontWeight: '700',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.75)',
    textAlign: 'center',
    maxWidth: width * 0.8,
    lineHeight: 20,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    gap: 12,
  },
  statBox: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center',
  },
  statValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
    marginTop: 6,
  },
  statLabel: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.7)',
    marginTop: 2,
  },
  sectionHeader: {
    fontSize: 22,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 4,
  },
  sectionSubheader: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.7)',
  },
  rolesContainer: {
    paddingHorizontal: 20,
    gap: 16,
  },
  roleCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.07)',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  roleCardSelected: {
    borderColor: 'rgba(255,255,255,0.2)',
    backgroundColor: 'rgba(255,255,255,0.12)',
  },
  roleAccentBar: {
    width: 6,
    height: '100%',
    borderRadius: 6,
    marginRight: 16,
  },
  roleContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  roleIconBox: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.1)',
    marginRight: 12,
  },
  roleTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
  },
  roleDesc: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.75)',
    marginTop: 2,
    maxWidth: width * 0.5,
  },
  connectBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    paddingHorizontal: 24,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  connectBtnText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
    marginHorizontal: 12,
  },
  connectHint: {
    textAlign: 'center',
    color: 'rgba(255,255,255,0.7)',
    fontSize: 13,
    marginTop: 8,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  footerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  footerText: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.7)',
  },
  footerDivider: {
    width: 1,
    height: 16,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  connectingOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 100,
  },
  connectRipple: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    borderWidth: 2,
  },
  connectingIcon: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  connectingTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 6,
  },
  connectingStatus: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    textAlign: 'center',
  },
  cancelBtn: {
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  cancelBtnText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
});