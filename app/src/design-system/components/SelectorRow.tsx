import { StyleSheet, View } from 'react-native';

import { iconSize, iconStroke } from '../icons';
import { EmojiBadge } from '../primitives/EmojiBadge';
import { Icon } from '../primitives/Icon';
import { Pressable } from '../primitives/Pressable';
import { Text } from '../primitives/Text';
import { colors, layout } from '../tokens';

export interface SelectorRowProps {
  /** Etiqueta fija ("Cuenta", "Categoría"). */
  label: string;
  /** Elección actual (nombre); si falta se ve solo la etiqueta. */
  value?: string;
  emoji?: string;
  error?: string;
  onPress: () => void;
}

/**
 * Fila selectora de los formularios (Agregar ingreso/gasto): píldora blanca de 60 con la etiqueta, la elección
 * (emoji + nombre) y chevron a la derecha. Al tocarla se abre una `SelectionSheet`.
 */
export function SelectorRow({ label, value, emoji, error, onPress }: SelectorRowProps) {
  return (
    <View style={styles.stretch}>
      <Pressable
        haptic={false}
        onPress={onPress}
        accessibilityLabel={value ? `${label}: ${value}` : label}
        style={styles.stretch}
      >
        <View style={styles.pill}>
          <View
            pointerEvents="none"
            style={[styles.border, error ? { borderColor: colors.expense } : null]}
          />
          <Text
            variant="fieldInput"
            style={[styles.label, value ? styles.labelSet : null]}
            numberOfLines={1}
          >
            {value ? label : label}
          </Text>
          {value ? (
            <View style={styles.value}>
              {emoji ? <EmojiBadge emoji={emoji} size={22} /> : null}
              <Text
                variant="fieldInput"
                tone="secondary"
                numberOfLines={1}
                style={styles.valueText}
              >
                {value}
              </Text>
            </View>
          ) : (
            <View style={styles.flex} />
          )}
          <Icon
            name="chevron-right"
            size={iconSize.trailing}
            color={colors.chevron}
            strokeWidth={iconStroke.firm}
          />
        </View>
      </Pressable>
      {error ? (
        <Text variant="fieldLabel" style={styles.error} accessibilityRole="alert">
          {error}
        </Text>
      ) : null}
    </View>
  );
}

const H = layout.field.height;

const styles = StyleSheet.create({
  stretch: { alignSelf: 'stretch' },
  flex: { flex: 1 },
  pill: {
    height: H,
    borderRadius: H / 2,
    backgroundColor: colors.white,
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: layout.field.textLeftNoIcon,
    paddingRight: 22,
    gap: 12,
  },
  border: {
    position: 'absolute',
    top: -1,
    left: -1,
    right: -1,
    bottom: -1,
    borderRadius: H / 2 + 1,
    borderWidth: 1,
    borderColor: colors.border,
  },
  label: { color: colors.textPrimary },
  labelSet: { flexShrink: 0 },
  value: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 8,
    minWidth: 0,
  },
  valueText: { flexShrink: 1 },
  error: { color: colors.expense, marginTop: 6, marginLeft: 20 },
});
