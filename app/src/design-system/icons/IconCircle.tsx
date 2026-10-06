import { StyleSheet, View } from 'react-native';

import { Icon } from '../primitives/Icon';
import { colors, layout } from '../tokens';
import type { LucideName } from './lucide';
import { iconSize, iconStroke } from './iconTokens';

export interface IconCircleProps {
  name: LucideName;
  /** Color del glifo (menú Agregar: verde / azul / amarillo / rojo del Figma). */
  color: string;
  size?: number;
  background?: string;
}

/** Ícono de color dentro del círculo de 50×50 (menú Agregar): mismo círculo gris claro y tono medido del Figma. */
export function IconCircle({
  name,
  color,
  size = layout.menuIconBox,
  background = colors.menuIconBox,
}: IconCircleProps) {
  return (
    <View
      style={[
        styles.circle,
        { width: size, height: size, borderRadius: size / 2, backgroundColor: background },
      ]}
    >
      <Icon name={name} size={iconSize.addMenu} color={color} strokeWidth={iconStroke.default} />
    </View>
  );
}

const styles = StyleSheet.create({ circle: { alignItems: 'center', justifyContent: 'center' } });
