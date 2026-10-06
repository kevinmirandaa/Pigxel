import { StyleSheet, View } from 'react-native';

import { iconSize, type LucideName } from '../icons';
import { Icon } from '../primitives/Icon';
import { Text } from '../primitives/Text';
import { colors, layout, radii } from '../tokens';

export interface DetailIntroProps {
  icon: LucideName;
  /** Título en negrita bajo el ícono (opcional: Moneda y Categorías solo llevan descripción). */
  title?: string;
  description?: string;
}

/** Introducción centrada de las pantallas de detalle de Ajustes: caja de ícono 56×56, título y descripción gris. */
export function DetailIntro({ icon, title, description }: DetailIntroProps) {
  return (
    <View style={styles.wrap}>
      <View style={styles.box}>
        <Icon name={icon} size={iconSize.header} color={colors.black} />
      </View>
      {title ? (
        <Text variant="bodyStrong" style={styles.center} accessibilityRole="header">
          {title}
        </Text>
      ) : null}
      {description ? (
        <Text variant="description" tone="secondary" style={styles.center}>
          {description}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { alignItems: 'center', gap: 10, paddingHorizontal: 4 },
  box: {
    width: layout.headerIcon.size,
    height: layout.headerIcon.size,
    borderRadius: radii.headerIcon,
    backgroundColor: colors.headerIconBox,
    alignItems: 'center',
    justifyContent: 'center',
  },
  center: { textAlign: 'center' },
});
