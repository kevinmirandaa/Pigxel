// design-spec: app-screens/ajustes-limite.png · screens/ajustes-limite.png
import { useRouter } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { goBackOr } from '@/core/navigation';
import {
  CardField,
  Content,
  DetailIntro,
  InfoNote,
  InlineMessage,
  Screen,
  ScreenHeader,
  SettingsGroup,
  SettingsRow,
} from '@/design-system';
import { limitSchema, useSettings, useUpdateSettings } from '@/features/settings';
import { parseAmountInput, sanitizeAmountDigits } from '@/lib/amountInput';
import { formatCurrency } from '@/lib/formatCurrency';
import { useCurrency } from '@/stores';

import type { LimitPeriod } from '@/data';

/**
 * Límite de gastos con guardado automático (como Ajustes de iOS): al cambiar el interruptor o el periodo, y al
 * terminar de editar el monto (debounce 600 ms o al perder el foco). El límite solo informa en Consultar.
 */
export default function LimitScreen() {
  const router = useRouter();
  const settings = useSettings();
  const update = useUpdateSettings();
  useCurrency();
  const saved = settings.data?.spendingLimit;
  // Borradores locales; null = "lo guardado".
  const [amountDraft, setAmountDraft] = useState<string | null>(null);
  const [enabledDraft, setEnabledDraft] = useState<boolean | null>(null);
  const [error, setError] = useState<string | null>(null);

  const enabled = enabledDraft ?? saved?.enabled ?? false;
  const digits = amountDraft ?? String(saved?.amount ?? 0);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
    },
    [],
  );

  const persist = (next: { enabled: boolean; amount: string; period: LimitPeriod }) => {
    const parsed = limitSchema.safeParse(next);
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? 'Valor no válido');
      return;
    }
    setError(null);
    update.mutate(
      { spendingLimit: parsed.data },
      {
        onSuccess: () => {
          setEnabledDraft(null);
          setAmountDraft(null);
        },
      },
    );
  };
  const period = saved?.period ?? 'weekly';
  const amountChanged =
    amountDraft !== null && parseAmountInput(amountDraft) !== (saved?.amount ?? 0);

  const periodRow = (value: LimitPeriod, title: string, subtitle?: string) => (
    <SettingsRow
      title={title}
      subtitle={subtitle}
      trailing={period === value ? 'check' : 'none'}
      onPress={() => persist({ enabled, amount: digits, period: value })}
    />
  );

  return (
    <Screen scroll tabBar avoidKeyboard>
      <ScreenHeader title="Límite" onBack={() => goBackOr(router, '/(tabs)/settings')} />
      <Content style={styles.body}>
        <DetailIntro
          icon="gauge"
          title="Límite de gastos"
          description="Define un límite para recibir alertas y llevar el control de tus gastos."
        />
        <SettingsGroup>
          <SettingsRow
            title="Activar límite"
            trailing="none"
            toggle={{
              value: enabled,
              onChange: (value) => {
                setEnabledDraft(value);
                persist({ enabled: value, amount: digits, period });
              },
            }}
          />
        </SettingsGroup>
        <View pointerEvents={enabled ? 'auto' : 'none'}>
          <SettingsGroup>
            <CardField
              label="Monto del límite"
              disabled={!enabled}
              error={error ?? undefined}
              input={{
                value:
                  parseAmountInput(digits) > 0
                    ? formatCurrency(parseAmountInput(digits), { spaced: true })
                    : '',
                placeholder: 'Monto',
                keyboardType: 'number-pad',
                onChangeText: (t) => {
                  const next = sanitizeAmountDigits(t);
                  setAmountDraft(next);
                  setError(null);
                  if (timer.current) clearTimeout(timer.current);
                  timer.current = setTimeout(() => persist({ enabled, amount: next, period }), 600);
                },
                onBlur: () => {
                  if (timer.current) clearTimeout(timer.current);
                  if (amountChanged) persist({ enabled, amount: digits, period });
                },
              }}
            />
          </SettingsGroup>
        </View>
        <View pointerEvents={enabled ? 'auto' : 'none'} style={!enabled && styles.dim}>
          <SettingsGroup dividerInset="noIcon">
            {periodRow('weekly', 'Semanal', 'Período del límite')}
            {periodRow('monthly', 'Mensual')}
          </SettingsGroup>
        </View>
        {update.error ? <InlineMessage>{update.error.message}</InlineMessage> : null}
        <InfoNote>
          El límite solo genera alertas en Consulta. No bloquea tus gastos ni impide registrar
          movimientos.
        </InfoNote>
      </Content>
    </Screen>
  );
}

const styles = StyleSheet.create({
  body: { marginTop: 20, gap: 16 },
  dim: { opacity: 0.4 },
});
