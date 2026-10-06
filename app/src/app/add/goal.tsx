// design-spec: app-screens/add-objetivo.png · screens/add-objetivo.png
import { useForm } from 'react-hook-form';

import {
  EmojiField,
  FormField,
  FormScreen,
  MoneyField,
  useFinishForm,
  zodFormResolver,
} from '@/core/forms';
import { createGoalSchema, useCreateGoal } from '@/features/goals';

interface Form {
  icon: string;
  name: string;
  targetAmount: string;
  initialAmount: string;
}

export default function NewGoalScreen() {
  const finish = useFinishForm();
  const create = useCreateGoal();
  const { control, handleSubmit, setFocus } = useForm<Form>({
    resolver: zodFormResolver<Form>(createGoalSchema),
    defaultValues: { icon: '', name: '', targetAmount: '', initialAmount: '' },
  });
  const submit = handleSubmit((v) =>
    create.mutate(createGoalSchema.parse(v), { onSuccess: finish }),
  );

  return (
    <FormScreen
      title="Nuevo objetivo"
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
        onSubmitEditing={() => setFocus('targetAmount')}
      />
      <MoneyField
        control={control}
        name="targetAmount"
        placeholder="Monto objetivo"
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
