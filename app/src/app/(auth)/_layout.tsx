import { Stack } from 'expo-router';

import { colors } from '@/design-system';

/** Stack de entrada: sin encabezado nativo (los botones de vidrio son propios), gesto de volver activo y animación estándar de iOS. */
export default function AuthLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        gestureEnabled: true,
        animation: 'default',
        contentStyle: { backgroundColor: colors.authBg },
      }}
    />
  );
}
