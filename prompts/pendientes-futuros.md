# Pendientes futuros (fuera del MVP del jueves)

## 1. Recuperación de contraseña con código de 6 dígitos (correo)
**Estado:** las 3 pantallas (recuperar, código, nueva contraseña) se construyen idénticas al diseño y están cableadas a Supabase (`resetPasswordForEmail`, `verifyOtp` tipo `recovery`, `updateUser`), pero **el correo por defecto de Supabase solo manda un enlace, no el código**, así que el flujo no se puede completar de punta a punta.

**Cómo completarlo (≈20–30 min):**
1. Supabase → Authentication → Emails → SMTP Settings → configurar un SMTP propio (p. ej. Resend; con su dominio de pruebas solo llega al correo del dueño de la cuenta).
2. Authentication → Email Templates → *Reset Password*: reemplazar el cuerpo por algo como:
   `<h2>Tu código de Pigxel</h2><p>Usa este código para restablecer tu contraseña:</p><h1>{{ .Token }}</h1><p>Si no lo pediste, ignora este correo.</p>`
3. Probar: recuperar → llega el código → verificar → nueva contraseña.

## 2. Eliminar cuenta (pantalla Privacidad)
Requiere una Edge Function con la service role (nunca en la app) que borre el usuario de `auth.users` (las tablas se borran en cascada). Mientras tanto, el botón queda visual.

## 3. Descargar mis datos (pantalla Privacidad)
Edge Function o RPC que exporte cuentas, movimientos, categorías, suscripciones y objetivos del usuario.

## 4. Sincronizar el correo del perfil
`profiles.email` se copia solo al registrarse. Si el usuario cambia su correo (Auth), añadir un trigger que actualice `profiles.email`.

## 5. Traducciones y modo oscuro reales
Las pantallas de Idioma y Apariencia guardan la preferencia pero la app sigue en español claro.

## 6. Notificaciones reales
Hoy la bandeja muestra "Sin notificaciones". No hay tabla ni push.
