// design-spec: app-screens/ajustes-contrasena.png · screens/ajustes-contrasena.png
import { useRouter } from 'expo-router';
import { useRef, useState } from 'react';
import { StyleSheet, View, type TextInput } from 'react-native';

import { goBackOr } from '@/core/navigation';
import {
  CardField,
  Content,
  DetailIntro,
  Icon,
  InlineMessage,
  Pressable,
  PrimaryButton,
  Screen,
  ScreenHeader,
  SettingsGroup,
  SettingsRow,
  Text,
  colors,
} from '@/design-system';
import { changePasswordSchema, useChangePassword } from '@/features/settings';

type Key = 'currentPassword' | 'newPassword' | 'repeatPassword';
const EMPTY = { currentPassword: '', newPassword: '', repeatPassword: '' };
const LABELS: Record<Key, string> = {
  currentPassword: 'Contraseña actual',
  newPassword: 'Nueva contraseña',
  repeatPassword: 'Repetir nueva contraseña',
};
const ORDER: Key[] = ['currentPassword', 'newPassword', 'repeatPassword'];

export default function PasswordScreen() {
  const router = useRouter();
  const change = useChangePassword();
  const [values, setValues] = useState(EMPTY);
  const [errors, setErrors] = useState<Partial<Record<Key, string>>>({});
  const [revealed, setRevealed] = useState(false);
  const [done, setDone] = useState(false);
  const refs = useRef<Partial<Record<Key, TextInput | null>>>({});

  const submit = () => {
    const parsed = changePasswordSchema.safeParse(values);
    if (!parsed.success) {
      const next: Partial<Record<Key, string>> = {};
      for (const issue of parsed.error.issues) {
        const key = issue.path[0] as Key;
        if (!next[key]) next[key] = issue.message;
      }
      setErrors(next);
      return;
    }
    setErrors({});
    setDone(false);
    change.mutate(
      { currentPassword: values.currentPassword, newPassword: values.newPassword },
      {
        onSuccess: () => {
          setValues(EMPTY);
          setRevealed(false);
          setDone(true);
        },
      },
    );
  };

  return (
    <Screen scroll tabBar avoidKeyboard>
      <ScreenHeader title="Contraseña" onBack={() => goBackOr(router, '/(tabs)/settings')} />
      <Content style={styles.body}>
        <DetailIntro
          icon="key-round"
          title="Cambia tu contraseña"
          description="Usa una contraseña segura para mantener tu cuenta protegida."
        />
        <SettingsGroup dividerInset={0}>
          {ORDER.map((key, i) => (
            <CardField
              key={key}
              label={LABELS[key]}
              error={errors[key]}
              input={{
                ref: (node: TextInput | null) => {
                  refs.current[key] = node;
                },
                value: values[key],
                onChangeText: (t) => {
                  setValues((v) => ({ ...v, [key]: t }));
                  setErrors((e) => ({ ...e, [key]: undefined }));
                  setDone(false);
                },
                secureTextEntry: !revealed,
                autoCapitalize: 'none',
                autoCorrect: false,
                autoComplete: i === 0 ? 'current-password' : 'new-password',
                textContentType: i === 0 ? 'password' : 'newPassword',
                returnKeyType: i === ORDER.length - 1 ? 'done' : 'next',
                onSubmitEditing: () =>
                  i === ORDER.length - 1 ? submit() : refs.current[ORDER[i + 1] as Key]?.focus(),
              }}
              right={
                <Pressable
                  haptic={false}
                  hitSlop={12}
                  accessibilityLabel={revealed ? 'Ocultar contraseñas' : 'Mostrar contraseñas'}
                  onPress={() => setRevealed((r) => !r)}
                >
                  <Icon name={revealed ? 'eye-off' : 'eye'} size={20} color={colors.iconMuted} />
                </Pressable>
              }
            />
          ))}
        </SettingsGroup>
        <SettingsGroup>
          <SettingsRow
            icon="eye"
            title="Mostrar contraseña"
            trailing="none"
            toggle={{ value: revealed, onChange: setRevealed }}
          />
        </SettingsGroup>
        <Text variant="description" tone="secondary">
          Al menos 8 caracteres, con mayúsculas, minúsculas y números.
        </Text>
        <View style={styles.action}>
          <PrimaryButton
            label="Actualizar contraseña"
            withArrow={false}
            loading={change.isPending}
            onPress={submit}
          />
          {change.error ? <InlineMessage>{change.error.message}</InlineMessage> : null}
          {done ? <InlineMessage tone="success">Contraseña actualizada</InlineMessage> : null}
        </View>
      </Content>
    </Screen>
  );
}

const styles = StyleSheet.create({
  body: { marginTop: 20, gap: 16 },
  action: { gap: 12, marginTop: 4 },
});
