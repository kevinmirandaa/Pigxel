import { StyleSheet } from 'react-native';

import { Pressable } from '../primitives/Pressable';
import { Text } from '../primitives/Text';

export interface FooterLinkProps {
  /** Texto normal: "¿Ya tienes una cuenta?". */
  prefix: string;
  /** Texto en negrita: "Iniciar sesión". */
  action: string;
  onPress?: () => void;
  /** `false` = la acción no se puede tocar (p. ej. "Reenviar en 00:59"). */
  actionEnabled?: boolean;
}

/** Pie de pantalla: texto 16 centrado con la acción en negrita ("¿No tienes cuenta? **Crear cuenta**"). Área táctil ≥ 44 pt. */
export function FooterLink({ prefix, action, onPress, actionEnabled = true }: FooterLinkProps) {
  const body = (
    <Text variant="rowDetail" style={styles.text}>
      {prefix}{' '}
      <Text variant="rowLabel" style={styles.action}>
        {action}
      </Text>
    </Text>
  );
  if (!onPress || !actionEnabled)
    return (
      <Pressable
        disabled
        haptic={false}
        style={styles.area}
        accessibilityLabel={`${prefix} ${action}`}
      >
        {body}
      </Pressable>
    );
  return (
    <Pressable
      onPress={onPress}
      haptic={false}
      style={styles.area}
      accessibilityRole="link"
      accessibilityLabel={`${prefix} ${action}`}
    >
      {body}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  area: { minHeight: 44, alignItems: 'center', justifyContent: 'center', alignSelf: 'stretch' },
  text: { fontSize: 16, lineHeight: 19, textAlign: 'center' },
  action: { fontSize: 16, lineHeight: 19 },
});
