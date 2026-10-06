// design-spec: app-screens/ajustes-suscripciones.png · screens/ajustes-suscripciones.png
import { useRouter } from 'expo-router';
import { ActivityIndicator, StyleSheet } from 'react-native';

import { goBackOr } from '@/core/navigation';
import {
  Content,
  EmptyState,
  GlassButton,
  InlineMessage,
  Screen,
  ScreenHeader,
  SubscriptionCard,
  Text,
  colors,
} from '@/design-system';
import { PLAN_LABEL, useSubscriptions } from '@/features/subscriptions';
import { formatShortDate } from '@/lib/dates';
import { formatCurrency } from '@/lib/formatCurrency';
import { parseLocalDate } from '@/lib/planPeriod';
import { useCurrency } from '@/stores';

export default function SettingsSubscriptionsScreen() {
  const router = useRouter();
  const subscriptions = useSubscriptions();
  useCurrency();
  return (
    <Screen scroll tabBar>
      <ScreenHeader
        title="Suscripciones"
        onBack={() => goBackOr(router, '/(tabs)/settings')}
        right={
          <GlassButton
            icon="plus"
            accessibilityLabel="Agregar suscripción"
            onPress={() => router.push('/add/subscription')}
          />
        }
      />
      <Content style={styles.body}>
        <Text variant="description" tone="secondary">
          Lleva el registro de tus pagos periódicos y sus próximas fechas.
        </Text>
        {subscriptions.isPending ? (
          <ActivityIndicator color={colors.textSecondary} />
        ) : subscriptions.isError ? (
          <InlineMessage>No pudimos cargar tus suscripciones. Inténtalo de nuevo.</InlineMessage>
        ) : subscriptions.data.length === 0 ? (
          <EmptyState icon="credit-card" title="Aún no tienes suscripciones" />
        ) : (
          subscriptions.data.map((s) => (
            <SubscriptionCard
              key={s.id}
              emoji={s.icon}
              name={s.name}
              cost={formatCurrency(s.cost)}
              plan={PLAN_LABEL[s.plan]}
              nextDate={`Próxima fecha: ${formatShortDate(parseLocalDate(s.nextChargeAt))}`}
              inactive={s.status === 'inactive'}
            />
          ))
        )}
        <Text variant="description" tone="secondary">
          Las suscripciones no se cobran automáticamente. Usa + para agregar una.
        </Text>
      </Content>
    </Screen>
  );
}

const styles = StyleSheet.create({ body: { marginTop: 16, gap: 12 } });
