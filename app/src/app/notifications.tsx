// design-spec: app-screens/notificaciones.png · screens/notificaciones.png
import { useRouter } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { goBackOr } from '@/core/navigation';
import { Content, EmptyState, Screen, ScreenHeader } from '@/design-system';

export default function NotificationsScreen() {
  const router = useRouter();
  return (
    <Screen>
      <ScreenHeader title="Notificaciones" onBack={() => goBackOr(router, '/(tabs)')} />
      <Content style={styles.center}>
        <View style={styles.empty}>
          <EmptyState
            title="Sin notificaciones"
            description="Ahora mismo no tienes ninguna notificación. Puedes volver más tarde para revisar tu bandeja."
          />
        </View>
      </Content>
    </Screen>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: 'center' },
  empty: { marginBottom: 120 },
});
