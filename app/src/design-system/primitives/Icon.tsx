import { lucideIcons, type LucideComponent, type LucideName } from '../icons/lucide';
import { iconStroke } from '../icons/iconTokens';
import { colors } from '../tokens';

export interface IconProps {
  /** Nombre del ícono en el catálogo (icons/lucide.tsx). */
  name: LucideName;
  size?: number;
  color?: string;
  /** Grosor del trazo en PUNTOS ABSOLUTOS (2 por defecto en toda la app). */
  strokeWidth?: number;
}

/**
 * Único componente de ícono de la app (Lucide): `name`, `size`, `color` y `strokeWidth`.
 * Lucide expresa el trazo en unidades de su viewBox de 24; aquí se convierte para fijar puntos absolutos,
 * de modo que el trazo es igual en todos los tamaños.
 */
export function Icon({
  name,
  size = 20,
  color = colors.black,
  strokeWidth = iconStroke.default,
}: IconProps) {
  const Cmp = lucideIcons[name] as LucideComponent;
  return <Cmp size={size} color={color} strokeWidth={(strokeWidth * 24) / size} />;
}
