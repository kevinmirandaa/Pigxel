import { useRouter, type Href } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { Content, PrimaryButton, Text, WELCOME_MARGIN, colors } from '@/design-system';

/** Lanzador de desarrollo (solo `__DEV__`): continuar a la app, galería de componentes o índice de pantallas. */
export function DevLauncher({ onContinue }: { onContinue: () => void }) {
  const router = useRouter();
  return (
    <View style={styles.root}>
      <Text variant="title">Pigxel</Text>
      <Text variant="caption" tone="secondary">
        Modo desarrollo
      </Text>
      <Content margin={WELCOME_MARGIN} style={styles.buttons}>
        <PrimaryButton label="Continuar a la app" onPress={onContinue} />
        <PrimaryButton
          variant="glass"
          label="Índice de pantallas"
          onPress={() => router.push('/_dev/screens' as Href)}
        />
        <PrimaryButton
          variant="glass"
          label="Galería de componentes"
          onPress={() => router.push('/_dev/gallery' as Href)}
        />
      </Content>
      <Text variant="micro" tone="secondary" style={styles.hint}>
        Para ocultar este lanzador: EXPO_PUBLIC_SKIP_DEV_LAUNCHER=true
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.authBg,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  buttons: { gap: 12, marginTop: 28 },
  hint: { marginTop: 24, textAlign: 'center' },
});
