/** Índice de las 36 pantallas del Figma → ruta de la app, agrupadas por flujo (herramienta de revisión en desarrollo). */
export interface ScreenEntry {
  /** Nombre de la captura en design-spec/app-screens (sin extensión). */
  key: string;
  title: string;
  href: string;
  /** Requiere sesión iniciada (las rutas de la app están protegidas). */
  protectedRoute?: boolean;
  note?: string;
}

export interface ScreenGroup {
  title: string;
  screens: ScreenEntry[];
}

const s = (
  key: string,
  title: string,
  href: string,
  protectedRoute = false,
  note?: string,
): ScreenEntry => ({ key, title, href, protectedRoute, note });

export const SCREEN_GROUPS: ScreenGroup[] = [
  {
    title: 'Entrada',
    screens: [
      s('auth-splash', 'Splash', '/'),
      s('auth-bienvenida', 'Bienvenida', '/(auth)/welcome'),
      s('auth-crear-cuenta', 'Crear cuenta', '/(auth)/sign-up'),
      s('auth-iniciar-sesion', 'Iniciar sesión', '/(auth)/sign-in'),
      s('auth-recuperar-contrasena', 'Recuperar contraseña', '/(auth)/forgot-password'),
      s('auth-codigo-verificacion', 'Código de verificación', '/(auth)/verify-code'),
      s('auth-nueva-contrasena', 'Nueva contraseña', '/(auth)/new-password'),
      s('error-404', 'Error 404', '/_dev/ruta-que-no-existe', false, 'Abre una ruta inexistente'),
    ],
  },
  {
    title: 'Pestañas',
    screens: [
      s('tab-cuentas', 'Cuentas', '/(tabs)', true),
      s(
        'tab-cuentas-objetivos',
        'Cuentas · Objetivos',
        '/(tabs)',
        true,
        'Misma ruta, pestaña Objetivos',
      ),
      s('tab-actividad', 'Actividad', '/(tabs)/activity', true),
      s('tab-ajustes', 'Ajustes', '/(tabs)/settings', true),
    ],
  },
  {
    title: 'Agregar',
    screens: [
      s('add-menu', 'Agregar', '/add', true),
      s('add-lista-cuentas', 'Cuentas (lista)', '/add/accounts-list', true),
      s('add-lista-categorias', 'Categorías (lista)', '/add/categories-list', true),
      s('add-cuenta', 'Nueva cuenta', '/add/account', true),
      s('add-categoria', 'Nueva categoría', '/add/category', true),
      s('add-suscripcion', 'Nueva suscripción', '/add/subscription', true),
      s('add-objetivo', 'Nuevo objetivo', '/add/goal', true),
      s('add-ingreso', 'Agregar ingreso', '/add/income', true),
      s('add-gasto', 'Agregar gasto', '/add/expense', true),
    ],
  },
  {
    title: 'Consulta y avisos',
    screens: [
      s('consultar', 'Consultar', '/consult', true),
      s('notificaciones', 'Notificaciones', '/notifications', true),
    ],
  },
  {
    title: 'Ajustes (detalle)',
    screens: [
      s('ajustes-informacion-personal', 'Información personal', '/(tabs)/settings/profile', true),
      s('ajustes-correo', 'Correo electrónico', '/(tabs)/settings/email', true),
      s('ajustes-contrasena', 'Contraseña', '/(tabs)/settings/password', true),
      s('ajustes-moneda', 'Moneda', '/(tabs)/settings/currency', true),
      s('ajustes-limite', 'Límite', '/(tabs)/settings/limit', true),
      s('ajustes-categorias', 'Categorías', '/(tabs)/settings/categories', true),
      s('ajustes-suscripciones', 'Suscripciones', '/(tabs)/settings/subscriptions', true),
      s('ajustes-objetivos', 'Objetivos', '/(tabs)/settings/goals', true),
      s('ajustes-notificaciones', 'Notificaciones', '/(tabs)/settings/notifications', true),
      s('ajustes-apariencia', 'Apariencia', '/(tabs)/settings/appearance', true),
      s('ajustes-idioma', 'Idioma', '/(tabs)/settings/language', true),
      s('ajustes-privacidad', 'Privacidad', '/(tabs)/settings/privacy', true),
      s('ajustes-ayuda', 'Ayuda', '/(tabs)/settings/help', true),
    ],
  },
];

export const ALL_SCREENS: ScreenEntry[] = SCREEN_GROUPS.flatMap((g) => g.screens);
