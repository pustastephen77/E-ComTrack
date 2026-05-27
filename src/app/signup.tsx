import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { BottomTabInset, Spacing } from '@/constants/theme';
import { useAuth, useRedirectIfAuthed } from '@/lib/auth';
import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, TextInput } from 'react-native';

export default function SignupScreen() {
  const { signUp, error, isLoading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [localError, setLocalError] = useState<string | null>(null);

  useRedirectIfAuthed();

  const handleSubmit = async () => {
    setLocalError(null);
    try {
      await signUp(email.trim(), password);
    } catch (caught) {
      setLocalError((caught as Error).message || 'Unable to create an account.');
    }
  };

  return (
    <ScrollView
      contentContainerStyle={styles.contentContainer}
      keyboardShouldPersistTaps="handled"
      style={styles.screen}>
      <ThemedView style={styles.card} type="backgroundElement">
        <ThemedText type="title" style={styles.heading}>
          Create account
        </ThemedText>
        <ThemedText type="small" themeColor="textSecondary" style={styles.helpText}>
          Secure signup with email and password keeps your data protected.
        </ThemedText>

        <TextInput
          autoCapitalize="none"
          autoComplete="email"
          keyboardType="email-address"
          onChangeText={setEmail}
          placeholder="Email"
          placeholderTextColor="#999"
          style={styles.input}
          value={email}
        />
        <TextInput
          autoCapitalize="none"
          autoComplete="password"
          onChangeText={setPassword}
          placeholder="Password"
          placeholderTextColor="#999"
          secureTextEntry
          style={styles.input}
          value={password}
        />

        {(localError || error) && (
          <ThemedText type="smallBold" style={styles.errorText}>
            {localError || error}
          </ThemedText>
        )}

        <Pressable style={styles.button} onPress={handleSubmit} disabled={isLoading}>
          <ThemedText type="smallBold" style={styles.buttonText}>
            {isLoading ? 'Creating account…' : 'Sign up'}
          </ThemedText>
        </Pressable>
      </ThemedView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  contentContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: Spacing.four,
    paddingBottom: BottomTabInset,
  },
  card: {
    borderRadius: Spacing.four,
    padding: Spacing.four,
    gap: Spacing.three,
  },
  heading: {
    marginBottom: Spacing.two,
  },
  helpText: {
    marginBottom: Spacing.four,
  },
  input: {
    borderRadius: Spacing.five,
    borderWidth: 1,
    borderColor: '#888',
    color: '#111',
    fontSize: 16,
    padding: Spacing.three,
  },
  button: {
    marginTop: Spacing.two,
    borderRadius: Spacing.five,
    paddingVertical: Spacing.three,
    alignItems: 'center',
    backgroundColor: '#3C7DFF',
  },
  buttonText: {
    color: '#fff',
  },
  errorText: {
    color: '#c53030',
  },
});
