import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    StatusBar,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

/*
 * After a call ends, the listener can provide a quick review of the
 * advisor.  This screen collects a star rating and an optional comment
 * and sends it to the backend.  It respects the current theme and
 * uses simple controls for a clean look.
 */

type ThemeMode = 'dark' | 'light';

export default function ReviewScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ role?: string; roomId?: string }>();
  const role = params?.role === 'listener' || params?.role === 'advisor' ? params.role : 'listener';
  const roomId = params?.roomId || '';
  const [theme, setTheme] = useState<ThemeMode>('dark');
  const [rating, setRating] = useState<number>(0);
  const [comment, setComment] = useState('');
  const isDark = theme === 'dark';
  const colors = {
    bg: isDark ? '#000' : '#fff',
    text: isDark ? '#fff' : '#000',
    textSecondary: isDark ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.7)',
    cardBg: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)',
    border: isDark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.15)',
    accent: '#a855f7',
  };

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

  const handleSubmit = async () => {
    const token = await AsyncStorage.getItem('userToken');
    const baseUrl = 'http://localhost:3000';
    try {
      await fetch(baseUrl + '/review', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token ? `Bearer ${token}` : '',
        },
        body: JSON.stringify({ roomId, role, rating, comment }),
      });
    } catch (_) {
      // Ignore errors; for a real app handle gracefully
    }
    // Return to the home screen.  '/' is the root route mapping to index.tsx
    router.replace('/');
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.bg }]}> 
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
      <Text style={{ color: colors.text, fontSize: 22, fontWeight: '600', marginBottom: 16 }}>Rate your advisor</Text>
      {/* Star rating */}
      <View style={styles.starRow}>
        {Array.from({ length: 5 }).map((_, idx) => {
          const filled = idx < rating;
          return (
            <TouchableOpacity
              key={idx}
              onPress={() => setRating(idx + 1)}
              activeOpacity={0.8}
            >
              <Ionicons
                name={filled ? 'star' : 'star-outline'}
                size={32}
                color={filled ? colors.accent : colors.textSecondary}
                style={{ marginHorizontal: 4 }}
              />
            </TouchableOpacity>
          );
        })}
      </View>
      {/* Comment input */}
      <TextInput
        value={comment}
        onChangeText={setComment}
        placeholder="Add a comment (optional)"
        placeholderTextColor={colors.textSecondary}
        multiline
        style={[
          styles.commentInput,
          {
            backgroundColor: colors.cardBg,
            borderColor: colors.border,
            color: colors.text,
          },
        ]}
      />
      <TouchableOpacity
        onPress={handleSubmit}
        activeOpacity={0.8}
        style={[styles.submitButton, { backgroundColor: colors.accent }]}
      >
        <Text style={{ color: colors.bg, fontSize: 16, fontWeight: '600' }}>Submit</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 80,
    paddingHorizontal: 24,
  },
  starRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 24,
  },
  commentInput: {
    height: 120,
    borderWidth: 1,
    borderRadius: 16,
    padding: 16,
    textAlignVertical: 'top',
    marginBottom: 24,
  },
  submitButton: {
    alignSelf: 'center',
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 20,
  },
});