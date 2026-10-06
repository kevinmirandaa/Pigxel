import Svg, { Circle, Path } from 'react-native-svg';

import { Icon } from '../primitives/Icon';
import { colors } from '../tokens';
import { iconSize, iconStroke } from './iconTokens';

export type TabIconName = 'wallet' | 'activity' | 'layers';

export interface TabIconProps {
  name: TabIconName;
  /** Activa: negro y relleno donde el glifo lo permite, trazo más firme. Inactiva: línea gris `#C1C1C1`. */
  active: boolean;
  size?: number;
}

const LINE_NAME = {
  wallet: 'wallet',
  activity: 'chart-no-axes-column-increasing',
  layers: 'layers',
} as const;

/**
 * Íconos de la barra de pestañas. Misma geometría Lucide que el resto de la app:
 *  · inactivo → `Icon` de línea gris (2 pt);
 *  · activo → negro, más firme: cartera y capas con la forma cerrada RELLENA, barras con trazo grueso redondeado.
 * Las siluetas rellenas usan los mismos trazos de Lucide (viewBox 24) y se dibujan aquí porque Lucide solo trae contorno.
 */
export function TabIcon({ name, active, size = iconSize.tab }: TabIconProps) {
  if (!active) {
    return (
      <Icon
        name={LINE_NAME[name]}
        size={size}
        color={colors.iconMuted}
        strokeWidth={iconStroke.default}
      />
    );
  }
  const ink = colors.black;
  if (name === 'activity') {
    return <Icon name={LINE_NAME.activity} size={size} color={ink} strokeWidth={3.25} />;
  }
  const stroke = {
    stroke: ink,
    strokeWidth: (iconStroke.firm * 24) / size,
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
  } as const;
  if (name === 'wallet') {
    return (
      <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        {/* Cartera sólida (silueta cerrada) con el cierre como punto blanco, como el ícono activo del Figma. */}
        <Path
          d="M5 3H18a1 1 0 0 1 1 1V7H20a1 1 0 0 1 1 1V20a1 1 0 0 1-1 1H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Z"
          fill={ink}
          {...stroke}
        />
        <Circle cx={17.25} cy={14} r={1.5} fill={colors.white} />
      </Svg>
    );
  }
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      {/* Capas: rombo superior relleno + dos bandas firmes. */}
      <Path
        d="M12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83z"
        fill={ink}
        {...stroke}
      />
      <Path
        d="M2 12a1 1 0 0 0 .58.91l8.6 3.91a2 2 0 0 0 1.65 0l8.58-3.9A1 1 0 0 0 22 12"
        {...stroke}
      />
      <Path
        d="M2 17a1 1 0 0 0 .58.91l8.6 3.91a2 2 0 0 0 1.65 0l8.58-3.9A1 1 0 0 0 22 17"
        {...stroke}
      />
    </Svg>
  );
}
