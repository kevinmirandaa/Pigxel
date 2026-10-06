// design-spec: app-screens/add-suscripcion.png · screens/add-suscripcion.png
import { Controller, useForm } from 'react-hook-form';
import { StyleSheet, View } from 'react-native';

import {
  EmojiField,
  FormField,
  FormScreen,
  MoneyField,
  useFinishForm,
  zodFormResolver,
} from '@/core/forms';
import { Segmented, Text } from '@/design-system';
import {
  PLAN_LABEL,
  createSubscriptionSchema,
  useCreateSubscription,
  type CreateSubscriptionInput,
} from '@/features/subscriptions';

interface Form {
  icon: string;
  name: string;
  cost: string;
  status: CreateSubscriptionInput['status'];
  plan: CreateSubscriptionInput['plan'];
}

const STATUS_OPTIONS = [
  { value: 'active', label: 'Activo' },
  { value: 'inactive', label: 'Inactivo' },
] as const;
const PLAN_OPTIONS = (['weekly', 'monthly', 'yearly'] as const).map((value) => ({
  value,
  label: PLAN_LABEL[value],
}));

export default function NewSubscriptionScreen() {
  const finish = useFinishForm();
  const create = useCreateSubscription();
  const { control, handleSubmit, setFocus } = useForm<Form>({
    resolver: zodFormResolver<Form>(createSubscriptionSchema),
    defaultValues: { icon: '', name: '', cost: '', status: 'active', plan: 'monthly' },
  });
  const submit = handleSubmit((v) =>
    create.mutate(createSubscriptionSchema.parse(v), { onSuccess: finish }),
  );

  return (
    <FormScreen
      title="Nueva suscripción"
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
        onSubmitEditing={() => setFocus('cost')}
      />
      <MoneyField control={control} name="cost" placeholder="Costo" returnKeyType="done" />
      <View style={styles.group}>
        <Text variant="label" tone="secondary">
          Estado
        </Text>
        <Controller
          control={control}
          name="status"
          render={({ field }) => (
            <Segmented
              fullWidth
              options={STATUS_OPTIONS}
              value={field.value}
              onChange={field.onChange}
              accessibilityLabel="Estado"
            />
          )}
        />
      </View>
      <View style={styles.group}>
        <Text variant="label" tone="secondary">
          Plan
        </Text>
        <Controller
          control={control}
          name="plan"
          render={({ field }) => (
            <Segmented
              fullWidth
              options={PLAN_OPTIONS}
              value={field.value}
              onChange={field.onChange}
              accessibilityLabel="Plan"
            />
          )}
        />
      </View>
    </FormScreen>
  );
}

const styles = StyleSheet.create({ group: { gap: 8 } });
