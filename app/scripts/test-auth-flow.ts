/// <reference types="node" />
/**
 * Integración REAL del flujo de autenticación (lote 7.1): registro → cierre → inicio → cambio de contraseña, con los
 * MISMOS esquemas y repositorios que usa la UI. Uso: npm run test:auth-flow
 * No llama a `requestPasswordReset` (enviaría un correo real). Los usuarios @pigxel-test.dev quedan en Auth.
 */
import { createClient } from '@supabase/supabase-js';

import type { Database } from '../src/data/supabase/database.types';
import { createRepositoriesFromClient } from '../src/data/supabase/factory';
import { newPasswordSchema, signInSchema, signUpSchema } from '../src/features/auth/schemas';

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`Falta ${name} en .env`);
  return value;
}
const url = requireEnv('EXPO_PUBLIC_SUPABASE_URL');
const key = requireEnv('EXPO_PUBLIC_SUPABASE_ANON_KEY');
const client = createClient<Database>(url, key, {
  auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
});
const { auth } = createRepositoriesFromClient(client);

let failures = 0;
let step = 0;
const check = (label: string, ok: boolean, detail = '') => {
  step += 1;
  if (!ok) failures += 1;
  console.log(`${ok ? '✅' : '❌'} ${step}. ${label}${detail ? ` → ${detail}` : ''}`);
};
async function expectError(label: string, fn: () => Promise<unknown>, expected?: string) {
  try {
    await fn();
    check(label, false, 'no lanzó error');
  } catch (e) {
    const msg = (e as Error).message;
    check(label, expected === undefined || msg === expected, `"${msg}"`);
  }
}

async function main() {
  const stamp = Date.now();
  const email = `qa-auth-${stamp}@pigxel-test.dev`;
  const pass1 = 'Clave1234';
  const pass2 = 'Cambio5678';
  const pass3 = 'Final9012';

  // Lo que escribe el usuario pasa por los esquemas de la UI antes de llegar al repositorio.
  const form = signUpSchema.parse({
    name: '  Usuario Flujo ',
    email: ` ${email} `,
    password: pass1,
    confirmPassword: pass1,
  });
  check(
    'esquema de registro normaliza nombre y correo',
    form.name === 'Usuario Flujo' && form.email === email,
  );
  check(
    'esquema rechaza contraseña débil y confirmación distinta',
    !signUpSchema.safeParse({ ...form, password: 'abc', confirmPassword: 'abc' }).success &&
      !signUpSchema.safeParse({ ...form, confirmPassword: 'otra' }).success,
  );

  const events: (string | null)[] = [];
  const unsubscribe = auth.onAuthStateChange((s) => events.push(s?.userId ?? null));

  // 1. Registro: entra directo (sin confirmación de correo)
  const created = await auth.signUp({
    name: form.name,
    email: form.email,
    password: form.password,
  });
  check(
    'registro devuelve sesión (sin confirmar correo)',
    !!created.userId && created.email === email,
    created.email,
  );
  check('getSession tras registrarse', (await auth.getSession())?.userId === created.userId);
  await expectError(
    'registro con el mismo correo',
    () => auth.signUp({ name: 'Otro', email, password: pass1 }),
    'Ya existe una cuenta con ese correo',
  );

  // 2. Cierre de sesión
  await auth.signOut();
  check('cierre de sesión → getSession es null', (await auth.getSession()) === null);

  // 3. Inicio de sesión (mismo esquema que la pantalla)
  check(
    'esquema de inicio acepta las credenciales',
    signInSchema.safeParse({ email, password: pass1 }).success,
  );
  await expectError(
    'inicio con contraseña incorrecta',
    () => auth.signIn({ email, password: 'Incorrecta1' }),
    'Correo o contraseña incorrectos',
  );
  const login = await auth.signIn({ email, password: pass1 });
  check('inicio con la contraseña correcta', login.userId === created.userId);

  // 4. Código de recuperación inválido: falla con elegancia y NO deja sesión de recuperación
  await auth.signOut();
  await expectError('código de verificación incorrecto', () =>
    auth.verifyResetCode({ email, code: '000000' }),
  );
  check('un código incorrecto no crea sesión', (await auth.getSession()) === null);

  // 5. Cambio de contraseña desde Ajustes (pide la actual)
  await auth.signIn({ email, password: pass1 });
  await expectError(
    'cambio con contraseña actual errónea',
    () => auth.changePassword({ currentPassword: 'Mala12345', newPassword: pass2 }),
    'La contraseña actual es incorrecta',
  );
  check(
    'esquema de nueva contraseña',
    newPasswordSchema.safeParse({ password: pass2, confirmPassword: pass2 }).success,
  );
  await auth.changePassword({ currentPassword: pass1, newPassword: pass2 });
  await auth.signOut();
  await expectError(
    'la contraseña anterior ya no sirve',
    () => auth.signIn({ email, password: pass1 }),
    'Correo o contraseña incorrectos',
  );
  check(
    'inicio con la contraseña nueva',
    (await auth.signIn({ email, password: pass2 })).userId === created.userId,
  );

  // 6. Último paso de "Nueva contraseña" (pantalla 7.1): updatePassword + signOut, luego a iniciar sesión
  await auth.updatePassword(pass3);
  await auth.signOut();
  check(
    'tras actualizar, la sesión queda cerrada (el usuario vuelve a Iniciar sesión)',
    (await auth.getSession()) === null,
  );
  await expectError(
    'la contraseña intermedia ya no sirve',
    () => auth.signIn({ email, password: pass2 }),
    'Correo o contraseña incorrectos',
  );
  check(
    'inicio con la contraseña final',
    (await auth.signIn({ email, password: pass3 })).userId === created.userId,
  );
  await auth.signOut();

  await new Promise((r) => setTimeout(r, 300));
  unsubscribe();
  check(
    'onAuthStateChange notificó inicios y cierres de sesión',
    events.includes(created.userId) && events.includes(null),
    `${events.length} eventos`,
  );

  console.log(
    `\n${failures === 0 ? '🎉 Todo OK' : `⚠️ ${failures} fallo(s)`} · usuario de prueba: ${email}`,
  );
  process.exit(failures === 0 ? 0 : 1);
}

main().catch((e) => {
  console.error('💥 Error inesperado:', e);
  process.exit(1);
});
