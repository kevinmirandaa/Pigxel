import { Controller, type Control, type FieldValues, type Path } from 'react-hook-form';
import { View } from 'react-native';

import { PillInput, Text, colors, type PillInputProps } from '@/design-system';
import { EmojiPickerButton } from '@/design-system';
import { formatAmountInput, sanitizeAmountDigits } from '@/lib/amountInput';

type FieldProps<T extends FieldValues> = {
  control: Control<T>;
  name: Path<T>;
} & Omit<PillInputProps, 'value' | 'onChangeText' | 'onBlur' | 'ref' | 'error' | 'variant'>;

/** Campo de formulario (píldora blanca) enlazado a react-hook-form: valor, error y foco encadenado. */
export function FormField<T extends FieldValues>({ control, name, ...input }: FieldProps<T>) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <PillInput
          {...input}
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

/** Monto en colones: guarda solo dígitos y muestra "¢700.000" con separador de miles en vivo. */
export function MoneyField<T extends FieldValues>({ control, name, ...input }: FieldProps<T>) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <PillInput
          {...input}
          ref={field.ref}
          keyboardType="number-pad"
          value={formatAmountInput(String(field.value ?? ''))}
          onChangeText={(text) => field.onChange(sanitizeAmountDigits(text))}
          onBlur={field.onBlur}
          error={fieldState.error?.message}
        />
      )}
    />
  );
}

/** Disparador de emoji con su mensaje de error debajo. */
export function EmojiField<T extends FieldValues>({
  control,
  name,
}: {
  control: Control<T>;
  name: Path<T>;
}) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <View style={{ alignItems: 'center', gap: 8 }}>
          <EmojiPickerButton value={String(field.value ?? '') || null} onChange={field.onChange} />
          {fieldState.error ? (
            <Text variant="fieldLabel" style={{ color: colors.expense }} accessibilityRole="alert">
              {fieldState.error.message}
            </Text>
          ) : null}
        </View>
      )}
    />
  );
}
