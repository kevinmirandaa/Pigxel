import { validateEmoji } from '../../../lib/emoji';
import type { CategoryRepository } from '../../repositories';
import { FriendlyError, toFriendlyError } from '../errors';
import { categoryFromRow } from '../mappers';
import type { PigxelClient } from '../types';

const DUPLICATE = { '23505': 'Ya tienes una categoría con ese nombre' };

export function createCategoryRepository(client: PigxelClient): CategoryRepository {
  return {
    async list() {
      const { data, error } = await client.from('categories').select('*');
      if (error) throw toFriendlyError(error);
      // Orden alfabético en español (acentos y mayúsculas no alteran el orden).
      return (data ?? [])
        .map(categoryFromRow)
        .sort((a, b) => a.name.localeCompare(b.name, 'es', { sensitivity: 'base' }));
    },

    async create({ name, icon }) {
      const cleanName = name.trim();
      if (!cleanName) throw new FriendlyError('Ingresa un nombre');
      if (!validateEmoji(icon)) throw new FriendlyError('Elige un solo emoji');
      const { data, error } = await client
        .from('categories')
        .insert({ name: cleanName, icon })
        .select('*')
        .single();
      if (error) throw toFriendlyError(error, DUPLICATE);
      return categoryFromRow(data);
    },
  };
}
