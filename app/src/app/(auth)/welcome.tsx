// design-spec: app-screens/auth-bienvenida.png · screens/auth-bienvenida.png
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import welcomeBg from '@/assets/backgrounds/welcome-bg.png';
import {
  Content,
  MAX_SCREEN_WIDTH,
  PrimaryButton,
  Text,
  WELCOME_MARGIN,
  colors,
} from '@/design-system';

/** Bienvenida: fondo a pantalla completa, título en tres tonos y dos botones (margen 51). */
export default function WelcomeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.root}>
      <Image
        source={welcomeBg}
        style={StyleSheet.absoluteFill}
        contentFit="cover"
        accessibilityIgnoresInvertColors
      />
      <View
        style={[
          styles.column,
          { paddingTop: insets.top, paddingBottom: Math.max(insets.bottom, 0) + 29 },
        ]}
      >
        <Content margin={WELCOME_MARGIN}>
          <Text variant="authTitle" accessibilityRole="header">
            Todo tu panorama{' '}
            <Text variant="authTitle" style={{ color: colors.titleMuted1 }}>
              financiero
            </Text>{' '}
            <Text variant="authTitle" style={{ color: colors.titleMuted2 }}>
              en un solo lugar.
            </Text>
          </Text>
        </Content>
        <Content margin={WELCOME_MARGIN} style={styles.buttons}>
          <PrimaryButton
            label="Crear cuenta"
            withArrow={false}
            onPress={() => router.push('/(auth)/sign-up')}
          />
          <PrimaryButton
            variant="glass"
            leftIcon="at-sign"
            label="Iniciar sesión"
            onPress={() => router.push('/(auth)/sign-in')}
          />
        </Content>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.authBg },
  // Columna centrada de 440 máx. (iPad); el contenido se ancla abajo, sobre el área segura.
  column: {
    flex: 1,
    width: '100%',
    maxWidth: MAX_SCREEN_WIDTH,
    alignSelf: 'center',
    justifyContent: 'flex-end',
  },
  buttons: { marginTop: 120, gap: 16 },
});
