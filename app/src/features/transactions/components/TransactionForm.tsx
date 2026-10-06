import { useRouter } from 'expo-router';
import { useCurrency } from '@/stores';
import { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { StyleSheet, View } from 'react-native';

import { FormField, FormScreen, MoneyField, useFinishForm, zodFormResolver } from '@/core/forms';
import {
  PrimaryButton,
  SelectionSheet,
  SelectorRow,
  Text,
  type SelectionOption,
} from '@/design-system';
import { useAccounts } from '@/features/accounts';
import { useCategories } from '@/features/categories';
import { formatCurrency } from '@/lib/formatCurrency';

import { NO_CATEGORY_VALUE, categoryIdFromChoice, resolveAccountId } from '../form';
import { useCreateTransaction } from '../hooks';
import { createTransactionSchema } from '../schemas';

interface Form {
  amount: string;
  title: string;
}

/**
 * Formulario de "Agregar ingreso" y "Agregar gasto": monto, descripción (opcional) y selectores de cuenta
 * (y categoría en gastos). La cuenta por defecto es la primera; sin cuentas se pide crear una antes.
 */
export function TransactionForm({
  type,
  initialAmount,
}: {
  type: 'income' | 'expense';
  /** Monto precargado (viene de Consultar). */
  initialAmount?: string;
}) {
  useCurrency();
  const router = useRouter();
  const finish = useFinishForm();
  const create = useCreateTransaction();
  const accounts = useAccounts();
  const categories = useCategories();
  const [accountChoice, setAccountChoice] = useState<string | null>(null);
  const [categoryChoice, setCategoryChoice] = useState<string | null>(null);
  const [sheet, setSheet] = useState<'account' | 'category' | null>(null);
  const [accountError, setAccountError] = useState<string | null>(null);

  const isExpense = type === 'expense';
  const accountList = useMemo(() => accounts.data ?? [], [accounts.data]);
  const accountId = resolveAccountId(accountList, accountChoice);
  const account = accountList.find((a) => a.id === accountId);
  const category = (categories.data ?? []).find((c) => c.id === categoryChoice);
  const noAccounts = accounts.isSuccess && accountList.length === 0;

  const { control, handleSubmit, setFocus } = useForm<Form>({
    resolver: zodFormResolver<Form>(createTransactionSchema.pick({ amount: true, title: true })),
    defaultValues: { amount: initialAmount ?? '', title: '' },
  });

  const submit = handleSubmit((v) => {
    if (!accountId) {
      setAccountError('Elige una cuenta');
      return;
    }
    const input = createTransactionSchema.parse({
      type,
      amount: v.amount,
      title: v.title,
      accountId,
      categoryId: isExpense ? categoryIdFromChoice(categoryChoice) : null,
    });
    create.mutate(input, { onSuccess: finish });
  });

  const accountOptions: SelectionOption<string>[] = accountList.map((a) => ({
    value: a.id,
    label: a.name,
    emoji: a.icon,
    detail: formatCurrency(a.balance),
  }));
  const categoryOptions: SelectionOption<string>[] = [
    { value: NO_CATEGORY_VALUE, label: 'Sin categoría' },
    ...(categories.data ?? []).map((c) => ({ value: c.id, label: c.name, emoji: c.icon })),
  ];

  return (
    <>
      <FormScreen
        title={isExpense ? 'Agregar gasto' : 'Agregar ingreso'}
        submitLabel="Agregar"
        onSubmit={submit}
        loading={create.isPending}
        disabled={noAccounts}
        error={create.error?.message}
      >
        <MoneyField
          control={control}
          name="amount"
          placeholder="Monto"
          returnKeyType="next"
          onSubmitEditing={() => setFocus('title')}
        />
        <FormField
          control={control}
          name="title"
          placeholder="Descripción"
          maxLength={60}
          autoCapitalize="sentences"
          returnKeyType="done"
        />
        {noAccounts ? (
          <View style={styles.noAccounts}>
            <Text variant="description" tone="secondary" style={{ textAlign: 'center' }}>
              Primero crea una cuenta
            </Text>
            <PrimaryButton
              variant="glass"
              label="Crear cuenta"
              withArrow={false}
              onPress={() => router.push('/add/account')}
            />
          </View>
        ) : (
          <SelectorRow
            label="Cuenta"
            value={account?.name}
            emoji={account?.icon}
            error={accountError ?? undefined}
            onPress={() => setSheet('account')}
          />
        )}
        {isExpense ? (
          <SelectorRow
            label="Categoría"
            value={
              category?.name ?? (categoryChoice === NO_CATEGORY_VALUE ? 'Sin categoría' : undefined)
            }
            emoji={category?.icon}
            onPress={() => setSheet('category')}
          />
        ) : null}
        {accounts.isError ? (
          <Text variant="fieldLabel" tone="secondary">
            No pudimos cargar tus cuentas.
          </Text>
        ) : null}
      </FormScreen>
      <SelectionSheet
        visible={sheet === 'account'}
        title="Cuenta"
        options={accountOptions}
        selected={accountId}
        onSelect={(value) => {
          setAccountChoice(value);
          setAccountError(null);
        }}
        onClose={() => setSheet(null)}
      />
      <SelectionSheet
        visible={sheet === 'category'}
        title="Categoría"
        options={categoryOptions}
        selected={categoryChoice}
        onSelect={setCategoryChoice}
        onClose={() => setSheet(null)}
      />
    </>
  );
}

const styles = StyleSheet.create({ noAccounts: { gap: 12 } });
