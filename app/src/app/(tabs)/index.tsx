// design-spec: app-screens/tab-cuentas.png · tab-cuentas-objetivos.png
import { useCurrency } from '@/stores';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, RefreshControl, StyleSheet, View } from 'react-native';

import {
  Content,
  EmptyState,
  GlassButton,
  GoalRow,
  HeaderActions,
  InlineMessage,
  ListRow,
  Screen,
  ScreenHeader,
  SectionTitle,
  TabsUnderline,
  Text,
  colors,
} from '@/design-system';
import { useHomeSummary } from '@/features/accounts';
import { PLAN_LABEL } from '@/features/subscriptions';
import { signedAmount, transactionSubtitle } from '@/features/transactions';
import { formatCurrency } from '@/lib/formatCurrency';

type Mode = 'accounts' | 'goals';
const MODES = [
  { value: 'accounts', label: 'Cuentas' },
  { value: 'goals', label: 'Objetivos' },
] as const;

/**
 * Cuentas: saldo total, accesos rápidos (Ingreso / Gasto / Consulta) y dos modos —Cuentas (cuentas, recientes y
 * suscripciones) y Objetivos—. Datos de `useHomeSummary` (saldo = suma real de las cuentas). Las filas no navegan.
 */
export default function AccountsScreen() {
  useCurrency();
  const router = useRouter();
  const [mode, setMode] = useState<Mode>('accounts');
  const [refreshing, setRefreshing] = useState(false);
  const summary = useHomeSummary();
  const data = summary.data;

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await summary.refetch();
    } finally {
      setRefreshing(false);
    }
  };

  const hasAnything = data
    ? data.accounts.length + data.recent.length + data.subscriptions.length > 0
    : false;

  return (
    <Screen
      scroll
      tabBar
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      <ScreenHeader
        variant="tab"
        title="Pigxel"
        right={
          <HeaderActions>
            <GlassButton
              icon="bell-dot"
              accessibilityLabel="Notificaciones"
              onPress={() => router.push('/notifications')}
            />
            <GlassButton
              icon="plus"
              accessibilityLabel="Agregar"
              onPress={() => router.push('/add')}
            />
          </HeaderActions>
        }
      />

      <Content style={styles.balance}>
        <Text
          variant="display"
          adjustsFontSizeToFit
          numberOfLines={1}
          allowFontScaling={false}
          style={[styles.center, !data && { color: colors.textPlaceholder }]}
          accessibilityLabel={`Saldo total ${formatCurrency(data?.totalBalance ?? 0)}`}
        >
          {formatCurrency(data?.totalBalance ?? 0, { spaced: true })}
        </Text>
        <Text variant="bodyStrong" tone="secondary" style={styles.center}>
          Saldo total
        </Text>
      </Content>

      <Content style={styles.pills}>
        <GlassButton
          fill
          label="Ingreso"
          accessibilityLabel="Agregar ingreso"
          onPress={() => router.push('/add/income')}
        />
        <GlassButton
          fill
          label="Gasto"
          accessibilityLabel="Agregar gasto"
          onPress={() => router.push('/add/expense')}
        />
        <GlassButton
          fill
          label="Consulta"
          accessibilityLabel="Consultar una compra"
          onPress={() => router.push('/consult')}
        />
      </Content>

      <View style={styles.tabs}>
        <TabsUnderline items={MODES} value={mode} onChange={setMode} />
      </View>

      <Content style={styles.sections}>
        {summary.isPending ? (
          <ActivityIndicator color={colors.textSecondary} style={styles.loading} />
        ) : summary.isError ? (
          <InlineMessage>
            No pudimos cargar tus datos. Desliza hacia abajo para reintentar.
          </InlineMessage>
        ) : mode === 'accounts' ? (
          hasAnything && data ? (
            <>
              {data.accounts.length > 0 ? (
                <View style={styles.list}>
                  {data.accounts.map((a) => (
                    <ListRow
                      key={a.id}
                      emoji={a.icon}
                      title={a.name}
                      subtitle={a.description ?? undefined}
                      trailing={formatCurrency(a.balance)}
                      trailingTone={a.balance < 0 ? 'expense' : 'primary'}
                    />
                  ))}
                </View>
              ) : null}
              {data.recent.length > 0 ? (
                <View style={styles.section}>
                  <SectionTitle>Recientes</SectionTitle>
                  <View style={styles.list}>
                    {data.recent.map((t) => (
                      <ListRow
                        key={t.id}
                        emoji={t.icon}
                        title={t.title}
                        subtitle={transactionSubtitle(t)}
                        trailing={formatCurrency(signedAmount(t), { showPlus: true })}
                        trailingTone={t.type === 'income' ? 'income' : 'expense'}
                      />
                    ))}
                  </View>
                </View>
              ) : null}
              {data.subscriptions.length > 0 ? (
                <View style={styles.section}>
                  <SectionTitle>Suscripciones</SectionTitle>
                  <View style={styles.list}>
                    {data.subscriptions.map((s) => (
                      <ListRow
                        key={s.id}
                        emoji={s.icon}
                        title={s.name}
                        subtitle={
                          s.status === 'inactive'
                            ? `${PLAN_LABEL[s.plan]} · Inactiva`
                            : PLAN_LABEL[s.plan]
                        }
                        trailing={formatCurrency(s.cost)}
                      />
                    ))}
                  </View>
                </View>
              ) : null}
            </>
          ) : (
            <EmptyState
              icon="wallet"
              title="Aún no tienes cuentas"
              actionLabel="Agregar cuenta"
              onAction={() => router.push('/add/account')}
            />
          )
        ) : data && data.goals.length > 0 ? (
          <View style={styles.list}>
            {data.goals.map((g) => (
              <GoalRow
                key={g.id}
                emoji={g.icon}
                name={g.name}
                saved={formatCurrency(g.currentAmount)}
                target={formatCurrency(g.targetAmount)}
              />
            ))}
          </View>
        ) : (
          <EmptyState
            icon="target"
            title="Aún no tienes objetivos"
            actionLabel="Agregar objetivo"
            onAction={() => router.push('/add/goal')}
          />
        )}
      </Content>
    </Screen>
  );
}

const styles = StyleSheet.create({
  center: { textAlign: 'center' },
  // Normalizado (Figma: saldo en y=124, "Saldo total" en 220, píldoras en 265, pestañas en 352, tarjetas en 413).
  balance: { marginTop: 28, gap: 4 },
  pills: { marginTop: 24, flexDirection: 'row', gap: 10 },
  tabs: { marginTop: 24 },
  sections: { marginTop: 8, gap: 28 },
  section: { gap: 12 },
  list: { gap: 8 },
  loading: { marginTop: 32 },
});
