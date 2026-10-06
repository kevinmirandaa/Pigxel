/** Código de verificación (OTP). Sin dependencias de React Native. */
export const OTP_LENGTH = 6;

/**
 * Normaliza lo escrito o pegado en el campo del código: solo dígitos, máximo `length`.
 * Pegar "123 456" o "Tu código es 123456" deja "123456"; borrar un carácter retrocede una casilla.
 */
export function parseOtpInput(input: string, length: number = OTP_LENGTH): string {
  return (input ?? '').replace(/\D/g, '').slice(0, length);
}

export const isOtpComplete = (value: string, length: number = OTP_LENGTH): boolean =>
  new RegExp(`^\\d{${length}}$`).test(value);
