import { StyleSheet } from 'react-native';

import { Text } from '../primitives/Text';

export interface SectionTitleProps {
  children: string;
  /**
   * `large` 20 Bold (Ajustes: Cuenta/Finanzas/App) · `medium` 18 Bold (Recientes, Suscripciones, detalle)
   * · `small` 14 Semibold gris (Hoy / Ayer).
   */
  size?: 'large' | 'medium' | 'small';
}

export function SectionTitle({ children, size = 'medium' }: SectionTitleProps) {
  if (size === 'small') {
    return (
      <Text variant="label" tone="secondary" style={styles.small} accessibilityRole="header">
        {children}
      </Text>
    );
  }
  return (
    <Text variant={size === 'large' ? 'heading' : 'bodyStrong'} accessibilityRole="header">
      {children}
    </Text>
  );
}

const styles = StyleSheet.create({ small: { fontSize: 14 } });
