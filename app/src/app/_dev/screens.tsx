import { Redirect, useRouter, type Href } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { env } from '@/core/config/env';
import { ALL_SCREENS, SCREEN_GROUPS } from '@/core/dev/screens-index';
import { isImplemented } from '@/core/dev/screens-status';
import { getRepositories } from '@/data';
import {
  Card,
  Content,
  GlassButton,
  Pressable,
  Screen,
  SectionTitle,
  Text,
  colors,
} from '@/design-system';
import { selectIsAuthenticated, useSessionStore } from '@/stores';

/**
 * ÍNDICE DE PANTALLAS (solo __DEV__): las 36 rutas del Figma agrupadas por flujo, con enlace directo y marca
 * "listo"/"pendiente". Permite revisar cualquier pantalla en Expo Go sin recorrer los flujos.
 * Cada lote actualiza `core/dev/screens-status.ts`.
 */
export default function ScreensIndex() {
  if (!__DEV__) return <Redirect href="/" />;
  return <ScreensIndexContent />;
}

function ScreensIndexContent() {
  const router = useRouter();
  const authenticated = useSessionStore(selectIsAuthenticated);
  const [busy, setBusy] = useState(false);
  const done = ALL_SCREENS.filter((x) => isImplemented(x.key)).length;

  const demoLogin = async () => {
    setBusy(true);
    try {
      const session = await getRepositories().auth.signIn({
        email: 'demo@pigxel.test',
        password: 'demo12345',
      });
      useSessionStore.getState().setSession(session);
    } finally {
      setBusy(false);
    }
  };
  const logout = async () => {
    await getRepositories().auth.signOut();
    useSessionStore.getState().setSession(null);
  };

  return (
    <Screen scroll>
      <View style={styles.back}>
        <GlassButton
          icon="chevron-left"
          accessibilityLabel="Volver"
          onPress={() => (router.canGoBack() ? router.back() : router.replace('/'))}
        />
      </View>
      <Content style={styles.body}>
        <Text variant="detailTitle">Pantallas</Text>
        <Text variant="description" tone="secondary">
          {done} de {ALL_SCREENS.length} construidas · fuente de datos: {env.dataSource}
        </Text>

        <Card style={styles.session}>
          <Text variant="rowLabel">{authenticated ? 'Sesión iniciada' : 'Sin sesión'}</Text>
          <Text variant="rowDetail" tone="secondary">
            Las pantallas de la app (pestañas, Agregar, Ajustes…) requieren sesión.
          </Text>
          {authenticated ? (
            <Pressable onPress={logout} accessibilityRole="button" style={styles.action}>
              <Text variant="rowLabel">Cerrar sesión</Text>
            </Pressable>
          ) : env.dataSource === 'mock' ? (
            <Pressable
              onPress={demoLogin}
              disabled={busy}
              accessibilityRole="button"
              style={styles.action}
            >
              <Text variant="rowLabel">{busy ? 'Entrando…' : 'Entrar como demo (solo mock)'}</Text>
            </Pressable>
          ) : (
            <Text variant="rowDetail" tone="secondary">
              Con supabase, inicia sesión desde la pantalla de entrada.
            </Text>
          )}
        </Card>

        {SCREEN_GROUPS.map((group) => (
          <View key={group.title} style={styles.group}>
            <SectionTitle>{group.title}</SectionTitle>
            <Card>
              {group.screens.map((screen, i) => {
                const ready = isImplemented(screen.key);
                return (
                  <Pressable
                    key={screen.key}
                    onPress={() => router.push(screen.href as Href)}
                    haptic={false}
                    accessibilityRole="button"
                    accessibilityLabel={`${screen.title}, ${ready ? 'lista' : 'pendiente'}`}
                    style={[styles.row, i > 0 && styles.rowBorder]}
                  >
                    <View style={styles.rowText}>
                      <Text variant="rowLabel" numberOfLines={1}>
                        {screen.title}
                      </Text>
                      <Text variant="rowDetail" tone="secondary" numberOfLines={1}>
                        {screen.key}
                        {screen.note ? ` · ${screen.note}` : ''}
                        {screen.protectedRoute && !authenticated ? ' · requiere sesión' : ''}
                      </Text>
                    </View>
                    <Text
                      variant="rowDetail"
                      style={{ color: ready ? colors.infoNoteText : colors.textSecondary }}
                    >
                      {ready ? 'listo' : 'pendiente'}
                    </Text>
                  </Pressable>
                );
              })}
            </Card>
          </View>
        ))}
      </Content>
    </Screen>
  );
}

const styles = StyleSheet.create({
  back: { marginTop: 20, paddingHorizontal: 20, alignItems: 'flex-start' },
  body: { marginTop: 24, gap: 12, paddingBottom: 24 },
  session: { padding: 16, gap: 6 },
  action: { minHeight: 44, justifyContent: 'center' },
  group: { gap: 8, marginTop: 8 },
  row: {
    minHeight: 56,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    gap: 12,
  },
  rowBorder: { borderTopWidth: 1, borderTopColor: colors.divider },
  rowText: { flex: 1, minWidth: 0 },
});
