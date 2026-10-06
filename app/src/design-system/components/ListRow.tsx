import { StyleSheet, View } from 'react-native';

import type { Emoji } from '@/data';

import { EmojiBadge } from '../primitives/EmojiBadge';
import { Pressable } from '../primitives/Pressable';
import { Text, type TextTone } from '../primitives/Text';
import { layout } from '../tokens';
import { Card } from './Card';

export interface ListRowProps {
  title: string;
  subtitle?: string;
  /** Emoji del usuario (35×35). */
  emoji?: Emoji | null;
  /** Monto o texto a la derecha (ya formateado). Rojo/verde SOLO en montos. */
  trailing?: string;
  trailingTone?: TextTone;
  /** Margen izquierdo del emoji: 18 en Cuentas/Suscripciones, 16 en Actividad. */
  inset?: number;
  /** Espacio emoji → texto: 18 en filas de cuentas, 14 en Recientes/Suscripciones, 13 en Actividad. */
  gap?: number;
  onPress?: () => void;
  accessibilityLabel?: string;
}

/**
 * Fila de tarjeta (alto 74, ancho flexible): emoji 35, título 18 Bold, subtítulo 14 Regular gris y monto
 * 18 Bold a la derecha. Los textos largos se recortan con "…" (`numberOfLines`) y NUNCA empujan al monto.
 */
export function ListRow({
  title,
  subtitle,
  emoji,
  trailing,
  trailingTone = 'primary',
  inset = 18,
  gap = 14,
  onPress,
  accessibilityLabel,
}: ListRowProps) {
  return (
    <Pressable
      onPress={onPress}
      disabled={!onPress}
      haptic={false}
      style={styles.stretch}
      accessibilityRole={onPress ? 'button' : 'text'}
      accessibilityLabel={
        accessibilityLabel ?? [title, subtitle, trailing].filter(Boolean).join(', ')
      }
    >
      <Card style={[styles.row, { paddingLeft: inset, gap }]}>
        {emoji ? <EmojiBadge emoji={emoji} size={layout.emojiSize} /> : null}
        <View style={styles.texts}>
          <Text variant="bodyStrong" numberOfLines={1}>
            {title}
          </Text>
          {subtitle ? (
            <Text variant="caption" tone="secondary" numberOfLines={1}>
              {subtitle}
            </Text>
          ) : null}
        </View>
        {trailing ? (
          <Text
            variant="bodyStrong"
            tone={trailingTone}
            style={styles.trailing}
            numberOfLines={1}
            adjustsFontSizeToFit
            minimumFontScale={0.8}
          >
            {trailing}
          </Text>
        ) : null}
      </Card>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  stretch: { alignSelf: 'stretch' },
  row: {
    height: layout.card.height,
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: 16,
  },
  texts: { flex: 1, minWidth: 0 },
  trailing: { flexShrink: 0, maxWidth: '45%', marginLeft: 8, textAlign: 'right' },
});
