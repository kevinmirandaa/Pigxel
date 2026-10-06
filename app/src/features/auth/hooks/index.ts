import { useMutation } from '@tanstack/react-query';
import { useCallback, useEffect, useState } from 'react';

import { getRepositories } from '@/data';
import { RESEND_SECONDS, countdownEnd, formatCountdown, remainingSeconds } from '@/lib/countdown';
import { useSessionStore } from '@/stores';

/** Inicio de sesión. El guard de sesión del layout raíz lleva a Tabs al cambiar la sesión. */
export function useSignIn() {
  return useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      getRepositories().auth.signIn({ email, password }),
    onSuccess: (session) => useSessionStore.getState().setSession(session),
  });
}

/** Registro (la confirmación de correo está apagada: entra directo). */
export function useSignUp() {
  return useMutation({
    mutationFn: (input: { name: string; email: string; password: string }) =>
      getRepositories().auth.signUp(input),
    onSuccess: (session) => useSessionStore.getState().setSession(session),
  });
}

/** Pide el correo/código de recuperación. */
export function useRequestPasswordReset() {
  return useMutation({
    mutationFn: (email: string) => getRepositories().auth.requestPasswordReset(email),
  });
}

/**
 * Verifica el código. Verificarlo crea una sesión en Supabase, así que se activa el modo "recuperación"
 * ANTES de la llamada (el guard no debe sacar al usuario de las pantallas de auth); si falla, se desactiva.
 */
export function useVerifyResetCode() {
  return useMutation({
    mutationFn: async ({ email, code }: { email: string; code: string }) => {
      const { setRecovering } = useSessionStore.getState();
      setRecovering(true);
      try {
        await getRepositories().auth.verifyResetCode({ email, code });
      } catch (error) {
        setRecovering(false);
        throw error;
      }
    },
  });
}

/** Cambia la contraseña y cierra la sesión de recuperación: el usuario vuelve a iniciar sesión con la nueva. */
export function useUpdatePassword() {
  return useMutation({
    mutationFn: async (newPassword: string) => {
      const { auth } = getRepositories();
      await auth.updatePassword(newPassword);
      await auth.signOut();
    },
    onSettled: () => useSessionStore.getState().setRecovering(false),
  });
}

/**
 * Cuenta regresiva del reenvío (59 → 0). Se calcula con el reloj (no con ticks), así sobrevive a segundo plano.
 * `restart()` la vuelve a lanzar tras reenviar el código.
 */
export function useResendTimer(seconds: number = RESEND_SECONDS) {
  const [endAt, setEndAt] = useState(() => countdownEnd(Date.now(), seconds));
  const [now, setNow] = useState(() => Date.now());
  const remaining = remainingSeconds(endAt, now);

  useEffect(() => {
    if (remaining === 0) return undefined;
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, [remaining]);

  const restart = useCallback(() => {
    const t = Date.now();
    setNow(t);
    setEndAt(countdownEnd(t, seconds));
  }, [seconds]);

  return { remaining, canResend: remaining === 0, label: formatCountdown(remaining), restart };
}
