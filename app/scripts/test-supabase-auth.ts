/**
 * Prueba de integración REAL contra el proyecto Supabase de .env (Auth + Ajustes + RLS).
 * Uso: npm run test:supabase
 * Ejecuta los repositorios reales con un cliente de Node (sin React Native).
 * Los usuarios de prueba quedan en Auth (no hay service_role aquí): purgar desde el panel.
 */
import { createClient } from '@supabase/supabase-js';

import type { Database } from '../src/data/supabase/database.types';
import { createAuthRepository } from '../src/data/supabase/repositories/auth';
import { createSettingsRepository } from '../src/data/supabase/repositories/settings';

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`Falta ${name} en .env`);
  return value;
}

const url = requireEnv('EXPO_PUBLIC_SUPABASE_URL');
const key = requireEnv('EXPO_PUBLIC_SUPABASE_ANON_KEY');

const newClient = () =>
  createClient<Database>(url, key, {
    auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
  });

let failures = 0;
let step = 0;
function check(label: string, ok: boolean, detail = '') {
  step += 1;
  if (!ok) failures += 1;
  console.log(`${ok ? '✅' : '❌'} ${step}. ${label}${detail ? ` → ${detail}` : ''}`);
}
async function expectError(label: string, fn: () => Promise<unknown>, expected: string) {
  try {
    await fn();
    check(label, false, 'no lanzó error');
  } catch (e) {
    const msg = (e as Error).message;
    check(label, msg === expected, `"${msg}"`);
  }
}

async function main() {
  const stamp = Date.now();
  const email = `qa-${stamp}@pigxel-test.dev`;
  const email2 = `qa2-${stamp}@pigxel-test.dev`;
  const password = 'Pigxel-Test-1234';
  const newPassword = 'Pigxel-Nueva-5678';

  const client = newClient();
  const auth = createAuthRepository(client);
  const settings = createSettingsRepository(client);

  // 1. signUp
  const session = await auth.signUp({ name: 'Usuario QA', email, password });
  check('signUp devuelve sesión', !!session.userId && session.email === email, session.email);

  // 2. perfil y ajustes por defecto
  const profile = await settings.getProfile();
  check(
    'getProfile: nombre y username esperados',
    profile.fullName === 'Usuario QA' &&
      profile.username === `qa-${stamp}` &&
      profile.id === session.userId,
    `${profile.fullName} / ${profile.username}`,
  );
  const s0 = await settings.getSettings();
  check(
    'getSettings: valores por defecto',
    s0.currency === 'CRC' &&
      s0.language === 'es' &&
      s0.appearance === 'system' &&
      s0.spendingLimit.enabled === false &&
      s0.spendingLimit.period === 'monthly' &&
      s0.notifications.activity === false &&
      s0.notifications.subscriptions === true,
    JSON.stringify({ c: s0.currency, l: s0.language, a: s0.appearance, lim: s0.spendingLimit }),
  );

  // 3. actualizaciones persistentes
  await settings.updateProfile({ phone: '+506 8888 8888' });
  const p1 = await settings.getProfile();
  check('updateProfile: teléfono persiste', p1.phone === '+506 8888 8888', String(p1.phone));

  await settings.updateSettings({
    currency: 'USD',
    spendingLimit: { enabled: true, amount: 300000, period: 'monthly' },
    notifications: { ...s0.notifications, activity: true, news: false },
  });
  const s1 = await settings.getSettings();
  check(
    'updateSettings: moneda, límite y notificaciones persisten',
    s1.currency === 'USD' &&
      s1.spendingLimit.enabled &&
      s1.spendingLimit.amount === 300000 &&
      s1.notifications.activity === true &&
      s1.notifications.news === false &&
      s1.language === 'es',
    JSON.stringify({ c: s1.currency, lim: s1.spendingLimit }),
  );
  await settings.updateSettings({ spendingLimit: { amount: 150000 } as never });
  const s2 = await settings.getSettings();
  check(
    'parche parcial anidado conserva el resto',
    s2.spendingLimit.amount === 150000 && s2.spendingLimit.enabled === true,
    JSON.stringify(s2.spendingLimit),
  );

  // 6 (se hace con sesión abierta). Categorías por defecto
  const { count, error: catErr } = await client
    .from('categories')
    .select('*', { count: 'exact', head: true });
  check('tabla categories: 8 filas por defecto', !catErr && count === 8, `${count}`);

  // 4. signOut / signIn
  await auth.signOut();
  check('signOut → getSession es null', (await auth.getSession()) === null);
  const again = await auth.signIn({ email, password });
  check('signIn con contraseña correcta', again.userId === session.userId);
  await auth.signOut();
  await expectError(
    'signIn con contraseña incorrecta',
    () => auth.signIn({ email, password: 'incorrecta-123' }),
    'Correo o contraseña incorrectos',
  );
  await expectError(
    'signUp con correo repetido',
    () => auth.signUp({ name: 'Otra', email, password }),
    'Ya existe una cuenta con ese correo',
  );

  // 5. changePassword
  await auth.signIn({ email, password });
  await expectError(
    'changePassword con actual errónea',
    () => auth.changePassword({ currentPassword: 'mala-12345', newPassword }),
    'La contraseña actual es incorrecta',
  );
  await auth.changePassword({ currentPassword: password, newPassword });
  await auth.signOut();
  const withNew = await auth.signIn({ email, password: newPassword });
  check('signIn con la contraseña nueva', withNew.userId === session.userId);
  await expectError(
    'la contraseña vieja ya no sirve',
    () => auth.signIn({ email, password }),
    'Correo o contraseña incorrectos',
  );

  // onAuthStateChange
  const events: (string | null)[] = [];
  const unsubscribe = auth.onAuthStateChange((s) => events.push(s?.userId ?? null));
  await auth.signOut();
  await new Promise((r) => setTimeout(r, 300));
  unsubscribe();
  check(
    'onAuthStateChange notifica el cierre de sesión',
    events.includes(null),
    `${events.length} eventos`,
  );

  // 7. RLS: un segundo usuario no ve el perfil del primero
  const client2 = newClient();
  const auth2 = createAuthRepository(client2);
  await auth2.signUp({ name: 'Usuario QA 2', email: email2, password });
  const { data: leaked, error: leakErr } = await client2
    .from('profiles')
    .select('*')
    .eq('id', session.userId);
  check(
    'RLS: usuario 2 no lee el perfil del usuario 1',
    !leakErr && (leaked?.length ?? 1) === 0,
    `${leaked?.length} filas`,
  );
  const { data: leakedSettings } = await client2
    .from('user_settings')
    .select('*')
    .eq('user_id', session.userId);
  check('RLS: usuario 2 no lee los ajustes del usuario 1', (leakedSettings?.length ?? 1) === 0);
  const { data: edited } = await client2
    .from('profiles')
    .update({ full_name: 'hack' })
    .eq('id', session.userId)
    .select();
  check('RLS: usuario 2 no puede editar el perfil del usuario 1', (edited?.length ?? 1) === 0);
  await auth2.signOut();

  console.log(
    `\n${failures === 0 ? '🎉 Todo OK' : `⚠️ ${failures} fallo(s)`} · usuarios de prueba: ${email}, ${email2}`,
  );
  process.exit(failures === 0 ? 0 : 1);
}

main().catch((e) => {
  console.error('💥 Error inesperado:', e);
  process.exit(1);
});
