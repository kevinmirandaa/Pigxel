// design-spec: app-screens/ajustes-ayuda.png · screens/ajustes-ayuda.png
import Constants from 'expo-constants';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert, Linking, Platform, StyleSheet, View } from 'react-native';

import { env } from '@/core/config/env';
import { goBackOr } from '@/core/navigation';
import {
  Content,
  DetailIntro,
  InfoSheet,
  Screen,
  ScreenHeader,
  SettingsGroup,
  SettingsRow,
  Text,
} from '@/design-system';
import {
  FAQ,
  HELP_CENTER,
  SUPPORT_SUBJECT,
  buildBugReportBody,
  buildMailto,
  type HelpItem,
  type SupportKind,
} from '@/features/settings';

type Sheet = 'help' | 'faq' | 'about' | null;

const APP_VERSION = Constants.expoConfig?.version ?? '1.0.0';

export default function HelpScreen() {
  const router = useRouter();
  const [sheet, setSheet] = useState<Sheet>(null);

  const contact = async (kind: SupportKind) => {
    if (!env.supportEmail) {
      Alert.alert(
        'Configura el correo de soporte',
        'Falta definir EXPO_PUBLIC_SUPPORT_EMAIL en el archivo .env.',
      );
      return;
    }
    const body =
      kind === 'bug'
        ? buildBugReportBody({
            appVersion: APP_VERSION,
            platform: Platform.OS === 'ios' ? 'iOS' : 'Android',
            osVersion: String(Platform.Version),
          })
        : undefined;
    try {
      await Linking.openURL(
        buildMailto({ to: env.supportEmail, subject: SUPPORT_SUBJECT[kind], body }),
      );
    } catch {
      Alert.alert('No pudimos abrir tu correo', `Escríbenos a ${env.supportEmail}.`);
    }
  };

  const items = (list: readonly HelpItem[]) =>
    list.map((i) => (
      <View key={i.question} style={styles.qa}>
        <Text variant="bodyStrong">{i.question}</Text>
        <Text variant="description" tone="secondary">
          {i.answer}
        </Text>
      </View>
    ));

  return (
    <Screen scroll tabBar>
      <ScreenHeader title="Ayuda" onBack={() => goBackOr(router, '/(tabs)/settings')} />
      <Content style={styles.body}>
        <DetailIntro
          icon="circle-help"
          description="Encuentra respuestas y ponte en contacto con nosotros."
        />
        <SettingsGroup>
          <SettingsRow
            icon="book-open"
            title="Centro de ayuda"
            subtitle="Aprende a usar Pigxel"
            onPress={() => setSheet('help')}
          />
          <SettingsRow
            icon="circle-help"
            title="Preguntas frecuentes"
            subtitle="Respuestas a tus dudas"
            onPress={() => setSheet('faq')}
          />
          <SettingsRow
            icon="headphones"
            title="Soporte técnico"
            subtitle="Contacta con nuestro equipo"
            onPress={() => void contact('support')}
          />
          <SettingsRow
            icon="message-square"
            title="Enviar comentarios"
            subtitle="Cuéntanos qué piensas"
            onPress={() => void contact('feedback')}
          />
          <SettingsRow
            icon="bug"
            title="Reportar un error"
            subtitle="Ayúdanos a mejorar Pigxel"
            onPress={() => void contact('bug')}
          />
          <SettingsRow
            icon="info"
            title="Acerca de"
            subtitle={`Pigxel · Versión ${APP_VERSION}`}
            onPress={() => setSheet('about')}
          />
        </SettingsGroup>
      </Content>

      <InfoSheet visible={sheet === 'help'} title="Centro de ayuda" onClose={() => setSheet(null)}>
        {items(HELP_CENTER)}
      </InfoSheet>
      <InfoSheet
        visible={sheet === 'faq'}
        title="Preguntas frecuentes"
        onClose={() => setSheet(null)}
      >
        {items(FAQ)}
      </InfoSheet>
      <InfoSheet visible={sheet === 'about'} title="Acerca de" onClose={() => setSheet(null)}>
        <Text variant="bodyStrong">Pigxel</Text>
        <Text variant="description" tone="secondary">{`Versión ${APP_VERSION}`}</Text>
        <Text variant="description">
          Tu dinero, claro y en un solo lugar: registra ingresos y gastos, consulta una compra antes
          de hacerla y cuida tu límite.
        </Text>
        <Text variant="description" tone="secondary">
          Hecho con cariño por el equipo de Pigxel.
        </Text>
      </InfoSheet>
    </Screen>
  );
}

const styles = StyleSheet.create({
  body: { marginTop: 20, gap: 16 },
  qa: { gap: 4 },
});
