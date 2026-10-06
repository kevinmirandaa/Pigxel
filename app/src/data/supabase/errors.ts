/**
 * Traduce errores de Supabase (Auth y PostgREST) a mensajes en español para la UI.
 * Sin dependencias de React Native.
 */
interface SupabaseLikeError {
  code?: string;
  name?: string;
  message?: string;
  status?: number;
}

const BY_CODE: Record<string, string> = {
  // Auth
  invalid_credentials: 'Correo o contraseña incorrectos',
  user_already_exists: 'Ya existe una cuenta con ese correo',
  email_exists: 'Ya existe una cuenta con ese correo',
  weak_password: 'La contraseña es demasiado débil',
  same_password: 'La nueva contraseña debe ser diferente a la actual',
  over_request_rate_limit: 'Demasiados intentos, espera un momento',
  over_email_send_rate_limit: 'Demasiados intentos, espera un momento',
  email_not_confirmed: 'Confirma tu correo antes de iniciar sesión',
  email_address_invalid: 'El correo no es válido',
  validation_failed: 'Revisa los datos ingresados',
  otp_expired: 'El código expiró, solicita uno nuevo',
  signup_disabled: 'El registro está deshabilitado por el momento',
  user_not_found: 'No encontramos una cuenta con ese correo',
  session_not_found: 'Tu sesión expiró, inicia sesión de nuevo',
  refresh_token_not_found: 'Tu sesión expiró, inicia sesión de nuevo',
  // Base de datos
  PGRST116: 'No encontramos esos datos',
  '42501': 'No tienes permiso para realizar esta acción',
  '23505': 'Ese dato ya existe',
  '23503': 'El dato relacionado no existe',
  '23514': 'Algún valor no es válido',
  '23502': 'Falta un dato obligatorio',
  '22P02': 'Algún valor no es válido',
};

const GENERIC = 'Algo salió mal. Intenta de nuevo.';
const OFFLINE = 'Sin conexión. Revisa tu internet e intenta de nuevo.';

/**
 * `overrides` permite que cada repositorio dé un mensaje más preciso para un código
 * (p. ej. 23505 en categorías = "Ya tienes una categoría con ese nombre").
 */
export function toFriendlyError(err: unknown, overrides: Record<string, string> = {}): Error {
  if (err instanceof FriendlyError) return err;
  const e = (err ?? {}) as SupabaseLikeError;

  if (e.code && overrides[e.code]) return new FriendlyError(overrides[e.code] as string);
  if (e.code && BY_CODE[e.code]) return new FriendlyError(BY_CODE[e.code] as string);

  const message = e.message ?? '';
  if (
    e.name === 'AuthRetryableFetchError' ||
    /network request failed|fetch failed|failed to fetch|network error/i.test(message)
  ) {
    return new FriendlyError(OFFLINE);
  }
  if (/auth session missing|not authenticated/i.test(message)) {
    return new FriendlyError(BY_CODE.session_not_found);
  }
  if (e.status === 429) return new FriendlyError(BY_CODE.over_request_rate_limit);
  return new FriendlyError(GENERIC);
}

/** Alias semántico para los repositorios de Auth. */
export const toFriendlyAuthError = toFriendlyError;

/** Error cuyo mensaje ya es apto para mostrar al usuario. */
export class FriendlyError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'FriendlyError';
  }
}

export const DELETE_ACCOUNT_UNAVAILABLE = 'Esta función aún no está disponible';

/** ¿La Edge Function no existe o no se puede alcanzar? (404, o error de red/relé de Functions). */
export function isFunctionUnavailable(error: unknown): boolean {
  const e = error as { name?: string; context?: { status?: number } } | null;
  if (!e) return false;
  return (
    e.context?.status === 404 ||
    e.name === 'FunctionsFetchError' ||
    e.name === 'FunctionsRelayError'
  );
}
