import { z } from 'zod';

import { emailSchema } from '@/lib/validators';

/**
 * Contraseña de registro y de "nueva contraseña": mínimo 8 caracteres, con al menos una letra y un número.
 * (La pantalla Ajustes › Contraseña pide además mayúsculas y minúsculas: schema aparte en settings.)
 */
export const authPasswordSchema = z
  .string()
  .min(8, 'Mínimo 8 caracteres')
  .regex(/[A-Za-z]/, 'Incluye al menos una letra')
  .regex(/\d/, 'Incluye al menos un número');

/** Nombre: recortado, al menos 2 caracteres. */
export const nameSchema = z.string().trim().min(2, 'Ingresa tu nombre (mínimo 2 caracteres)');

const confirmMatches = {
  path: ['confirmPassword'],
  message: 'Las contraseñas no coinciden',
};

export const signUpSchema = z
  .object({
    name: nameSchema,
    email: emailSchema,
    password: authPasswordSchema,
    confirmPassword: z.string().min(1, 'Confirma tu contraseña'),
  })
  .refine((v) => v.password === v.confirmPassword, confirmMatches);

export const signInSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Ingresa tu contraseña'),
});

export const forgotPasswordSchema = z.object({ email: emailSchema });

/** Código de 6 dígitos (auth-codigo-verificacion). */
export const verifyCodeSchema = z.object({
  code: z.string().regex(/^\d{6}$/, 'Ingresa los 6 dígitos'),
});

export const newPasswordSchema = z
  .object({
    password: authPasswordSchema,
    confirmPassword: z.string().min(1, 'Confirma tu contraseña'),
  })
  .refine((v) => v.password === v.confirmPassword, confirmMatches);

export type SignUpInput = z.infer<typeof signUpSchema>;
export type SignInInput = z.infer<typeof signInSchema>;
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;
export type VerifyCodeInput = z.infer<typeof verifyCodeSchema>;
export type NewPasswordInput = z.infer<typeof newPasswordSchema>;
