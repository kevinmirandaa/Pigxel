import {
  DELETE_ACCOUNT_UNAVAILABLE,
  FriendlyError,
  isFunctionUnavailable,
  toFriendlyError,
} from '../errors';
import { profileFromRow, profilePatchToRow, settingsFromRow, settingsPatchToRow } from '../mappers';
import type { SettingsRepository } from '../../repositories';
import type { PigxelClient } from '../types';

export function createSettingsRepository(client: PigxelClient): SettingsRepository {
  async function currentUserId(): Promise<string> {
    const { data, error } = await client.auth.getSession();
    if (error) throw toFriendlyError(error);
    const id = data.session?.user.id;
    if (!id) throw new FriendlyError('Tu sesión expiró, inicia sesión de nuevo');
    return id;
  }

  async function readProfile(userId: string) {
    const { data, error } = await client.from('profiles').select('*').eq('id', userId).single();
    if (error) throw toFriendlyError(error);
    return profileFromRow(data);
  }

  async function readSettings(userId: string) {
    const { data, error } = await client
      .from('user_settings')
      .select('*')
      .eq('user_id', userId)
      .single();
    if (error) throw toFriendlyError(error);
    return settingsFromRow(data);
  }

  return {
    async getProfile() {
      return readProfile(await currentUserId());
    },

    async updateProfile(patch) {
      const userId = await currentUserId();

      const row = profilePatchToRow(patch);
      if (Object.keys(row).length > 0) {
        const { error } = await client.from('profiles').update(row).eq('id', userId);
        if (error) throw toFriendlyError(error);
      }

      // El correo vive en Auth. Con "Secure email change" activo, Supabase exige
      // confirmar el cambio en el correo viejo y en el nuevo; hasta entonces
      // `profiles.email` no cambia (sincronización: prompts/pendientes-futuros.md).
      if (patch.email !== undefined) {
        const { error } = await client.auth.updateUser({ email: patch.email.trim() });
        if (error) throw toFriendlyError(error);
      }

      return readProfile(userId);
    },

    async getSettings() {
      return readSettings(await currentUserId());
    },

    async updateSettings(patch) {
      const userId = await currentUserId();
      const row = settingsPatchToRow(patch);
      if (Object.keys(row).length > 0) {
        const { error } = await client.from('user_settings').update(row).eq('user_id', userId);
        if (error) throw toFriendlyError(error);
      }
      return readSettings(userId);
    },

    async deleteAccount() {
      const { error } = await client.functions.invoke('delete-account');
      if (error) {
        if (isFunctionUnavailable(error)) throw new FriendlyError(DELETE_ACCOUNT_UNAVAILABLE);
        throw toFriendlyError(error);
      }
      await client.auth.signOut();
    },
  };
}
