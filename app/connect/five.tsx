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
 * A third reinterpretation of the anonymous connect screen designed for
 * maximum clarity and accessibility.  This layout splits the role
 * selection into two large panels and positions the call‑to‑action
 * immediately beneath, minimising cognitive load for first‑time users.
 * Subtle highlights and clean typography make each element easy to
 * understand at a glance.  Animations are restrained to simple
 * fades and scales, keeping the focus on the content.
 */

const { width } = Dimensions.get('window');
type UserRole = 'advisor' | 'listener' | null;

export default function ConnectScreenPro() {
  const router = useRouter();
  const [selectedRole, setSelectedRole] = useState<UserRole>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');

  // Entry animations
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;
  const advisorScale = useRef(new Animated.Value(1)).current;
  const listenerScale = useRef(new Animated.Value(1)).current;
  const buttonPulse = useRef(new Animated.Value(1)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;

  // Stats animations
  const stat1Anim = useRef(new Animated.Value(0)).current;
  const stat2Anim = useRef(new Animated.Value(0)).current;
  const stat3Anim = useRef(new Animated.Value(0)).current;

  // Connecting animations
  const ripples = [useRef(new Animated.Value(0)).current, useRef(new Animated.Value(0)).current, useRef(new Animated.Value(0)).current];
  const connectPulse = useRef(new Animated.Value(1)).current;
  const connectRotate = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Screen entrance
    Animated.sequence([
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 700,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 700,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
      ]),
      Animated.stagger(150, [
        Animated.timing(stat1Anim, {
          toValue: 1,
          duration: 600,
          useNativeDriver: false,
        }),
        Animated.timing(stat2Anim, {
          toValue: 1,
          duration: 600,
          useNativeDriver: false,
        }),
        Animated.timing(stat3Anim, {
          toValue: 1,
          duration: 600,
          useNativeDriver: false,
        }),
      ]),
    ]).start();
    // Button gentle pulse
    Animated.loop(
      Animated.sequence([
        Animated.timing(buttonPulse, {
          toValue: 1.05,
          duration: 1200,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(buttonPulse, {
          toValue: 1,
          duration: 1200,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    ).start();
    // Settings icon rotation
    Animated.timing(rotateAnim, {
      toValue: 1,
      duration: 1200,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  }, []);

  useEffect(() => {
    if (isConnecting) {
      // Ripple loops
      ripples.forEach((ripple, index) => {
        Animated.loop(
          Animated.sequence([
            Animated.delay(index * 500),
            Animated.timing(ripple, {
              toValue: 1,
              duration: 2500,
              easing: Easing.out(Easing.ease),
              useNativeDriver: true,
            }),
            Animated.timing(ripple, {
              toValue: 0,
              duration: 0,
              useNativeDriver: true,
            }),
          ])
        ).start();
      });
      // Pulse and rotation of central icon
      Animated.loop(
        Animated.parallel([
          Animated.sequence([
            Animated.timing(connectPulse, {
              toValue: 1.25,
              duration: 1000,
              easing: Easing.inOut(Easing.ease),
              useNativeDriver: true,
            }),
            Animated.timing(connectPulse, {
              toValue: 1,
              duration: 1000,
              easing: Easing.inOut(Easing.ease),
              useNativeDriver: true,
            }),
          ]),
          Animated.timing(connectRotate, {
            toValue: 1,
            duration: 3500,
            easing: Easing.linear,
            useNativeDriver: true,
          }),
        ])
      ).start();
    } else {
      // reset values
      connectPulse.setValue(1);
      connectRotate.setValue(0);
    }
  }, [isConnecting]);

  const onSelectRole = (role: UserRole) => {
    setSelectedRole(role);
    const selected = role === 'advisor' ? advisorScale : listenerScale;
    const other = role === 'advisor' ? listenerScale : advisorScale;
    Animated.parallel([
      Animated.spring(selected, {
        toValue: 1.03,
        tension: 200,
        friction: 8,
        useNativeDriver: true,
      }),
      Animated.spring(other, {
        toValue: 0.98,
        tension: 200,
        friction: 8,
        useNativeDriver: true,
      }),
    ]).start(() => {
      Animated.parallel([
        Animated.spring(selected, {
          toValue: 1,
          tension: 150,
          friction: 8,
          useNativeDriver: true,
        }),
        Animated.spring(other, {
          toValue: 1,
          tension: 150,
          friction: 8,
          useNativeDriver: true,
        }),
      ]).start();
    });
  };

  const startConnection = () => {
    if (!selectedRole) return;
    setIsConnecting(true);
    setStatusMessage('Securing connection…');
    setTimeout(() => setStatusMessage('Contacting servers…'), 1000);
    setTimeout(() => setStatusMessage('Matching you now…'), 2500);
    setTimeout(() => {
      setStatusMessage('Connected!');
      setTimeout(() => setIsConnecting(false), 1500);
    }, 5000);
  };

  const accent = selectedRole === 'listener' ? '#5ABFAF' : '#4DA0E0';
  const rotateSettings = rotateAnim.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '180deg'] });
  const connectRotation = connectRotate.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '360deg'] });

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <LinearGradient
        colors={['#0f182a', '#16243d', '#0f182a']}
        style={{ flex: 1 }}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
          {!isConnecting ? (
            <>
              {/* Header */}
              <Animated.View
                style={{
                  opacity: fadeAnim,
                  transform: [{ translateY: slideAnim }],
                  paddingTop: Platform.OS === 'ios' ? 60 : 40,
                  paddingHorizontal: 20,
                  marginBottom: 16,
                }}
              >
                <View style={styles.headerRow}>
                  {/* Profile */}
                  <TouchableOpacity style={{ flex: 1, marginRight: 12 }} activeOpacity={0.8}>
                    <LinearGradient
                      colors={['rgba(255,255,255,0.15)', 'rgba(255,255,255,0.08)']}
                      style={styles.profileContainer}
                    >
                      <View style={styles.avatarWrapper}>
                        <LinearGradient
                          colors={['#4DA0E0', '#4A70AF']}
                          style={styles.avatar}
                        >
                          <Text style={styles.avatarText}>A</Text>
                        </LinearGradient>
                        <View style={styles.onlineDot} />
                      </View>
                      <View style={{ flex: 1 }}>
                        <Text style={styles.welcomeText}>Welcome back</Text>
                        <Text style={styles.userName}>Anonymous User</Text>
                      </View>
                    </LinearGradient>
                  </TouchableOpacity>
                  {/* Icons */}
                  <View style={{ flexDirection: 'row', gap: 8 }}>
                    <TouchableOpacity activeOpacity={0.8}>
                      <LinearGradient
                        colors={['rgba(255,255,255,0.15)', 'rgba(255,255,255,0.07)']}
                        style={styles.iconBox}
                      >
                        <Ionicons name="notifications" size={20} color="#fff" />
                        <View style={styles.badge}>
                          <Text style={styles.badgeText}>3</Text>
                        </View>
                      </LinearGradient>
                    </TouchableOpacity>
                    <TouchableOpacity activeOpacity={0.8}>
                      <Animated.View style={{ transform: [{ rotate: rotateSettings }] }}>
                        <LinearGradient
                          colors={['rgba(255,255,255,0.15)', 'rgba(255,255,255,0.07)']}
                          style={styles.iconBox}
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
                  opacity: fadeAnim,
                  transform: [{ translateY: slideAnim }],
                  alignItems: 'center',
                  paddingHorizontal: 20,
                }}
              >
                <LinearGradient
                  colors={['#4DA0E0', '#4A70AF', '#5ABFAF']}
                  style={styles.logoCircle}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  <Ionicons name="chatbubbles" size={28} color="#fff" />
                </LinearGradient>
                <Text style={styles.appTitle}>Anonymous Voice</Text>
                <Text style={styles.appSubtitle}>
                  Connect with anyone, share your story and listen to theirs
                </Text>
              </Animated.View>
              {/* Stats */}
              <View style={styles.statsContainer}>
                <View style={styles.statItem}>
                  <LinearGradient
                    colors={['rgba(77,160,224,0.18)', 'rgba(77,160,224,0.08)']}
                    style={styles.statBackground}
                  >
                    <Ionicons name="people" size={20} color="#4DA0E0" />
                    <Animated.View style={{ opacity: stat1Anim }}>
                      <Text style={styles.statValue}>12.5k</Text>
                    </Animated.View>
                    <Text style={styles.statName}>Online</Text>
                  </LinearGradient>
                </View>
                <View style={styles.statItem}>
                  <LinearGradient
                    colors={['rgba(74,112,175,0.18)', 'rgba(74,112,175,0.08)']}
                    style={styles.statBackground}
                  >
                    <Ionicons name="chatbubbles" size={20} color="#4A70AF" />
                    <Animated.View style={{ opacity: stat2Anim }}>
                      <Text style={styles.statValue}>2.8k</Text>
                    </Animated.View>
                    <Text style={styles.statName}>Chats</Text>
                  </LinearGradient>
                </View>
                <View style={styles.statItem}>
                  <LinearGradient
                    colors={['rgba(90,191,175,0.18)', 'rgba(90,191,175,0.08)']}
                    style={styles.statBackground}
                  >
                    <Ionicons name="heart" size={20} color="#5ABFAF" />
                    <Animated.View style={{ opacity: stat3Anim }}>
                      <Text style={styles.statValue}>98%</Text>
                    </Animated.View>
                    <Text style={styles.statName}>Happy</Text>
                  </LinearGradient>
                </View>
              </View>
              {/* Role header */}
              <View style={{ paddingHorizontal: 20, marginTop: 30, marginBottom: 10 }}>
                <Text style={styles.sectionTitle}>Choose your role</Text>
                <Text style={styles.sectionSub}>Pick how you want to engage today</Text>
              </View>
              {/* Role selection */}
              <View style={styles.roleRow}>
                {/* Advisor panel */}
                <Animated.View style={{ flex: 1, transform: [{ scale: advisorScale }] }}>
                  <TouchableOpacity
                    style={[styles.rolePanel, selectedRole === 'advisor' && styles.rolePanelActive]}
                    activeOpacity={0.9}
                    onPress={() => onSelectRole('advisor')}
                  >
                    <View style={[styles.roleIconWrapper, { backgroundColor: 'rgba(77,160,224,0.15)' }] }>
                      <Ionicons name="mic" size={32} color="#4DA0E0" />
                    </View>
                    <Text style={styles.roleLabel}>Advisor</Text>
                    <Text style={styles.roleInfo}>Offer guidance and support</Text>
                    {selectedRole === 'advisor' && (
                      <Ionicons
                        name="checkmark-circle"
                        size={28}
                        color="#4DA0E0"
                        style={styles.checkIcon}
                      />
                    )}
                  </TouchableOpacity>
                </Animated.View>
                {/* Spacer */}
                <View style={{ width: 12 }} />
                {/* Listener panel */}
                <Animated.View style={{ flex: 1, transform: [{ scale: listenerScale }] }}>
                  <TouchableOpacity
                    style={[styles.rolePanel, selectedRole === 'listener' && styles.rolePanelActive]}
                    activeOpacity={0.9}
                    onPress={() => onSelectRole('listener')}
                  >
                    <View style={[styles.roleIconWrapper, { backgroundColor: 'rgba(90,191,175,0.15)' }] }>
                      <Ionicons name="ear" size={32} color="#5ABFAF" />
                    </View>
                    <Text style={styles.roleLabel}>Listener</Text>
                    <Text style={styles.roleInfo}>Seek advice anonymously</Text>
                    {selectedRole === 'listener' && (
                      <Ionicons
                        name="checkmark-circle"
                        size={28}
                        color="#5ABFAF"
                        style={styles.checkIcon}
                      />
                    )}
                  </TouchableOpacity>
                </Animated.View>
              </View>
              {/* Connect button */}
              <View style={{ paddingHorizontal: 20, marginTop: 30 }}>
                <TouchableOpacity
                  disabled={!selectedRole}
                  activeOpacity={0.85}
                  onPress={startConnection}
                  style={{ opacity: selectedRole ? 1 : 0.5 }}
                >
                  <Animated.View style={{ transform: [{ scale: selectedRole ? buttonPulse : 1 }] }}>
                    <LinearGradient
                      colors={selectedRole ? ['#4DA0E0', '#4A70AF', '#5ABFAF'] : ['rgba(255,255,255,0.1)', 'rgba(255,255,255,0.05)']}
                      style={styles.connectButton}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                    >
                      <Ionicons name={selectedRole === 'advisor' ? 'mic' : 'ear'} size={24} color="#fff" />
                      <Text style={styles.connectText}>
                        {selectedRole ? 'Start Connection' : 'Select a role'}
                      </Text>
                      <Ionicons name="arrow-forward" size={24} color="#fff" />
                    </LinearGradient>
                  </Animated.View>
                </TouchableOpacity>
                {selectedRole && (
                  <Text style={styles.connectNote}>
                    You'll be paired with a random {selectedRole === 'advisor' ? 'listener' : 'advisor'}
                  </Text>
                )}
              </View>
              {/* Footer */}
              <View style={styles.footerRow}>
                <View style={styles.footerItem}>
                  <Ionicons name="shield-checkmark" size={16} color="rgba(255,255,255,0.7)" />
                  <Text style={styles.footerLabel}>Anonymous</Text>
                </View>
                <View style={styles.footerDivider} />
                <View style={styles.footerItem}>
                  <Ionicons name="lock-closed" size={16} color="rgba(255,255,255,0.7)" />
                  <Text style={styles.footerLabel}>Encrypted</Text>
                </View>
                <View style={styles.footerDivider} />
                <View style={styles.footerItem}>
                  <Ionicons name="time" size={16} color="rgba(255,255,255,0.7)" />
                  <Text style={styles.footerLabel}>24/7</Text>
                </View>
              </View>
            </>
          ) : (
            // Connecting overlay
            <View style={styles.connectingLayer}>
              {ripples.map((ripple, index) => (
                <Animated.View
                  key={index}
                  style={[
                    styles.rippleCircle,
                    {
                      borderColor: accent,
                      opacity: ripple.interpolate({ inputRange: [0, 1], outputRange: [0.5, 0] }),
                      transform: [
                        {
                          scale: ripple.interpolate({ inputRange: [0, 1], outputRange: [1, 2.5] }),
                        },
                      ],
                    },
                  ]}
                />
              ))}
              <Animated.View
                style={{
                  transform: [
                    { scale: connectPulse },
                    { rotate: connectRotation },
                  ],
                }}
              >
                <LinearGradient
                  colors={['#4DA0E0', '#4A70AF', '#5ABFAF']}
                  style={styles.connectIcon}
                >
                  <Ionicons
                    name={selectedRole === 'advisor' ? 'mic' : 'ear'}
                    size={48}
                    color="#fff"
                  />
                </LinearGradient>
              </Animated.View>
              <View style={{ alignItems: 'center', marginTop: 40 }}>
                <Text style={styles.connectingHeadline}>Connecting…</Text>
                <Text style={styles.connectingMessage}>{statusMessage}</Text>
              </View>
              <TouchableOpacity
                style={{ width: '80%', marginTop: 40 }}
                activeOpacity={0.8}
                onPress={() => {
                  setIsConnecting(false);
                  setStatusMessage('');
                }}
              >
                <LinearGradient
                  colors={['rgba(255,255,255,0.15)', 'rgba(255,255,255,0.07)']}
                  style={styles.cancelContainer}
                >
                  <Text style={styles.cancelLabel}>Cancel</Text>
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
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
  },
  avatarWrapper: {
    position: 'relative',
    marginRight: 12,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  avatarText: {
    fontSize: 20,
    fontWeight: '700',
    color: '#fff',
  },
  onlineDot: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#5ABFAF',
    borderWidth: 2,
    borderColor: '#0f182a',
  },
  welcomeText: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.75)',
    marginBottom: 2,
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  iconBox: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    top: -2,
    right: -2,
    backgroundColor: '#4DA0E0',
    borderRadius: 10,
    minWidth: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#0f182a',
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#fff',
  },
  logoCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: 'rgba(255,255,255,0.2)',
    marginBottom: 12,
  },
  appTitle: {
    fontSize: 34,
    fontWeight: '700',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 6,
  },
  appSubtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.75)',
    textAlign: 'center',
    maxWidth: width * 0.8,
    lineHeight: 20,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginTop: 24,
    gap: 12,
  },
  statItem: {
    flex: 1,
  },
  statBackground: {
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
    alignItems: 'center',
  },
  statValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
    marginTop: 6,
  },
  statName: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.75)',
    marginTop: 2,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 4,
  },
  sectionSub: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.75)',
  },
  roleRow: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginTop: 12,
  },
  rolePanel: {
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderRadius: 20,
    paddingVertical: 24,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
    alignItems: 'center',
    position: 'relative',
  },
  rolePanelActive: {
    borderColor: 'rgba(255,255,255,0.2)',
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  roleIconWrapper: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  roleLabel: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 4,
  },
  roleInfo: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.75)',
    textAlign: 'center',
  },
  checkIcon: {
    position: 'absolute',
    top: 8,
    right: 8,
  },
  connectButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    paddingHorizontal: 24,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  connectText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
    marginHorizontal: 12,
  },
  connectNote: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.75)',
    marginTop: 8,
    textAlign: 'center',
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 20,
    gap: 12,
    marginTop: 32,
  },
  footerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  footerDivider: {
    width: 1,
    height: 16,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  footerLabel: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.7)',
  },
  connectingLayer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 120,
  },
  rippleCircle: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    borderWidth: 2,
  },
  connectIcon: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  connectingHeadline: {
    fontSize: 24,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 6,
  },
  connectingMessage: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    textAlign: 'center',
  },
  cancelContainer: {
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  cancelLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
});