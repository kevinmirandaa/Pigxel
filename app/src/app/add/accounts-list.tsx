// design-spec: app-screens/add-lista-cuentas.png · screens/add-lista-cuentas.png
import { useRouter } from 'expo-router';
import { ActivityIndicator, StyleSheet } from 'react-native';

import { goBackOr } from '@/core/navigation';
import {
  Content,
  EmptyState,
  InlineMessage,
  ListRow,
  Screen,
  ScreenHeader,
  colors,
} from '@/design-system';
import { useAccounts } from '@/features/accounts';

export default function AccountsListScreen() {
  const router = useRouter();
  const accounts = useAccounts();
  return (
    <Screen scroll>
      <ScreenHeader title="Cuentas" onBack={() => goBackOr(router, '/add')} />
      <Content style={styles.list}>
        {accounts.isPending ? (
          <ActivityIndicator color={colors.textSecondary} />
        ) : accounts.isError ? (
          <InlineMessage>No pudimos cargar tus cuentas. Inténtalo de nuevo.</InlineMessage>
        ) : accounts.data.length === 0 ? (
          <EmptyState
            icon="piggy-bank"
            title="Aún no tienes cuentas"
            actionLabel="Agregar cuenta"
            onAction={() => router.push('/add/account')}
          />
        ) : (
          accounts.data.map((a) => <ListRow key={a.id} emoji={a.icon} title={a.name} />)
        )}
      </Content>
    </Screen>
  );
}

const styles = StyleSheet.create({ list: { marginTop: 28, gap: 8 } });
