// design-spec: app-screens/consultar.png · screens/consultar.png
import { useCurrency } from '@/stores';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, StyleSheet, TextInput, View } from 'react-native';

import { goBackOr } from '@/core/navigation';
import {
  Content,
  InlineMessage,
  PrimaryButton,
  Screen,
  ScreenHeader,
  Text,
  colors,
  font,
  layout,
} from '@/design-system';
import { computeConsult, limitLine, useConsultContext } from '@/features/consult';
import { formatCurrency } from '@/lib/formatCurrency';
import { formatAmountInput, parseAmountInput, sanitizeAmountDigits } from '@/lib/amountInput';

/**
 * Consultar: simula una compra sin guardar nada. El resultado se recalcula mientras se escribe. "Crear gasto"
 * abre Agregar gasto con el monto cargado; esta pantalla nunca envía datos.
 */
export default function ConsultScreen() {
  useCurrency();
  const router = useRouter();
  const context = useConsultContext();
  const [digits, setDigits] = useState('');
  const amount = parseAmountInput(digits);

  const balance = context.data?.balance ?? 0;
  const result = computeConsult({
    balance,
    amount,
    limit: context.data?.limit,
    spentInPeriod: context.data?.spentInPeriod,
  });
  const line = context.data
    ? limitLine(result, context.data.limit, context.data.spentInPeriod, amount)
    : null;
  const negative = result.remaining < 0;

  return (
    <Screen scroll avoidKeyboard>
      <ScreenHeader title="Consultar" onBack={() => goBackOr(router, '/(tabs)')} />
      <Content style={styles.body}>
        <View style={styles.input}>
          <View pointerEvents="none" style={styles.border} />
          <TextInput
            value={formatAmountInput(digits)}
            onChangeText={(t) => setDigits(sanitizeAmountDigits(t))}
            placeholder="Monto"
            placeholderTextColor={colors.textPlaceholder}
            keyboardType="number-pad"
            accessibilityLabel="Monto a consultar"
            selectionColor={colors.black}
            allowFontScaling={false}
            style={styles.inputText}
          />
        </View>

        {context.isPending ? (
          <ActivityIndicator color={colors.textSecondary} style={styles.loading} />
        ) : context.isError ? (
          <InlineMessage>No pudimos cargar tu saldo. Inténtalo de nuevo.</InlineMessage>
        ) : (
          <View style={styles.results}>
            <View style={styles.block}>
              <Text variant="description" style={styles.caption}>
                Ahora mismo tienes:
              </Text>
              <ReadOnlyPill value={formatCurrency(balance, { spaced: true })} />
            </View>
            <View style={styles.block}>
              <Text variant="description" style={styles.caption}>
                Te quedarán:
              </Text>
              <ReadOnlyPill
                value={formatCurrency(result.remaining, { spaced: true })}
                color={negative ? colors.expense : colors.textPrimary}
                label={`Te quedarán ${formatCurrency(result.remaining)}`}
              />
            </View>
            {line ? (
              <Text variant="caption" tone="secondary" style={styles.limit}>
                {line}
              </Text>
            ) : null}
          </View>
        )}

        <View style={styles.action}>
          <PrimaryButton
            label="Crear gasto"
            disabled={amount <= 0}
            onPress={() =>
              router.push({ pathname: '/add/expense', params: { amount: String(amount) } })
            }
          />
        </View>
      </Content>
    </Screen>
  );
}

function ReadOnlyPill({ value, color, label }: { value: string; color?: string; label?: string }) {
  return (
    <View
      style={styles.pill}
      accessible
      accessibilityLabel={label ?? `Ahora mismo tienes ${value}`}
    >
      <View pointerEvents="none" style={styles.border} />
      <Text
        variant="heading"
        numberOfLines={1}
        adjustsFontSizeToFit
        minimumFontScale={0.6}
        style={[styles.pillText, color ? { color } : null]}
      >
        {value}
      </Text>
    </View>
  );
}

const H = layout.field.height;

const styles = StyleSheet.create({
  body: { marginTop: 28 },
  input: {
    height: H,
    borderRadius: H / 2,
    backgroundColor: colors.white,
    justifyContent: 'center',
  },
  inputText: {
    ...font('regular'),
    fontSize: 16,
    color: colors.textPrimary,
    paddingHorizontal: 23,
    height: H,
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
  results: { marginTop: 20, gap: 12 },
  block: { gap: 6 },
  caption: { color: colors.textPlaceholder, marginLeft: 8 },
  pill: {
    height: H,
    borderRadius: H / 2,
    backgroundColor: colors.white,
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  pillText: { textAlign: 'center' },
  limit: { textAlign: 'center', marginTop: 4 },
  loading: { marginTop: 32 },
  action: { marginTop: 48 },
});
