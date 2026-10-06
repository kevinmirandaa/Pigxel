// design-spec: app-screens/auth-nueva-contrasena.png · screens/auth-nueva-contrasena.png
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'expo-router';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { StyleSheet, View } from 'react-native';

import { goBackOr } from '@/core/navigation';
import { getRepositories } from '@/data';
import { AuthHeader, Content, InlineMessage, PrimaryButton, Screen } from '@/design-system';
import {
  AuthField,
  newPasswordSchema,
  useUpdatePassword,
  type NewPasswordInput,
} from '@/features/auth';
import { useSessionStore } from '@/stores';

export default function NewPasswordScreen() {
  const router = useRouter();
  const update = useUpdatePassword();
  const { control, handleSubmit, setFocus } = useForm<NewPasswordInput>({
    resolver: zodResolver(newPasswordSchema),
    defaultValues: { password: '', confirmPassword: '' },
  });
  const submit = handleSubmit(({ password }) =>
    update.mutate(password, {
      onSuccess: () => {
        router.replace({ pathname: '/(auth)/sign-in', params: { notice: 'password-updated' } });
      },
    }),
  );

  // Si el usuario sale sin cambiar la contraseña, se cierra la sesión de recuperación (no entra a la app sin elegirla).
  useEffect(
    () => () => {
      // `recovering` sigue activo solo si NO se llegó a cambiar la contraseña (useUpdatePassword lo apaga al terminar).
      if (!useSessionStore.getState().recovering) return;
      useSessionStore.getState().setRecovering(false);
      void getRepositories()
        .auth.signOut()
        .catch(() => undefined);
    },
    [],
  );

  return (
    <Screen background="auth" scroll avoidKeyboard>
      <AuthHeader
        title="Crea tu nueva contraseña"
        subtitle="Tu contraseña debe ser segura. Asegúrate de no olvidarla."
        onBack={() => goBackOr(router, '/(auth)/sign-in')}
      />
      <Content style={styles.form}>
        <AuthField
          control={control}
          name="password"
          leftIcon="lock"
          placeholder="Nueva contraseña"
          secureTextEntry
          autoCapitalize="none"
          autoComplete="new-password"
          textContentType="newPassword"
          returnKeyType="next"
          onSubmitEditing={() => setFocus('confirmPassword')}
        />
        <AuthField
          control={control}
          name="confirmPassword"
          leftIcon="lock"
          placeholder="Confirmar contraseña"
          secureTextEntry
          autoCapitalize="none"
          autoComplete="new-password"
          textContentType="newPassword"
          returnKeyType="done"
          onSubmitEditing={submit}
        />
        <View style={styles.action}>
          <PrimaryButton label="Continuar" loading={update.isPending} onPress={submit} />
          {update.error ? <InlineMessage>{update.error.message}</InlineMessage> : null}
        </View>
      </Content>
    </Screen>
  );
}

const styles = StyleSheet.create({
  form: { marginTop: 32, gap: 24 },
  action: { marginTop: 24, gap: 12 },
});
