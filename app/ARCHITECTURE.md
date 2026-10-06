# Pigxel: arquitectura de la app

Expo SDK 57 · React Native 0.86 · TypeScript estricto · expo-router (rutas en `src/app/`).
El diseño vive en `../design-spec/` (solo lectura). Empieza por `../design-spec/README.md`.

## Árbol

```
app/
├─ assets/                 brand/ · backgrounds/ · icons/{tabs,ui,settings,add,categories} · fonts/
├─ src/
│  ├─ app/                 rutas (expo-router): solo componen features y design-system
│  │  ├─ _layout.tsx       providers, splash, sesión, Stack.Protected (auth vs app)
│  │  ├─ index.tsx         redirige según sesión
│  │  ├─ (auth)/           welcome · sign-up · sign-in · forgot-password · verify-code · new-password
│  │  ├─ (tabs)/           index (Cuentas/Objetivos) · activity · settings/ (stack con 13 detalles)
│  │  ├─ add/              index · income · expense · account · category · subscription · goal · accounts-list · categories-list
│  │  ├─ consult.tsx · notifications.tsx · +not-found.tsx
│  ├─ core/                config/env.ts (valida EXPO_PUBLIC_*) · constants.ts · providers/
│  ├─ design-system/       tokens/ · primitives/ · components/ · icons/
│  ├─ features/            auth · accounts · transactions · categories · subscriptions · goals · consult · settings · notifications
│  ├─ data/                models.ts · repositories/ (interfaces) · mock/ · supabase/ · index.ts (getRepositories)
│  ├─ lib/                 formatCurrency · dates · utils · validators
│  ├─ stores/              session · preferences (zustand)
│  └─ types/               declaraciones de .svg/.png
├─ .env.example · metro.config.js · babel.config.js · eslint.config.js · .prettierrc
```

## Reglas de capas

1. `src/app` (pantallas) solo importa `features`, `design-system`, `stores` y `lib`.
2. `features` usan `getRepositories()` de `@/data`; **nunca** importan `@supabase/supabase-js`.
3. Solo `src/data/supabase` habla con Supabase. Solo se usa la **anon key**; la `service_role` nunca va en la app.
4. `design-system` no conoce features ni datos (solo tipos de `@/data/models`).
5. Montos: enteros en colones (sin decimales). Formato con `formatCurrency` (`¢ 830.000`, `¢20.000`, `-¢18.000`, `+¢718.000`).

## Emojis (decisión con el cliente)

- Los datos del usuario (cuentas, categorías, objetivos, suscripciones) llevan **nombre + emoji elegido por el usuario**, guardado como **texto Unicode** en la columna `icon` (1 grafema, ≤16 caracteres; `lib/emoji.ts` y `emojiSchema`). **No hay imágenes de emojis**: los dibuja el sistema (Apple Color Emoji en iOS, Noto Color Emoji en Android).
- `EmojiBadge` (primitiva) muestra un emoji sin `fontFamily`. `EmojiPicker` / `EmojiPickerButton` (`design-system/emoji/`) eligen uno: hoja inferior con búsqueda en español, categorías y recientes (`stores/recentEmojis`). Catálogo propio generado con `npm run build:emoji-data` desde `emojibase-data` (Emoji 17, español); solo se muestran los emojis que el iOS/Android del dispositivo puede dibujar (`design-system/emoji/support.ts`).
- Los íconos FIJOS de la app (tabs, ajustes, flechas, buscador, menú Agregar, detalle) son un único sistema de línea (**Lucide**) con el componente `<Icon name size color strokeWidth />`; ver `docs/fidelity-iconos.md`. Los SVG de `assets/icons/**` quedan en disco solo como respaldo y **no se importan** (lo verifica una prueba).
- **Obsoleto:** los PNG de `assets/icons/categories/` (bank, cash, credit-card, shopping-cart, money-bag, coffee, car) ya no se usan en el código; se conservan en disco por si el cliente los quiere de referencia.

## Backend cerrado: guía para el frontend (Fase 7)

Todo se obtiene con `getRepositories()` (mock o Supabase según `EXPO_PUBLIC_DATA_SOURCE`); las pantallas no cambian.

| Pantalla                     | Qué usar                                                                                                                                                                                                                         |
| ---------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Cuentas / Cuentas·Objetivos  | `useHomeSummary()` → `{ totalBalance, accounts, recent (3), subscriptions, goals }`. Invalidar `HOME_SUMMARY_KEY` tras crear algo                                                                                                |
| Actividad                    | `transactions.list({ type, search, limit })`, `getPeriodTotal(type)`, `getWeeklySeries(type)` (semana lunes–domingo, hora del dispositivo)                                                                                       |
| Agregar ingreso / gasto      | `transactions.create({ type, amount, title, accountId, categoryId })`; listas con `accounts.list()` y `categories.list()`                                                                                                        |
| Nueva cuenta / categoría     | `accounts.create({ name, icon, initialAmount, description? })`, `categories.create({ name, icon })` + `EmojiPickerButton`                                                                                                        |
| Nueva suscripción / objetivo | `subscriptions.create({ name, icon, cost, status, plan })` (el próximo cobro se calcula solo); `goals.create({ name, icon, targetAmount, initialAmount })`                                                                       |
| Suscripciones (Ajustes)      | `subscriptions.list()` y `subscriptions.getMonthlyCost()`                                                                                                                                                                        |
| Objetivos                    | `goals.list()`; cada objetivo trae `progressPercent` (0–100)                                                                                                                                                                     |
| Consultar                    | `useConsultContext()` → `{ balance, limit, spentInPeriod }` y `computeConsult({ balance, amount, limit, spentInPeriod })` → `{ remaining, canAfford, remainingAfterLimit?, limitStatus }`. El límite solo informa: nunca bloquea |
| Límite (Ajustes)             | `settings.updateSettings({ spendingLimit })` y `transactions.getSpentInPeriod('weekly' \| 'monthly')`                                                                                                                            |
| Auth / Ajustes               | `auth.*` (incluye `changePassword`), `settings.getProfile/updateProfile/getSettings/updateSettings`                                                                                                                              |

Cosas a recordar: los errores de los repositorios ya vienen en español (`error.message` se muestra tal cual). `nextChargeAt` es ISO de la medianoche LOCAL (usar `new Date(...)` + `formatShortDate`). Un ingreso sin categoría se rotula "Ingreso" y un gasto sin categoría "Sin categoría". Datos de demo para ver la app con contenido: `SEED_EMAIL=… SEED_PASSWORD=… npm run seed:demo` (`-- --reset` borra solo los datos financieros de ese usuario).

## Autenticación (Fase 7 · lote 7.1)

- **Rutas:** `src/app/index.tsx` (splash + redirección), `(auth)/` (welcome, sign-up, sign-in, forgot-password, verify-code, new-password) y `+not-found.tsx`. `(auth)/_layout` es un Stack sin encabezado nativo, con gesto de volver.
- **Lógica:** `features/auth` (esquemas zod, hooks `useSignIn/useSignUp/useRequestPasswordReset/useVerifyResetCode/useUpdatePassword/useResendTimer`, `AuthField`). Datos siempre por `getRepositories().auth`.
- **Modo recuperación:** `useSessionStore.recovering`. Verificar el código crea una sesión; mientras `recovering` es verdadero `selectIsAuthenticated` es falso y el usuario se queda en las pantallas de auth hasta elegir su contraseña (ver `docs/fidelity-auth.md`).
- **Herramientas dev (`__DEV__`):** lanzador en el splash, galería (`/_dev/gallery`) e **índice de las 36 pantallas** (`/_dev/screens`, estado en `src/core/dev/screens-status.ts` que cada lote actualiza; vive en `core/dev` porque expo-router trata cada archivo de `src/app` como una ruta). En mock hay "Entrar como demo".
- **Pruebas:** `npm run test:auth-flow` (registro → cierre → inicio → cambio de contraseña contra Supabase) y las unitarias de esquemas, OTP y cuenta regresiva.

## Ancho responsivo (Fase 7 · etapa 0b)

El Figma mide 402 pt, pero la app debe verse bien de 360 a 440 pt (y en iPad, como columna centrada de 440 máx.). Regla única (`design-system/tokens/metrics.ts`, con pruebas):

- **Márgenes laterales FIJOS:** 36 pt (tarjetas, campos, listas), 51 en los botones de bienvenida, 39 en el menú de Ajustes. `<Content margin>` los aplica.
- **Contenido FLEXIBLE:** `ancho = min(pantalla, 440) − 2 × margen`; los componentes se estiran (`alignSelf: 'stretch'`). **Prohibido** usar un ancho del Figma (330, 300, 351…) como `width` de contenido: ya no existen en `layout` (solo en `figmaReference`, para documentación y pruebas).
- `Screen` centra una columna de 440 máx. y NO pone márgenes; `Content` sí. `useScreenMetrics()` da los números a quien los necesite; `LineChart` mide su ancho con `onLayout`.
- La comprobación componente × ancho está en `docs/responsive-check.md` (`npm run responsive-check`).

## Galería de componentes (Fase 7 · etapa 0)

`src/app/_dev/gallery.tsx` muestra TODOS los componentes del design-system y sus estados, rotulados, para compararlos con `design-spec/app-screens/`. Solo existe con `__DEV__` (en producción redirige a `/`) y no está enlazada en la navegación normal.

- **Abrirla en Expo Go:** al iniciar la app en desarrollo aparece un lanzador con "Galería de componentes" (en `src/app/index.tsx`). Para saltarlo, `EXPO_PUBLIC_SKIP_DEV_LAUNCHER=true` en `.env`. También por enlace: `exp://<ip>:8081/--/_dev/gallery`.
- Los componentes y sus medidas están documentados en `docs/fidelity-components.md`; las medidas y colores se regeneran con `npm run measure` (`docs/measurements.md`).
- **Selector de ancho:** la galería permite simular 360 / 375 / 390 / 402 / 430 pt (o el real) sin cambiar de teléfono.
- Íconos: catálogo en `src/design-system/icons/lucide.tsx`; `docs/fidelity-iconos.md` (`npm run docs:icons`). **OBSOLETO:** `icons/generated.tsx` y `scripts/build-icons.ts` (SVG monocromos del Figma) ya no se usan.

## Pruebas

- `npm run test:unit`: modelo de ancho (360–768), íconos (existen en Lucide, sin importar `assets/icons`), validación y búsqueda de emoji, soporte por versión del sistema, semana lunes–domingo, mapeadores y errores (sin red).
- `npm run test:supabase` (Auth y Ajustes), `npm run test:supabase-data` (cuentas, categorías, movimientos con emojis) y `npm run test:supabase-extra` (suscripciones, objetivos, periodo, inicio, seed, RLS y Consultar): integración REAL contra el proyecto de `.env`; los usuarios `qa-*@pigxel-test.dev` quedan en Auth y se purgan desde el panel.

## Mock → Supabase

`EXPO_PUBLIC_DATA_SOURCE=mock` (por defecto) usa datos en memoria de `src/data/mock`. En la Fase 6 se implementan los repositorios en `src/data/supabase/repositories/` (etapas 1–3: los 7 repositorios son reales) y se cambia a `supabase` (con `EXPO_PUBLIC_SUPABASE_URL` y `_ANON_KEY`). Las pantallas no cambian. Con mock, `EXPO_PUBLIC_MOCK_SIGNED_IN=true` arranca con sesión iniciada para navegar la app.

## Mapa pantalla ↔ ruta (design-spec/app-screens/<nombre>.png)

| Diseño                                                                 | Ruta                                                                                                                                    |
| ---------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| auth-splash                                                            | splash nativo (`app.json`)                                                                                                              |
| auth-bienvenida · crear-cuenta · iniciar-sesion                        | `(auth)/welcome · sign-up · sign-in`                                                                                                    |
| auth-recuperar-contrasena · codigo-verificacion · nueva-contrasena     | `(auth)/forgot-password · verify-code · new-password`                                                                                   |
| error-404                                                              | `+not-found`                                                                                                                            |
| tab-cuentas · tab-cuentas-objetivos                                    | `(tabs)/index` (segmento Cuentas / Objetivos)                                                                                           |
| tab-actividad · tab-ajustes                                            | `(tabs)/activity · (tabs)/settings/index`                                                                                               |
| add-menu · add-cuenta · add-categoria · add-suscripcion · add-objetivo | `add/index · account · category · subscription · goal`                                                                                  |
| add-ingreso · add-gasto                                                | `add/income · expense`                                                                                                                  |
| add-lista-cuentas · add-lista-categorias                               | `add/accounts-list · categories-list` (punto de entrada por definir)                                                                    |
| consultar · notificaciones                                             | `consult · notifications`                                                                                                               |
| ajustes-* (13)                                                         | `(tabs)/settings/{profile,email,password,currency,limit,categories,subscriptions,goals,notifications,appearance,language,privacy,help}` |

Navegación: la campana abre `notifications`; el **+** abre `add`; las píldoras Ingreso / Gasto / Consulta abren `add/income`, `add/expense` y `consult`.

## Decisiones técnicas

- **Tipografía:** iOS usa `fontFamily: 'ui-rounded'` (SF Pro Rounded del sistema); Android, Nunito (`useAppFonts`). Ver `design-system/tokens/typography.ts`.
- **Liquid Glass:** `expo-glass-effect` (`GlassView`, solo iOS 26+) con alternativa translúcida en el resto (`GlassButton`, `TabBar`).
- **Auth:** `Stack.Protected` en el layout raíz según `useSessionStore`.
- **Sesión Supabase:** `chunkedSecureStore` (SecureStore limita ~2 KB por valor).
- **Detalles de Ajustes dentro de `(tabs)/settings/`:** así la tab bar sigue visible, como en el diseño.

## Pendientes conocidos para la Fase 7

- Los íconos de `assets/icons/tabs/` son la versión **inactiva** (gris `#C1C1C1`); faltan los activos (negros) del SVG fuente.
- `assets/backgrounds/welcome-bg.png` (imagen 3D de bienvenida) lo aporta el cliente.
- Componentes aún sin implementar (stubs con props tipadas): `SettingsRow`, `Segmented`, `PillInput`, `LineChart`, `ProgressBar`, `Toggle`; `PrimaryButton` sin flecha real ni estados.
- Aspecto Liquid Glass y sombras: afinar contra `design-spec/app-screens/`.
- El disparador de `EmojiPickerButton` usa el glifo ☺︎ como aproximación de la carita de `add-categoria.png`; reemplazar por el SVG exacto de `design-spec/source/Pigxel.svg` y medir el círculo.
- Probar `EmojiPicker` en simulador/dispositivo (altura de la hoja, teclado, rendimiento con ~1900 emojis).

## Inconsistencias del diseño (no corregidas; replicar o decidir con el cliente)

- Saldo total ¢830.000 ≠ suma de cuentas (¢20.000 + ¢5.000). Mock: `MOCK_TOTAL_BALANCE` fijo.
- Gastos de Actividad ¢128.500 ≠ suma de los movimientos listados.
- "Supermercado" es categoría _Alimentación_ en Cuentas y _Compras_ en Actividad.
- Tooltip de la gráfica usa coma (`¢18,500`); el resto del diseño usa punto.
- Textos: "Categorias" sin tilde en Ajustes, " Suscripciones" con espacio inicial, "Nueva suscripción" con doble espacio.
- Placeholders de ícono/splash derivados de `assets/brand/logo/`; reemplazar si hay arte final.

## Lote 7.2 · pestañas

`(tabs)/index` (Cuentas/Objetivos), `(tabs)/activity`, `(tabs)/settings/index`. Lógica pura en `features/transactions/activity.ts`; claves de consulta en `features/*/queryKeys.ts`; `features/invalidate.ts` centraliza la invalidación tras mutaciones. Ver `docs/fidelity-pestanas.md`.

## Formularios (lote 7.3)

Los formularios usan react-hook-form + `zodFormResolver` (esquemas con `coerce`: la entrada es texto de dígitos, `schema.parse` produce los números). Los montos se guardan como dígitos y se muestran con `formatAmountInput` (`lib/amountInput.ts`). Cada creación usa un hook de mutación del feature que invalida `invalidateFinancialQueries` (o `CATEGORIES_KEY`) y, al éxito, `useFinishForm` vuelve a la raíz de la pestaña. Consultar nunca escribe datos: calcula con `computeConsult` y navega a Agregar gasto con `?amount=`.

## Moneda (lote 7.4)

`lib/currency.ts` guarda la moneda activa; `formatCurrency` toma su símbolo por defecto. `stores/currency.ts` la expone como estado (`useCurrency()` re-renderiza las pantallas que dan formato a montos) y `CurrencySync` la carga desde `user_settings`. **Limitación del MVP: solo cambia el símbolo; no se convierten montos.**

## Ajustes con datos

Hooks `useProfile`/`useSettings` (TanStack Query); `useUpdateSettings` actualiza la caché de forma optimista y revierte si falla. El límite de gastos guarda automáticamente (sin botón).

## Mapa final de rutas (36 pantallas)

- **Entrada:** `/` (splash), `(auth)/welcome`, `sign-up`, `sign-in`, `forgot-password`, `verify-code`, `new-password`, 404.
- **Pestañas `(tabs)`:** `index` (Cuentas y Objetivos), `activity`, `settings/index`.
- **Ajustes `(tabs)/settings/*`:** `profile`, `email`, `password`, `currency`, `limit`, `categories`, `subscriptions`, `goals`, `notifications`, `appearance`, `language`, `privacy`, `help`.
- **Agregar `add/*`:** `index`, `accounts-list`, `categories-list`, `account`, `category`, `subscription`, `goal`, `income`, `expense`.
- **Otras:** `consult`, `notifications`.

## Limitaciones conocidas del MVP

- **Sin conversión de moneda:** cambiar la moneda solo cambia el símbolo.
- **Sin notificaciones push:** las preferencias se guardan, pero no se envía nada.
- **Solo modo claro:** la preferencia de apariencia se guarda lista para activarse.
- **Sin traducciones:** la app está solo en español; la preferencia de idioma se guarda.
- **Recuperación de contraseña:** usa el correo de Supabase por defecto (con límite de envíos) y no el código personalizado.
- **Eliminar cuenta:** depende de la Edge Function `delete-account`, que despliega el dueño del proyecto en Supabase. Sin ella, la app muestra "Esta función aún no está disponible".
- **Soporte:** requiere `EXPO_PUBLIC_SUPPORT_EMAIL`.
- **Listas largas:** Actividad no pagina.

## Cómo ejecutar las pruebas

Desde `app/`: `npx tsc --noEmit`, `npm run lint`, `npx prettier --check .`, `npm run test:unit`, `npm run responsive-check`, y con Supabase configurado en `.env`: `npm run test:supabase`, `test:supabase-data`, `test:supabase-extra`, `test:forms-flow`, `test:settings-flow`, `test:auth-flow`. Exportación: `EXPO_NO_DOTENV=1 npx expo export --platform ios|android --clear`.
