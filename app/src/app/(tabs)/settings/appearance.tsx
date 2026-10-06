// design-spec: app-screens/ajustes-apariencia.png · screens/ajustes-apariencia.png
import { useRouter } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { goBackOr } from '@/core/navigation';
import {
  Card,
  Content,
  DetailIntro,
  InlineMessage,
  Screen,
  ScreenHeader,
  SectionTitle,
  SettingsGroup,
  SettingsRow,
  Text,
  type LucideName,
} from '@/design-system';
import { useHomeSummary } from '@/features/accounts';
import { APPEARANCE_OPTIONS, useSettings, useUpdateSettings } from '@/features/settings';
import { formatCurrency } from '@/lib/formatCurrency';
import { useCurrency } from '@/stores';

/** La app sigue en modo claro (decisión del MVP): la preferencia se guarda lista para activarse. */
export default function AppearanceScreen() {
  const router = useRouter();
  const settings = useSettings();
  const update = useUpdateSettings();
  const summary = useHomeSummary();
  useCurrency();
  const current = settings.data?.appearance ?? 'system';

  return (
    <Screen scroll tabBar>
      <ScreenHeader title="Apariencia" onBack={() => goBackOr(router, '/(tabs)/settings')} />
      <Content style={styles.body}>
        <DetailIntro icon="moon" description="Elige cómo se ve Pigxel en tu dispositivo." />
        <SettingsGroup>
          {APPEARANCE_OPTIONS.map((o) => (
            <SettingsRow
              key={o.value}
              icon={o.icon as LucideName}
              title={o.title}
              subtitle={o.subtitle}
              trailing={o.value === current ? 'check' : 'none'}
              onPress={() => update.mutate({ appearance: o.value })}
            />
          ))}
        </SettingsGroup>
        {update.error ? <InlineMessage>{update.error.message}</InlineMessage> : null}
        <View style={styles.section}>
          <SectionTitle size="large">Vista previa</SectionTitle>
          <Card style={styles.preview}>
            <Text variant="bodyStrong">Pigxel</Text>
            <Text variant="amount" numberOfLines={1} adjustsFontSizeToFit style={styles.center}>
              {formatCurrency(summary.data?.totalBalance ?? 0, { spaced: true })}
            </Text>
            <Text variant="caption" tone="secondary" style={styles.center}>
              Saldo total
            </Text>
          </Card>
        </View>
      </Content>
    </Screen>
  );
}

const styles = StyleSheet.create({
  body: { marginTop: 20, gap: 20 },
  section: { gap: 10 },
  preview: { padding: 20, gap: 8 },
  center: { textAlign: 'center' },
});
