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

const { width, height } = Dimensions.get('window');

type UserRole = 'advisor' | 'listener' | null;

export default function ConnectScreen() {
  const [selectedRole, setSelectedRole] = useState<UserRole>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState('');
  
  // Animation refs
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideUp = useRef(new Animated.Value(50)).current;
  const headerOpacity = useRef(new Animated.Value(0)).current;
  
  // Card animations
  const advisorTranslateX = useRef(new Animated.Value(-width)).current;
  const advisorOpacity = useRef(new Animated.Value(0)).current;
  const advisorScale = useRef(new Animated.Value(0.8)).current;
  
  const listenerTranslateX = useRef(new Animated.Value(width)).current;
  const listenerOpacity = useRef(new Animated.Value(0)).current;
  const listenerScale = useRef(new Animated.Value(0.8)).current;
  
  // Selection animations
  const selectionPulse = useRef(new Animated.Value(1)).current;
  const selectionGlow = useRef(new Animated.Value(0)).current;
  
  // Button animations
  const buttonScale = useRef(new Animated.Value(0)).current;
  const buttonOpacity = useRef(new Animated.Value(0)).current;
  
  // Connecting animations
  const connectSpin = useRef(new Animated.Value(0)).current;
  const connectPulse = useRef(new Animated.Value(1)).current;
  const particleAnim1 = useRef(new Animated.Value(0)).current;
  const particleAnim2 = useRef(new Animated.Value(0)).current;
  const particleAnim3 = useRef(new Animated.Value(0)).current;
  const particleAnim4 = useRef(new Animated.Value(0)).current;
  
  // Floating particles
  const floater1 = useRef(new Animated.Value(0)).current;
  const floater2 = useRef(new Animated.Value(0)).current;
  const floater3 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Entrance sequence
    Animated.sequence([
      Animated.parallel([
        Animated.timing(headerOpacity, {
          toValue: 1,
          duration: 800,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 600,
          delay: 200,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(slideUp, {
          toValue: 0,
          duration: 800,
          delay: 200,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
      ]),
      Animated.stagger(150, [
        Animated.parallel([
          Animated.spring(advisorTranslateX, {
            toValue: 0,
            tension: 50,
            friction: 10,
            useNativeDriver: true,
          }),
          Animated.timing(advisorOpacity, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
          }),
          Animated.spring(advisorScale, {
            toValue: 1,
            tension: 60,
            friction: 8,
            useNativeDriver: true,
          }),
        ]),
        Animated.parallel([
          Animated.spring(listenerTranslateX, {
            toValue: 0,
            tension: 50,
            friction: 10,
            useNativeDriver: true,
          }),
          Animated.timing(listenerOpacity, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
          }),
          Animated.spring(listenerScale, {
            toValue: 1,
            tension: 60,
            friction: 8,
            useNativeDriver: true,
          }),
        ]),
      ]),
    ]).start();

    // Floating particles animation
    startFloatingAnimation();
  }, []);

  const startFloatingAnimation = () => {
    [floater1, floater2, floater3].forEach((floater, index) => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(floater, {
            toValue: 1,
            duration: 4000 + index * 1000,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: true,
          }),
          Animated.timing(floater, {
            toValue: 0,
            duration: 4000 + index * 1000,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: true,
          }),
        ])
      ).start();
    });
  };

  useEffect(() => {
    if (selectedRole) {
      Animated.parallel([
        Animated.spring(buttonScale, {
          toValue: 1,
          tension: 100,
          friction: 8,
          useNativeDriver: true,
        }),
        Animated.timing(buttonOpacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.spring(buttonScale, {
          toValue: 0,
          tension: 100,
          friction: 8,
          useNativeDriver: true,
        }),
        Animated.timing(buttonOpacity, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [selectedRole]);

  useEffect(() => {
    if (isConnecting) {
      Animated.loop(
        Animated.parallel([
          Animated.timing(connectSpin, {
            toValue: 1,
            duration: 2000,
            easing: Easing.linear,
            useNativeDriver: true,
          }),
          Animated.sequence([
            Animated.timing(connectPulse, {
              toValue: 1.2,
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
        ])
      ).start();

      // Particle animations
      [particleAnim1, particleAnim2, particleAnim3, particleAnim4].forEach((particle, index) => {
        Animated.loop(
          Animated.sequence([
            Animated.delay(index * 400),
            Animated.timing(particle, {
              toValue: 1,
              duration: 2000,
              easing: Easing.out(Easing.cubic),
              useNativeDriver: true,
            }),
            Animated.timing(particle, {
              toValue: 0,
              duration: 0,
              useNativeDriver: true,
            }),
          ])
        ).start();
      });
    } else {
      connectSpin.setValue(0);
      connectPulse.setValue(1);
    }
  }, [isConnecting]);

  const handleRoleSelect = (role: UserRole) => {
    setSelectedRole(role);
    
    Animated.sequence([
      Animated.parallel([
        Animated.spring(selectionPulse, {
          toValue: 0.95,
          tension: 200,
          friction: 10,
          useNativeDriver: true,
        }),
        Animated.timing(selectionGlow, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]),
      Animated.parallel([
        Animated.spring(selectionPulse, {
          toValue: 1,
          tension: 150,
          friction: 8,
          useNativeDriver: true,
        }),
        Animated.timing(selectionGlow, {
          toValue: 0.7,
          duration: 200,
          useNativeDriver: true,
        }),
      ]),
    ]).start();
  };

  const handleConnect = async () => {
    if (!selectedRole) return;
    
    setIsConnecting(true);
    setConnectionStatus('Establishing secure connection...');
    
    setTimeout(() => setConnectionStatus('Searching for available peers...'), 1500);
    setTimeout(() => setConnectionStatus('Matching with the best fit...'), 3200);
    setTimeout(() => {
      setConnectionStatus('Connection established!');
      setTimeout(() => {
        setIsConnecting(false);
        // Navigate to chat screen
      }, 1200);
    }, 5500);
  };

  // Interpolations
  const spinRotation = connectSpin.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const floater1Y = floater1.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -30],
  });

  const floater2Y = floater2.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 25],
  });

  const floater3Y = floater3.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -20],
  });

  const floater1X = floater1.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 20],
  });

  const floater2X = floater2.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -15],
  });

  const floater3X = floater3.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 18],
  });

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      {/* Modern Background */}
      <View style={styles.background}>
        {/* Floating geometric shapes */}
        <Animated.View
          style={[
            styles.floatingShape,
            styles.shape1,
            {
              transform: [
                { translateY: floater1Y },
                { translateX: floater1X },
                { rotate: floater1.interpolate({
                  inputRange: [0, 1],
                  outputRange: ['0deg', '180deg'],
                })},
              ],
              opacity: floater1.interpolate({
                inputRange: [0, 0.5, 1],
                outputRange: [0.1, 0.2, 0.1],
              }),
            },
          ]}
        />
        <Animated.View
          style={[
            styles.floatingShape,
            styles.shape2,
            {
              transform: [
                { translateY: floater2Y },
                { translateX: floater2X },
              ],
              opacity: floater2.interpolate({
                inputRange: [0, 0.5, 1],
                outputRange: [0.15, 0.25, 0.15],
              }),
            },
          ]}
        />
        <Animated.View
          style={[
            styles.floatingShape,
            styles.shape3,
            {
              transform: [
                { translateY: floater3Y },
                { translateX: floater3X },
                { rotate: floater3.interpolate({
                  inputRange: [0, 1],
                  outputRange: ['0deg', '-90deg'],
                })},
              ],
              opacity: floater3.interpolate({
                inputRange: [0, 0.5, 1],
                outputRange: [0.12, 0.22, 0.12],
              }),
            },
          ]}
        />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {!isConnecting ? (
          <>
            {/* Minimal Header */}
            <Animated.View
              style={[
                styles.header,
                { opacity: headerOpacity },
              ]}
            >
              <View style={styles.headerContent}>
                <View style={styles.brandSection}>
                  <View style={styles.logoWrapper}>
                    <View style={styles.logoOuter}>
                      <View style={styles.logoInner}>
                        <View style={styles.logoDot} />
                      </View>
                    </View>
                  </View>
                  <Text style={styles.brandText}>CONNECT</Text>
                </View>
                
                <TouchableOpacity style={styles.menuButton} activeOpacity={0.7}>
                  <View style={styles.menuLine} />
                  <View style={styles.menuLine} />
                </TouchableOpacity>
              </View>
            </Animated.View>

            {/* Hero Section */}
            <Animated.View
              style={[
                styles.heroSection,
                {
                  opacity: fadeAnim,
                  transform: [{ translateY: slideUp }],
                },
              ]}
            >
              <Text style={styles.heroTitle}>Choose Your{'\n'}Connection Mode</Text>
              <Text style={styles.heroSubtitle}>
                Anonymous conversations, real connections
              </Text>
            </Animated.View>

            {/* Minimalist Stats */}
            <Animated.View
              style={[
                styles.statsRow,
                {
                  opacity: fadeAnim,
                  transform: [{ translateY: slideUp }],
                },
              ]}
            >
              <View style={styles.statItem}>
                <Text style={styles.statValue}>8.2K</Text>
                <Text style={styles.statLabel}>ONLINE</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Text style={styles.statValue}>1.5K</Text>
                <Text style={styles.statLabel}>ACTIVE</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Text style={styles.statValue}>97%</Text>
                <Text style={styles.statLabel}>RATING</Text>
              </View>
            </Animated.View>

            {/* Modern Role Cards */}
            <View style={styles.cardsContainer}>
              {/* Advisor Card */}
              <Animated.View
                style={[
                  styles.roleCard,
                  {
                    opacity: advisorOpacity,
                    transform: [
                      { translateX: advisorTranslateX },
                      { scale: selectedRole === 'advisor' ? selectionPulse : advisorScale },
                    ],
                  },
                ]}
              >
                <TouchableOpacity
                  activeOpacity={0.9}
                  onPress={() => handleRoleSelect('advisor')}
                  style={styles.cardTouchable}
                >
                  <View style={[
                    styles.cardContent,
                    selectedRole === 'advisor' && styles.cardSelected,
                  ]}>
                    {selectedRole === 'advisor' && (
                      <Animated.View
                        style={[
                          styles.selectedGlow,
                          { opacity: selectionGlow },
                        ]}
                      />
                    )}
                    
                    <View style={styles.cardTop}>
                      <View style={[
                        styles.iconCircle,
                        selectedRole === 'advisor' && styles.iconCircleSelected,
                      ]}>
                        <Ionicons 
                          name="mic-outline" 
                          size={32} 
                          color={selectedRole === 'advisor' ? '#000' : '#fff'} 
                        />
                      </View>
                      
                      {selectedRole === 'advisor' && (
                        <View style={styles.checkMark}>
                          <Ionicons name="checkmark-circle" size={28} color="#fff" />
                        </View>
                      )}
                    </View>

                    <View style={styles.cardInfo}>
                      <Text style={styles.roleTitle}>ADVISOR</Text>
                      <Text style={styles.roleDescription}>
                        Share insights and guide others through their challenges
                      </Text>
                      
                      <View style={styles.cardFeatures}>
                        <View style={styles.featureDot} />
                        <Text style={styles.featureText}>Voice enabled</Text>
                      </View>
                      <View style={styles.cardFeatures}>
                        <View style={styles.featureDot} />
                        <Text style={styles.featureText}>No time limit</Text>
                      </View>
                    </View>

                    <View style={styles.cardFooter}>
                      <Ionicons name="arrow-forward" size={20} color="#fff" />
                    </View>
                  </View>
                </TouchableOpacity>
              </Animated.View>

              {/* Listener Card */}
              <Animated.View
                style={[
                  styles.roleCard,
                  {
                    opacity: listenerOpacity,
                    transform: [
                      { translateX: listenerTranslateX },
                      { scale: selectedRole === 'listener' ? selectionPulse : listenerScale },
                    ],
                  },
                ]}
              >
                <TouchableOpacity
                  activeOpacity={0.9}
                  onPress={() => handleRoleSelect('listener')}
                  style={styles.cardTouchable}
                >
                  <View style={[
                    styles.cardContent,
                    selectedRole === 'listener' && styles.cardSelected,
                  ]}>
                    {selectedRole === 'listener' && (
                      <Animated.View
                        style={[
                          styles.selectedGlow,
                          { opacity: selectionGlow },
                        ]}
                      />
                    )}
                    
                    <View style={styles.cardTop}>
                      <View style={[
                        styles.iconCircle,
                        selectedRole === 'listener' && styles.iconCircleSelected,
                      ]}>
                        <Ionicons 
                          name="ear-outline" 
                          size={32} 
                          color={selectedRole === 'listener' ? '#000' : '#fff'} 
                        />
                      </View>
                      
                      {selectedRole === 'listener' && (
                        <View style={styles.checkMark}>
                          <Ionicons name="checkmark-circle" size={28} color="#fff" />
                        </View>
                      )}
                    </View>

                    <View style={styles.cardInfo}>
                      <Text style={styles.roleTitle}>LISTENER</Text>
                      <Text style={styles.roleDescription}>
                        Receive guidance and support from experienced advisors
                      </Text>
                      
                      <View style={styles.cardFeatures}>
                        <View style={styles.featureDot} />
                        <Text style={styles.featureText}>Listen mode</Text>
                      </View>
                      <View style={styles.cardFeatures}>
                        <View style={styles.featureDot} />
                        <Text style={styles.featureText}>100% anonymous</Text>
                      </View>
                    </View>

                    <View style={styles.cardFooter}>
                      <Ionicons name="arrow-forward" size={20} color="#fff" />
                    </View>
                  </View>
                </TouchableOpacity>
              </Animated.View>
            </View>

            {/* Connect Button */}
            {selectedRole && (
              <Animated.View
                style={[
                  styles.connectButtonWrapper,
                  {
                    opacity: buttonOpacity,
                    transform: [{ scale: buttonScale }],
                  },
                ]}
              >
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={handleConnect}
                  style={styles.connectButton}
                >
                  <LinearGradient
                    colors={['#fff', '#e8e8e8']}
                    style={styles.connectButtonGradient}
                  >
                    <Ionicons name="flash" size={24} color="#000" />
                    <Text style={styles.connectButtonText}>START CONNECTION</Text>
                    <Ionicons name="arrow-forward-circle" size={24} color="#000" />
                  </LinearGradient>
                </TouchableOpacity>
              </Animated.View>
            )}

            {/* Footer Info */}
            <View style={styles.footer}>
              <View style={styles.footerLine} />
              <View style={styles.footerContent}>
                <View style={styles.footerItem}>
                  <Ionicons name="shield-checkmark-outline" size={16} color="rgba(255,255,255,0.4)" />
                  <Text style={styles.footerText}>End-to-end encrypted</Text>
                </View>
                <View style={styles.footerItem}>
                  <Ionicons name="eye-off-outline" size={16} color="rgba(255,255,255,0.4)" />
                  <Text style={styles.footerText}>Completely anonymous</Text>
                </View>
              </View>
            </View>
          </>
        ) : (
          /* Connecting State */
          <Animated.View
            style={[
              styles.connectingContainer,
              { opacity: fadeAnim },
            ]}
          >
            {/* Particle system */}
            {[particleAnim1, particleAnim2, particleAnim3, particleAnim4].map((particle, index) => (
              <Animated.View
                key={index}
                style={[
                  styles.particle,
                  {
                    top: '50%',
                    left: '50%',
                    opacity: particle.interpolate({
                      inputRange: [0, 0.5, 1],
                      outputRange: [0, 1, 0],
                    }),
                    transform: [
                      {
                        translateX: particle.interpolate({
                          inputRange: [0, 1],
                          outputRange: [0, [60, -60, 80, -80][index]],
                        }),
                      },
                      {
                        translateY: particle.interpolate({
                          inputRange: [0, 1],
                          outputRange: [0, [-80, -70, 70, 80][index]],
                        }),
                      },
                      { scale: particle },
                    ],
                  },
                ]}
              />
            ))}

            <Animated.View
              style={[
                styles.connectingCircle,
                {
                  transform: [
                    { rotate: spinRotation },
                    { scale: connectPulse },
                  ],
                },
              ]}
            >
              <View style={styles.connectingInner}>
                <Ionicons 
                  name={selectedRole === 'advisor' ? 'mic' : 'ear'} 
                  size={56} 
                  color="#fff" 
                />
              </View>
            </Animated.View>

            <View style={styles.connectingText}>
              <Text style={styles.connectingTitle}>CONNECTING</Text>
              <Text style={styles.connectingStatus}>{connectionStatus}</Text>
            </View>

            <TouchableOpacity
              style={styles.cancelBtn}
              onPress={() => {
                setIsConnecting(false);
                setConnectionStatus('');
              }}
              activeOpacity={0.7}
            >
              <Text style={styles.cancelBtnText}>CANCEL</Text>
            </TouchableOpacity>
          </Animated.View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  background: {
    ...StyleSheet.absoluteFillObject,
  },
  floatingShape: {
    position: 'absolute',
    borderWidth: 1,
    borderColor: '#fff',
  },
  shape1: {
    width: 120,
    height: 120,
    borderRadius: 60,
    top: '15%',
    right: '10%',
  },
  shape2: {
    width: 80,
    height: 80,
    top: '45%',
    left: '5%',
    transform: [{ rotate: '45deg' }],
  },
  shape3: {
    width: 100,
    height: 100,
    borderRadius: 50,
    bottom: '20%',
    right: '15%',
  },
  scrollContent: {
    paddingBottom: 40,
  },
  
  // Header
  header: {
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingHorizontal: 24,
    marginBottom: 60,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  brandSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  logoWrapper: {
    position: 'relative',
  },
  logoOuter: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 2,
    borderColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoInner: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#fff',
  },
  brandText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
    letterSpacing: 2,
  },
  menuButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'flex-end',
    gap: 6,
  },
  menuLine: {
    width: 24,
    height: 2,
    backgroundColor: '#fff',
  },

  // Hero
  heroSection: {
    paddingHorizontal: 24,
    marginBottom: 40,
  },
  heroTitle: {
    fontSize: 42,
    fontWeight: '700',
    color: '#fff',
    lineHeight: 50,
    marginBottom: 16,
  },
  heroSubtitle: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.6)',
    lineHeight: 24,
  },

  // Stats
  statsRow: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    marginBottom: 50,
    justifyContent: 'space-between',
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 10,
    color: 'rgba(255,255,255,0.4)',
    letterSpacing: 1,
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },

  // Cards
  cardsContainer: {
    paddingHorizontal: 24,
    gap: 20,
    marginBottom: 40,
  },
  roleCard: {
    width: '100%',
  },
  cardTouchable: {
    width: '100%',
  },
  cardContent: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    borderRadius: 20,
    padding: 24,
    position: 'relative',
    overflow: 'hidden',
  },
  cardSelected: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderColor: '#fff',
  },
  selectedGlow: {
    position: 'absolute',
    top: -2,
    left: -2,
    right: -2,
    bottom: -2,
    borderRadius: 22,
    borderWidth: 2,
    borderColor: '#fff',
  },
  cardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 24,
  },
  iconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconCircleSelected: {
    backgroundColor: '#fff',
    borderColor: '#fff',
  },
  checkMark: {
    marginTop: -4,
  },
  cardInfo: {
    marginBottom: 20,
  },
  roleTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#fff',
    letterSpacing: 1,
    marginBottom: 12,
  },
  roleDescription: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.6)',
    lineHeight: 20,
    marginBottom: 16,
  },
  cardFeatures: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  featureDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#fff',
  },
  featureText: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.7)',
  },
  cardFooter: {
    alignItems: 'flex-end',
  },

  // Connect Button
  connectButtonWrapper: {
    paddingHorizontal: 24,
    marginBottom: 40,
  },
  connectButton: {
    width: '100%',
  },
  connectButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
    paddingHorizontal: 32,
    borderRadius: 16,
    gap: 12,
  },
  connectButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#000',
    letterSpacing: 1,
  },

  // Footer
  footer: {
    paddingHorizontal: 24,
    marginTop: 20,
  },
  footerLine: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.1)',
    marginBottom: 20,
  },
  footerContent: {
    gap: 12,
  },
  footerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  footerText: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.4)',
  },

  // Connecting State
  connectingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: height * 0.25,
    paddingHorizontal: 24,
    minHeight: height * 0.7,
  },
  particle: {
    position: 'absolute',
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#fff',
  },
  connectingCircle: {
    width: 140,
    height: 140,
    borderRadius: 70,
    borderWidth: 2,
    borderColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 50,
  },
  connectingInner: {
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: 'rgba(255,255,255,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  connectingText: {
    alignItems: 'center',
    marginBottom: 60,
  },
  connectingTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#fff',
    letterSpacing: 2,
    marginBottom: 16,
  },
  connectingStatus: {
    fontSize: 15,
    color: 'rgba(255,255,255,0.6)',
    textAlign: 'center',
    lineHeight: 22,
  },
  cancelBtn: {
    paddingVertical: 16,
    paddingHorizontal: 40,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
    borderRadius: 12,
  },
  cancelBtnText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
    letterSpacing: 1,
  },
});