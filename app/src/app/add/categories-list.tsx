// design-spec: app-screens/add-lista-categorias.png · screens/add-lista-categorias.png
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
import { useCategories } from '@/features/categories';

export default function CategoriesListScreen() {
  const router = useRouter();
  const categories = useCategories();
  return (
    <Screen scroll>
      <ScreenHeader title="Categorías" onBack={() => goBackOr(router, '/add')} />
      <Content style={styles.list}>
        {categories.isPending ? (
          <ActivityIndicator color={colors.textSecondary} />
        ) : categories.isError ? (
          <InlineMessage>No pudimos cargar tus categorías. Inténtalo de nuevo.</InlineMessage>
        ) : categories.data.length === 0 ? (
          <EmptyState
            icon="notebook-text"
            title="Aún no tienes categorías"
            actionLabel="Agregar categoría"
            onAction={() => router.push('/add/category')}
          />
        ) : (
          categories.data.map((c) => <ListRow key={c.id} emoji={c.icon} title={c.name} />)
        )}
      </Content>
    </Screen>
  );
}

const styles = StyleSheet.create({ list: { marginTop: 28, gap: 8 } });
