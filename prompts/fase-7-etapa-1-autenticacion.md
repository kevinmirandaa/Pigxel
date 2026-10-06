# Fase 7 · Etapa 1: pantallas de entrada (autenticación)

Lee primero `prompts/fase-7-protocolo-pantallas.md` y síguelo íntegro. Requisito: etapa 7.0 terminada (componentes y galería).

## Pantallas del lote (8) · captura de referencia en `design-spec/app-screens/` y `screens/`
| Ruta | Captura | Qué hace |
|---|---|---|
| `src/app/index.tsx` | `auth-splash` | Fondo blanco, logo pixelado centrado (medidas del XML, nodo 1:3). Se muestra mientras carga la sesión (mínimo ~700 ms para no parpadear) y redirige a Tabs si hay sesión o a `welcome` si no. Conserva el acceso dev a la galería solo en `__DEV__`. |
| `(auth)/welcome` | `auth-bienvenida` | Fondo `assets/backgrounds/welcome-bg.png` a pantalla completa con `cover` (en el Figma mide 409×883 desde (-4,-5)). Título 40 Bold en tres tonos: "Todo tu panorama " negro, "financiero" `#5E5E5F`, " en un solo lugar." `#AFAFAF`. Botón negro "Crear cuenta" (300×60, radio 50) → `sign-up`. Botón de vidrio "Iniciar sesión" con el ícono "@" → `sign-in`. |
| `(auth)/sign-up` | `auth-crear-cuenta` | Botón atrás de vidrio, título "Crear cuenta", subtítulo, 4 campos (Nombre, Correo electrónico, Contraseña, Confirmar contraseña con sus íconos), botón negro "Crear cuenta →", pie "¿Ya tienes una cuenta? **Iniciar sesión**". |
| `(auth)/sign-in` | `auth-iniciar-sesion` | Título "Iniciar sesión" (el Figma dice "Iniciar Sesión"; se normaliza a minúscula y se anota), campos Correo y Contraseña (ojo para mostrar/ocultar), enlace "Olvidé mi contraseña" alineado a la derecha, botón "Iniciar sesión →", pie "¿No tienes cuenta? **Crear cuenta**". |
| `(auth)/forgot-password` | `auth-recuperar-contrasena` | Campo de correo, botón "Enviar enlace →". |
| `(auth)/verify-code` | `auth-codigo-verificacion` | Código de 6 dígitos (`OtpInput`), botón "Continuar →", pie "¿No recibiste el código? **Reenviar en 00:59**" con cuenta regresiva de 59 s; al llegar a 0 pasa a "**Reenviar**" y vuelve a pedir el código. |
| `(auth)/new-password` | `auth-nueva-contrasena` | Campos "Nueva contraseña" y "Confirmar contraseña", botón "Continuar →". |
| `src/app/+not-found.tsx` | `error-404` | "Error 404" + "La aplicación no responde", botón atrás de vidrio que vuelve al inicio. |

Fondo de las pantallas de auth: **blanco** (no gris), campos `#F0F0F0` con borde `#EAEAEA`, según `docs/measurements.md`.

## Comportamiento y datos (repositorio `auth`)
- **Registro:** esquema zod en `src/features/auth/schemas`: nombre ≥ 2 caracteres (recortado), correo válido, contraseña ≥ 8 con al menos una letra y un número, confirmación igual. Mensajes en español bajo el campo. Envía `auth.signUp({ name, email, password })`. Éxito → el guard de sesión redirige a Tabs sin pasos extra (la confirmación de correo está apagada). Errores del repositorio (correo repetido, red, etc.) se muestran bajo el botón; el botón muestra estado de carga y no permite doble envío.
- **Inicio de sesión:** `auth.signIn`. "Correo o contraseña incorrectos" bajo el botón. Con `mock` entra siempre.
- **Recuperar:** `auth.requestPasswordReset(email)` y navega a `verify-code` pasando el correo. *Nota:* el correo por defecto de Supabase no trae código (ver `prompts/pendientes-futuros.md`); el flujo debe quedar completo en UI y cableado, y fallar con elegancia si el código no llega ("Código incorrecto o vencido"). No intentes arreglar el correo.
- **Código:** `auth.verifyResetCode({email, code})` → éxito navega a `new-password`. Reenviar reutiliza `requestPasswordReset`. Pegar el código completo en la primera casilla lo reparte; borrar retrocede.
- **Nueva contraseña:** mismas reglas que el registro; `auth.updatePassword` → éxito: vuelve a `sign-in` con un mensaje breve "Contraseña actualizada".
- Navegación: `(auth)/_layout` como Stack sin encabezado nativo, gesto de volver activo, animación estándar de iOS. El botón atrás de vidrio usa `router.back()` (o `welcome` si no hay historial).
- `sign-up` y `sign-in` ofrecen alternar entre sí con `router.replace` (no apilar).

## Herramienta de revisión (solo `__DEV__`)
Crea `src/app/_dev/screens.tsx`: índice de **todas las rutas del proyecto** (las 36) agrupadas por flujo, con enlace directo a cada una y marca "pendiente" en las que aún sean un stub (mantén una lista simple de pantallas implementadas en un archivo `src/app/_dev/screens-status.ts`, que cada lote actualiza). Enlázala desde el lanzador dev que ya existe. Sirve para revisar cualquier pantalla en Expo Go sin recorrer los flujos.

## Pruebas
Unitarias de los esquemas de registro, inicio de sesión y nueva contraseña (casos válidos e inválidos, bordes de longitud, espacios), del temporizador de reenvío (lógica pura, 59 → 0) y del parseo del código OTP. Una prueba de integración nueva `scripts/test-auth-flow.ts` contra Supabase: registro → cierre → inicio → cambio de contraseña con los mismos repositorios que usa la UI (usuario `@pigxel-test.dev`).

## Resumen final
Formato del protocolo (a–g). En (g) incluye: cómo cambiar `.env` a `EXPO_PUBLIC_DATA_SOURCE=supabase` para probar el registro real, y qué comprobar en cada una de las 8 pantallas.
