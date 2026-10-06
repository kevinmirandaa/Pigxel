import { Controller, type Control, type FieldValues, type Path } from 'react-hook-form';

import { PillInput, type PillInputProps } from '@/design-system';

type Props<T extends FieldValues> = {
  control: Control<T>;
  name: Path<T>;
} & Omit<PillInputProps, 'value' | 'onChangeText' | 'onBlur' | 'ref' | 'error' | 'variant'>;

/** Campo de formulario de auth: `PillInput` gris sobre fondo blanco enlazado a react-hook-form (valor, error y foco encadenado). */
export function AuthField<T extends FieldValues>({ control, name, ...input }: Props<T>) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <PillInput
          {...input}
          variant="auth"
          ref={field.ref}
          value={String(field.value ?? '')}
          onChangeText={field.onChange}
          onBlur={field.onBlur}
          error={fieldState.error?.message}
        />
      )}
    />
  );
}
