import { useMemo, useState } from 'react';
import { Pressable as RNPressable, StyleSheet, View } from 'react-native';
import Svg, { Circle, Defs, Line, LinearGradient, Path, Stop } from 'react-native-svg';

import type { SeriesPoint } from '@/data';
import { formatCurrency } from '@/lib/formatCurrency';

import { Text } from '../primitives/Text';
import { monotonePath, type Pt } from './lineChartMath';
import { colors, font, layout } from '../tokens';

export interface LineChartProps {
  /** 7 puntos (Lun…Dom). */
  data: readonly SeriesPoint[];
  /** Día seleccionado (tooltip y guía). Por defecto, el último. */
  selectedIndex?: number;
  onSelectIndex?: (index: number) => void;
  height?: number;
}

// Geometría tomada de reference/chart-placeholder.png (312×124): etiquetas centradas desde x≈22 con
// paso ≈44,7; eje a y=97; curva entre y=32 (máximo) y el eje; etiquetas a y≈109; tooltip a y≈10.
const PAD_X = 22;
const AXIS_Y = 97;
const TOP_Y = 32;
const TOOLTIP_TOP = 10;
const TOOLTIP_H = 15;
const TOOLTIP_W = 48;

/**
 * Gráfica de línea de Actividad (reconstruida como vector; en Figma es un PNG): curva negra suave de
 * 2 pt, área con degradado gris, guía punteada, punto negro y tooltip oscuro `¢18.500` sobre el día
 * seleccionado, ejes Lun–Dom (activo en negro, resto gris). Tocar un día lo selecciona.
 */
export function LineChart({
  data,
  selectedIndex,
  onSelectIndex,
  height = layout.chart.height,
}: LineChartProps) {
  // Ancho flexible: se mide el contenedor y la geometría (paso entre días, tooltip) se recalcula.
  const [width, setWidth] = useState<number>(layout.chart.fallbackWidth);
  const n = data.length;
  const selected = Math.min(Math.max(selectedIndex ?? n - 1, 0), Math.max(n - 1, 0));
  const step = n > 1 ? (width - PAD_X * 2) / (n - 1) : 0;
  const values = data.map((d) => d.value);
  // Admite valores negativos (modo Ambos: ingresos − gastos): el eje inferior es el mínimo y se dibuja la línea del cero.
  const min = Math.min(0, ...values);
  const max = Math.max(1, ...values);
  const range = max - min;

  const { points, curve, area } = useMemo(() => {
    const pts: Pt[] = data.map((d, i) => ({
      x: PAD_X + i * step,
      y: AXIS_Y - ((d.value - min) / range) * (AXIS_Y - TOP_Y),
    }));
    if (pts.length === 0) return { points: pts, curve: '', area: '' };
    // Puntas planas (la curva sobresale ≈5 pt de la primera/última etiqueta, como en el Figma).
    const first = pts[0]!;
    const last = pts[pts.length - 1]!;
    const ext: Pt[] = [{ x: first.x - 5, y: first.y }, ...pts, { x: last.x + 5, y: last.y }];
    const c = monotonePath(ext);
    return {
      points: pts,
      curve: c,
      area: `${c} L${last.x + 5} ${AXIS_Y} L${first.x - 5} ${AXIS_Y} Z`,
    };
  }, [data, min, range, step]);

  const sel = points[selected];
  const tooltipLeft = sel ? Math.min(Math.max(sel.x - TOOLTIP_W / 2, 0), width - TOOLTIP_W) : 0;

  return (
    <View
      onLayout={(e) => setWidth(Math.max(1, e.nativeEvent.layout.width))}
      style={{ alignSelf: 'stretch', height }}
      accessibilityRole="image"
      accessibilityLabel={`Gráfica semanal. ${data.map((d) => `${d.label} ${formatCurrency(d.value)}`).join(', ')}`}
    >
      <Svg width={width} height={height}>
        <Defs>
          <LinearGradient id="area" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0" stopColor="#000000" stopOpacity={0.07} />
            <Stop offset="1" stopColor="#000000" stopOpacity={0} />
          </LinearGradient>
        </Defs>
        <Line
          x1={0}
          y1={AXIS_Y}
          x2={width}
          y2={AXIS_Y}
          stroke="#E4E4E4"
          strokeWidth={1}
          strokeDasharray="2 3"
        />
        {min < 0 ? (
          <Line
            x1={0}
            y1={AXIS_Y - ((0 - min) / range) * (AXIS_Y - TOP_Y)}
            x2={width}
            y2={AXIS_Y - ((0 - min) / range) * (AXIS_Y - TOP_Y)}
            stroke="#D9D9D9"
            strokeWidth={1}
          />
        ) : null}
        {area ? <Path d={area} fill="url(#area)" /> : null}
        {sel ? (
          <Line
            x1={sel.x}
            y1={TOOLTIP_TOP + TOOLTIP_H}
            x2={sel.x}
            y2={AXIS_Y}
            stroke={colors.iconMuted}
            strokeWidth={1}
            strokeDasharray="3 3"
          />
        ) : null}
        {curve ? (
          <Path
            d={curve}
            stroke={colors.chartLine}
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
        ) : null}
        {sel ? (
          <Circle
            cx={sel.x}
            cy={sel.y}
            r={4.5}
            fill={colors.black}
            stroke={colors.white}
            strokeWidth={1.5}
          />
        ) : null}
      </Svg>

      {sel ? (
        <View
          pointerEvents="none"
          style={[styles.tooltip, { left: tooltipLeft, top: TOOLTIP_TOP }]}
        >
          <Text allowFontScaling={false} style={styles.tooltipText}>
            {formatCurrency(data[selected]!.value)}
          </Text>
        </View>
      ) : null}

      {data.map((d, i) => (
        <RNPressable
          key={d.label}
          accessibilityRole="button"
          accessibilityLabel={`${d.label}: ${formatCurrency(d.value)}`}
          accessibilityState={{ selected: i === selected }}
          onPress={() => onSelectIndex?.(i)}
          style={[styles.column, { left: PAD_X + i * step - step / 2, width: step || width }]}
        >
          <Text
            allowFontScaling={false}
            style={[
              styles.label,
              {
                color: i === selected ? colors.black : colors.textPlaceholder,
                fontWeight: i === selected ? '700' : '400',
              },
            ]}
          >
            {d.label}
          </Text>
        </RNPressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  tooltip: {
    position: 'absolute',
    width: TOOLTIP_W,
    height: TOOLTIP_H,
    borderRadius: TOOLTIP_H / 2 + 1,
    backgroundColor: colors.tooltipBg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tooltipText: {
    ...font('semibold'),
    fontSize: 8.5,
    color: colors.white,
    includeFontPadding: false,
  },
  column: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  label: { ...font('regular'), fontSize: 9.5, marginBottom: 5, includeFontPadding: false },
});
