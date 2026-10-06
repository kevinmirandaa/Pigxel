// design-spec: app-screens/ajustes-privacidad.png · screens/ajustes-privacidad.png
import { useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert, Share, StyleSheet, View } from 'react-native';

import { goBackOr } from '@/core/navigation';
import { getRepositories } from '@/data';
import {
  Content,
  DetailIntro,
  InfoSheet,
  InlineMessage,
  Screen,
  ScreenHeader,
  SectionTitle,
  SettingsGroup,
  SettingsRow,
  Text,
} from '@/design-system';
import { buildDataExport, serializeExport } from '@/features/settings';
import { useSessionStore } from '@/stores';

type Sheet = 'permissions' | 'privacy' | 'terms' | null;

const DATA_LIST = [
  'Tu perfil: nombre, usuario, correo y teléfono (si lo agregas).',
  'Tus cuentas, categorías, movimientos, suscripciones y objetivos.',
  'Tus ajustes: moneda, límite, notificaciones, apariencia e idioma.',
];

export default function PrivacyScreen() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [sheet, setSheet] = useState<Sheet>(null);
  const [exporting, setExporting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const download = async () => {
    setError(null);
    setExporting(true);
    try {
      const data = await buildDataExport(getRepositories());
      await Share.share({ title: 'Mis datos de Pigxel', message: serializeExport(data) });
    } catch {
      setError('No pudimos preparar tus datos. Inténtalo de nuevo.');
    } finally {
      setExporting(false);
    }
  };

  const deleteAccount = async () => {
    setError(null);
    try {
      await getRepositories().settings.deleteAccount();
      useSessionStore.getState().setSession(null);
      queryClient.clear();
      router.replace('/(auth)/welcome');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'No pudimos eliminar tu cuenta.');
    }
  };

  // Confirmación en dos pasos.
  const confirmDelete = () =>
    Alert.alert('¿Eliminar tu cuenta?', 'Se borrarán tu cuenta y todos tus datos.', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Continuar',
        style: 'destructive',
        onPress: () =>
          Alert.alert(
            'Esta acción no se puede deshacer',
            'Perderás tus cuentas, movimientos, suscripciones y objetivos para siempre.',
            [
              { text: 'Cancelar', style: 'cancel' },
              {
                text: 'Eliminar cuenta',
                style: 'destructive',
                onPress: () => void deleteAccount(),
              },
            ],
          ),
      },
    ]);

  return (
    <Screen scroll tabBar>
      <ScreenHeader title="Privacidad" onBack={() => goBackOr(router, '/(tabs)/settings')} />
      <Content style={styles.body}>
        <DetailIntro
          icon="lock"
          description="Controla la información y los permisos de tu cuenta."
        />
        <View style={styles.section}>
          <SectionTitle size="large">Tus datos</SectionTitle>
          <SettingsGroup>
            <SettingsRow
              icon="shield-check"
              title="Permisos de datos"
              subtitle="Gestiona el acceso a tus datos"
              onPress={() => setSheet('permissions')}
            />
            <SettingsRow
              icon="download"
              title="Descargar datos"
              subtitle={exporting ? 'Preparando tus datos…' : 'Obtén una copia de tu información'}
              onPress={exporting ? undefined : () => void download()}
            />
            <SettingsRow
              icon="trash-2"
              title="Eliminar cuenta"
              subtitle="Elimina tu cuenta y tus datos"
              destructive
              onPress={confirmDelete}
            />
          </SettingsGroup>
          {error ? <InlineMessage>{error}</InlineMessage> : null}
        </View>
        <View style={styles.section}>
          <SectionTitle size="large">Legal</SectionTitle>
          <SettingsGroup>
            <SettingsRow
              icon="file-lock-2"
              title="Política de privacidad"
              onPress={() => setSheet('privacy')}
            />
            <SettingsRow
              icon="file-text"
              title="Términos de uso"
              onPress={() => setSheet('terms')}
            />
          </SettingsGroup>
        </View>
      </Content>

      <InfoSheet
        visible={sheet === 'permissions'}
        title="Permisos de datos"
        onClose={() => setSheet(null)}
      >
        <Text variant="description">Pigxel guarda únicamente la información que tú registras:</Text>
        {DATA_LIST.map((line) => (
          <Text key={line} variant="description">
            {`•  ${line}`}
          </Text>
        ))}
        <Text variant="description">
          Tus datos están protegidos por usuario: solo tú puedes verlos y modificarlos. Puedes
          descargar una copia o eliminar tu cuenta cuando quieras.
        </Text>
      </InfoSheet>
      <InfoSheet
        visible={sheet === 'privacy'}
        title="Política de privacidad"
        onClose={() => setSheet(null)}
      >
        <Text variant="description">Documento en preparación.</Text>
      </InfoSheet>
      <InfoSheet visible={sheet === 'terms'} title="Términos de uso" onClose={() => setSheet(null)}>
        <Text variant="description">Documento en preparación.</Text>
      </InfoSheet>
    </Screen>
  );
}

const styles = StyleSheet.create({
  body: { marginTop: 20, gap: 24 },
  section: { gap: 10 },
});
