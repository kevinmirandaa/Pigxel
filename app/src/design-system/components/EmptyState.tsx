import { StyleSheet, View } from 'react-native';

import { iconSize, iconStroke, type LucideName } from '../icons';
import { Icon } from '../primitives/Icon';
import { Pressable } from '../primitives/Pressable';
import { Text } from '../primitives/Text';
import { colors } from '../tokens';

export interface EmptyStateProps {
  icon?: LucideName;
  title: string;
  description?: string;
  /** Botón de texto bajo el mensaje ("Agregar cuenta"). */
  actionLabel?: string;
  onAction?: () => void;
}

/**
 * Estado vacío centrado (Notificaciones: "Sin notificaciones"): ícono gris `#C1C1C1` de ≈41 pt, título
 * 18 Bold y detalle 14 `#C1C1C1` en un bloque de 266 pt; 29 pt entre el ícono y el título.
 */
export function EmptyState({
  icon = 'message-square-text',
  title,
  description,
  actionLabel,
  onAction,
}: EmptyStateProps) {
  return (
    <View
      style={styles.wrap}
      accessibilityRole="text"
      accessibilityLabel={[title, description].filter(Boolean).join('. ')}
    >
      <Icon
        name={icon}
        size={iconSize.empty}
        color={colors.textPlaceholder}
        strokeWidth={iconStroke.large}
      />
      <View style={styles.texts}>
        <Text variant="bodyStrong" style={styles.center}>
          {title}
        </Text>
        {description ? (
          <Text variant="caption" style={[styles.center, { color: colors.textPlaceholder }]}>
            {description}
          </Text>
        ) : null}
      </View>
      {actionLabel && onAction ? (
        <Pressable
          onPress={onAction}
          haptic={false}
          accessibilityRole="button"
          style={styles.action}
        >
          <Text variant="bodyStrong">{actionLabel}</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { alignSelf: 'stretch', alignItems: 'center', gap: 29, paddingHorizontal: 12 },
  texts: { width: '100%', maxWidth: 266, gap: 3 },
  center: { textAlign: 'center' },
  action: { minHeight: 44, paddingHorizontal: 16, justifyContent: 'center' },
});
