import { Stack } from 'expo-router';

import { colors } from '@/design-system';

/** Los detalles de Ajustes mantienen visible la barra de pestañas (así están en el diseño). */
export default function SettingsStackLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        gestureEnabled: true,
        contentStyle: { backgroundColor: colors.bg },
      }}
    />
  );
}
