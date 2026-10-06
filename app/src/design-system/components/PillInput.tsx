import { useState, type Ref } from 'react';
import { StyleSheet, TextInput, View, type TextInputProps } from 'react-native';

import { iconSize, iconStroke, type LucideName } from '../icons';
import { Icon } from '../primitives/Icon';
import { Pressable } from '../primitives/Pressable';
import { Text } from '../primitives/Text';
import { colors, font, layout, radii } from '../tokens';

export interface PillInputProps extends Omit<TextInputProps, 'style' | 'placeholderTextColor'> {
  /** Ícono a la izquierda (mail, lock, user): 20 pt `#C1C1C1` en x=24. */
  leftIcon?: LucideName;
  /** `form` = blanco (Agregar/Nueva…) · `auth` = gris `#F0F0F0` sobre fondo blanco (auth). */
  variant?: 'form' | 'auth';
  /** Mensaje de error: borde y texto rojos bajo el campo. Nota para el cliente: el Figma no define el estado de error. */
  error?: string;
  /** Texto de accesibilidad si el placeholder no basta. */
  accessibilityLabel?: string;
  ref?: Ref<TextInput>;
}

const { height: H, iconLeft, textLeftNoIcon, textLeftWithIcon } = layout.field;

/**
 * Campo en píldora (alto 60, radio 30, ANCHO FLEXIBLE: se estira al contenedor). Con `secureTextEntry`
 * muestra el ojo para ver/ocultar la contraseña, anclado a 26 pt del borde derecho. El borde `#EAEAEA`
 * de 1 pt es exterior al relleno, como en Figma.
 */
export function PillInput({
  leftIcon,
  variant = 'form',
  error,
  secureTextEntry,
  accessibilityLabel,
  placeholder,
  ref,
  ...rest
}: PillInputProps) {
  const [hidden, setHidden] = useState(true);
  const isSecret = Boolean(secureTextEntry);

  return (
    <View style={styles.stretch}>
      <View
        style={[
          styles.field,
          { backgroundColor: variant === 'auth' ? colors.fieldAuth : colors.white },
        ]}
      >
        <View
          pointerEvents="none"
          style={[styles.border, error ? { borderColor: colors.expense } : null]}
        />
        {leftIcon ? (
          <View style={styles.leftIcon} pointerEvents="none">
            <Icon
              name={leftIcon}
              size={iconSize.field}
              color={colors.iconMuted}
              strokeWidth={iconStroke.firm}
            />
          </View>
        ) : null}
        <TextInput
          ref={ref}
          {...rest}
          placeholder={placeholder}
          placeholderTextColor={colors.textPlaceholder}
          secureTextEntry={isSecret && hidden}
          accessibilityLabel={accessibilityLabel ?? placeholder}
          style={[
            styles.input,
            {
              paddingLeft: leftIcon ? textLeftWithIcon : textLeftNoIcon,
              paddingRight: isSecret ? 56 : 20,
            },
          ]}
          selectionColor={colors.black}
          allowFontScaling={false}
        />
        {isSecret ? (
          <Pressable
            haptic={false}
            hitSlop={12}
            accessibilityRole="button"
            accessibilityLabel={hidden ? 'Mostrar contraseña' : 'Ocultar contraseña'}
            onPress={() => setHidden((h) => !h)}
            style={styles.eye}
          >
            <Icon
              name={hidden ? 'eye' : 'eye-off'}
              size={iconSize.field}
              color={colors.iconMuted}
              strokeWidth={iconStroke.firm}
            />
          </Pressable>
        ) : null}
      </View>
      {error ? (
        <Text variant="fieldLabel" style={styles.error} accessibilityRole="alert">
          {error}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  stretch: { alignSelf: 'stretch' },
  field: { height: H, borderRadius: H / 2, justifyContent: 'center' },
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
  input: {
    ...font('regular'),
    fontSize: 16,
    color: colors.textPrimary,
    height: H,
    paddingVertical: 0,
    borderRadius: radii.pill,
  },
  leftIcon: { position: 'absolute', left: iconLeft, top: (H - iconSize.field) / 2 },
  // El ojo del Figma está a x=284 de 330 (26 pt del borde derecho): anclado a la derecha, no a una x fija.
  eye: { position: 'absolute', right: 26, top: (H - iconSize.field) / 2 },
  error: { color: colors.expense, marginTop: 6, marginLeft: 20 },
});
