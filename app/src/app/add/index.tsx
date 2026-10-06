// design-spec: app-screens/add-menu.png · screens/add-menu.png
import { useRouter, type Href } from 'expo-router';
import { StyleSheet } from 'react-native';

import { goBackOr } from '@/core/navigation';
import {
  AddMenuRow,
  Content,
  Screen,
  ScreenHeader,
  colors,
  type LucideName,
} from '@/design-system';

interface Item {
  title: string;
  icon: LucideName;
  tint: string;
  list: Href;
  form: Href;
  addLabel: string;
}

const ITEMS: Item[] = [
  {
    title: 'Cuenta',
    icon: 'piggy-bank',
    tint: colors.addPiggy,
    list: '/add/accounts-list',
    form: '/add/account',
    addLabel: 'Agregar cuenta',
  },
  {
    title: 'Categoría',
    icon: 'notebook-text',
    tint: colors.addNotebook,
    list: '/add/categories-list',
    form: '/add/category',
    addLabel: 'Agregar categoría',
  },
  {
    title: 'Suscripción',
    icon: 'credit-card',
    tint: colors.addCard,
    list: '/(tabs)/settings/subscriptions',
    form: '/add/subscription',
    addLabel: 'Agregar suscripción',
  },
  {
    title: 'Objetivo',
    icon: 'target',
    tint: colors.expense,
    list: '/(tabs)/settings/goals',
    form: '/add/goal',
    addLabel: 'Agregar objetivo',
  },
];

/** Menú Agregar: el cuerpo de cada fila abre su lista y el "+" abre el formulario. */
export default function AddMenuScreen() {
  const router = useRouter();
  return (
    <Screen scroll>
      <ScreenHeader title="Agregar" onBack={() => goBackOr(router, '/(tabs)')} />
      <Content style={styles.list}>
        {ITEMS.map((item) => (
          <AddMenuRow
            key={item.title}
            title={item.title}
            icon={item.icon}
            tint={item.tint}
            addLabel={item.addLabel}
            onPress={() => router.push(item.list)}
            onAdd={() => router.push(item.form)}
          />
        ))}
      </Content>
    </Screen>
  );
}

const styles = StyleSheet.create({ list: { marginTop: 28, gap: 8 } });
