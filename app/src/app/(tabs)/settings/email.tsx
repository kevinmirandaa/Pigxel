// design-spec: app-screens/ajustes-correo.png · screens/ajustes-correo.png
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { goBackOr } from '@/core/navigation';
import {
  Content,
  DetailIntro,
  FormSheet,
  InlineMessage,
  PillInput,
  PrimaryButton,
  Screen,
  ScreenHeader,
  SectionTitle,
  SettingsGroup,
  SettingsRow,
  Text,
} from '@/design-system';
import {
  changeEmailSchema,
  useProfile,
  useSettings,
  useUpdateProfile,
  useUpdateSettings,
} from '@/features/settings';

export default function EmailScreen() {
  const router = useRouter();
  const profile = useProfile();
  const settings = useSettings();
  const updateProfile = useUpdateProfile();
  const updateSettings = useUpdateSettings();
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);

  const notifications = settings.data?.notifications;

  const submit = () => {
    const parsed = changeEmailSchema.safeParse({ email });
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? 'Correo inválido');
      return;
    }
    updateProfile.mutate({ email: parsed.data.email }, { onSuccess: () => setSent(true) });
  };
  const close = () => {
    setOpen(false);
    setSent(false);
    setEmail('');
    setError(null);
    updateProfile.reset();
  };

  return (
    <Screen scroll tabBar>
      <ScreenHeader
        title="Correo electrónico"
        onBack={() => goBackOr(router, '/(tabs)/settings')}
      />
      <Content style={styles.body}>
        <View style={styles.intro}>
          <DetailIntro
            icon="mail"
            title={profile.data?.email ?? ' '}
            description="Este es tu correo electrónico principal."
          />
        </View>

        <View style={styles.section}>
          <SectionTitle size="large">Correo actual</SectionTitle>
          <SettingsGroup>
            <SettingsRow
              icon="badge-check"
              title="Verificación del correo"
              subtitle="Tu correo está verificado"
              trailing="none"
              right={
                <Text variant="caption" tone="secondary" style={styles.verified}>
                  Verificado
                </Text>
              }
            />
            <SettingsRow
              icon="mail"
              title="Cambiar correo electrónico"
              onPress={() => {
                updateProfile.reset();
                setOpen(true);
              }}
            />
          </SettingsGroup>
        </View>

        <View style={styles.section}>
          <SectionTitle size="large">Notificaciones</SectionTitle>
          <SettingsGroup>
            <SettingsRow
              icon="bell"
              title="Notificaciones por correo"
              trailing="none"
              toggle={{
                value: notifications?.email ?? false,
                onChange: (value) =>
                  notifications &&
                  updateSettings.mutate({ notifications: { ...notifications, email: value } }),
              }}
            />
          </SettingsGroup>
          {updateSettings.error ? (
            <InlineMessage>{updateSettings.error.message}</InlineMessage>
          ) : null}
          <Text variant="description" tone="secondary">
            Usamos tu correo para avisos importantes y notificaciones de tu cuenta.
          </Text>
        </View>
      </Content>

      <FormSheet visible={open} title="Cambiar correo electrónico" onClose={close}>
        {sent ? (
          <>
            <InlineMessage tone="success">
              Te enviamos un correo de confirmación a ambas direcciones
            </InlineMessage>
            <PrimaryButton label="Listo" withArrow={false} onPress={close} />
          </>
        ) : (
          <>
            <PillInput
              value={email}
              onChangeText={(t) => {
                setEmail(t);
                setError(null);
              }}
              placeholder="Nuevo correo electrónico"
              leftIcon="mail"
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              autoComplete="email"
              textContentType="emailAddress"
              autoFocus
              error={error ?? undefined}
              returnKeyType="done"
              onSubmitEditing={submit}
            />
            <PrimaryButton
              label="Cambiar correo"
              loading={updateProfile.isPending}
              onPress={submit}
            />
            {updateProfile.error ? (
              <InlineMessage>{updateProfile.error.message}</InlineMessage>
            ) : null}
          </>
        )}
      </FormSheet>
    </Screen>
  );
}

const styles = StyleSheet.create({
  body: { marginTop: 20, gap: 28 },
  intro: { alignItems: 'center' },
  section: { gap: 10 },
  verified: { marginRight: 4 },
});
