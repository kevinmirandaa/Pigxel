import { z } from 'zod';

import { emailSchema, passwordSchema } from '@/lib/validators';

export const fullNameSchema = z
  .string()
  .trim()
  .min(2, 'Mínimo 2 caracteres')
  .max(60, 'Máximo 60 caracteres');

/** 3–30 caracteres: minúsculas, números, punto y guion bajo. */
export const usernameSchema = z
  .string()
  .trim()
  .min(3, 'Mínimo 3 caracteres')
  .max(30, 'Máximo 30 caracteres')
  .regex(/^[a-z0-9._]+$/, 'Usa minúsculas, números, punto o guion bajo');

/** Opcional: vacío = sin teléfono; si hay, 7–15 dígitos y admite "+" inicial. */
export const phoneSchema = z
  .string()
  .trim()
  .refine((v) => v === '' || /^\+?[\d\s-]+$/.test(v), 'Teléfono no válido')
  .refine((v) => {
    const digits = v.replace(/\D/g, '').length;
    return v === '' || (digits >= 7 && digits <= 15);
  }, 'Debe tener entre 7 y 15 dígitos');

export const profileSchema = z.object({
  fullName: fullNameSchema,
  username: usernameSchema,
  phone: phoneSchema,
});

export const changeEmailSchema = z.object({ email: emailSchema });

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, 'Ingresa tu contraseña actual'),
    newPassword: passwordSchema,
    repeatPassword: z.string(),
  })
  .refine((v) => v.newPassword === v.repeatPassword, {
    path: ['repeatPassword'],
    message: 'Las contraseñas no coinciden',
  });

/** Límite: con el interruptor apagado el monto puede ser 0; encendido, debe ser > 0. */
export const limitSchema = z
  .object({
    enabled: z.boolean(),
    amount: z.coerce
      .number({ message: 'Monto inválido' })
      .int('Sin decimales')
      .min(0)
      .max(999_999_999),
    period: z.enum(['weekly', 'monthly']),
  })
  .refine((l) => !l.enabled || l.amount > 0, {
    path: ['amount'],
    message: 'Debe ser mayor que 0',
  });
