import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
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
 * ConnectScreenProfessional delivers a refined and user‑friendly
 * experience for anonymous voice connections.  It keeps the familiar
 * iconography of the original interface while introducing a more
 * sophisticated colour palette and smoother animations.  A role is
 * selected by default on launch, and themed backgrounds smoothly
 * cross‑fade based on the chosen role.  The role panels expand and
 * contract gracefully, and a gentle halo highlights the active
 * selection.  A clearly defined call‑to‑action bar appears when a
 * role is chosen, and the connecting overlay inherits the theme
 * colours without resorting to playful pulsations.
 */

const { width } = Dimensions.get('window');
type UserRole = 'advisor' | 'listener' | null;

export default function ConnectScreenProfessional() {
  // Default selection is Advisor for immediate context
  const defaultRole = 'advisor';
  const [selectedRole, setSelectedRole] = useState<UserRole>(defaultRole);
  const [connecting, setConnecting] = useState(false);
  const [statusText, setStatusText] = useState('');

  // Theme definitions: warm for advisor, cool for listener
  const advisorTheme = ['#ff7e5f', '#feb47b'] as const;
  const listenerTheme = ['#2193b0', '#6dd5ed'] as const;
  const neutralTheme = ['#0F172A', '#1F2A47'] as const;

  // Animated values for background crossfading
  const neutralOpacity = useRef(new Animated.Value(selectedRole ? 0 : 1)).current;
  const advisorOpacity = useRef(new Animated.Value(selectedRole === 'advisor' ? 1 : 0)).current;
  const listenerOpacity = useRef(new Animated.Value(selectedRole === 'listener' ? 1 : 0)).current;

  // Card transforms and halo
  const advisorScale = useRef(new Animated.Value(1)).current;
  const advisorTranslate = useRef(new Animated.Value(0)).current;
  const listenerScale = useRef(new Animated.Value(1)).current;
  const listenerTranslate = useRef(new Animated.Value(0)).current;
  const haloOpacity = useRef(new Animated.Value(defaultRole ? 1 : 0)).current;
  const haloScale = useRef(new Animated.Value(defaultRole ? 1 : 0)).current;

  // Connect button animations
  const connectOpacity = useRef(new Animated.Value(defaultRole ? 1 : 0)).current;
  const connectTranslate = useRef(new Animated.Value(defaultRole ? 0 : 80)).current;

  // Header animations
  const headerOpacity = useRef(new Animated.Value(0)).current;
  const headerTranslateY = useRef(new Animated.Value(-40)).current;
  const settingsRotate = useRef(new Animated.Value(0)).current;
  // Stats animations
  const statOpacity1 = useRef(new Animated.Value(0)).current;
  const statOpacity2 = useRef(new Animated.Value(0)).current;
  const statOpacity3 = useRef(new Animated.Value(0)).current;

  // Overlay animations for connecting state
  const rippleAnims = [useRef(new Animated.Value(0)).current, useRef(new Animated.Value(0)).current, useRef(new Animated.Value(0)).current];
  const overlayScale = useRef(new Animated.Value(1)).current;
  const overlayRotate = useRef(new Animated.Value(0)).current;

  // Trigger entrance animations
  useEffect(() => {
    Animated.parallel([
      Animated.timing(headerOpacity, {
        toValue: 1,
        duration: 800,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(headerTranslateY, {
        toValue: 0,
        duration: 800,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start();
    Animated.timing(settingsRotate, {
      toValue: 1,
      duration: 2000,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
    Animated.stagger(250, [
      Animated.timing(statOpacity1, { toValue: 1, duration: 600, useNativeDriver: false }),
      Animated.timing(statOpacity2, { toValue: 1, duration: 600, useNativeDriver: false }),
      Animated.timing(statOpacity3, { toValue: 1, duration: 600, useNativeDriver: false }),
    ]).start();
  }, []);

  // Handle appearance/disappearance of connect button when role changes
  useEffect(() => {
    if (selectedRole) {
      Animated.parallel([
        Animated.timing(connectOpacity, {
          toValue: 1,
          duration: 700,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(connectTranslate, {
          toValue: 0,
          duration: 700,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(connectOpacity, {
          toValue: 0,
          duration: 500,
          easing: Easing.in(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(connectTranslate, {
          toValue: 80,
          duration: 500,
          easing: Easing.in(Easing.cubic),
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [selectedRole]);

  // Ripple effect when connecting
  useEffect(() => {
    if (connecting) {
      rippleAnims.forEach((anim, idx) => {
        Animated.loop(
          Animated.sequence([
            Animated.delay(idx * 600),
            Animated.timing(anim, {
              toValue: 1,
              duration: 3000,
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
      Animated.loop(
        Animated.parallel([
          Animated.sequence([
            Animated.timing(overlayScale, {
              toValue: 1.2,
              duration: 1200,
              easing: Easing.inOut(Easing.ease),
              useNativeDriver: true,
            }),
            Animated.timing(overlayScale, {
              toValue: 1,
              duration: 1200,
              easing: Easing.inOut(Easing.ease),
              useNativeDriver: true,
            }),
          ]),
          Animated.timing(overlayRotate, {
            toValue: 1,
            duration: 5000,
            easing: Easing.linear,
            useNativeDriver: true,
          }),
        ])
      ).start();
    } else {
      overlayScale.setValue(1);
      overlayRotate.setValue(0);
    }
  }, [connecting]);

  const handleRoleSelect = (role: UserRole) => {
    if (!role || role === selectedRole) return;
    setSelectedRole(role);
    const isAdvisor = role === 'advisor';
    const selectedScale = isAdvisor ? advisorScale : listenerScale;
    const selectedTranslate = isAdvisor ? advisorTranslate : listenerTranslate;
    const otherScale = isAdvisor ? listenerScale : advisorScale;
    const otherTranslate = isAdvisor ? listenerTranslate : advisorTranslate;
    // Card bounce and translation
    Animated.parallel([
      Animated.spring(selectedScale, {
        toValue: 1.05,
        tension: 200,
        friction: 8,
        useNativeDriver: true,
      }),
      Animated.spring(selectedTranslate, {
        toValue: -8,
        tension: 200,
        friction: 8,
        useNativeDriver: true,
      }),
      Animated.spring(otherScale, {
        toValue: 0.95,
        tension: 200,
        friction: 8,
        useNativeDriver: true,
      }),
      Animated.spring(otherTranslate, {
        toValue: 8,
        tension: 200,
        friction: 8,
        useNativeDriver: true,
      }),
    ]).start(() => {
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
    // Halo animation
    Animated.parallel([
      Animated.timing(haloOpacity, {
        toValue: 1,
        duration: 700,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(haloScale, {
        toValue: 1,
        duration: 700,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start();
    // Theme fade
    if (role === 'advisor') {
      Animated.parallel([
        Animated.timing(advisorOpacity, {
          toValue: 1,
          duration: 800,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(listenerOpacity, {
          toValue: 0,
          duration: 800,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(neutralOpacity, {
          toValue: 0,
          duration: 800,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(listenerOpacity, {
          toValue: 1,
          duration: 800,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(advisorOpacity, {
          toValue: 0,
          duration: 800,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(neutralOpacity, {
          toValue: 0,
          duration: 800,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
      ]).start();
    }
  };

  const handleConnect = () => {
    if (!selectedRole) return;
    setConnecting(true);
    setStatusText('Initialising secure connection…');
    setTimeout(() => setStatusText('Connecting to global network…'), 1500);
    setTimeout(() => setStatusText('Searching for an ideal match…'), 3200);
    setTimeout(() => {
      setStatusText('Connection established');
      setTimeout(() => setConnecting(false), 2000);
    }, 6000);
  };

  // Rotate settings icon
  const rotateSettings = settingsRotate.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '180deg'] });
  const rotateOverlay = overlayRotate.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '360deg'] });
  // Determine accent palette and halo colour based on selection
  const palette = selectedRole === 'listener' ? listenerTheme : advisorTheme;
  const haloColor = selectedRole === 'listener' ? 'rgba(33,147,176,0.25)' : 'rgba(255,126,95,0.25)';

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      {/* Themed backgrounds */}
      <View style={StyleSheet.absoluteFillObject as any}>
        <Animated.View style={[StyleSheet.absoluteFillObject, { opacity: neutralOpacity }] }>
          <LinearGradient colors={neutralTheme} style={StyleSheet.absoluteFillObject} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} />
        </Animated.View>
        <Animated.View style={[StyleSheet.absoluteFillObject, { opacity: advisorOpacity }] }>
          <LinearGradient colors={advisorTheme} style={StyleSheet.absoluteFillObject} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} />
        </Animated.View>
        <Animated.View style={[StyleSheet.absoluteFillObject, { opacity: listenerOpacity }] }>
          <LinearGradient colors={listenerTheme} style={StyleSheet.absoluteFillObject} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} />
        </Animated.View>
      </View>
      {/* Dark overlay for readability */}
      <View style={[StyleSheet.absoluteFillObject, { backgroundColor: 'rgba(0,0,0,0.55)' }]} />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }} style={{ flex: 1 }}>
        {!connecting ? (
          <>
            {/* Header */}
            <Animated.View style={{ opacity: headerOpacity, transform: [{ translateY: headerTranslateY }], paddingTop: Platform.OS === 'ios' ? 60 : 40, paddingHorizontal: 20, marginBottom: 12 }}>
              <View style={styles.headerRow}>
                {/* Profile */}
                <TouchableOpacity style={{ flex: 1, marginRight: 12 }} activeOpacity={0.8}>
                  <LinearGradient colors={['rgba(255,255,255,0.12)', 'rgba(255,255,255,0.04)']} style={styles.profileCard}>
                    <View style={styles.avatarWrap}>
                      <LinearGradient colors={palette} style={styles.avatar}>
                        <Text style={styles.avatarLetter}>A</Text>
                      </LinearGradient>
                      <View style={[styles.onlineDot, { backgroundColor: palette[0] }]} />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.profileHello}>Welcome back</Text>
                      <Text style={styles.profileUser}>Anonymous User</Text>
                    </View>
                  </LinearGradient>
                </TouchableOpacity>
                {/* Icons */}
                <View style={{ flexDirection: 'row', gap: 8 }}>
                  <TouchableOpacity activeOpacity={0.8}>
                    <LinearGradient colors={['rgba(255,255,255,0.12)', 'rgba(255,255,255,0.04)']} style={styles.iconCard}>
                      <Ionicons name="notifications" size={20} color="#fff" />
                      <View style={styles.badgeBubble}>
                        <Text style={styles.badgeNumber}>3</Text>
                      </View>
                    </LinearGradient>
                  </TouchableOpacity>
                  <TouchableOpacity activeOpacity={0.8}>
                    <Animated.View style={{ transform: [{ rotate: rotateSettings }] }}>
                      <LinearGradient colors={['rgba(255,255,255,0.12)', 'rgba(255,255,255,0.04)']} style={styles.iconCard}>
                        <Ionicons name="settings" size={20} color="#fff" />
                      </LinearGradient>
                    </Animated.View>
                  </TouchableOpacity>
                </View>
              </View>
            </Animated.View>
            {/* Logo and stats */}
            <Animated.View style={{ opacity: headerOpacity, transform: [{ translateY: headerTranslateY }] }}>
              <View style={{ alignItems: 'center', paddingHorizontal: 20 }}>
                <LinearGradient colors={palette} style={styles.logoCircle} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
                  <Ionicons name="chatbubbles" size={28} color="#fff" />
                </LinearGradient>
                <Text style={styles.appName}>Anonymous Voice</Text>
                <Text style={styles.appTagline}>Connect with strangers and share your experiences</Text>
              </View>
              <View style={styles.statsRow}>
                {/* Online now */}
                <LinearGradient colors={['rgba(255,255,255,0.18)', 'rgba(255,255,255,0.08)']} style={styles.statBox}>
                  <Ionicons name="people" size={24} color={palette[0]} />
                  <Animated.View style={{ opacity: statOpacity1 }}>
                    <Text style={styles.statValue}>12.5k</Text>
                  </Animated.View>
                  <Text style={styles.statLabel}>Online Now</Text>
                </LinearGradient>
                {/* Active chats */}
                <LinearGradient colors={['rgba(255,255,255,0.18)', 'rgba(255,255,255,0.08)']} style={styles.statBox}>
                  <Ionicons name="chatbubbles" size={24} color={palette[1]} />
                  <Animated.View style={{ opacity: statOpacity2 }}>
                    <Text style={styles.statValue}>2.8k</Text>
                  </Animated.View>
                  <Text style={styles.statLabel}>Active Chats</Text>
                </LinearGradient>
                {/* Satisfaction */}
                <LinearGradient colors={['rgba(255,255,255,0.18)', 'rgba(255,255,255,0.08)']} style={styles.statBox}>
                  <Ionicons name="heart" size={24} color={palette[1]} />
                  <Animated.View style={{ opacity: statOpacity3 }}>
                    <Text style={styles.statValue}>98%</Text>
                  </Animated.View>
                  <Text style={styles.statLabel}>Satisfaction</Text>
                </LinearGradient>
              </View>
            </Animated.View>
            {/* Section heading */}
            <View style={{ paddingHorizontal: 20, marginTop: 32, marginBottom: 12 }}>
              <Text style={styles.sectionTitle}>Choose Your Role</Text>
              <Text style={styles.sectionSubtitle}>Select how you want to connect today</Text>
            </View>
            {/* Halo highlight behind selected card */}
            {selectedRole && (
              <Animated.View
                pointerEvents="none"
                style={{
                  position: 'absolute',
                  left: 16,
                  right: 16,
                  top: 380,
                  height: 150,
                  borderRadius: 24,
                  backgroundColor: haloColor,
                  opacity: haloOpacity,
                  transform: [{ scale: haloScale }],
                }}
              />
            )}
            {/* Role cards */}
            <View style={{ paddingHorizontal: 16 }}>
              {/* Advisor card */}
              <Animated.View style={{ transform: [{ scale: advisorScale }, { translateY: advisorTranslate }] }}>
                <TouchableOpacity activeOpacity={0.9} onPress={() => handleRoleSelect('advisor')} style={styles.roleContainer}>
                  <LinearGradient
                    colors={advisorTheme}
                    style={[styles.rolePanel, selectedRole === 'advisor' && styles.rolePanelActive]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                  >
                    <View style={styles.roleIconWrap}>
                      <LinearGradient colors={['rgba(255,255,255,0.15)', 'rgba(255,255,255,0.05)']} style={styles.roleIconBackground}>
                        <Ionicons name="mic-outline" size={32} color="#fff" />
                      </LinearGradient>
                    </View>
                    <View style={{ flex: 1 }}>
                      <View style={styles.roleHeaderRow}>
                        <Text style={styles.roleTitle}>Advisor</Text>
                        <View style={styles.roleBadge}>
                          <LinearGradient colors={['rgba(255,255,255,0.25)', 'rgba(255,255,255,0.1)']} style={styles.roleBadgeGradient}>
                            <Text style={[styles.roleBadgeText, { color: '#ff7e5f' }]}>Speaker</Text>
                          </LinearGradient>
                        </View>
                      </View>
                      <Text style={styles.roleDescription}>Share your wisdom and guide others through their challenges</Text>
                      {/* Features */}
                      <View style={styles.featureRow}>
                        <View style={styles.featureItem}>
                          <Ionicons name="mic" size={14} color="#ff7e5f" />
                          <Text style={styles.featureText}>Voice Chat</Text>
                        </View>
                        <View style={styles.featureItem}>
                          <Ionicons name="time" size={14} color="#ff7e5f" />
                          <Text style={styles.featureText}>Unlimited</Text>
                        </View>
                      </View>
                    </View>
                    {selectedRole === 'advisor' && <Ionicons name="checkmark-circle" size={28} color="#fff" />}
                  </LinearGradient>
                </TouchableOpacity>
              </Animated.View>
              <View style={{ height: 16 }} />
              {/* Listener card */}
              <Animated.View style={{ transform: [{ scale: listenerScale }, { translateY: listenerTranslate }] }}>
                <TouchableOpacity activeOpacity={0.9} onPress={() => handleRoleSelect('listener')} style={styles.roleContainer}>
                  <LinearGradient
                    colors={listenerTheme}
                    style={[styles.rolePanel, selectedRole === 'listener' && styles.rolePanelActive]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                  >
                    <View style={styles.roleIconWrap}>
                      <LinearGradient colors={['rgba(255,255,255,0.15)', 'rgba(255,255,255,0.05)']} style={styles.roleIconBackground}>
                        <Ionicons name="ear-outline" size={32} color="#fff" />
                      </LinearGradient>
                    </View>
                    <View style={{ flex: 1 }}>
                      <View style={styles.roleHeaderRow}>
                        <Text style={styles.roleTitle}>Listener</Text>
                        <View style={styles.roleBadge}>
                          <LinearGradient colors={['rgba(255,255,255,0.25)', 'rgba(255,255,255,0.1)']} style={styles.roleBadgeGradient}>
                            <Text style={[styles.roleBadgeText, { color: '#2193b0' }]}>Seeker</Text>
                          </LinearGradient>
                        </View>
                      </View>
                      <Text style={styles.roleDescription}>Get anonymous advice and support from caring advisors</Text>
                      <View style={styles.featureRow}>
                        <View style={styles.featureItem}>
                          <Ionicons name="ear" size={14} color="#2193b0" />
                          <Text style={styles.featureText}>Listen Mode</Text>
                        </View>
                        <View style={styles.featureItem}>
                          <Ionicons name="shield-checkmark" size={14} color="#2193b0" />
                          <Text style={styles.featureText}>Anonymous</Text>
                        </View>
                      </View>
                    </View>
                    {selectedRole === 'listener' && <Ionicons name="checkmark-circle" size={28} color="#fff" />}
                  </LinearGradient>
                </TouchableOpacity>
              </Animated.View>
            </View>
            {/* Connect button */}
            <Animated.View style={{ opacity: connectOpacity, transform: [{ translateY: connectTranslate }], paddingHorizontal: 20, marginTop: 32 }}>
              <TouchableOpacity activeOpacity={0.85} disabled={!selectedRole} onPress={handleConnect}>
                <LinearGradient colors={palette} style={styles.connectBar} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
                  <Ionicons name={selectedRole === 'advisor' ? 'mic' : 'ear'} size={24} color="#fff" />
                  <Text style={styles.connectText}>Start Connection</Text>
                  <Ionicons name="arrow-forward" size={24} color="#fff" />
                </LinearGradient>
              </TouchableOpacity>
              {selectedRole && (
                <Text style={styles.connectHint}>
                  You will be connected to a random {selectedRole === 'advisor' ? 'listener' : 'advisor'}
                </Text>
              )}
            </Animated.View>
            {/* Footer */}
            <View style={styles.footerRow}>
              <View style={styles.footerItem}>
                <Ionicons name="shield-checkmark" size={16} color="rgba(255,255,255,0.7)" />
                <Text style={styles.footerLabel}>100% Anonymous</Text>
              </View>
              <View style={styles.footerDivider} />
              <View style={styles.footerItem}>
                <Ionicons name="lock-closed" size={16} color="rgba(255,255,255,0.7)" />
                <Text style={styles.footerLabel}>End‑to‑End Encrypted</Text>
              </View>
              <View style={styles.footerDivider} />
              <View style={styles.footerItem}>
                <Ionicons name="time" size={16} color="rgba(255,255,255,0.7)" />
                <Text style={styles.footerLabel}>24/7 Available</Text>
              </View>
            </View>
          </>
        ) : (
          /* Connecting overlay */
          <View style={styles.overlayContainer}>
            {rippleAnims.map((anim, idx) => (
              <Animated.View
                key={idx}
                style={[
                  styles.ripple,
                  {
                    borderColor: palette[0],
                    opacity: anim.interpolate({ inputRange: [0, 1], outputRange: [0.5, 0] }),
                    transform: [
                      {
                        scale: anim.interpolate({ inputRange: [0, 1], outputRange: [1, 2.8] }),
                      },
                    ],
                  },
                ]}
              />
            ))}
            <Animated.View style={{ transform: [{ scale: overlayScale }, { rotate: rotateOverlay }] }}>
              <LinearGradient colors={palette} style={styles.overlayIcon} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
                <Ionicons name={selectedRole === 'advisor' ? 'mic' : 'ear'} size={48} color="#fff" />
              </LinearGradient>
            </Animated.View>
            <View style={{ alignItems: 'center', marginTop: 40 }}>
              <Text style={styles.overlayTitle}>Connecting…</Text>
              <Text style={styles.overlayStatus}>{statusText}</Text>
            </View>
            <TouchableOpacity activeOpacity={0.8} onPress={() => { setConnecting(false); setStatusText(''); }} style={{ width: '80%', marginTop: 40 }}>
              <LinearGradient colors={['rgba(255,255,255,0.15)', 'rgba(255,255,255,0.05)']} style={styles.cancelBar}>
                <Text style={styles.cancelText}>Cancel</Text>
              </LinearGradient>
            </TouchableOpacity>
            <View style={styles.connectionInfo}>
              <View style={styles.connectionInfoItem}>
                <Ionicons name="person" size={20} color="rgba(255,255,255,0.6)" />
                <Text style={styles.connectionInfoText}>Role: {selectedRole === 'advisor' ? 'Advisor' : 'Listener'}</Text>
              </View>
              <View style={styles.connectionInfoItem}>
                <Ionicons name="globe" size={20} color="rgba(255,255,255,0.6)" />
                <Text style={styles.connectionInfoText}>Global Network</Text>
              </View>
            </View>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
  },
  avatarWrap: {
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
  avatarLetter: {
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
    borderWidth: 2,
    borderColor: '#0F172A',
  },
  profileHello: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.75)',
    marginBottom: 2,
  },
  profileUser: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  iconCard: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
    position: 'relative',
  },
  badgeBubble: {
    position: 'absolute',
    top: -2,
    right: -2,
    backgroundColor: '#e94560',
    borderRadius: 10,
    minWidth: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#0F172A',
  },
  badgeNumber: {
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
  appName: {
    fontSize: 32,
    fontWeight: '700',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 4,
  },
  appTagline: {
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
    marginTop: 24,
    gap: 12,
  },
  statBox: {
    flex: 1,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
    alignItems: 'center',
  },
  statValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#fff',
    marginTop: 6,
  },
  statLabel: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.75)',
    marginTop: 2,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.75)',
  },
  roleContainer: {
    borderRadius: 24,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.15)',
  },
  rolePanel: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 20,
    paddingHorizontal: 24,
  },
  rolePanelActive: {
    borderColor: 'rgba(255,255,255,0.35)',
  },
  roleIconWrap: {
    marginRight: 16,
  },
  roleIconBackground: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  roleHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  roleTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#fff',
  },
  roleBadge: {
    overflow: 'hidden',
    borderRadius: 12,
  },
  roleBadgeGradient: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  roleBadgeText: {
    fontSize: 12,
    fontWeight: '600',
  },
  roleDescription: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    marginBottom: 12,
    lineHeight: 20,
  },
  featureRow: {
    flexDirection: 'row',
    gap: 12,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(255,255,255,0.1)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
  },
  featureText: {
    fontSize: 12,
    fontWeight: '500',
    color: 'rgba(255,255,255,0.85)',
  },
  connectBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    paddingHorizontal: 24,
    borderRadius: 24,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  connectText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
    marginHorizontal: 12,
  },
  connectHint: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.8)',
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
    backgroundColor: 'rgba(255,255,255,0.3)',
  },
  footerLabel: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.8)',
  },
  overlayContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 120,
    paddingHorizontal: 20,
  },
  ripple: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    borderWidth: 2,
  },
  overlayIcon: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  overlayTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 6,
  },
  overlayStatus: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.85)',
    textAlign: 'center',
  },
  cancelBar: {
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  cancelText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  connectionInfo: {
    width: '100%',
    backgroundColor: 'rgba(0,0,0,0.35)',
    borderRadius: 16,
    padding: 20,
    marginTop: 32,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  connectionInfoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  connectionInfoText: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    fontWeight: '500',
  },
});