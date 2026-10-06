import { Tabs } from 'expo-router';

import { FloatingTabBar, colors } from '@/design-system';

/**
 * Tres pestañas con la barra flotante de vidrio: Cuentas (`index`), Actividad (`activity`) y Ajustes (`settings`,
 * con su propio Stack: la barra sigue visible en sus pantallas de detalle). Cambiar de pestaña conserva su estado
 * (las pantallas no se desmontan).
 */
export default function TabsLayout() {
  return (
    <Tabs
      tabBar={(props) => <FloatingTabBar {...props} />}
      screenOptions={{ headerShown: false, sceneStyle: { backgroundColor: colors.bg } }}
    >
      <Tabs.Screen name="index" options={{ title: 'Cuentas' }} />
      <Tabs.Screen name="activity" options={{ title: 'Actividad' }} />
      <Tabs.Screen name="settings" options={{ title: 'Ajustes' }} />
    </Tabs>
  );
}
