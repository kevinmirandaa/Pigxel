import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import type { Emoji } from '@/data';

import { SmileGlyph } from '../icons/SmileGlyph';
import { EmojiBadge } from '../primitives/EmojiBadge';
import { Pressable } from '../primitives/Pressable';
import { colors, layout } from '../tokens';
import { EmojiPicker } from './EmojiPicker';

export interface EmojiPickerButtonProps {
  value?: Emoji | null;
  onChange: (emoji: Emoji) => void;
  /** Diámetro del círculo (80 en el Figma). */
  size?: number;
  accessibilityLabel?: string;
}

/**
 * Disparador del selector: círculo blanco de 80 pt con borde `#EAEAEA` exterior y la carita de línea
 * `#C1C1C1` de 33,3 pt (`SmileGlyph`: los paths exactos del Figma, trazo 3,33 pt). Al elegir, muestra
 * el emoji. Se reutiliza arriba de Nueva cuenta, Nueva categoría, Nuevo objetivo y Nueva suscripción.
 */
export function EmojiPickerButton({
  value,
  onChange,
  size = layout.emojiTrigger.size,
  accessibilityLabel = 'Elegir emoji',
}: EmojiPickerButtonProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Pressable
        onPress={() => setOpen(true)}
        accessibilityLabel={value ? `${accessibilityLabel}. Actual: ${value}` : accessibilityLabel}
        style={{ alignSelf: 'center' }}
      >
        <View style={[styles.circle, { width: size, height: size, borderRadius: size / 2 }]}>
          <View pointerEvents="none" style={[styles.border, { borderRadius: size / 2 + 1 }]} />
          {value ? (
            <EmojiBadge emoji={value} size={size * 0.55} />
          ) : (
            <SmileGlyph color={colors.iconMuted} size={layout.emojiTrigger.glyph} />
          )}
        </View>
      </Pressable>
      <EmojiPicker
        visible={open}
        selected={value}
        onClose={() => setOpen(false)}
        onSelect={onChange}
      />
    </>
  );
}

const styles = StyleSheet.create({
  circle: { backgroundColor: colors.emojiCircle, alignItems: 'center', justifyContent: 'center' },
  border: {
    position: 'absolute',
    top: -1,
    left: -1,
    right: -1,
    bottom: -1,
    borderWidth: 1,
    borderColor: colors.border,
  },
});
