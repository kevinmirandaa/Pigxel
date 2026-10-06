/**
 * Pantallas ya construidas (nombre de la captura en design-spec/app-screens). CADA LOTE ACTUALIZA ESTA LISTA.
 * Las que no están aquí se muestran como "pendiente" (siguen siendo un stub) en el índice de desarrollo.
 * (Vive en core/dev y no en src/app/_dev porque expo-router trata cada archivo de src/app como una ruta.)
 */
export const IMPLEMENTED_SCREENS: ReadonlySet<string> = new Set([
  // Lote 7.1 · autenticación
  'auth-splash',
  'auth-bienvenida',
  'auth-crear-cuenta',
  'auth-iniciar-sesion',
  'auth-recuperar-contrasena',
  'auth-codigo-verificacion',
  'auth-nueva-contrasena',
  'error-404',
  // Lote 7.2 · pestañas
  'tab-cuentas',
  'tab-cuentas-objetivos',
  'tab-actividad',
  'tab-ajustes',
  // Lote 7.3 · agregar, consultar, notificaciones
  'add-menu',
  'add-lista-cuentas',
  'add-lista-categorias',
  'add-cuenta',
  'add-categoria',
  'add-suscripcion',
  'add-objetivo',
  'add-ingreso',
  'add-gasto',
  'consultar',
  'notificaciones',
  // Lote 7.4 · ajustes con datos
  'ajustes-informacion-personal',
  'ajustes-correo',
  'ajustes-contrasena',
  'ajustes-moneda',
  'ajustes-limite',
  'ajustes-categorias',
  'ajustes-suscripciones',
  'ajustes-objetivos',
  // Lote 7.5 · ajustes de la app
  'ajustes-notificaciones',
  'ajustes-apariencia',
  'ajustes-idioma',
  'ajustes-privacidad',
  'ajustes-ayuda',
]);

export const isImplemented = (key: string): boolean => IMPLEMENTED_SCREENS.has(key);
