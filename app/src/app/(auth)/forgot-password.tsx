// design-spec: app-screens/auth-recuperar-contrasena.png · screens/auth-recuperar-contrasena.png
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'expo-router';
import { useForm } from 'react-hook-form';
import { StyleSheet, View } from 'react-native';

import { goBackOr } from '@/core/navigation';
import { AuthHeader, Content, InlineMessage, PrimaryButton, Screen } from '@/design-system';
import {
  AuthField,
  useRequestPasswordReset,
  forgotPasswordSchema,
  type ForgotPasswordInput,
} from '@/features/auth';

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const request = useRequestPasswordReset();
  const { control, handleSubmit } = useForm<ForgotPasswordInput>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: '' },
  });
  const submit = handleSubmit(({ email }) =>
    request.mutate(email, {
      onSuccess: () => router.push({ pathname: '/(auth)/verify-code', params: { email } }),
    }),
  );

  return (
    <Screen background="auth" scroll avoidKeyboard>
      <AuthHeader
        title="Recuperar tu contraseña"
        subtitle="Ingresa tu correo electrónico y te enviaremos un enlace para restablecer tu contraseña."
        onBack={() => goBackOr(router, '/(auth)/sign-in')}
      />
      <Content style={styles.form}>
        <AuthField
          control={control}
          name="email"
          leftIcon="mail"
          placeholder="Correo electrónico"
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
          autoComplete="email"
          textContentType="emailAddress"
          returnKeyType="done"
          onSubmitEditing={submit}
        />
        <View style={styles.action}>
          <PrimaryButton label="Enviar enlace" loading={request.isPending} onPress={submit} />
          {request.error ? <InlineMessage>{request.error.message}</InlineMessage> : null}
        </View>
      </Content>
    </Screen>
  );
}

const styles = StyleSheet.create({
  form: { marginTop: 32, gap: 24 },
  action: { marginTop: 24, gap: 12 },
});
