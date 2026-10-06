// design-spec: app-screens/auth-crear-cuenta.png · screens/auth-crear-cuenta.png
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'expo-router';
import { useForm } from 'react-hook-form';
import { StyleSheet, View } from 'react-native';

import { goBackOr } from '@/core/navigation';
import {
  AuthHeader,
  Content,
  FooterLink,
  InlineMessage,
  PrimaryButton,
  Screen,
} from '@/design-system';
import { AuthField, useSignUp, signUpSchema, type SignUpInput } from '@/features/auth';

export default function SignUpScreen() {
  const router = useRouter();
  const signUp = useSignUp();
  const { control, handleSubmit, setFocus } = useForm<SignUpInput>({
    resolver: zodResolver(signUpSchema),
    defaultValues: { name: '', email: '', password: '', confirmPassword: '' },
  });
  const submit = handleSubmit((v) =>
    signUp.mutate({ name: v.name, email: v.email, password: v.password }),
  );

  return (
    <Screen background="auth" scroll avoidKeyboard>
      <AuthHeader
        title="Crear cuenta"
        subtitle="Comienza a gestionar tu dinero de forma simple."
        onBack={() => goBackOr(router, '/(auth)/welcome')}
      />
      <Content style={styles.form}>
        <AuthField
          control={control}
          name="name"
          leftIcon="user"
          placeholder="Nombre"
          autoCapitalize="words"
          autoComplete="name"
          textContentType="name"
          returnKeyType="next"
          onSubmitEditing={() => setFocus('email')}
        />
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
          returnKeyType="next"
          onSubmitEditing={() => setFocus('password')}
        />
        <AuthField
          control={control}
          name="password"
          leftIcon="lock"
          placeholder="Contraseña"
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
          <PrimaryButton label="Crear cuenta" loading={signUp.isPending} onPress={submit} />
          {signUp.error ? <InlineMessage>{signUp.error.message}</InlineMessage> : null}
        </View>
      </Content>
      <View style={styles.footer}>
        <FooterLink
          prefix="¿Ya tienes una cuenta?"
          action="Iniciar sesión"
          onPress={() => router.replace('/(auth)/sign-in')}
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  form: { marginTop: 32, gap: 24 },
  action: { marginTop: 24, gap: 12 },
  footer: { marginTop: 'auto', paddingTop: 24, paddingBottom: 8 },
});
