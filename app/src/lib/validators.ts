import { z } from 'zod';

import { AMOUNT_MAX } from './amountInput';
import { EMOJI_MAX_LENGTH, validateEmoji } from './emoji';

export const emailSchema = z.string().trim().min(1, 'Ingresa tu correo').email('Correo inválido');

/** Mínimo 8 caracteres, con mayúsculas, minúsculas y números (ver ajustes-contrasena). */
export const passwordSchema = z
  .string()
  .min(8, 'Mínimo 8 caracteres')
  .regex(/[A-Z]/, 'Incluye una mayúscula')
  .regex(/[a-z]/, 'Incluye una minúscula')
  .regex(/[0-9]/, 'Incluye un número');

/** Monto en colones, entero positivo (sin decimales). */
export const amountSchema = z.coerce
  .number({ message: 'Monto inválido' })
  .int('Sin decimales')
  .positive('Debe ser mayor que 0')
  .max(AMOUNT_MAX, 'Monto demasiado grande');

/** Monto que puede ser 0 (monto inicial de cuentas y objetivos; vacío = 0). */
export const initialAmountSchema = z.coerce
  .number({ message: 'Monto inválido' })
  .int('Sin decimales')
  .min(0, 'No puede ser negativo')
  .max(AMOUNT_MAX, 'Monto demasiado grande');

/** Nombre recortado, 1–60 caracteres. */
export const nameSchema = z
  .string()
  .trim()
  .min(1, 'Ingresa un nombre')
  .max(60, 'Máximo 60 caracteres');

/** Ícono de usuario: exactamente 1 emoji (1–16 caracteres; ver lib/emoji.ts). */
export const emojiSchema = z
  .string()
  .min(1, 'Elige un emoji')
  .max(EMOJI_MAX_LENGTH * 2, 'Emoji no válido')
  .refine(validateEmoji, 'Elige un solo emoji');
