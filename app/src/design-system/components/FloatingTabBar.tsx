import type { ComponentProps } from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { Tabs } from 'expo-router';

import { TabIcon, type TabIconName } from '../icons';
import { Pressable } from '../primitives/Pressable';
import { layout, radii } from '../tokens';
import { GlassSurface } from './GlassSurface';

type TabBarRenderer = NonNullable<ComponentProps<typeof Tabs>['tabBar']>;
export type FloatingTabBarProps = Parameters<TabBarRenderer>[0];

const TABS: Record<string, { icon: TabIconName; label: string }> = {
  index: { icon: 'wallet', label: 'Cuentas' },
  activity: { icon: 'activity', label: 'Actividad' },
  settings: { icon: 'layers', label: 'Ajustes' },
};

const { width: BAR_W, height: BAR_H, activeWidth: ACTIVE_W } = layout.tabBar;
/** Paso entre pestañas: la seleccionada (85) se desplaza 82 pt por pestaña (0 / 82 / 164). */
const STEP = (BAR_W - ACTIVE_W) / 2;

export interface TabBarViewProps {
  activeIndex: number;
  onPressTab: (index: number) => void;
}

/** Barra de vidrio 249×61 (sin posición absoluta): la usa FloatingTabBar y la galería. */
export function TabBarView({ activeIndex, onPressTab }: TabBarViewProps) {
  const tabs = Object.values(TABS);
  return (
    <GlassSurface radius={radii.pill} style={styles.bar}>
      <GlassSurface
        radius={radii.pill}
        variant="active"
        style={[styles.active, { left: activeIndex * STEP }]}
      />
      {tabs.map((tab, i) => {
        const focused = i === activeIndex;
        return (
          <Pressable
            key={tab.label}
            accessibilityRole="tab"
            accessibilityLabel={tab.label}
            accessibilityState={{ selected: focused }}
            haptic={!focused}
            onPress={() => onPressTab(i)}
            style={[styles.item, { left: i * STEP, width: ACTIVE_W }]}
          >
            <TabIcon name={tab.icon} active={focused} />
          </Pressable>
        );
      })}
    </GlassSurface>
  );
}

/**
 * Barra inferior flotante de vidrio (249×61) con 3 pestañas. La pestaña activa es una cápsula de
 * 85×61 con el ícono en negro; las inactivas, en gris `#C1C1C1`. Un solo SVG por ícono (color por prop).
 * Posición: 15 pt sobre el borde inferior (en el Figma, bajo el área del indicador de inicio).
 */
export function FloatingTabBar({ state, navigation }: FloatingTabBarProps) {
  const insets = useSafeAreaInsets();
  const bottom =
    Platform.OS === 'ios' ? layout.tabBar.bottom : Math.max(layout.tabBar.bottom, insets.bottom);
  const visible = state.routes.filter((r) => TABS[r.name]);
  const activeIndex = Math.max(
    0,
    visible.findIndex((r) => r.key === state.routes[state.index]?.key),
  );

  return (
    <View pointerEvents="box-none" style={[styles.wrap, { bottom }]}>
      <TabBarView
        activeIndex={activeIndex}
        onPressTab={(i) => {
          const route = visible[i];
          if (!route) return;
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });
          if (i !== activeIndex && !event.defaultPrevented) navigation.navigate(route.name);
        }}
      />
    </View>
  );
}

/** Nombre previo (compatibilidad con rutas existentes). */
export const TabBar = FloatingTabBar;

const styles = StyleSheet.create({
  wrap: { position: 'absolute', left: 0, right: 0, alignItems: 'center' },
  bar: { width: BAR_W, height: BAR_H },
  active: { position: 'absolute', top: 0, width: ACTIVE_W, height: BAR_H },
  item: {
    position: 'absolute',
    top: 0,
    height: BAR_H,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
