import type { Session } from '@supabase/supabase-js';

import type { AuthSession } from '../../models';
import type { AuthRepository } from '../../repositories';
import { FriendlyError, toFriendlyAuthError } from '../errors';
import type { PigxelClient } from '../types';

function toAuthSession(session: Session | null): AuthSession | null {
  if (!session?.user) return null;
  return { userId: session.user.id, email: session.user.email ?? '' };
}

export function createAuthRepository(client: PigxelClient): AuthRepository {
  const auth = client.auth;

  return {
    async getSession() {
      const { data, error } = await auth.getSession();
      if (error) throw toFriendlyAuthError(error);
      return toAuthSession(data.session);
    },

    async signUp({ name, email, password }) {
      const { data, error } = await auth.signUp({
        email: email.trim(),
        password,
        options: { data: { full_name: name.trim() } },
      });
      if (error) throw toFriendlyAuthError(error);
      const session = toAuthSession(data.session);
      if (!session) {
        // Solo ocurre si el proyecto exige confirmar el correo (aquí está desactivado).
        throw new FriendlyError('Revisa tu correo para confirmar tu cuenta e inicia sesión.');
      }
      return session;
    },

    async signIn({ email, password }) {
      const { data, error } = await auth.signInWithPassword({ email: email.trim(), password });
      if (error) throw toFriendlyAuthError(error);
      const session = toAuthSession(data.session);
      if (!session) throw toFriendlyAuthError(null);
      return session;
    },

    async signOut() {
      const { error } = await auth.signOut();
      if (error) throw toFriendlyAuthError(error);
    },

    /**
     * Recuperación de contraseña (3 pasos). Implementada, pero el correo por defecto
     * de Supabase envía un ENLACE, no el código de 6 dígitos que pide la pantalla:
     * el flujo no se completa hasta configurar SMTP propio y la plantilla con
     * {{ .Token }} (ver prompts/pendientes-futuros.md).
     */
    async requestPasswordReset(email) {
      const { error } = await auth.resetPasswordForEmail(email.trim());
      if (error) throw toFriendlyAuthError(error);
    },

    async verifyResetCode({ email, code }) {
      const { error } = await auth.verifyOtp({
        email: email.trim(),
        token: code,
        type: 'recovery',
      });
      if (error) throw toFriendlyAuthError(error);
    },

    async updatePassword(newPassword) {
      const { error } = await auth.updateUser({ password: newPassword });
      if (error) throw toFriendlyAuthError(error);
    },

    async changePassword({ currentPassword, newPassword }) {
      const { data: sessionData, error: sessionError } = await auth.getSession();
      if (sessionError) throw toFriendlyAuthError(sessionError);
      const email = sessionData.session?.user.email;
      if (!email) throw new FriendlyError('Tu sesión expiró, inicia sesión de nuevo');

      // Verifica la contraseña actual re-autenticando con ella.
      const { error: verifyError } = await auth.signInWithPassword({
        email,
        password: currentPassword,
      });
      if (verifyError) {
        if (verifyError.code === 'invalid_credentials') {
          throw new FriendlyError('La contraseña actual es incorrecta');
        }
        throw toFriendlyAuthError(verifyError);
      }

      const { error } = await auth.updateUser({ password: newPassword });
      if (error) throw toFriendlyAuthError(error);
    },

    onAuthStateChange(listener) {
      // Callback síncrono (Supabase desaconseja trabajo async dentro de él).
      const { data } = auth.onAuthStateChange((_event, session) => {
        listener(toAuthSession(session));
      });
      return () => data.subscription.unsubscribe();
    },
  };
}
