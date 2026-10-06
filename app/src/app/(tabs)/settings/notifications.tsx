// design-spec: app-screens/ajustes-notificaciones.png · screens/ajustes-notificaciones.png
import { useRouter } from 'expo-router';
import { StyleSheet } from 'react-native';

import { goBackOr } from '@/core/navigation';
import {
  Content,
  DetailIntro,
  InlineMessage,
  Screen,
  ScreenHeader,
  SettingsGroup,
  SettingsRow,
  Text,
  type LucideName,
} from '@/design-system';
import {
  NOTIFICATION_ITEMS,
  useSettings,
  useUpdateSettings,
  withNotificationPref,
} from '@/features/settings';

/** No hay notificaciones push reales todavía: las preferencias se guardan listas para cuando existan. */
export default function NotificationSettingsScreen() {
  const router = useRouter();
  const settings = useSettings();
  const update = useUpdateSettings();
  const prefs = settings.data?.notifications;

  return (
    <Screen scroll tabBar>
      <ScreenHeader title="Notificaciones" onBack={() => goBackOr(router, '/(tabs)/settings')} />
      <Content style={styles.body}>
        <DetailIntro icon="bell" description="Elige los avisos que quieres recibir de Pigxel." />
        <SettingsGroup>
          {NOTIFICATION_ITEMS.map((item) => (
            <SettingsRow
              key={item.key}
              icon={item.icon as LucideName}
              title={item.title}
              subtitle={item.subtitle}
              trailing="none"
              toggle={{
                value: prefs?.[item.key] ?? false,
                onChange: (value) =>
                  prefs &&
                  update.mutate({ notifications: withNotificationPref(prefs, item.key, value) }),
              }}
            />
          ))}
        </SettingsGroup>
        {update.error ? <InlineMessage>{update.error.message}</InlineMessage> : null}
        <Text variant="description" tone="secondary">
          Los avisos de límite son informativos. Nunca bloquean el registro de tus gastos.
        </Text>
      </Content>
    </Screen>
  );
}

const styles = StyleSheet.create({ body: { marginTop: 20, gap: 16 } });
