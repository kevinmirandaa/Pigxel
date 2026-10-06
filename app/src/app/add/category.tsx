// design-spec: app-screens/add-categoria.png · screens/add-categoria.png
import { useForm } from 'react-hook-form';

import { EmojiField, FormField, FormScreen, useFinishForm, zodFormResolver } from '@/core/forms';
import { createCategorySchema, useCreateCategory } from '@/features/categories';

interface Form {
  icon: string;
  name: string;
}

export default function NewCategoryScreen() {
  const finish = useFinishForm();
  const create = useCreateCategory();
  const { control, handleSubmit } = useForm<Form>({
    resolver: zodFormResolver<Form>(createCategorySchema),
    defaultValues: { icon: '', name: '' },
  });
  const submit = handleSubmit((v) =>
    create.mutate(createCategorySchema.parse(v), { onSuccess: finish }),
  );

  return (
    <FormScreen
      title="Nueva categoría"
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
        returnKeyType="done"
        onSubmitEditing={submit}
      />
    </FormScreen>
  );
}
