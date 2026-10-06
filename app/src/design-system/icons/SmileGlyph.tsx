import Svg, { Path } from 'react-native-svg';

/**
 * Carita de línea del disparador de emoji: los 3 trazos EXACTOS del Figma (design-spec/source/Pigxel.svg,
 * pantalla add-categoria, capa "Group" 33,3×33,3, trazo 3,333 pt redondeado). Generada a partir de ese SVG.
 */
export function SmileGlyph({
  color = '#C1C1C1',
  size = 33.333,
}: {
  color?: string;
  size?: number;
}) {
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 33.333 33.333"
      fill="none"
      style={{ overflow: 'visible' }}
    >
      <Path
        d="M10.83 11.667C10.61 11.667 10.4 11.579 10.24 11.423C10.09 11.266 10 11.054 10 10.833C10 10.612 10.09 10.4 10.24 10.244C10.4 10.088 10.61 10 10.83 10C11.05 10 11.27 10.088 11.42 10.244C11.58 10.4 11.67 10.612 11.67 10.833C11.67 11.054 11.58 11.266 11.42 11.423C11.27 11.579 11.05 11.667 10.83 11.667Z"
        stroke={color}
        strokeWidth={3.33333}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M20 11.667H23.33M33.33 16.667C33.33 25.872 25.87 33.333 16.67 33.333C7.46 33.333 0 25.872 0 16.667C0 7.462 7.46 0 16.67 0C25.87 0 33.33 7.462 33.33 16.667Z"
        stroke={color}
        strokeWidth={3.33333}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M9.17 20.833C9.17 20.833 11.67 24.167 16.67 24.167C21.67 24.167 24.17 20.833 24.17 20.833"
        stroke={color}
        strokeWidth={3.33333}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}
