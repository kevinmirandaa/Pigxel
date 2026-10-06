// design-spec: app-screens/auth-iniciar-sesion.png · screens/auth-iniciar-sesion.png
import { zodResolver } from '@hookform/resolvers/zod';
import { useLocalSearchParams, useRouter } from 'expo-router';
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
  TextLink,
} from '@/design-system';
import { AuthField, useSignIn, signInSchema, type SignInInput } from '@/features/auth';

export default function SignInScreen() {
  const router = useRouter();
  const { notice } = useLocalSearchParams<{ notice?: string }>();
  const signIn = useSignIn();
  const { control, handleSubmit, setFocus } = useForm<SignInInput>({
    resolver: zodResolver(signInSchema),
    defaultValues: { email: '', password: '' },
  });
  const submit = handleSubmit((v) => signIn.mutate(v));

  return (
    <Screen background="auth" scroll avoidKeyboard>
      <AuthHeader
        title="Iniciar sesión"
        subtitle="Bienvenido de nuevo. Ingresa tu cuenta."
        onBack={() => goBackOr(router, '/(auth)/welcome')}
      />
      <Content style={styles.form}>
        {notice === 'password-updated' ? (
          <InlineMessage tone="success">Contraseña actualizada</InlineMessage>
        ) : null}
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
        <View style={styles.passwordBlock}>
          <AuthField
            control={control}
            name="password"
            leftIcon="lock"
            placeholder="Contraseña"
            secureTextEntry
            autoCapitalize="none"
            autoComplete="current-password"
            textContentType="password"
            returnKeyType="done"
            onSubmitEditing={submit}
          />
          <TextLink onPress={() => router.push('/(auth)/forgot-password')}>
            Olvidé mi contraseña
          </TextLink>
        </View>
        <View style={styles.action}>
          <PrimaryButton label="Iniciar sesión" loading={signIn.isPending} onPress={submit} />
          {signIn.error ? <InlineMessage>{signIn.error.message}</InlineMessage> : null}
        </View>
      </Content>
      <View style={styles.footer}>
        <FooterLink
          prefix="¿No tienes cuenta?"
          action="Crear cuenta"
          onPress={() => router.replace('/(auth)/sign-up')}
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  form: { marginTop: 32, gap: 24 },
  // El enlace va a 17 pt bajo el campo (Figma: 379 → 396).
  passwordBlock: { gap: 16 },
  action: { marginTop: 8, gap: 12 },
  footer: { marginTop: 'auto', paddingTop: 24, paddingBottom: 8 },
});
