# Fase 4: scaffolding de Pigxel (prompt para Claude Code)

Eres un ingeniero senior de React Native/Expo. Vas a crear SOLO el esqueleto del proyecto Pigxel: carpetas, configuración, dependencias y archivos base con stubs. **No construyas pantallas ni lógica de negocio** (eso es la Fase 7). No crees tablas en Supabase (Fase 5).

## 0. Contexto
- App de finanzas personales (ingresos, gastos, saldo y simulador "si compro esto, cuánto me queda"). iOS primero, Android funcional. Estética Apple minimalista con Liquid Glass.
- Raíz del workspace: `/Users/kevinmiranda/Downloads/Pigxel`. El proyecto Expo vive en `Pigxel/app/` (esa carpeta es la raíz del proyecto: `package.json` aquí).
- `Pigxel/design-spec/` es referencia de diseño de SOLO LECTURA. **Prohibido modificar, mover o borrar nada dentro de `design-spec/`** ni de `Pigxel/prompts/`.
- `Pigxel/app/assets/` ya existe con íconos y emojis descargados. **Conservar tal cual** (puedes añadir archivos, no borrar ni renombrar los existentes).
- El MCP de Figma NO está disponible. La fuente de verdad del diseño es `design-spec/README.md` (léelo primero, completo), `tokens.md`, `overlays.md`, `app-screens/` y `screens/`.
- Moneda: colón costarricense `¢`, formato `¢ 830.000` (punto de miles, sin decimales).

## 1. Crear el proyecto Expo en `app/` (que ya contiene `assets/`)
1. Usa el SDK estable más reciente de Expo y TypeScript estricto. `create-expo-app` falla en carpetas no vacías: genera el proyecto en una carpeta temporal fuera de `app/`, copia el resultado a `app/` SIN tocar `app/assets/` y borra la temporal.
2. Usa expo-router con las rutas en `src/app/` (no en `app/app`). Elimina todo el contenido de ejemplo de la plantilla (pantallas, componentes, imágenes de demo).
3. Alias de importación `@/*` → `src/*` en `tsconfig.json` (y en Babel/Metro si hace falta).
4. `app.json`: name `Pigxel`, slug `pigxel`, scheme `pigxel`, `userInterfaceStyle: "light"` por ahora, orientación portrait, `ios.supportsTablet: false`. Splash/ícono: apunta a `assets/brand/*` (los archivos finales los pone el cliente; usa nombres `app-icon.png`, `splash-icon.png`, `adaptive-icon.png` y crea placeholders SOLO si no existen).

## 2. Dependencias (instala con `npx expo install` para que coincidan con el SDK)
- Navegación/base: expo-router, react-native-safe-area-context, react-native-screens, expo-linking, expo-constants, expo-status-bar, expo-splash-screen.
- UI: react-native-reanimated, react-native-gesture-handler, react-native-svg, react-native-svg-transformer, expo-haptics, expo-font, @expo-google-fonts/nunito, expo-glass-effect (Liquid Glass en iOS; verifica en la documentación que existe para este SDK; si no, usa `expo-blur` como alternativa y documéntalo).
- Datos: @supabase/supabase-js, @tanstack/react-query, zustand, expo-secure-store, react-native-url-polyfill, @react-native-async-storage/async-storage.
- Formularios: react-hook-form, zod, @hookform/resolvers.
- Calidad: eslint (config de Expo), prettier, scripts `typecheck` (`tsc --noEmit`) y `lint`.
Configura Metro para importar `.svg` como componentes (react-native-svg-transformer) y declara los tipos de `*.svg` y `*.png`.

## 3. Estructura de carpetas y archivos
Crea TODOS estos archivos. Los de pantalla son stubs: un componente que muestra el nombre de la pantalla y un comentario `// design-spec: app-screens/<nombre>.png`.

    app/
    ├─ assets/                     (existente; no tocar)
    ├─ src/
    │  ├─ app/                     (expo-router)
    │  │  ├─ _layout.tsx           providers (QueryClient, safe area, fuentes), splash, guard de sesión (stub)
    │  │  ├─ index.tsx             redirección según sesión
    │  │  ├─ +not-found.tsx        = error-404
    │  │  ├─ (auth)/  _layout, welcome, sign-up, sign-in, forgot-password, verify-code, new-password
    │  │  ├─ (tabs)/  _layout (tab bar flotante, stub), index (cuentas + objetivos), activity, settings
    │  │  ├─ add/     index, income, expense, account, category, subscription, goal, accounts-list, categories-list
    │  │  ├─ consult.tsx · notifications.tsx
    │  │  └─ settings/ profile, email, password, currency, limit, categories, subscriptions, goals, notifications, appearance, language, privacy, help
    │  ├─ core/        config/env.ts (lee y valida EXPO_PUBLIC_*), constants.ts, providers/
    │  ├─ design-system/
    │  │  ├─ tokens/       colors.ts, typography.ts, spacing.ts, radii.ts, index.ts   (llenar con tokens.md)
    │  │  ├─ primitives/   Screen, Text, Pressable, Icon
    │  │  ├─ components/   GlassButton, TabBar, Card, ListRow, SettingsRow, Segmented, PillInput, PrimaryButton, LineChart, ProgressBar, Toggle   (stubs con props tipadas)
    │  │  └─ icons/        index.ts (mapa nombre → require/SVG de assets/icons/**)
    │  ├─ features/        auth · accounts · transactions · categories · subscriptions · goals · consult · settings · notifications
    │  │     cada feature: components/ · hooks/ · schemas/ (zod) · types.ts · index.ts
    │  ├─ data/
    │  │  ├─ supabase/     client.ts (con SecureStore y url-polyfill), repositories/ (vacío por ahora)
    │  │  ├─ mock/         datos y repositorios mock (cuentas BCR ¢20.000 y Efectivo ¢5.000, movimientos, suscripciones, objetivos de los diseños)
    │  │  ├─ repositories/ interfaces (AccountRepository, TransactionRepository, CategoryRepository, SubscriptionRepository, GoalRepository, SettingsRepository, AuthRepository)
    │  │  └─ index.ts      getRepositories(): elige mock | supabase según EXPO_PUBLIC_DATA_SOURCE
    │  ├─ lib/             formatCurrency.ts (¢ 830.000), dates.ts, cn/utils
    │  └─ stores/          session.ts, preferences.ts (zustand)
    ├─ .env.example        EXPO_PUBLIC_SUPABASE_URL=  EXPO_PUBLIC_SUPABASE_ANON_KEY=  EXPO_PUBLIC_DATA_SOURCE=mock
    ├─ .gitignore          incluye .env y .env.local
    ├─ metro.config.js · babel.config.js · tsconfig.json · eslint/prettier
    └─ ARCHITECTURE.md     árbol, reglas de capas, cómo cambiar mock → supabase

Reglas de capas: las pantallas (`src/app`) solo componen features y design-system; las features usan `getRepositories()`, nunca importan `@supabase/supabase-js` directamente; solo `src/data/supabase` habla con Supabase. Nunca pongas la service role key en el cliente.

## 4. Tokens (copia fiel de `design-spec/tokens.md`)
Colores (bg #F4F4F4, card #FFFFFF, borde #EAEAEA, texto #000000, secundario #8F8F8F, segmento #F0F0F0, buscador #EBEBEB, gasto #FF0000, ingreso #65CA60), radios (card 20, píldora 50), escala tipográfica (64/40/32/20/18/16/14/13). Tipografía: en iOS intenta `SF Pro Rounded`; si no resuelve (o en Android) usa Nunito. Encapsula la decisión en `typography.ts` con `Platform.select` y deja un TODO verificable en simulador. Rojo y verde SOLO para montos y íconos de categoría.

## 5. Verificación obligatoria antes de terminar
1. `npx tsc --noEmit` sin errores y `npm run lint` sin errores.
2. `npx expo-doctor` sin problemas bloqueantes.
3. `npx expo start` arranca y el bundle compila (no hace falta probar en dispositivo).
4. Confirma que `design-spec/`, `prompts/` y `app/assets/` no cambiaron (lista sus archivos y compara el conteo con el inicial).

## 6. Resumen final (formato exacto)
Entrega al terminar: (a) árbol final de `app/` a 3 niveles, (b) dependencias instaladas con versiones, (c) decisiones que tomaste y por qué (glass, fuentes, expo-router vs alternativas), (d) problemas encontrados y cómo los resolviste, (e) resultado de cada verificación del punto 5, (f) cualquier desviación de este prompt.
