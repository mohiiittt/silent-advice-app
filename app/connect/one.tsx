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

const { width, height } = Dimensions.get('window');

type UserRole = 'advisor' | 'listener' | null;

export default function ConnectScreen() {
  const router = useRouter();
  const [selectedRole, setSelectedRole] = useState<UserRole>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState('');
  
  // Advanced animation refs
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideUp = useRef(new Animated.Value(100)).current;
  const headerScale = useRef(new Animated.Value(0)).current;
  const profileSlide = useRef(new Animated.Value(-100)).current;
  const settingsRotate = useRef(new Animated.Value(0)).current;
  
  // Card 3D animations
  const advisorRotateX = useRef(new Animated.Value(0)).current;
  const advisorRotateY = useRef(new Animated.Value(0)).current;
  const advisorScale = useRef(new Animated.Value(1)).current;
  const advisorGlow = useRef(new Animated.Value(0)).current;
  
  const listenerRotateX = useRef(new Animated.Value(0)).current;
  const listenerRotateY = useRef(new Animated.Value(0)).current;
  const listenerScale = useRef(new Animated.Value(1)).current;
  const listenerGlow = useRef(new Animated.Value(0)).current;
  
  // Stats animations
  const statsAnim1 = useRef(new Animated.Value(0)).current;
  const statsAnim2 = useRef(new Animated.Value(0)).current;
  const statsAnim3 = useRef(new Animated.Value(0)).current;
  
  // Connecting animations
  const connectPulse = useRef(new Animated.Value(1)).current;
  const connectRotate = useRef(new Animated.Value(0)).current;
  const ripple1 = useRef(new Animated.Value(0)).current;
  const ripple2 = useRef(new Animated.Value(0)).current;
  const ripple3 = useRef(new Animated.Value(0)).current;
  
  // Background orbs
  const orb1 = useRef(new Animated.Value(0)).current;
  const orb2 = useRef(new Animated.Value(0)).current;
  const orb3 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Spectacular entrance animation
    Animated.stagger(100, [
      Animated.parallel([
        Animated.spring(fadeAnim, {
          toValue: 1,
          tension: 20,
          friction: 7,
          useNativeDriver: true,
        }),
        Animated.spring(slideUp, {
          toValue: 0,
          tension: 30,
          friction: 8,
          useNativeDriver: true,
        }),
      ]),
      Animated.spring(headerScale, {
        toValue: 1,
        tension: 40,
        friction: 6,
        useNativeDriver: true,
      }),
      Animated.spring(profileSlide, {
        toValue: 0,
        tension: 50,
        friction: 8,
        useNativeDriver: true,
      }),
    ]).start();

    // Continuous background orb animations
    startOrbAnimations();
    // Stats counter animation
    animateStats();
    
    // Settings icon rotation on mount
    Animated.spring(settingsRotate, {
      toValue: 1,
      tension: 10,
      friction: 3,
      useNativeDriver: true,
    }).start();
  }, []);

  const startOrbAnimations = () => {
    [orb1, orb2, orb3].forEach((orb, index) => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(orb, {
            toValue: 1,
            duration: 8000 + index * 1000,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(orb, {
            toValue: 0,
            duration: 8000 + index * 1000,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
        ])
      ).start();
    });
  };

  const animateStats = () => {
    Animated.stagger(200, [
      Animated.timing(statsAnim1, {
        toValue: 1,
        duration: 1500,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: false,
      }),
      Animated.timing(statsAnim2, {
        toValue: 1,
        duration: 1500,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: false,
      }),
      Animated.timing(statsAnim3, {
        toValue: 1,
        duration: 1500,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: false,
      }),
    ]).start();
  };

  useEffect(() => {
    if (isConnecting) {
      // Epic connecting animations
      Animated.loop(
        Animated.parallel([
          Animated.sequence([
            Animated.timing(connectPulse, {
              toValue: 1.3,
              duration: 1200,
              easing: Easing.bezier(0.4, 0, 0.2, 1),
              useNativeDriver: true,
            }),
            Animated.timing(connectPulse, {
              toValue: 1,
              duration: 1200,
              easing: Easing.bezier(0.4, 0, 0.2, 1),
              useNativeDriver: true,
            }),
          ]),
          Animated.timing(connectRotate, {
            toValue: 1,
            duration: 3000,
            easing: Easing.linear,
            useNativeDriver: true,
          }),
        ])
      ).start();

      // Ripple effects
      [ripple1, ripple2, ripple3].forEach((ripple, index) => {
        Animated.loop(
          Animated.sequence([
            Animated.delay(index * 600),
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
    } else {
      connectPulse.setValue(1);
      connectRotate.setValue(0);
    }
  }, [isConnecting]);

  const handleRoleSelect = (role: UserRole) => {
    setSelectedRole(role);
    
    const rotateX = role === 'advisor' ? advisorRotateX : listenerRotateX;
    const rotateY = role === 'advisor' ? advisorRotateY : listenerRotateY;
    const scale = role === 'advisor' ? advisorScale : listenerScale;
    const glow = role === 'advisor' ? advisorGlow : listenerGlow;

    // Epic 3D card flip with glow
    Animated.parallel([
      Animated.sequence([
        Animated.parallel([
          Animated.timing(rotateY, {
            toValue: 1,
            duration: 400,
            easing: Easing.out(Easing.back(1.2)),
            useNativeDriver: true,
          }),
          Animated.timing(rotateX, {
            toValue: 1,
            duration: 400,
            easing: Easing.out(Easing.back(1.2)),
            useNativeDriver: true,
          }),
        ]),
        Animated.parallel([
          Animated.spring(rotateY, {
            toValue: 0,
            tension: 100,
            friction: 8,
            useNativeDriver: true,
          }),
          Animated.spring(rotateX, {
            toValue: 0,
            tension: 100,
            friction: 8,
            useNativeDriver: true,
          }),
        ]),
      ]),
      Animated.sequence([
        Animated.spring(scale, {
          toValue: 0.92,
          tension: 200,
          friction: 8,
          useNativeDriver: true,
        }),
        Animated.spring(scale, {
          toValue: 1.05,
          tension: 200,
          friction: 8,
          useNativeDriver: true,
        }),
        Animated.spring(scale, {
          toValue: 1,
          tension: 150,
          friction: 8,
          useNativeDriver: true,
        }),
      ]),
      Animated.sequence([
        Animated.timing(glow, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(glow, {
          toValue: 0.5,
          duration: 200,
          useNativeDriver: true,
        }),
      ]),
    ]).start();
  };

  const handleConnect = async () => {
    if (!selectedRole) return;
    
    setIsConnecting(true);
    setConnectionStatus('Initializing secure connection...');
    
    setTimeout(() => setConnectionStatus('Connecting to global network...'), 1200);
    setTimeout(() => setConnectionStatus('Finding perfect match...'), 2800);
    setTimeout(() => {
      setConnectionStatus('Connected successfully!');
      setTimeout(() => {
        setIsConnecting(false);
      }, 1500);
    }, 5500);
  };

  // Interpolations
  const rotateSettings = settingsRotate.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg'],
  });

  const rotateConnect = connectRotate.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const advisorRotateYDeg = advisorRotateY.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '15deg'],
  });

  const advisorRotateXDeg = advisorRotateX.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '-8deg'],
  });

  const listenerRotateYDeg = listenerRotateY.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '-15deg'],
  });

  const listenerRotateXDeg = listenerRotateX.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '8deg'],
  });

  // Orb movements
  const orb1TranslateX = orb1.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 50],
  });

  const orb1TranslateY = orb1.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -80],
  });

  const orb2TranslateX = orb2.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -60],
  });

  const orb2TranslateY = orb2.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 70],
  });

  const orb3TranslateX = orb3.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 40],
  });

  const orb3TranslateY = orb3.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -50],
  });

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      {/* Dynamic Background */}
      <LinearGradient
        colors={['#0a0118', '#1a0a2e', '#0f0520', '#1a0f2e']}
        style={styles.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        {/* Animated Background Orbs */}
        <Animated.View
          style={[
            styles.orb,
            styles.orb1,
            {
              transform: [
                { translateX: orb1TranslateX },
                { translateY: orb1TranslateY },
                { scale: orb1 },
              ],
            },
          ]}
        >
          <LinearGradient
            colors={['rgba(233, 69, 96, 0.4)', 'rgba(255, 107, 157, 0.2)']}
            style={styles.orbGradient}
          />
        </Animated.View>

        <Animated.View
          style={[
            styles.orb,
            styles.orb2,
            {
              transform: [
                { translateX: orb2TranslateX },
                { translateY: orb2TranslateY },
                { scale: orb2 },
              ],
            },
          ]}
        >
          <LinearGradient
            colors={['rgba(78, 204, 163, 0.4)', 'rgba(69, 183, 209, 0.2)']}
            style={styles.orbGradient}
          />
        </Animated.View>

        <Animated.View
          style={[
            styles.orb,
            styles.orb3,
            {
              transform: [
                { translateX: orb3TranslateX },
                { translateY: orb3TranslateY },
                { scale: orb3 },
              ],
            },
          ]}
        >
          <LinearGradient
            colors={['rgba(138, 43, 226, 0.4)', 'rgba(147, 51, 234, 0.2)']}
            style={styles.orbGradient}
          />
        </Animated.View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          bounces={true}
          contentContainerStyle={styles.scrollContent}
        >
          {!isConnecting ? (
            <>
              {/* Premium Header */}
              <Animated.View
                style={[
                  styles.header,
                  {
                    opacity: fadeAnim,
                    transform: [{ translateY: profileSlide }],
                  },
                ]}
              >
                <View style={styles.topBar}>
                  {/* Profile Button */}
                  <TouchableOpacity style={styles.profileButton} activeOpacity={0.8}>
                    <LinearGradient
                      colors={['rgba(255, 255, 255, 0.15)', 'rgba(255, 255, 255, 0.05)']}
                      style={styles.profileGradient}
                    >
                      <View style={styles.avatarContainer}>
                        <LinearGradient
                          colors={['#e94560', '#ff6b9d']}
                          style={styles.avatar}
                        >
                          <Text style={styles.avatarText}>A</Text>
                        </LinearGradient>
                        <View style={styles.onlineIndicator} />
                      </View>
                      <View style={styles.profileInfo}>
                        <Text style={styles.greeting}>Welcome back</Text>
                        <Text style={styles.username}>Anonymous User</Text>
                      </View>
                    </LinearGradient>
                  </TouchableOpacity>

                  {/* Action Buttons */}
                  <View style={styles.headerActions}>
                    <TouchableOpacity style={styles.iconButton} activeOpacity={0.8}>
                      <LinearGradient
                        colors={['rgba(255, 255, 255, 0.12)', 'rgba(255, 255, 255, 0.04)']}
                        style={styles.iconButtonGradient}
                      >
                        <Ionicons name="notifications" size={20} color="#fff" />
                        <View style={styles.notificationBadge}>
                          <Text style={styles.badgeText}>3</Text>
                        </View>
                      </LinearGradient>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.iconButton} activeOpacity={0.8}>
                      <Animated.View style={{ transform: [{ rotate: rotateSettings }] }}>
                        <LinearGradient
                          colors={['rgba(255, 255, 255, 0.12)', 'rgba(255, 255, 255, 0.04)']}
                          style={styles.iconButtonGradient}
                        >
                          <Ionicons name="settings" size={20} color="#fff" />
                        </LinearGradient>
                      </Animated.View>
                    </TouchableOpacity>
                  </View>
                </View>
              </Animated.View>

              {/* Main Title Section */}
              <Animated.View
                style={[
                  styles.titleSection,
                  {
                    opacity: fadeAnim,
                    transform: [
                      { translateY: slideUp },
                      { scale: headerScale },
                    ],
                  },
                ]}
              >
                <View style={styles.logoContainer}>
                  <LinearGradient
                    colors={['#e94560', '#ff6b9d', '#ffa07a']}
                    style={styles.premiumLogo}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                  >
                    <Ionicons name="chatbubbles" size={28} color="#fff" />
                  </LinearGradient>
                  
                  {/* Animated rings around logo */}
                  <Animated.View style={[styles.logoRing, styles.logoRing1]} />
                  <Animated.View style={[styles.logoRing, styles.logoRing2]} />
                </View>

                <Text style={styles.mainTitle}>Anonymous Voice</Text>
                <Text style={styles.tagline}>Connect with strangers, share experiences</Text>
              </Animated.View>

              {/* Live Stats */}
              <Animated.View
                style={[
                  styles.statsContainer,
                  {
                    opacity: fadeAnim,
                  },
                ]}
              >
                <View style={styles.statCard}>
                  <LinearGradient
                    colors={['rgba(233, 69, 96, 0.15)', 'rgba(233, 69, 96, 0.05)']}
                    style={styles.statGradient}
                  >
                    <Ionicons name="people" size={24} color="#e94560" />
                    <Animated.View style={{ opacity: statsAnim1 }}>
  <Text style={styles.statNumber}>12.5k</Text>
</Animated.View>
                    <Text style={styles.statLabel}>Online Now</Text>
                  </LinearGradient>
                </View>

                <View style={styles.statCard}>
                  <LinearGradient
                    colors={['rgba(78, 204, 163, 0.15)', 'rgba(78, 204, 163, 0.05)']}
                    style={styles.statGradient}
                  >
                    <Ionicons name="chatbubbles" size={24} color="#4ecca3" />
                    <Animated.View style={{ opacity: statsAnim2 }}>
  <Text style={styles.statNumber}>2.8k</Text>
</Animated.View>
                    <Text style={styles.statLabel}>Active Chats</Text>
                  </LinearGradient>
                </View>

                <View style={styles.statCard}>
                  <LinearGradient
                    colors={['rgba(138, 43, 226, 0.15)', 'rgba(138, 43, 226, 0.05)']}
                    style={styles.statGradient}
                  >
                    <Ionicons name="heart" size={24} color="#8a2be2" />
                    <Animated.View style={{ opacity: statsAnim3 }}>
                      <Text style={styles.statNumber}>98%</Text>
                    </Animated.View>
                    <Text style={styles.statLabel}>Satisfaction</Text>
                  </LinearGradient>
                </View>
              </Animated.View>

              {/* Section Title */}
              <Animated.View
                style={[
                  styles.sectionHeader,
                  {
                    opacity: fadeAnim,
                    transform: [{ translateY: slideUp }],
                  },
                ]}
              >
                <Text style={styles.sectionTitle}>Choose Your Role</Text>
                <Text style={styles.sectionSubtitle}>
                  Select how you want to connect today
                </Text>
              </Animated.View>

              {/* Premium Role Cards */}
              <Animated.View
                style={[
                  styles.cardsWrapper,
                  {
                    opacity: fadeAnim,
                    transform: [{ translateY: slideUp }],
                  },
                ]}
              >
                {/* Advisor Card */}
                <Animated.View
                  style={[
                    styles.cardContainer,
                    {
                      transform: [
                        { perspective: 1000 },
                        { rotateY: advisorRotateYDeg },
                        { rotateX: advisorRotateXDeg },
                        { scale: advisorScale },
                      ],
                    },
                  ]}
                >
                  <TouchableOpacity
                    activeOpacity={1}
                    onPress={() => handleRoleSelect('advisor')}
                    style={styles.cardTouchable}
                  >
                    <LinearGradient
                      colors={
                        selectedRole === 'advisor'
                          ? ['rgba(233, 69, 96, 0.3)', 'rgba(255, 107, 157, 0.2)']
                          : ['rgba(255, 255, 255, 0.08)', 'rgba(255, 255, 255, 0.02)']
                      }
                      style={styles.premiumCard}
                    >
                      {/* Glow effect when selected */}
                      {selectedRole === 'advisor' && (
                        <Animated.View
                          style={[
                            styles.cardGlow,
                            {
                              opacity: advisorGlow,
                              backgroundColor: '#e94560',
                            },
                          ]}
                        />
                      )}

                      <View style={styles.cardInner}>
                        {/* Icon Section */}
                        <View style={styles.cardIconSection}>
                          <LinearGradient
                            colors={
                              selectedRole === 'advisor'
                                ? ['#e94560', '#ff6b9d']
                                : ['rgba(233, 69, 96, 0.3)', 'rgba(255, 107, 157, 0.2)']
                            }
                            style={styles.cardIcon}
                          >
                            <Ionicons name="mic-outline" size={32} color="#fff" />
                          </LinearGradient>
                          
                          {selectedRole === 'advisor' && (
                            <View style={styles.selectedBadge}>
                              <LinearGradient
                                colors={['rgba(255, 255, 255, 0.9)', 'rgba(255, 255, 255, 0.7)']}
                                style={styles.badgeGradient}
                              >
                                <Ionicons name="checkmark-circle" size={24} color="#e94560" />
                              </LinearGradient>
                            </View>
                          )}
                        </View>

                        {/* Content Section */}
                        <View style={styles.cardContent}>
                          <View style={styles.cardHeader}>
                            <Text style={styles.cardTitle}>Advisor</Text>
                            <View style={styles.roleBadge}>
                              <LinearGradient
                                colors={['rgba(233, 69, 96, 0.3)', 'rgba(233, 69, 96, 0.1)']}
                                style={styles.roleBadgeGradient}
                              >
                                <Text style={[styles.roleBadgeText, { color: '#e94560' }]}>
                                  Speaker
                                </Text>
                              </LinearGradient>
                            </View>
                          </View>
                          
                          <Text style={styles.cardDescription}>
                            Share your wisdom and guide others through their challenges
                          </Text>

                          {/* Features */}
                          <View style={styles.cardFeatures}>
                            <View style={styles.featureItem}>
                              <Ionicons name="mic" size={14} color="#e94560" />
                              <Text style={styles.featureText}>Voice Chat</Text>
                            </View>
                            <View style={styles.featureItem}>
                              <Ionicons name="time" size={14} color="#e94560" />
                              <Text style={styles.featureText}>Unlimited</Text>
                            </View>
                          </View>
                        </View>
                      </View>

                      {/* Shine effect */}
                      {selectedRole === 'advisor' && (
                        <View style={styles.shine} />
                      )}
                    </LinearGradient>
                  </TouchableOpacity>
                </Animated.View>

                {/* Listener Card */}
                <Animated.View
                  style={[
                    styles.cardContainer,
                    {
                      transform: [
                        { perspective: 1000 },
                        { rotateY: listenerRotateYDeg },
                        { rotateX: listenerRotateXDeg },
                        { scale: listenerScale },
                      ],
                    },
                  ]}
                >
                  <TouchableOpacity
                    activeOpacity={1}
                    onPress={() => handleRoleSelect('listener')}
                    style={styles.cardTouchable}
                  >
                    <LinearGradient
                      colors={
                        selectedRole === 'listener'
                          ? ['rgba(78, 204, 163, 0.3)', 'rgba(69, 183, 209, 0.2)']
                          : ['rgba(255, 255, 255, 0.08)', 'rgba(255, 255, 255, 0.02)']
                      }
                      style={styles.premiumCard}
                    >
                      {selectedRole === 'listener' && (
                        <Animated.View
                          style={[
                            styles.cardGlow,
                            {
                              opacity: listenerGlow,
                              backgroundColor: '#4ecca3',
                            },
                          ]}
                        />
                      )}

                      <View style={styles.cardInner}>
                        <View style={styles.cardIconSection}>
                          <LinearGradient
                            colors={
                              selectedRole === 'listener'
                                ? ['#4ecca3', '#45b7d1']
                                : ['rgba(78, 204, 163, 0.3)', 'rgba(69, 183, 209, 0.2)']
                            }
                            style={styles.cardIcon}
                          >
                            <Ionicons name="ear-outline" size={32} color="#fff" />
                          </LinearGradient>
                          
                          {selectedRole === 'listener' && (
                            <View style={styles.selectedBadge}>
                              <LinearGradient
                                colors={['rgba(255, 255, 255, 0.9)', 'rgba(255, 255, 255, 0.7)']}
                                style={styles.badgeGradient}
                              >
                                <Ionicons name="checkmark-circle" size={24} color="#4ecca3" />
                              </LinearGradient>
                            </View>
                          )}
                        </View>

                        <View style={styles.cardContent}>
                          <View style={styles.cardHeader}>
                            <Text style={styles.cardTitle}>Listener</Text>
                            <View style={styles.roleBadge}>
                              <LinearGradient
                                colors={['rgba(78, 204, 163, 0.3)', 'rgba(78, 204, 163, 0.1)']}
                                style={styles.roleBadgeGradient}
                              >
                                <Text style={[styles.roleBadgeText, { color: '#4ecca3' }]}>
                                  Seeker
                                </Text>
                              </LinearGradient>
                            </View>
                          </View>
                          
                          <Text style={styles.cardDescription}>
                            Get anonymous advice and support from caring advisors
                          </Text>

                          <View style={styles.cardFeatures}>
                            <View style={styles.featureItem}>
                              <Ionicons name="ear" size={14} color="#4ecca3" />
                              <Text style={styles.featureText}>Listen Mode</Text>
                            </View>
                            <View style={styles.featureItem}>
                              <Ionicons name="shield-checkmark" size={14} color="#4ecca3" />
                              <Text style={styles.featureText}>Anonymous</Text>
                            </View>
                          </View>
                        </View>
                      </View>

                      {selectedRole === 'listener' && (
                        <View style={styles.shine} />
                      )}
                    </LinearGradient>
                  </TouchableOpacity>
                </Animated.View>
              </Animated.View>

              {/* Epic Connect Button */}
              <Animated.View
                style={[
                  styles.connectButtonContainer,
                  {
                    opacity: fadeAnim,
                    transform: [{ translateY: slideUp }],
                  },
                ]}
              >
                <TouchableOpacity
                  activeOpacity={0.85}
                  onPress={handleConnect}
                  disabled={!selectedRole}
                  style={styles.connectButtonTouchable}
                >
                  <LinearGradient
                    colors={
                      selectedRole
                        ? ['#e94560', '#ff6b9d', '#ffa07a']
                        : ['rgba(255, 255, 255, 0.1)', 
                          'rgba(255, 255, 255, 0.05)']
                    }
                    style={styles.connectButton}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                  >
                    <View style={styles.connectButtonInner}>
                      <Ionicons 
                        name={selectedRole === 'advisor' ? 'mic' : 'ear'} 
                        size={24} 
                        color="#fff" 
                      />
                      <Text style={styles.connectButtonText}>
                        {selectedRole ? 'Start Connection' : 'Select a Role'}
                      </Text>
                      <Ionicons name="arrow-forward" size={24} color="#fff" />
                    </View>
                  </LinearGradient>
                </TouchableOpacity>

                {selectedRole && (
                  <Text style={styles.connectHint}>
                    You'll be connected to a random {selectedRole === 'advisor' ? 'listener' : 'advisor'}
                  </Text>
                )}
              </Animated.View>

              {/* Footer Info */}
              <View style={styles.footer}>
                <View style={styles.footerItem}>
                  <Ionicons name="shield-checkmark" size={16} color="rgba(255, 255, 255, 0.5)" />
                  <Text style={styles.footerText}>100% Anonymous</Text>
                </View>
                <View style={styles.footerDivider} />
                <View style={styles.footerItem}>
                  <Ionicons name="lock-closed" size={16} color="rgba(255, 255, 255, 0.5)" />
                  <Text style={styles.footerText}>End-to-End Encrypted</Text>
                </View>
                <View style={styles.footerDivider} />
                <View style={styles.footerItem}>
                  <Ionicons name="time" size={16} color="rgba(255, 255, 255, 0.5)" />
                  <Text style={styles.footerText}>24/7 Available</Text>
                </View>
              </View>
            </>
          ) : (
            /* Connecting State */
            <Animated.View
              style={[
                styles.connectingContainer,
                {
                  opacity: fadeAnim,
                },
              ]}
            >
              {/* Ripple Effects */}
              <Animated.View
                style={[
                  styles.ripple,
                  {
                    opacity: ripple1.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0.6, 0],
                    }),
                    transform: [
                      {
                        scale: ripple1.interpolate({
                          inputRange: [0, 1],
                          outputRange: [1, 2.5],
                        }),
                      },
                    ],
                  },
                ]}
              />
              <Animated.View
                style={[
                  styles.ripple,
                  {
                    opacity: ripple2.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0.5, 0],
                    }),
                    transform: [
                      {
                        scale: ripple2.interpolate({
                          inputRange: [0, 1],
                          outputRange: [1, 2.5],
                        }),
                      },
                    ],
                  },
                ]}
              />
              <Animated.View
                style={[
                  styles.ripple,
                  {
                    opacity: ripple3.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0.4, 0],
                    }),
                    transform: [
                      {
                        scale: ripple3.interpolate({
                          inputRange: [0, 1],
                          outputRange: [1, 2.5],
                        }),
                      },
                    ],
                  },
                ]}
              />

              {/* Central Connection Animation */}
              <Animated.View
                style={[
                  styles.connectingIcon,
                  {
                    transform: [
                      { scale: connectPulse },
                      { rotate: rotateConnect },
                    ],
                  },
                ]}
              >
                <LinearGradient
                  colors={['#e94560', '#ff6b9d', '#ffa07a']}
                  style={styles.connectingIconGradient}
                >
                  <Ionicons 
                    name={selectedRole === 'advisor' ? 'mic' : 'ear'} 
                    size={48} 
                    color="#fff" 
                  />
                </LinearGradient>
              </Animated.View>

              {/* Status Text */}
              <View style={styles.connectingTextContainer}>
                <Text style={styles.connectingTitle}>Connecting...</Text>
                <Text style={styles.connectingStatus}>{connectionStatus}</Text>
                
                {/* Animated Dots */}
                <View style={styles.dotsContainer}>
                  <Animated.View style={[styles.dot, { opacity: ripple1 }]} />
                  <Animated.View style={[styles.dot, { opacity: ripple2 }]} />
                  <Animated.View style={[styles.dot, { opacity: ripple3 }]} />
                </View>
              </View>

              {/* Cancel Button */}
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => {
                  setIsConnecting(false);
                  setConnectionStatus('');
                }}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={['rgba(255, 255, 255, 0.15)', 'rgba(255, 255, 255, 0.05)']}
                  style={styles.cancelButtonGradient}
                >
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </LinearGradient>
              </TouchableOpacity>

              {/* Connection Info */}
              <View style={styles.connectionInfo}>
                <View style={styles.connectionInfoItem}>
                  <Ionicons name="person" size={20} color="rgba(255, 255, 255, 0.6)" />
                  <Text style={styles.connectionInfoText}>
                    Role: {selectedRole === 'advisor' ? 'Advisor' : 'Listener'}
                  </Text>
                </View>
                <View style={styles.connectionInfoItem}>
                  <Ionicons name="globe" size={20} color="rgba(255, 255, 255, 0.6)" />
                  <Text style={styles.connectionInfoText}>Global Network</Text>
                </View>
              </View>
            </Animated.View>
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
  gradient: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  
  // Background Orbs
  orb: {
    position: 'absolute',
    borderRadius: 200,
    opacity: 0.6,
  },
  orb1: {
    width: 200,
    height: 200,
    top: 100,
    right: -50,
  },
  orb2: {
    width: 250,
    height: 250,
    bottom: 200,
    left: -80,
  },
  orb3: {
    width: 180,
    height: 180,
    top: 400,
    left: width / 2 - 90,
  },
  orbGradient: {
    flex: 1,
    borderRadius: 200,
  },

  // Header
  header: {
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  profileButton: {
    flex: 1,
    marginRight: 12,
  },
  profileGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  avatarContainer: {
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
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  avatarText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  onlineIndicator: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#4ecca3',
    borderWidth: 2,
    borderColor: '#0a0118',
  },
  profileInfo: {
    flex: 1,
  },
  greeting: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: 12,
    marginBottom: 2,
  },
  username: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  headerActions: {
    flexDirection: 'row',
    gap: 8,
  },
  iconButton: {
    position: 'relative',
  },
  iconButtonGradient: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  notificationBadge: {
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
    borderColor: '#0a0118',
  },
  badgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },

  // Title Section
  titleSection: {
    alignItems: 'center',
    paddingHorizontal: 20,
    marginTop: 30,
    marginBottom: 30,
  },
  logoContainer: {
    position: 'relative',
    marginBottom: 20,
  },
  premiumLogo: {
    width: 72,
    height: 72,
    borderRadius: 36,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  logoRing: {
    position: 'absolute',
    borderWidth: 2,
    borderRadius: 50,
  },
  logoRing1: {
    width: 90,
    height: 90,
    top: -9,
    left: -9,
    borderColor: 'rgba(233, 69, 96, 0.3)',
  },
  logoRing2: {
    width: 108,
    height: 108,
    top: -18,
    left: -18,
    borderColor: 'rgba(233, 69, 96, 0.15)',
  },
  mainTitle: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
    textAlign: 'center',
  },
  tagline: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.7)',
    textAlign: 'center',
    maxWidth: '80%',
  },

  // Stats
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 40,
    gap: 12,
  },
  statCard: {
    flex: 1,
  },
  statGradient: {
    padding: 16,
    borderRadius: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  statNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 8,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.6)',
    textAlign: 'center',
  },

  // Section Header
  sectionHeader: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 6,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.6)',
  },

  // Cards
  cardsWrapper: {
    paddingHorizontal: 20,
    gap: 16,
    marginBottom: 32,
  },
  cardContainer: {
    width: '100%',
  },
  cardTouchable: {
    width: '100%',
  },
  premiumCard: {
    borderRadius: 24,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    position: 'relative',
  },
  cardGlow: {
    position: 'absolute',
    top: -20,
    left: -20,
    right: -20,
    bottom: -20,
    borderRadius: 44,
    opacity: 0.2,
  },
  cardInner: {
    padding: 20,
  },
  cardIconSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  cardIcon: {
    width: 72,
    height: 72,
    borderRadius: 36,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  selectedBadge: {
    position: 'absolute',
    right: 0,
    top: 0,
  },
  badgeGradient: {
    borderRadius: 20,
    padding: 4,
  },
  cardContent: {
    flex: 1,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 24,
    fontWeight: 'bold',
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
  cardDescription: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.7)',
    marginBottom: 16,
    lineHeight: 20,
  },
  cardFeatures: {
    flexDirection: 'row',
    gap: 12,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  featureText: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
    fontWeight: '500',
  },
  shine: {
    position: 'absolute',
    top: 0,
    left: -100,
    width: 100,
    height: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    transform: [{ skewX: '-20deg' }],
  },

  // Connect Button
  connectButtonContainer: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  connectButtonTouchable: {
    width: '100%',
  },
  connectButton: {
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  connectButtonInner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    paddingHorizontal: 24,
    gap: 12,
  },
  connectButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  connectHint: {
    textAlign: 'center',
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: 13,
    marginTop: 12,
  },

  // Footer
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 20,
    gap: 12,
  },
  footerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  footerText: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.5)',
  },
  footerDivider: {
    width: 1,
    height: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },

  // Connecting State
  connectingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: height * 0.2,
    paddingHorizontal: 20,
  },
  ripple: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    borderWidth: 2,
    borderColor: '#e94560',
  },
  connectingIcon: {
    marginBottom: 40,
    zIndex: 10,
  },
  connectingIconGradient: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  connectingTextContainer: {
    alignItems: 'center',
    marginBottom: 60,
  },
  connectingTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 12,
  },
  connectingStatus: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.7)',
    textAlign: 'center',
    marginBottom: 20,
  },
  dotsContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#e94560',
  },
  cancelButton: {
    width: '100%',
    marginBottom: 40,
  },
  cancelButtonGradient: {
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  connectionInfo: {
    width: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 16,
    padding: 20,
    gap: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  connectionInfoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  connectionInfoText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    fontWeight: '500',
  },
});