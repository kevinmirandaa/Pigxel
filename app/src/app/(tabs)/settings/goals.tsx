// design-spec: app-screens/ajustes-objetivos.png · screens/ajustes-objetivos.png
import { useRouter } from 'expo-router';
import { ActivityIndicator, StyleSheet } from 'react-native';

import { goBackOr } from '@/core/navigation';
import {
  Content,
  EmptyState,
  GlassButton,
  GoalCard,
  InlineMessage,
  Screen,
  ScreenHeader,
  Text,
  colors,
} from '@/design-system';
import { useGoals } from '@/features/goals';
import { formatCurrency } from '@/lib/formatCurrency';
import { useCurrency } from '@/stores';

export default function SettingsGoalsScreen() {
  const router = useRouter();
  const goals = useGoals();
  useCurrency();
  return (
    <Screen scroll tabBar>
      <ScreenHeader
        title="Objetivos"
        onBack={() => goBackOr(router, '/(tabs)/settings')}
        right={
          <GlassButton
            icon="plus"
            accessibilityLabel="Agregar objetivo"
            onPress={() => router.push('/add/goal')}
          />
        }
      />
      <Content style={styles.body}>
        <Text variant="description" tone="secondary">
          Define tus metas y sigue el progreso de tus ahorros.
        </Text>
        {goals.isPending ? (
          <ActivityIndicator color={colors.textSecondary} />
        ) : goals.isError ? (
          <InlineMessage>No pudimos cargar tus objetivos. Inténtalo de nuevo.</InlineMessage>
        ) : goals.data.length === 0 ? (
          <EmptyState icon="target" title="Aún no tienes objetivos" />
        ) : (
          goals.data.map((g) => (
            <GoalCard
              key={g.id}
              emoji={g.icon}
              name={g.name}
              saved={formatCurrency(g.currentAmount)}
              target={formatCurrency(g.targetAmount)}
              percent={g.progressPercent}
            />
          ))
        )}
        <Text variant="description" tone="secondary">
          Los objetivos no transfieren dinero automáticamente. Tu ahorro se registra manualmente.
          Usa + para crear una meta.
        </Text>
      </Content>
    </Screen>
  );
}

const styles = StyleSheet.create({ body: { marginTop: 16, gap: 12 } });
