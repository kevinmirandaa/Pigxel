import { StyleSheet, View } from 'react-native';

import { iconSize, iconStroke, type LucideName } from '../icons';
import { Icon } from '../primitives/Icon';
import { Pressable } from '../primitives/Pressable';
import { Text } from '../primitives/Text';
import { colors, layout } from '../tokens';
import { Card } from './Card';

export interface AddMenuRowProps {
  title: string;
  icon: LucideName;
  /** Color del ícono de línea (verde, azul, amarillo, rojo en el Figma). */
  tint: string;
  /** El cuerpo de la fila abre la lista… */
  onPress: () => void;
  /** …y el "+" abre el formulario de creación. */
  onAdd: () => void;
  addLabel: string;
}

/** Fila del menú Agregar: círculo de ícono de color 50×50, título 20 Bold y "+" gris (área táctil propia ≥ 44). */
export function AddMenuRow({ title, icon, tint, onPress, onAdd, addLabel }: AddMenuRowProps) {
  return (
    <Card style={styles.card}>
      <Pressable haptic={false} onPress={onPress} accessibilityLabel={title} style={styles.body}>
        <View style={styles.circle}>
          <Icon
            name={icon}
            size={iconSize.settingsRow}
            color={tint}
            strokeWidth={iconStroke.firm}
          />
        </View>
        <Text variant="heading" numberOfLines={1} style={styles.title}>
          {title}
        </Text>
      </Pressable>
      <Pressable onPress={onAdd} accessibilityLabel={addLabel} hitSlop={8} style={styles.plus}>
        <Icon name="plus" size={22} color={colors.chevron} strokeWidth={iconStroke.firm} />
      </Pressable>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: { height: layout.card.height, flexDirection: 'row', alignItems: 'center' },
  body: {
    flex: 1,
    height: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 10,
    gap: 16,
  },
  circle: {
    width: layout.menuIconBox,
    height: layout.menuIconBox,
    borderRadius: layout.menuIconBox / 2,
    backgroundColor: colors.menuIconBox,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: { flex: 1 },
  plus: { width: 56, height: '100%', alignItems: 'center', justifyContent: 'center' },
});
