# Fase 6 · Etapa 1: Supabase en la app (cliente tipado, Auth y Ajustes)

Continúas el proyecto Pigxel en `/Users/kevinmiranda/Downloads/Pigxel/app`. Lee antes `app/ARCHITECTURE.md` y `app/supabase/migrations/*.sql`. El proyecto Supabase ya existe y tiene el esquema aplicado (tablas `profiles`, `user_settings`, `accounts`, `categories`, `transactions`, `subscriptions`, `goals`, vista `account_balances`; RLS por usuario; un trigger crea perfil, ajustes y 8 categorías al registrarse). **No cambies el esquema ni crees migraciones** en esta etapa; si crees que falta algo, repórtalo en el resumen.

Prohibido tocar `design-spec/`, `prompts/` y `app/assets/`. No construyas UI de pantallas (eso es la Fase 7). `EXPO_PUBLIC_DATA_SOURCE` se queda en `mock`. La service_role key NUNCA va en el código ni en `.env`.

## Alcance
1. **Cliente tipado:** `createClient<Database>` con `src/data/supabase/database.types.ts`. Que el código de los repositorios NO importe nada de React Native (para poder probarlo en Node): el cliente se inyecta, por ejemplo `createAuthRepository(client: SupabaseClient<Database>)`. `getSupabase()` (con SecureStore) solo se usa al armar los repositorios en la app.
2. **`src/data/supabase/mappers.ts`:** funciones puras fila ↔ modelo (`profiles` → `UserProfile`, `user_settings` → `UserSettings` incluyendo `spendingLimit` y `notifications`, y el inverso para parches parciales).
3. **AuthRepository sobre Supabase** (`src/data/supabase/repositories/auth.ts`):
   - `signUp({name,email,password})`: `auth.signUp` con `options.data.full_name = name`. Si no vuelve sesión (confirmación de correo activada), lanza un error claro; en este proyecto la confirmación está DESACTIVADA, así que debe devolver sesión.
   - `signIn`, `signOut`, `getSession` (mapea a `AuthSession {userId,email}`), `onAuthStateChange` (devuelve la función para desuscribirse).
   - `requestPasswordReset(email)` → `resetPasswordForEmail`; `verifyResetCode({email,code})` → `verifyOtp({type:'recovery'})`; `updatePassword(newPassword)` → `updateUser({password})`. Quedan implementados, pero el correo por defecto de Supabase no trae el código (ver `prompts/pendientes-futuros.md`): documéntalo en un comentario, no intentes arreglarlo.
   - **Añade `changePassword({currentPassword,newPassword})` a la interfaz `AuthRepository`**, a la implementación mock y a la de Supabase: verifica la contraseña actual con `signInWithPassword` (email de la sesión) y luego `updateUser`.
   - **Errores en español:** función `toFriendlyAuthError(err)` que traduce los códigos de Supabase (`invalid_credentials` → "Correo o contraseña incorrectos", `user_already_exists` → "Ya existe una cuenta con ese correo", `weak_password` → "La contraseña es demasiado débil", `over_request_rate_limit`/`over_email_send_rate_limit` → "Demasiados intentos, espera un momento", `email_not_confirmed`, errores de red → "Sin conexión", y un genérico). Todos los repositorios lanzan `Error` con ese mensaje.
4. **SettingsRepository sobre Supabase** (`.../settings.ts`): `getProfile`, `updateProfile` (fullName, username, phone; si cambia `email`, usa `auth.updateUser({email})` y deja anotado que "Secure email change" exige confirmar ambos correos), `getSettings`, `updateSettings` (parche parcial, devuelve el estado fresco).
5. **`createSupabaseRepositories()`:** compone `auth` y `settings` reales. Para `accounts`, `categories`, `transactions`, `subscriptions`, `goals` deja repositorios que lanzan `Error('Pendiente: Fase 6 etapa 2/3')` (se implementan en las siguientes etapas).
6. **Sesión en la app:** revisa que `src/app/_layout.tsx`/`stores/session.ts` carguen la sesión inicial con `getSession()` y se mantengan sincronizados con `onAuthStateChange`, y que `Stack.Protected` redirija bien. Corrige solo lo necesario; no rediseñes.
7. **Prueba de integración real:** crea `app/scripts/test-supabase-auth.ts` (ejecutable con `npx tsx --env-file=.env scripts/test-supabase-auth.ts`; añade `tsx` como devDependency y el script npm `test:supabase`). Debe usar un cliente de Node (`createClient` con almacenamiento en memoria) + tus repositorios reales contra el proyecto de `.env` y comprobar, imprimiendo ✅/❌ por paso:
   1. signUp con correo único (`qa-<timestamp>@pigxel-test.dev`; si Supabase lo rechaza, prueba otro dominio) → sesión devuelta.
   2. `getProfile` → nombre y username esperados; `getSettings` → valores por defecto (CRC, es, system, límite apagado).
   3. `updateProfile` (teléfono) y `updateSettings` (moneda USD, límite activado ¢300.000 mensual, notificaciones) → se persisten al releer.
   4. signOut → `getSession` es null; signIn con la contraseña correcta funciona; con una incorrecta lanza "Correo o contraseña incorrectos".
   5. `changePassword` con contraseña actual errónea falla; con la correcta funciona y se puede iniciar sesión con la nueva.
   6. Tabla `categories` del usuario (consulta directa con el cliente) tiene 8 filas.
   7. Un segundo usuario NO puede leer el perfil del primero (RLS).
   Al final haz signOut. Los usuarios de prueba quedan en Auth; indícalo en el resumen (los purga quien administra Supabase).

## Verificación obligatoria
`npx tsc --noEmit`, `npm run lint`, `npx prettier --check`, `npm run test:supabase` (pega el resultado completo), `npx expo-doctor`. Confirma con `grep` que no hay `service_role` en el código ni en `.env`, y que `design-spec/`, `prompts/`, `app/assets/` no cambiaron.

## Resumen final (formato exacto)
(a) archivos creados/modificados, (b) decisiones y por qué, (c) salida completa del test de integración, (d) problemas encontrados y cómo se resolvieron, (e) resultado de cada verificación, (f) desviaciones del prompt y cosas que el esquema necesite cambiar (si las hay).
