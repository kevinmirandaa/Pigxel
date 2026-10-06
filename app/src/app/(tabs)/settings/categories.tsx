// design-spec: app-screens/ajustes-categorias.png · screens/ajustes-categorias.png
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
  SettingsGroup,
  SettingsRow,
  Text,
  colors,
} from '@/design-system';
import { useCategories } from '@/features/categories';

export default function SettingsCategoriesScreen() {
  const router = useRouter();
  const categories = useCategories();
  return (
    <Screen scroll tabBar>
      <ScreenHeader
        title="Categorías"
        onBack={() => goBackOr(router, '/(tabs)/settings')}
        right={
          <GlassButton
            icon="plus"
            accessibilityLabel="Agregar categoría"
            onPress={() => router.push('/add/category')}
          />
        }
      />
      <Content style={styles.body}>
        <Text variant="description" tone="secondary">
          Organiza tus gastos e ingresos en categorías personales.
        </Text>
        {categories.isPending ? (
          <ActivityIndicator color={colors.textSecondary} />
        ) : categories.isError ? (
          <InlineMessage>No pudimos cargar tus categorías. Inténtalo de nuevo.</InlineMessage>
        ) : categories.data.length === 0 ? (
          <EmptyState icon="notebook-text" title="Aún no tienes categorías" />
        ) : (
          <SettingsGroup>
            {categories.data.map((c) => (
              <SettingsRow key={c.id} emoji={c.icon} title={c.name} trailing="none" />
            ))}
          </SettingsGroup>
        )}
        <Text variant="description" tone="secondary">
          Usa + para crear una categoría.
        </Text>
      </Content>
    </Screen>
  );
}

const styles = StyleSheet.create({ body: { marginTop: 16, gap: 16 } });
