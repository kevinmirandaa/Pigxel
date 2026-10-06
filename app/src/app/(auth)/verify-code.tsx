// design-spec: app-screens/auth-codigo-verificacion.png · screens/auth-codigo-verificacion.png
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { goBackOr } from '@/core/navigation';
import {
  AuthHeader,
  Content,
  FooterLink,
  InlineMessage,
  OtpInput,
  PrimaryButton,
  Screen,
} from '@/design-system';
import { useRequestPasswordReset, useResendTimer, useVerifyResetCode } from '@/features/auth';
import { isOtpComplete } from '@/lib/otp';

export default function VerifyCodeScreen() {
  const router = useRouter();
  const { email = '' } = useLocalSearchParams<{ email?: string }>();
  const [code, setCode] = useState('');
  const [resent, setResent] = useState(false);
  const verify = useVerifyResetCode();
  const resend = useRequestPasswordReset();
  const timer = useResendTimer();

  const submit = () => {
    if (!isOtpComplete(code)) return;
    verify.mutate({ email, code }, { onSuccess: () => router.replace('/(auth)/new-password') });
  };
  const onResend = () => {
    resend.mutate(email, {
      onSuccess: () => {
        timer.restart();
        setCode('');
        setResent(true);
      },
    });
  };
  // Cualquier fallo de verificación se muestra igual salvo la falta de conexión (no es culpa del código).
  const verifyError = verify.error
    ? verify.error.message.startsWith('Sin conexión')
      ? verify.error.message
      : 'Código incorrecto o vencido'
    : null;

  return (
    <Screen background="auth" scroll avoidKeyboard>
      <AuthHeader
        title="Ingresa el código de verificación"
        subtitle="Hemos enviado un código de 6 dígitos a tu correo electrónico."
        onBack={() => goBackOr(router, '/(auth)/forgot-password')}
      />
      <Content style={styles.form}>
        <OtpInput value={code} onChange={setCode} autoFocus onComplete={() => undefined} />
        <FooterLink
          prefix="¿No recibiste el código?"
          action={timer.canResend ? 'Reenviar' : `Reenviar en ${timer.label}`}
          actionEnabled={timer.canResend && !resend.isPending}
          onPress={onResend}
        />
        {resent && !resend.error ? (
          <InlineMessage tone="success">Te enviamos un nuevo código</InlineMessage>
        ) : null}
        {resend.error ? <InlineMessage>{resend.error.message}</InlineMessage> : null}
        <View style={styles.action}>
          <PrimaryButton
            label="Continuar"
            loading={verify.isPending}
            disabled={!isOtpComplete(code)}
            onPress={submit}
          />
          {verifyError ? <InlineMessage>{verifyError}</InlineMessage> : null}
        </View>
      </Content>
    </Screen>
  );
}

const styles = StyleSheet.create({
  form: { marginTop: 32, gap: 16 },
  action: { marginTop: 16, gap: 12 },
});
