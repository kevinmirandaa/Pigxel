/**
 * Integración REAL (lote 7.4): perfil, moneda, límite, notificaciones y cambio de contraseña con los repositorios reales.
 * Uso: npm run test:settings-flow  ·  Crea un usuario @pigxel-test.dev (purgar desde el panel).
 */
import { createClient } from '@supabase/supabase-js';

import type { Database } from '../src/data/supabase/database.types';
import { createRepositoriesFromClient } from '../src/data/supabase/factory';
import { changePasswordSchema, limitSchema, profileSchema } from '../src/features/settings/schemas';

const url = process.env.EXPO_PUBLIC_SUPABASE_URL as string;
const key = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY as string;
if (!url || !key) throw new Error('Falta EXPO_PUBLIC_SUPABASE_URL / ANON_KEY en .env');

let failures = 0;
let step = 0;
function check(label: string, ok: boolean, detail = '') {
  step += 1;
  if (!ok) failures += 1;
  console.log(`${ok ? '✅' : '❌'} ${step}. ${label}${detail ? ` → ${detail}` : ''}`);
}

async function main() {
  const client = createClient<Database>(url, key, {
    auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
  });
  const repos = createRepositoriesFromClient(client);
  const stamp = Date.now();
  const email = `qa-settings-${stamp}@pigxel-test.dev`;
  const oldPassword = 'Pigxel-Test-1234';
  await repos.auth.signUp({ name: 'Usuario Ajustes', email, password: oldPassword });

  // Perfil (valores validados con el mismo esquema que la pantalla)
  const p = profileSchema.parse({
    fullName: ' Kevin Prueba ',
    username: 'kevin.prueba',
    phone: '+506 8888 8888',
  });
  const profile = await repos.settings.updateProfile({
    fullName: p.fullName,
    username: p.username,
    phone: p.phone,
  });
  check(
    'perfil actualizado',
    profile.fullName === 'Kevin Prueba' &&
      profile.username === 'kevin.prueba' &&
      profile.phone === '+506 8888 8888',
  );
  const cleared = await repos.settings.updateProfile({ phone: null });
  check('teléfono se puede quitar (null)', cleared.phone === null);
  check('persiste al releer', (await repos.settings.getProfile()).username === 'kevin.prueba');

  // Moneda
  const usd = await repos.settings.updateSettings({ currency: 'USD' });
  check(
    'moneda USD',
    usd.currency === 'USD' && (await repos.settings.getSettings()).currency === 'USD',
  );
  await repos.settings.updateSettings({ currency: 'CRC' });

  // Límite
  const lim = limitSchema.parse({ enabled: true, amount: '300000', period: 'monthly' });
  const withLimit = await repos.settings.updateSettings({ spendingLimit: lim });
  check(
    'límite mensual ¢300.000 activo',
    withLimit.spendingLimit.enabled &&
      withLimit.spendingLimit.amount === 300000 &&
      withLimit.spendingLimit.period === 'monthly',
  );
  const off = await repos.settings.updateSettings({
    spendingLimit: limitSchema.parse({ enabled: false, amount: '300000', period: 'weekly' }),
  });
  check(
    'límite apagado y semanal',
    !off.spendingLimit.enabled && off.spendingLimit.period === 'weekly',
  );

  // Notificaciones por correo
  const s = await repos.settings.getSettings();
  const noMail = await repos.settings.updateSettings({
    notifications: { ...s.notifications, email: false },
  });
  check(
    'notificaciones por correo apagadas',
    noMail.notifications.email === false && noMail.notifications.goals === s.notifications.goals,
  );

  // Contraseña
  let wrong = '';
  try {
    await repos.auth.changePassword({
      currentPassword: 'Incorrecta1',
      newPassword: 'Nueva-Clave-1',
    });
  } catch (e) {
    wrong = (e as Error).message;
  }
  check(
    'contraseña actual incorrecta rechazada en español',
    wrong === 'La contraseña actual es incorrecta',
    wrong,
  );
  check(
    'esquema valida la nueva',
    changePasswordSchema.safeParse({
      currentPassword: oldPassword,
      newPassword: 'Nueva-Clave-1',
      repeatPassword: 'Nueva-Clave-1',
    }).success,
  );
  await repos.auth.changePassword({ currentPassword: oldPassword, newPassword: 'Nueva-Clave-1' });
  await repos.auth.signOut();
  const back = await repos.auth.signIn({ email, password: 'Nueva-Clave-1' });
  check('inicia sesión con la contraseña nueva', back.email === email);
  let old = false;
  await repos.auth.signOut();
  try {
    await repos.auth.signIn({ email, password: oldPassword });
    old = true;
  } catch {
    old = false;
  }
  check('la contraseña vieja ya no funciona', !old);

  console.log(`\n${failures === 0 ? '🎉 Todo OK' : `⚠️ ${failures} fallo(s)`} · usuario: ${email}`);
  process.exit(failures === 0 ? 0 : 1);
}

main().catch((e) => {
  console.error('💥 Error inesperado:', e);
  process.exit(1);
});
