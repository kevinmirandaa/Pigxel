import { useEffect, useRef, useState } from 'react';
import { Animated, Pressable as RNPressable, StyleSheet, TextInput, View } from 'react-native';

import { parseOtpInput } from '@/lib/otp';

import { Text } from '../primitives/Text';
import { OTP_EXTRA_INSET, colors, layout, radii } from '../tokens';

export interface OtpInputProps {
  value: string;
  onChange: (value: string) => void;
  length?: number;
  autoFocus?: boolean;
  /** Se llama al completar todas las casillas. */
  onComplete?: (value: string) => void;
}

/**
 * Código de verificación: 6 casillas de 49×77 (radio ≈15, relleno `#EAEAEA`) repartidas en 317 pt,
 * con cursor parpadeante en la casilla activa. Un solo TextInput oculto recibe el código
 * (pegar/autocompletar del SMS funciona con `oneTimeCode`).
 */
export function OtpInput({
  value,
  onChange,
  length = 6,
  autoFocus = false,
  onComplete,
}: OtpInputProps) {
  const inputRef = useRef<TextInput>(null);
  const [focused, setFocused] = useState(autoFocus);
  const [blink] = useState(() => new Animated.Value(1));
  const digits = value.slice(0, length).split('');
  const active = Math.min(digits.length, length - 1);

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(blink, { toValue: 0, duration: 500, useNativeDriver: true }),
        Animated.timing(blink, { toValue: 1, duration: 500, useNativeDriver: true }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [blink]);

  return (
    <RNPressable
      accessibilityRole="none"
      accessibilityLabel={`Código de ${length} dígitos`}
      onPress={() => inputRef.current?.focus()}
      style={styles.wrap}
    >
      <TextInput
        ref={inputRef}
        value={value}
        onChangeText={(t) => {
          const clean = parseOtpInput(t, length);
          onChange(clean);
          if (clean.length === length) onComplete?.(clean);
        }}
        keyboardType="number-pad"
        textContentType="oneTimeCode"
        autoComplete="one-time-code"
        maxLength={length}
        autoFocus={autoFocus}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        caretHidden
        accessibilityLabel="Código de verificación"
        style={styles.hidden}
      />
      <View style={styles.row} pointerEvents="none">
        {Array.from({ length }, (_, i) => (
          <View key={i} style={styles.cell}>
            {digits[i] ? (
              <Text variant="amount" style={styles.digit} allowFontScaling={false}>
                {digits[i]}
              </Text>
            ) : focused && i === active ? (
              <Animated.View style={[styles.caret, { opacity: blink }]} />
            ) : null}
          </View>
        ))}
      </View>
    </RNPressable>
  );
}

const styles = StyleSheet.create({
  // Ancho flexible: el bloque es el contenido menos 6 pt por lado y las 6 casillas se reparten ese ancho (mismo espaciado).
  wrap: { alignSelf: 'stretch', marginHorizontal: OTP_EXTRA_INSET },
  row: { flexDirection: 'row', gap: layout.otp.gap },
  cell: {
    flex: 1,
    height: layout.otp.cellHeight,
    borderRadius: radii.otp,
    backgroundColor: colors.otpCell,
    alignItems: 'center',
    justifyContent: 'center',
  },
  digit: { includeFontPadding: false },
  caret: { width: 3, height: 40, borderRadius: 1.5, backgroundColor: colors.black },
  hidden: { position: 'absolute', width: 1, height: 1, opacity: 0 },
});
