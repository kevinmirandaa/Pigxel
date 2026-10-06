import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';

import { AppProviders } from '@/core/providers/AppProviders';
import { getRepositories } from '@/data';
import { useAppFonts } from '@/design-system';
import { selectIsAuthenticated, useSessionStore } from '@/stores';

void SplashScreen.preventAutoHideAsync();

function RootNavigator() {
  const fontsReady = useAppFonts();
  const status = useSessionStore((s) => s.status);
  const setSession = useSessionStore((s) => s.setSession);
  const signedIn = useSessionStore(selectIsAuthenticated);

  useEffect(() => {
    const { auth } = getRepositories();
    void auth.getSession().then(setSession);
    return auth.onAuthStateChange(setSession);
  }, [setSession]);

  const ready = fontsReady && status !== 'loading';
  useEffect(() => {
    if (ready) void SplashScreen.hideAsync();
  }, [ready]);

  if (!ready) return null;

  return (
    <>
      <StatusBar style="dark" />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Protected guard={!signedIn}>
          <Stack.Screen name="(auth)" />
        </Stack.Protected>
        <Stack.Protected guard={signedIn}>
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="add" />
          <Stack.Screen name="consult" />
          <Stack.Screen name="notifications" />
        </Stack.Protected>
      </Stack>
    </>
  );
}

export default function RootLayout() {
  return (
    <AppProviders>
      <RootNavigator />
    </AppProviders>
  );
}
