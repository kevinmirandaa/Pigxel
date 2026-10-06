import { StyleSheet, View } from 'react-native';

import type { Emoji } from '@/data';

import { EmojiBadge } from '../primitives/EmojiBadge';
import { Text } from '../primitives/Text';
import { colors, layout } from '../tokens';
import { Card } from './Card';
import { ProgressBar } from './ProgressBar';

export interface SubscriptionCardProps {
  emoji: Emoji;
  name: string;
  /** Costo ya formateado. */
  cost: string;
  plan: string;
  /** "Próxima fecha: 11 oct. 2026" */
  nextDate: string;
  inactive?: boolean;
}

/** Tarjeta de suscripción (Ajustes): emoji, nombre y costo a la derecha, plan y próxima fecha debajo. */
export function SubscriptionCard({
  emoji,
  name,
  cost,
  plan,
  nextDate,
  inactive,
}: SubscriptionCardProps) {
  return (
    <Card style={[styles.card, inactive && styles.dim]}>
      <EmojiBadge emoji={emoji} size={layout.emojiSize} />
      <View style={styles.texts}>
        <View style={styles.top}>
          <Text variant="bodyStrong" numberOfLines={1} style={styles.flex}>
            {name}
          </Text>
          <Text variant="bodyStrong" numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.8}>
            {cost}
          </Text>
        </View>
        <Text variant="caption" tone="secondary">
          {inactive ? `${plan} · Inactiva` : plan}
        </Text>
        <Text variant="micro" tone="secondary">
          {nextDate}
        </Text>
      </View>
    </Card>
  );
}

export interface GoalCardProps {
  emoji: Emoji;
  name: string;
  saved: string;
  target: string;
  percent: number;
}

/** Tarjeta de objetivo (Ajustes): ahorro actual, meta en azul, barra de avance y "20% de tu meta". */
export function GoalCard({ emoji, name, saved, target, percent }: GoalCardProps) {
  return (
    <Card style={styles.goal}>
      <View style={styles.goalHead}>
        <EmojiBadge emoji={emoji} size={layout.emojiSize} />
        <Text variant="bodyStrong" numberOfLines={1} style={styles.flex}>
          {name}
        </Text>
      </View>
      <View style={styles.amounts}>
        <View style={styles.flex}>
          <Text variant="micro" tone="secondary">
            Ahorro actual
          </Text>
          <Text variant="heading" numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.7}>
            {saved}
          </Text>
        </View>
        <View style={[styles.flex, styles.end]}>
          <Text variant="micro" tone="secondary">
            Objetivo
          </Text>
          <Text
            variant="heading"
            numberOfLines={1}
            adjustsFontSizeToFit
            minimumFontScale={0.7}
            style={{ color: colors.blue }}
          >
            {target}
          </Text>
        </View>
      </View>
      <ProgressBar percent={percent} />
      <Text variant="micro" tone="secondary">
        {`${percent}% de tu meta`}
      </Text>
    </Card>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, minWidth: 0 },
  end: { alignItems: 'flex-end' },
  dim: { opacity: 0.6 },
  card: { flexDirection: 'row', alignItems: 'center', gap: 14, padding: 16 },
  texts: { flex: 1, minWidth: 0, gap: 2 },
  top: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  goal: { padding: 18, gap: 12 },
  goalHead: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  amounts: { flexDirection: 'row', gap: 12 },
});
