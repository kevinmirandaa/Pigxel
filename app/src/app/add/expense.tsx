// design-spec: app-screens/add-gasto.png · screens/add-gasto.png
import { useLocalSearchParams } from 'expo-router';

import { TransactionForm } from '@/features/transactions';

/** `?amount=700000` llega desde Consultar ("Crear gasto"): solo precarga el monto, no envía nada. */
export default function AddExpenseScreen() {
  const { amount } = useLocalSearchParams<{ amount?: string }>();
  return <TransactionForm type="expense" initialAmount={amount?.replace(/\D/g, '')} />;
}
