// design-spec: app-screens/add-cuenta.png · screens/add-cuenta.png
import { useForm } from 'react-hook-form';

import {
  EmojiField,
  FormField,
  FormScreen,
  MoneyField,
  useFinishForm,
  zodFormResolver,
} from '@/core/forms';
import { createAccountSchema, useCreateAccount } from '@/features/accounts';

interface Form {
  icon: string;
  name: string;
  initialAmount: string;
}

export default function NewAccountScreen() {
  const finish = useFinishForm();
  const create = useCreateAccount();
  const { control, handleSubmit, setFocus } = useForm<Form>({
    resolver: zodFormResolver<Form>(createAccountSchema),
    defaultValues: { icon: '', name: '', initialAmount: '' },
  });
  const submit = handleSubmit((v) =>
    create.mutate(createAccountSchema.parse(v), { onSuccess: finish }),
  );

  return (
    <FormScreen
      title="Nueva cuenta"
      submitLabel="Crear"
      onSubmit={submit}
      loading={create.isPending}
      error={create.error?.message}
    >
      <EmojiField control={control} name="icon" />
      <FormField
        control={control}
        name="name"
        placeholder="Nombre"
        maxLength={60}
        autoCapitalize="sentences"
        returnKeyType="next"
        onSubmitEditing={() => setFocus('initialAmount')}
      />
      <MoneyField
        control={control}
        name="initialAmount"
        placeholder="Monto inicial"
        returnKeyType="done"
        onSubmitEditing={submit}
      />
    </FormScreen>
  );
}
