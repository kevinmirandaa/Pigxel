import type { Repositories } from '../repositories';
import { createAccountRepository } from './repositories/accounts';
import { createAuthRepository } from './repositories/auth';
import { createCategoryRepository } from './repositories/categories';
import { createGoalRepository } from './repositories/goals';
import { createSettingsRepository } from './repositories/settings';
import { createSubscriptionRepository } from './repositories/subscriptions';
import { createTransactionRepository } from './repositories/transactions';
import type { PigxelClient } from './types';

/** Los 7 repositorios reales sobre un cliente Supabase (sin React Native: usable en Node/pruebas). */
export function createRepositoriesFromClient(client: PigxelClient): Repositories {
  return {
    auth: createAuthRepository(client),
    accounts: createAccountRepository(client),
    categories: createCategoryRepository(client),
    transactions: createTransactionRepository(client),
    subscriptions: createSubscriptionRepository(client),
    goals: createGoalRepository(client),
    settings: createSettingsRepository(client),
  };
}
