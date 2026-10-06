import { StyleSheet, View } from 'react-native';

import { Text } from '../primitives/Text';
import { Content } from '../primitives/Screen';
import { layout } from '../tokens';
import { GlassButton } from './GlassButton';

export interface AuthHeaderProps {
  title: string;
  subtitle?: string;
  /** Botón de vidrio "atrás" (20, 20). */
  onBack?: () => void;
}

/**
 * Cabecera de las pantallas de entrada: botón atrás de vidrio, título 40 Bold (líneas de 48) y subtítulo 20
 * gris (líneas de 24), alineados al margen de 36 pt. El Figma los coloca en x=42 y con espacios que varían
 * entre pantallas (95/102, 10–15 pt): se normalizan (ver docs/fidelity-auth.md).
 */
export function AuthHeader({ title, subtitle, onBack }: AuthHeaderProps) {
  return (
    <View>
      <View style={styles.back}>
        {onBack ? (
          <GlassButton icon="chevron-left" accessibilityLabel="Volver" onPress={onBack} />
        ) : (
          <View style={styles.spacer} />
        )}
      </View>
      <Content style={styles.texts}>
        <Text variant="authTitle" accessibilityRole="header">
          {title}
        </Text>
        {subtitle ? (
          <Text variant="authSubtitle" tone="secondary">
            {subtitle}
          </Text>
        ) : null}
      </Content>
    </View>
  );
}

const styles = StyleSheet.create({
  back: {
    marginTop: layout.backButtonTop,
    paddingHorizontal: layout.backButtonLeft,
    alignItems: 'flex-start',
  },
  spacer: { width: layout.glassButtonSize, height: layout.glassButtonSize },
  // El título cae 25 pt bajo el botón (20 + 50 + 25 = 95); subtítulo 12 pt bajo el título.
  texts: { marginTop: 24, gap: 12 },
});
