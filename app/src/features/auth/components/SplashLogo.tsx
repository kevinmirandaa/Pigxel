import { Image } from 'expo-image';
import { StyleSheet, View } from 'react-native';

import logo from '@/assets/brand/logo/logo.png';
import { colors } from '@/design-system';

/** Splash: fondo blanco y el logo pixelado de 160×160 centrado (en el Figma, nodo 1:3 en (131, 357) de 402×874 = centro exacto). */
export function SplashLogo() {
  return (
    <View style={styles.root} accessibilityLabel="Pigxel" accessibilityRole="image">
      <Image source={logo} style={styles.logo} contentFit="contain" />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.authBg, alignItems: 'center', justifyContent: 'center' },
  logo: { width: 160, height: 160 },
});
