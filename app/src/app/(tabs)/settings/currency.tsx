// design-spec: app-screens/ajustes-moneda.png · screens/ajustes-moneda.png
import { useRouter } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { goBackOr } from '@/core/navigation';
import {
  Content,
  DetailIntro,
  InlineMessage,
  Screen,
  ScreenHeader,
  SectionTitle,
  SettingsGroup,
  SettingsRow,
  Text,
} from '@/design-system';
import { useSettings, useUpdateSettings } from '@/features/settings';
import { CURRENCIES } from '@/lib/currency';
import { useCurrency } from '@/stores';

export default function CurrencyScreen() {
  const router = useRouter();
  const settings = useSettings();
  const update = useUpdateSettings();
  useCurrency();
  const current = settings.data?.currency ?? 'CRC';
  const main = CURRENCIES.find((c) => c.code === current) ?? CURRENCIES[0]!;
  const others = CURRENCIES.filter((c) => c.code !== main.code);

  const row = (c: (typeof CURRENCIES)[number]) => (
    <SettingsRow
      key={c.code}
      title={c.name}
      subtitle={`${c.code} · ${c.symbol}`}
      trailing={c.code === current ? 'check' : 'none'}
      onPress={() => update.mutate({ currency: c.code })}
    />
  );

  return (
    <Screen scroll tabBar>
      <ScreenHeader title="Moneda" onBack={() => goBackOr(router, '/(tabs)/settings')} />
      <Content style={styles.body}>
        <DetailIntro
          icon="banknote"
          description="Selecciona la moneda principal para tus cuentas y registros."
        />
        <View style={styles.section}>
          <SectionTitle size="large">Moneda principal</SectionTitle>
          <SettingsGroup dividerInset="noIcon">{row(main)}</SettingsGroup>
        </View>
        <View style={styles.section}>
          <SectionTitle size="large">Otras monedas</SectionTitle>
          <SettingsGroup dividerInset="noIcon">{others.map(row)}</SettingsGroup>
        </View>
        {update.error ? <InlineMessage>{update.error.message}</InlineMessage> : null}
        <Text variant="description" tone="secondary">
          {`${current} es la moneda principal seleccionada.`}
        </Text>
      </Content>
    </Screen>
  );
}

const styles = StyleSheet.create({
  body: { marginTop: 20, gap: 24 },
  section: { gap: 10 },
});
