# Fidelidad · Lote 7.1 (autenticación)

Cada fila: elemento · valor del Figma · valor implementado · fuente. **Normalización** = el Figma variaba entre pantallas y se aplicó un valor coherente
(cuadrícula 4/8, margen lateral de 36); se anota para poder revertirla. Fuentes: `design-spec/figma-metadata.xml` (XML), `design-spec/app-screens/*.png` (captura),
`docs/measurements.md` (muestreo). Posiciones `y` medidas desde el borde superior del área segura; contenido flexible con márgenes fijos (ver `docs/responsive-check.md`).

Fondo de TODAS las pantallas de auth: **blanco** `#FFFFFF`; campos `#F0F0F0` con borde exterior `#EAEAEA` (muestreo).

## Splash · `src/app/index.tsx` (`auth-splash`)

| Elemento   | Figma                                           | Implementado                                                                     | Fuente         |
| ---------- | ----------------------------------------------- | -------------------------------------------------------------------------------- | -------------- |
| Logo       | 160×160 en (131, 357) = centro exacto del frame | 160×160 centrado (`assets/brand/logo/logo.png`)                                  | XML (nodo 1:3) |
| Fondo      | blanco                                          | `colors.authBg`                                                                  | Captura        |
| Duración   | —                                               | mínimo 700 ms y hasta que cargue la sesión; luego Tabs (con sesión) o Bienvenida | Prompt         |
| Acceso dev | —                                               | solo `__DEV__`: lanzador con galería e índice de pantallas                       | Prompt         |

## Bienvenida · `(auth)/welcome` (`auth-bienvenida`)

| Elemento               | Figma                                                                                                     | Implementado                                                     | Fuente        |
| ---------------------- | --------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------- | ------------- |
| Fondo                  | 409×883 en (-4, -5)                                                                                       | `assets/backgrounds/welcome-bg.png` a pantalla completa, `cover` | XML           |
| Título                 | 40 Bold, (52, 410), 306 de ancho; 3 tonos: negro / `#5E5E5F` "financiero" / `#AFAFAF` "en un solo lugar." | `authTitle` (40, líneas de 48) en columna de margen 51 (300)     | XML, Muestreo |
| Botón "Crear cuenta"   | negro 300×60 en (51, 676), sin flecha                                                                     | `PrimaryButton` margen 51, sin flecha                            | XML           |
| Botón "Iniciar sesión" | vidrio 300×60 en **(47, 751)** con "@"                                                                    | vidrio, margen 51, ícono `at-sign`                               | XML           |
| **Normalización**      | x=47 vs 51                                                                                                | **51** (ambos botones alineados)                                 | Cuadrícula    |
| **Normalización**      | espacio entre botones 15                                                                                  | **16**                                                           | 4/8 pt        |
| **Normalización**      | título→botones 122                                                                                        | **120**                                                          | 4/8 pt        |
| Posición vertical      | glass termina a 63 pt del borde físico                                                                    | anclado a `área segura inferior + 29`                            | XML           |

## Crear cuenta · `(auth)/sign-up` (`auth-crear-cuenta`)

| Elemento     | Figma                                                                                         | Implementado                                                                       | Fuente                                                           |
| ------------ | --------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------- | ---------------------------------------------------------------- |
| Botón atrás  | vidrio 50×50 en (20, 20)                                                                      | `GlassButton` (20, 20)                                                             | XML                                                              |
| Título       | 40 Bold en **(42, 95)**                                                                       | `AuthHeader`: 40 Bold en x=**36**, 24 pt bajo el botón (y=94)                      | XML · **normalización** (margen 36)                              |
| Subtítulo    | 20 gris en (42, 153), 324 de ancho                                                            | 20 `#8F8F8F`, 12 pt bajo el título                                                 | XML · normalización (10 → 12)                                    |
| Campos       | 4 × 330×60 en y=234/319/404/489 (paso 85) con íconos user/mail/lock/lock a x=60, texto a x=89 | `PillInput` auth, gap **24** (paso 84), ancho flexible; ícono a x=24, texto a x=53 | XML · normalización (85 → 84)                                    |
| Primer campo | 33 pt bajo el subtítulo                                                                       | **32**                                                                             | normalización                                                    |
| Botón        | 330×60 en y=593 (44 bajo el último campo), flecha                                             | `PrimaryButton` "Crear cuenta →", **48** bajo el último campo                      | XML · normalización                                              |
| Pie          | "¿Ya tienes una cuenta? **Iniciar sesión**" en y=715 (en sign-in está en y=587)               | anclado al borde inferior (mín. 24 pt bajo el contenido), 16 pt, acción en negrita | XML · **normalización** (posición inconsistente entre pantallas) |
| Íconos       | user/mail/lock Figma                                                                          | `user`, `mail`, `lock` (Lucide, trazo 2,5)                                         | `docs/fidelity-iconos.md`                                        |

## Iniciar sesión · `(auth)/sign-in` (`auth-iniciar-sesion`)

| Elemento               | Figma                                              | Implementado                                                                | Fuente              |
| ---------------------- | -------------------------------------------------- | --------------------------------------------------------------------------- | ------------------- |
| Título                 | "Iniciar **S**esión"                               | **"Iniciar sesión"** (minúscula, como el resto)                             | Errata anotada      |
| Campos                 | correo y contraseña (ojo en x=320)                 | correo; contraseña con ojo a 26 pt del borde derecho                        | XML                 |
| "Olvidé mi contraseña" | 14, caja de 290 en (129, 396): 17 pt bajo el campo | enlace alineado a la derecha, 16 pt bajo el campo, área táctil ampliada     | XML · normalización |
| Botón                  | y=474 (61 bajo el enlace)                          | "Iniciar sesión →", 32 pt bajo el enlace                                    | normalización       |
| Pie                    | "¿No tienes cuenta? **Crear cuenta**" y=587        | anclado abajo; `router.replace` a sign-up                                   | XML                 |
| Aviso (nuevo)          | —                                                  | "Contraseña actualizada" (verde del aviso) al volver desde Nueva contraseña | Prompt              |

## Recuperar contraseña · `(auth)/forgot-password` (`auth-recuperar-contrasena`)

| Elemento     | Figma                                               | Implementado                                                     | Fuente              |
| ------------ | --------------------------------------------------- | ---------------------------------------------------------------- | ------------------- |
| Título       | 40 Bold, 2 líneas (96), (42, 95)                    | `AuthHeader`, x=36                                               | XML                 |
| Subtítulo    | 20 gris, 3 líneas (72) en y=206 (15 bajo el título) | igual, 12 bajo el título                                         | XML · normalización |
| Campo correo | y=322 (44 bajo el subtítulo)                        | 32 bajo el subtítulo                                             | normalización       |
| Botón        | "Enviar enlace →" y=437 (55 bajo el campo)          | 48 bajo el campo                                                 | normalización       |
| Acción       | —                                                   | `auth.requestPasswordReset(email)` → `verify-code` con el correo | Prompt              |

## Código de verificación · `(auth)/verify-code` (`auth-codigo-verificacion`)

| Elemento         | Figma                                                                                               | Implementado                                                                                     | Fuente                      |
| ---------------- | --------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------ | --------------------------- |
| Código           | 6 casillas de 49×77 de x=42 a 359 (paso 54,2); cursor negro; relleno `#EAEAEA`, radio ≈15           | `OtpInput`: 6 casillas flexibles (≈48,5 a 402), `parseOtpInput`, cursor parpadeante, `autoFocus` | Muestreo (escaneo de fila)  |
| Texto de reenvío | "¿No recibiste el código? **Reenviar en 00:59**", caja de 347 de ancho (más ancha que el contenido) | `FooterLink` centrado; cuenta regresiva real 59 → 0; a 0 pasa a "**Reenviar**"                   | XML                         |
| Espacios         | OTP→texto 43; texto→botón 70                                                                        | 16 + área táctil de 44 (≈28 visibles) · 16                                                       | normalización               |
| Botón            | "Continuar →"                                                                                       | deshabilitado hasta tener 6 dígitos; carga al verificar                                          | XML                         |
| Error (nuevo)    | —                                                                                                   | "Código incorrecto o vencido" bajo el botón (o "Sin conexión…")                                  | Prompt                      |
| Aviso (nuevo)    | —                                                                                                   | "Te enviamos un nuevo código" tras reenviar                                                      | estado no definido en Figma |

## Nueva contraseña · `(auth)/new-password` (`auth-nueva-contrasena`)

| Elemento  | Figma                                          | Implementado                                                                      | Fuente                                                  |
| --------- | ---------------------------------------------- | --------------------------------------------------------------------------------- | ------------------------------------------------------- |
| Subtítulo | "…**Asegurate** de no olvidarla."              | **"Asegúrate"**                                                                   | Errata anotada                                          |
| Campos    | y=322 y 407 (44 y 68 bajo el subtítulo/título) | 32 bajo el subtítulo, gap 24                                                      | XML · normalización (el 68 era la inconsistencia mayor) |
| Botón     | "Continuar →" y=555 (88 bajo el último campo)  | 48                                                                                | normalización                                           |
| Acción    | —                                              | `updatePassword` + cierre de sesión → Iniciar sesión con "Contraseña actualizada" | Prompt                                                  |

## Error 404 · `src/app/+not-found.tsx` (`error-404`)

| Elemento    | Figma                                       | Implementado              | Fuente                                          |
| ----------- | ------------------------------------------- | ------------------------- | ----------------------------------------------- |
| Título      | "Error 404" 40 Bold en **(42, 102)**        | `AuthHeader` (x=36, y=94) | XML · normalización (102 → 94/95 como el resto) |
| Subtítulo   | "La aplicación no responde" 20 en (42, 150) | 20 gris                   | XML                                             |
| Botón atrás | vidrio (20, 20)                             | `router.replace('/')`     | Prompt                                          |

## Validación (esquemas en `features/auth/schemas`)

- **Nombre:** recortado, ≥ 2 caracteres. **Correo:** válido (recortado). **Contraseña (registro y nueva):** ≥ 8, con al menos una letra y un número. **Confirmación:** igual. **Código:** 6 dígitos.
- **Inicio de sesión:** correo válido y contraseña no vacía (sin reglas de fuerza: nunca se bloquea a quien ya tiene cuenta).
- La pantalla Ajustes › Contraseña exige además mayúsculas y minúsculas (esquema aparte, lote posterior).

## Comportamiento que no es visible en las capturas

- **Recuperación:** verificar el código crea una sesión en Supabase; se activa el modo `recovering` del store ANTES de verificar para que el guard no saque al usuario a la app. Si falla, se desactiva; si sale de "Nueva contraseña" sin terminar, se cierra la sesión de recuperación.
- **Doble envío:** los botones muestran carga y se deshabilitan mientras la mutación está pendiente.
- **Teclado:** `Screen scroll avoidKeyboard`, `returnKeyType` y foco encadenado (`setFocus`), `autoComplete`/`textContentType` por campo.
- **Mock:** `signIn`/`signUp` entran siempre; `verifyResetCode` acepta cualquier código.
