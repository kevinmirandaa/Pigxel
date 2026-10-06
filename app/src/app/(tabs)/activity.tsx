// design-spec: app-screens/tab-actividad.png · screens/tab-actividad.png
import { useCurrency } from '@/stores';
import { useQueryClient } from '@tanstack/react-query';
import { useMemo, useState } from 'react';
import { ActivityIndicator, RefreshControl, StyleSheet, View } from 'react-native';

import { useDebouncedValue } from '@/core/useDebouncedValue';
import {
  Content,
  EmptyState,
  GlassButton,
  LineChart,
  ListRow,
  Screen,
  ScreenHeader,
  SearchField,
  SectionTitle,
  Segmented,
  SelectionSheet,
  Text,
  colors,
  type SelectionOption,
} from '@/design-system';
import { useCategories } from '@/features/categories';
import {
  ACTIVITY_MODES,
  MODE_CAPTION,
  NO_CATEGORY,
  activityKeys,
  defaultSelectedDay,
  filterByCategory,
  groupTransactionsByDay,
  signedAmount,
  transactionSubtitle,
  useTransactionList,
  useWeeklyActivity,
  type ActivityMode,
} from '@/features/transactions';
import { formatCurrency } from '@/lib/formatCurrency';

const ALL = '__all__';

/**
 * Actividad: tipo (Gastos / Ingresos / Ambos), total de la semana, gráfica Lun–Dom, búsqueda y movimientos agrupados
 * por día. "Ambos" muestra el BALANCE (ingresos − gastos) y la gráfica con el neto diario (decisión de diseño: el
 * Figma solo dibuja Gastos). El botón de filtro abre la hoja de categorías (filtro local sobre la lista).
 */
export default function ActivityScreen() {
  useCurrency();
  const queryClient = useQueryClient();
  const [mode, setMode] = useState<ActivityMode>('expense');
  const [search, setSearch] = useState('');
  const debounced = useDebouncedValue(search, 250);
  const [categoryId, setCategoryId] = useState<string | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [selectedDay, setSelectedDay] = useState(() => defaultSelectedDay());
  const [refreshing, setRefreshing] = useState(false);

  const weekly = useWeeklyActivity(mode);
  const list = useTransactionList(mode, debounced);
  const categories = useCategories();

  const groups = useMemo(
    () => groupTransactionsByDay(filterByCategory(list.data ?? [], categoryId)),
    [list.data, categoryId],
  );
  const total = weekly.data?.total ?? 0;
  const isBalance = mode === 'both';

  const options: SelectionOption<string>[] = useMemo(
    () => [
      { value: ALL, label: 'Todas' },
      ...(categories.data ?? []).map((c) => ({ value: c.id, label: c.name, emoji: c.icon })),
      { value: NO_CATEGORY, label: 'Sin categoría' },
    ],
    [categories.data],
  );

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await queryClient.invalidateQueries({ queryKey: activityKeys.all });
      await categories.refetch();
    } finally {
      setRefreshing(false);
    }
  };

  return (
    <Screen
      scroll
      tabBar
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      <ScreenHeader
        variant="tab"
        title="Actividad"
        right={
          <GlassButton
            icon="list-filter"
            badge={categoryId !== null}
            accessibilityLabel={
              categoryId !== null ? 'Filtrar por categoría (activo)' : 'Filtrar por categoría'
            }
            onPress={() => setSheetOpen(true)}
          />
        }
      />

      <Content style={styles.body}>
        <Segmented
          options={ACTIVITY_MODES}
          value={mode}
          onChange={setMode}
          accessibilityLabel="Tipo de movimiento"
        />

        <View style={styles.totals}>
          <Text variant="heading" tone="secondary" style={styles.center}>
            {MODE_CAPTION[mode]}
          </Text>
          <Text
            variant="amount"
            adjustsFontSizeToFit
            numberOfLines={1}
            allowFontScaling={false}
            style={[
              styles.center,
              isBalance && total > 0 && { color: colors.income },
              isBalance && total < 0 && { color: colors.expense },
            ]}
          >
            {formatCurrency(total, { spaced: true, showPlus: isBalance })}
          </Text>
        </View>

        <LineChart
          data={weekly.data?.series ?? EMPTY_WEEK}
          selectedIndex={selectedDay}
          onSelectIndex={setSelectedDay}
        />

        <SearchField value={search} onChangeText={setSearch} />

        {list.isPending ? (
          <ActivityIndicator color={colors.textSecondary} style={styles.loading} />
        ) : groups.length === 0 ? (
          <View style={styles.empty}>
            <EmptyState
              icon="search"
              title="Sin movimientos"
              description={
                search.trim() || categoryId !== null
                  ? 'No encontramos movimientos con ese filtro.'
                  : 'Cuando registres ingresos o gastos aparecerán aquí.'
              }
            />
          </View>
        ) : (
          <View style={styles.groups}>
            {groups.map((group) => (
              <View key={group.key} style={styles.group}>
                <SectionTitle size="small">{group.label}</SectionTitle>
                <View style={styles.rows}>
                  {group.items.map((t) => (
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
            ))}
          </View>
        )}
      </Content>

      <SelectionSheet
        visible={sheetOpen}
        title="Filtrar por categoría"
        options={options}
        selected={categoryId ?? ALL}
        onSelect={(value) => setCategoryId(value === ALL ? null : value)}
        onClose={() => setSheetOpen(false)}
      />
    </Screen>
  );
}

/** Mientras carga: semana en cero (la gráfica ya dibuja los ejes). */
const EMPTY_WEEK = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'].map((label) => ({
  label,
  value: 0,
}));

const styles = StyleSheet.create({
  center: { textAlign: 'center' },
  body: { marginTop: 16, gap: 16 },
  totals: { gap: 2, marginTop: 4 },
  groups: { gap: 16, marginTop: 4 },
  group: { gap: 8 },
  rows: { gap: 8 },
  loading: { marginTop: 24 },
  empty: { marginTop: 16 },
});
