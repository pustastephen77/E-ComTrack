import { useRouter } from 'expo-router';
import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { BottomTabInset, Spacing } from '@/constants/theme';
import { useAuth } from '@/lib/auth';

export default function AccountScreen() {
  const { user, signOut, isLoading } = useAuth();
  const router = useRouter();

  return (
    <View style={styles.screen}>
      <ThemedView style={styles.container} type="backgroundElement">
        <ThemedText type="title" style={styles.title}>
          Account
        </ThemedText>
        <ThemedText type="small" themeColor="textSecondary" style={styles.subtitle}>
          Secure your shopping experience with email authentication.
        </ThemedText>

        {isLoading ? (
          <ThemedText type="smallBold" style={styles.status}>
            Loading account…
          </ThemedText>
        ) : user ? (
          <>
            <ThemedText type="subtitle" style={styles.userEmail}>
              {user.email}
            </ThemedText>
            <Pressable style={styles.actionButton} onPress={signOut}>
              <ThemedText type="smallBold" style={styles.actionText}>
                Sign out
              </ThemedText>
            </Pressable>
          </>
        ) : (
          <>
            <Pressable style={styles.actionButton} onPress={() => router.push('/login')}>
              <ThemedText type="smallBold" style={styles.actionText}>
                Sign in
              </ThemedText>
            </Pressable>
            <Pressable style={styles.secondaryButton} onPress={() => router.push('/signup')}>
              <ThemedText type="smallBold" style={styles.secondaryText}>
                Create account
              </ThemedText>
            </Pressable>
          </>
        )}
      </ThemedView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    paddingBottom: BottomTabInset,
  },
  container: {
    flex: 1,
    margin: Spacing.four,
    borderRadius: Spacing.four,
    padding: Spacing.four,
    justifyContent: 'center',
    gap: Spacing.four,
  },
  title: {
    marginBottom: Spacing.one,
  },
  subtitle: {
    marginBottom: Spacing.four,
  },
  status: {
    marginVertical: Spacing.two,
  },
  userEmail: {
    marginBottom: Spacing.four,
  },
  actionButton: {
    marginTop: Spacing.two,
    paddingVertical: Spacing.three,
    borderRadius: Spacing.five,
    backgroundColor: '#3C7DFF',
    alignItems: 'center',
  },
  actionText: {
    color: '#fff',
  },
  secondaryButton: {
    marginTop: Spacing.two,
    paddingVertical: Spacing.three,
    borderRadius: Spacing.five,
    borderWidth: 1,
    borderColor: '#3C7DFF',
    alignItems: 'center',
  },
  secondaryText: {
    color: '#3C7DFF',
  },
});
