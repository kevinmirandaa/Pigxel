// design-spec: app-screens/tab-ajustes.png · screens/tab-ajustes.png
import { useQueryClient } from '@tanstack/react-query';
import { useRouter, type Href } from 'expo-router';
import { Alert, StyleSheet, View } from 'react-native';

import {
  Content,
  Screen,
  ScreenHeader,
  SectionTitle,
  SettingsGroup,
  SettingsRow,
  type LucideName,
} from '@/design-system';
import { getRepositories } from '@/data';
import { useSessionStore } from '@/stores';

interface Item {
  title: string;
  icon: LucideName;
  href: Href;
}

const GROUPS: { title: string; items: Item[] }[] = [
  {
    title: 'Cuenta',
    items: [
      { title: 'Información personal', icon: 'user-round', href: '/(tabs)/settings/profile' },
      { title: 'Correo electrónico', icon: 'mail', href: '/(tabs)/settings/email' },
      { title: 'Contraseña', icon: 'key-round', href: '/(tabs)/settings/password' },
    ],
  },
  {
    title: 'Finanzas',
    items: [
      { title: 'Moneda', icon: 'wallet', href: '/(tabs)/settings/currency' },
      { title: 'Límite', icon: 'gauge', href: '/(tabs)/settings/limit' },
      { title: 'Categorías', icon: 'notebook-text', href: '/(tabs)/settings/categories' },
      { title: 'Suscripciones', icon: 'credit-card', href: '/(tabs)/settings/subscriptions' },
      { title: 'Objetivos', icon: 'target', href: '/(tabs)/settings/goals' },
    ],
  },
  {
    title: 'App',
    items: [
      { title: 'Notificaciones', icon: 'bell', href: '/(tabs)/settings/notifications' },
      { title: 'Apariencia', icon: 'moon', href: '/(tabs)/settings/appearance' },
      { title: 'Idioma', icon: 'globe', href: '/(tabs)/settings/language' },
      { title: 'Privacidad', icon: 'lock', href: '/(tabs)/settings/privacy' },
      { title: 'Ayuda', icon: 'circle-help', href: '/(tabs)/settings/help' },
    ],
  },
];

/**
 * Ajustes: tres grupos (Cuenta, Finanzas, App) que navegan a sus pantallas de detalle, y — adición necesaria que el
 * Figma no tiene — "Cerrar sesión" con confirmación nativa.
 */
export default function SettingsScreen() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const signOut = async () => {
    try {
      await getRepositories().auth.signOut();
    } finally {
      useSessionStore.getState().setSession(null);
      queryClient.clear(); // no dejar datos del usuario anterior en memoria
      router.replace('/(auth)/welcome');
    }
  };
  const confirmSignOut = () =>
    Alert.alert('¿Cerrar sesión?', 'Tendrás que iniciar sesión de nuevo para ver tus cuentas.', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Cerrar sesión', style: 'destructive', onPress: () => void signOut() },
    ]);

  return (
    <Screen scroll tabBar>
      <ScreenHeader variant="tab" title="Ajustes" />
      <Content margin={39} style={styles.body}>
        {GROUPS.map((group) => (
          <View key={group.title} style={styles.group}>
            <SectionTitle size="large">{group.title}</SectionTitle>
            <SettingsGroup dividerInset={74}>
              {group.items.map((item) => (
                <SettingsRow
                  key={item.title}
                  menuIcon={item.icon}
                  title={item.title}
                  onPress={() => router.push(item.href)}
                />
              ))}
            </SettingsGroup>
          </View>
        ))}
        <SettingsGroup dividerInset={74}>
          <SettingsRow
            menuIcon="log-out"
            title="Cerrar sesión"
            destructive
            trailing="none"
            onPress={confirmSignOut}
          />
        </SettingsGroup>
      </Content>
    </Screen>
  );
}

const styles = StyleSheet.create({
  body: { marginTop: 28, gap: 32 },
  group: { gap: 8 },
});
