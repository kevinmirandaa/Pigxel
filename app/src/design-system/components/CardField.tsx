import type { ReactNode, Ref } from 'react';
import { StyleSheet, TextInput, View, type TextInputProps } from 'react-native';

import { Pressable } from '../primitives/Pressable';
import { Text } from '../primitives/Text';
import { colors, font } from '../tokens';

export interface CardFieldProps {
  /** Etiqueta pequeña gris sobre el valor. */
  label: string;
  /** Valor de solo lectura (negrita). Con `onPress` la fila es tocable. */
  value?: string;
  /** Texto gris cuando no hay valor ("Agregar"). */
  emptyText?: string;
  onPress?: () => void;
  /** Con `input` la fila contiene un campo de texto editable. */
  input?: Omit<TextInputProps, 'style' | 'placeholderTextColor'> & { ref?: Ref<TextInput> };
  /** Elemento a la derecha (ojo de contraseña). */
  right?: ReactNode;
  error?: string;
  /** Atenuada y no editable (límite apagado). */
  disabled?: boolean;
}

/**
 * Fila de tarjeta "etiqueta pequeña + valor" (Información personal, Contraseña, Límite). Va dentro de un
 * `SettingsGroup`/`Card`; el alto lo da el contenido (≥ 64) y el ancho es flexible.
 */
export function CardField({
  label,
  value,
  emptyText,
  onPress,
  input,
  right,
  error,
  disabled = false,
}: CardFieldProps) {
  const body = (
    <View style={[styles.row, disabled && styles.dim]}>
      <View style={styles.texts}>
        <Text variant="fieldLabel" tone="secondary">
          {label}
        </Text>
        {input ? (
          <TextInput
            {...input}
            editable={!disabled}
            accessibilityLabel={label}
            placeholderTextColor={colors.textPlaceholder}
            selectionColor={colors.black}
            allowFontScaling={false}
            style={styles.input}
          />
        ) : value ? (
          <Text variant="fieldValue" numberOfLines={1}>
            {value}
          </Text>
        ) : (
          <Text variant="fieldValue" tone="secondary" numberOfLines={1}>
            {emptyText}
          </Text>
        )}
        {error ? (
          <Text variant="fieldLabel" style={styles.error} accessibilityRole="alert">
            {error}
          </Text>
        ) : null}
      </View>
      {right}
    </View>
  );
  if (!onPress) return body;
  return (
    <Pressable
      haptic={false}
      onPress={onPress}
      accessibilityLabel={`${label}: ${value ?? emptyText ?? ''}`}
    >
      {body}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    minHeight: 64,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 18,
    paddingVertical: 12,
    gap: 12,
  },
  dim: { opacity: 0.4 },
  texts: { flex: 1, minWidth: 0, gap: 2 },
  input: {
    ...font('semibold'),
    fontSize: 16,
    color: colors.textPrimary,
    padding: 0,
    minHeight: 22,
  },
  error: { color: colors.expense, marginTop: 2 },
});
