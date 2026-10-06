// design-spec: app-screens/ajustes-idioma.png · screens/ajustes-idioma.png
import { useRouter } from 'expo-router';
import { StyleSheet } from 'react-native';

import { goBackOr } from '@/core/navigation';
import {
  Content,
  DetailIntro,
  InlineMessage,
  Screen,
  ScreenHeader,
  SettingsGroup,
  SettingsRow,
} from '@/design-system';
import { LANGUAGE_OPTIONS, useSettings, useUpdateSettings } from '@/features/settings';

/** La app sigue en español (sin traducciones todavía): la preferencia se guarda lista para activarse. */
export default function LanguageScreen() {
  const router = useRouter();
  const settings = useSettings();
  const update = useUpdateSettings();
  const current = settings.data?.language ?? 'es';

  return (
    <Screen scroll tabBar>
      <ScreenHeader title="Idioma" onBack={() => goBackOr(router, '/(tabs)/settings')} />
      <Content style={styles.body}>
        <DetailIntro icon="globe" description="Selecciona el idioma de la aplicación." />
        <SettingsGroup dividerInset="noIcon">
          {LANGUAGE_OPTIONS.map((o) => (
            <SettingsRow
              key={o.value}
              title={o.native}
              subtitle={o.spanish}
              trailing={o.value === current ? 'check' : 'none'}
              onPress={() => update.mutate({ language: o.value })}
            />
          ))}
        </SettingsGroup>
        {update.error ? <InlineMessage>{update.error.message}</InlineMessage> : null}
      </Content>
    </Screen>
  );
}

const styles = StyleSheet.create({ body: { marginTop: 20, gap: 16 } });
