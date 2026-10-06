import { Redirect, useRouter } from 'expo-router';
import { useState, type ReactNode } from 'react';
import {
  Platform,
  Pressable as RNPressable,
  ScrollView,
  StyleSheet,
  View,
  useWindowDimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import {
  Card,
  Content,
  EmojiBadge,
  EmojiPickerButton,
  EmptyState,
  GlassButton,
  HeaderActions,
  Icon,
  IconCircle,
  InfoNote,
  LineChart,
  ListRow,
  OtpInput,
  PillInput,
  PrimaryButton,
  ProgressBar,
  ScreenHeader,
  ScreenWidthProvider,
  SearchField,
  SectionTitle,
  Segmented,
  SettingsGroup,
  SettingsRow,
  TabBarView,
  TabIcon,
  TabsUnderline,
  Text,
  Toggle,
  addMenuTones,
  colors,
  columnWidth,
  contentWidth,
  font,
  isNativeGlassAvailable,
  lucideIcons,
  textVariants,
  type LucideName,
  type TextVariant,
} from '@/design-system';
import { formatCurrency } from '@/lib/formatCurrency';

/**
 * GALERÍA DE COMPONENTES (solo __DEV__). Ábrela desde el lanzador de la pantalla de inicio de desarrollo o con
 * `exp://<ip>:8081/--/_dev/gallery`. Compárala con design-spec/app-screens/*.png. No está enlazada en la navegación normal.
 * El selector "Ancho" limita el marco de prueba a 360/375/390/402/430 pt para revisar cada componente a cada ancho
 * desde el mismo teléfono; dentro del marco, el contenido usa los MISMOS márgenes fijos (36 pt) que las pantallas.
 */
export default function Gallery() {
  if (!__DEV__) return <Redirect href="/" />;
  return <GalleryContent />;
}

const WIDTHS = [360, 375, 390, 402, 430] as const;

const WEEK = [
  { label: 'Lun', value: 4_000 },
  { label: 'Mar', value: 7_000 },
  { label: 'Mié', value: 9_500 },
  { label: 'Jue', value: 21_000 },
  { label: 'Vie', value: 18_500 },
  { label: 'Sáb', value: 9_000 },
  { label: 'Dom', value: 15_000 },
];

const ICON_GROUPS: { title: string; names: LucideName[] }[] = [
  {
    title: 'Menú de Ajustes',
    names: [
      'user-round',
      'mail',
      'key-round',
      'wallet',
      'gauge',
      'notebook-text',
      'credit-card',
      'target',
      'bell',
      'moon',
      'globe',
      'lock',
      'circle-help',
    ],
  },
  {
    title: 'UI',
    names: [
      'search',
      'list-filter',
      'plus',
      'chevron-left',
      'chevron-right',
      'bell-dot',
      'arrow-right',
      'check',
      'x',
      'ellipsis',
      'eye',
      'eye-off',
      'pencil',
      'calendar',
    ],
  },
  {
    title: 'Detalle',
    names: [
      'book-open',
      'headphones',
      'message-square',
      'message-square-text',
      'bug',
      'info',
      'shield-check',
      'download',
      'trash-2',
      'file-text',
      'file-lock-2',
      'lock-keyhole',
      'sun',
      'monitor',
      'banknote',
      'chart-column',
      'sparkles',
      'badge-check',
      'user',
      'tags',
    ],
  },
  {
    title: 'Categorías',
    names: [
      'utensils',
      'bus',
      'popcorn',
      'film',
      'heart',
      'house',
      'graduation-cap',
      'shopping-bag',
      'cloud',
      'play',
      'layers',
    ],
  },
];

function Section({ title, note, children }: { title: string; note?: string; children: ReactNode }) {
  return (
    <View style={styles.section}>
      <Content>
        <Text variant="heading">{title}</Text>
        {note ? (
          <Text variant="caption" tone="secondary" style={styles.note}>
            {note}
          </Text>
        ) : null}
      </Content>
      <View style={styles.sectionBody}>{children}</View>
    </View>
  );
}

const Label = ({ children }: { children: string }) => (
  <Text variant="micro" tone="secondary" style={styles.label}>
    {children}
  </Text>
);

function GalleryContent() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { width: windowWidth } = useWindowDimensions();
  const [sim, setSim] = useState<number | null>(null);
  const frameWidth = columnWidth(sim ?? windowWidth);

  const [seg3, setSeg3] = useState<'expense' | 'income' | 'both'>('expense');
  const [seg2, setSeg2] = useState<'active' | 'inactive'>('active');
  const [plan, setPlan] = useState<'weekly' | 'monthly' | 'yearly'>('monthly');
  const [tabs, setTabs] = useState<'accounts' | 'goals'>('accounts');
  const [tabBar, setTabBar] = useState(0);
  const [tg1, setTg1] = useState(true);
  const [tg2, setTg2] = useState(false);
  const [otp, setOtp] = useState('12');
  const [day, setDay] = useState(4);
  const [emoji, setEmoji] = useState<string | null>(null);
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const native = isNativeGlassAvailable();

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.bg }}
      contentContainerStyle={{ paddingTop: insets.top + 12, paddingBottom: insets.bottom + 48 }}
      keyboardShouldPersistTaps="handled"
    >
      <Content margin={20}>
        <Text variant="title">Galería</Text>
        <Text variant="caption" tone="secondary">
          Componentes del design-system, pixel-exactos al Figma. Solo en modo desarrollo.
        </Text>
        <Text
          variant="caption"
          tone="secondary"
          style={styles.link}
          onPress={() => (router.canGoBack() ? router.back() : router.replace('/'))}
        >
          ← Volver
        </Text>

        <Text variant="bodyStrong" style={styles.widthTitle}>
          Ancho del marco de prueba
        </Text>
        <View style={styles.chips} accessibilityRole="tablist">
          {[...WIDTHS, null].map((w) => {
            const selected = sim === w;
            return (
              <RNPressable
                key={String(w)}
                accessibilityRole="tab"
                accessibilityState={{ selected }}
                accessibilityLabel={w ? `${w} puntos` : 'Ancho real del dispositivo'}
                onPress={() => setSim(w)}
                style={[styles.chip2, selected && styles.chipActive]}
              >
                <Text
                  variant="label"
                  style={{ color: selected ? colors.white : colors.textPrimary }}
                >
                  {w ?? 'Real'}
                </Text>
              </RNPressable>
            );
          })}
        </View>
        <Text variant="micro" tone="secondary">
          Dispositivo: {Math.round(windowWidth)} pt · marco: {Math.round(frameWidth)} pt ·
          contenido: {Math.round(contentWidth(frameWidth))} pt (márgenes fijos de 36)
        </Text>
      </Content>

      {/* Marco de prueba: simula la pantalla del ancho elegido (centrado). Todo lo de abajo vive dentro. */}
      <View style={[styles.frame, { width: frameWidth }]}>
        <ScreenWidthProvider width={frameWidth}>
          <Section title="0 · Entorno" note="Qué quedó activo en este dispositivo.">
            <Content style={styles.gap}>
              <Text variant="rowLabel">
                Plataforma: {Platform.OS} {String(Platform.Version)}
              </Text>
              <Text variant="rowLabel">
                Fuente activa:{' '}
                {Platform.OS === 'ios'
                  ? 'SF Pro Rounded (ui-rounded del sistema)'
                  : 'Nunito (respaldo en Android)'}
              </Text>
              <Text variant="rowLabel">
                Vidrio:{' '}
                {native ? 'Liquid Glass NATIVO (iOS 26+)' : 'respaldo dibujado (medido del Figma)'}
              </Text>
              <View style={styles.row}>
                {(['bold', 'semibold', 'regular'] as const).map((w) => (
                  <Text key={w} style={{ ...font(w), fontSize: 20 }}>
                    Aa {w}
                  </Text>
                ))}
              </View>
            </Content>
          </Section>

          <Section
            title="1 · Tipografía"
            note="Variantes de texto (tamaño / peso) tomadas del Figma."
          >
            <Content style={styles.gap}>
              {(Object.keys(textVariants) as TextVariant[]).map((v) => (
                <View key={v}>
                  <Label>{`${v} · ${textVariants[v].fontSize}`}</Label>
                  <Text variant={v} numberOfLines={1} adjustsFontSizeToFit={v === 'display'}>
                    {v === 'display' ? '¢ 830.000' : 'Todo tu panorama financiero'}
                  </Text>
                </View>
              ))}
            </Content>
          </Section>

          <Section title="2 · Colores" note="Tokens muestreados (docs/measurements.md).">
            <Content>
              <View style={styles.swatches}>
                {(Object.entries(colors) as [string, unknown][])
                  .filter(([, v]) => typeof v === 'string')
                  .map(([name, value]) => (
                    <View key={name} style={styles.swatch}>
                      <View style={[styles.chip, { backgroundColor: value as string }]} />
                      <Text variant="micro" numberOfLines={1}>
                        {name}
                      </Text>
                      <Text variant="micro" tone="secondary">
                        {value as string}
                      </Text>
                    </View>
                  ))}
              </View>
            </Content>
          </Section>

          <Section
            title="3 · Botones de vidrio"
            note="Símbolo 50×50 y píldoras de alto 50. Sobre #F4F4F4 y sobre blanco (auth)."
          >
            <Content style={styles.gap}>
              <View style={styles.row}>
                <GlassButton icon="chevron-left" accessibilityLabel="Atrás" />
                <GlassButton icon="plus" accessibilityLabel="Agregar" />
                <GlassButton icon="bell" accessibilityLabel="Notificaciones" />
                <GlassButton icon="bell-dot" accessibilityLabel="Notificaciones nuevas" />
                <GlassButton icon="list-filter" accessibilityLabel="Filtrar" />
                <HeaderActions>
                  <GlassButton icon="bell" accessibilityLabel="Notificaciones" />
                  <GlassButton icon="plus" accessibilityLabel="Agregar" />
                </HeaderActions>
              </View>
              <View style={styles.row}>
                <GlassButton label="Ingreso" accessibilityLabel="Ingreso" />
                <GlassButton label="Gasto" accessibilityLabel="Gasto" />
                <GlassButton label="Consulta" accessibilityLabel="Consulta" />
              </View>
              <View style={[styles.row, styles.onWhite]}>
                <GlassButton icon="chevron-left" accessibilityLabel="Atrás" />
                <GlassButton label="Ingreso" accessibilityLabel="Ingreso" />
              </View>
            </Content>
          </Section>

          <Section
            title="4 · Barra de pestañas flotante"
            note="249×61 centrada, activa 85×61. Toca para cambiar."
          >
            <View style={styles.centerCol}>
              <TabBarView activeIndex={tabBar} onPressTab={setTabBar} />
              <TabBarView activeIndex={(tabBar + 1) % 3} onPressTab={setTabBar} />
              <View style={styles.row}>
                <TabIcon name="wallet" active />
                <TabIcon name="activity" active />
                <TabIcon name="layers" active />
                <TabIcon name="wallet" active={false} />
                <TabIcon name="activity" active={false} />
                <TabIcon name="layers" active={false} />
              </View>
            </View>
          </Section>

          <Section
            title="5 · Cabeceras"
            note="detalle: botón atrás + título 32 · pestaña: título + acciones solapadas."
          >
            <View style={styles.headerDemo}>
              <ScreenHeader title="Nueva cuenta" onBack={() => undefined} />
            </View>
            <View style={styles.headerDemo}>
              <ScreenHeader
                title="Objetivos"
                onBack={() => undefined}
                right={<GlassButton icon="plus" accessibilityLabel="Crear" />}
              />
            </View>
            <View style={styles.headerDemo}>
              <ScreenHeader
                variant="tab"
                title="Pigxel"
                right={
                  <HeaderActions>
                    <GlassButton icon="bell" accessibilityLabel="Notificaciones" />
                    <GlassButton icon="plus" accessibilityLabel="Agregar" />
                  </HeaderActions>
                }
              />
            </View>
          </Section>

          <Section
            title="6 · Saldo y pestañas"
            note="Saldo 64 con ajuste automático (sin salirse); Cuentas | Objetivos con subrayado."
          >
            <Content style={styles.gap}>
              <Text
                variant="display"
                adjustsFontSizeToFit
                numberOfLines={1}
                style={styles.center}
                allowFontScaling={false}
              >
                {formatCurrency(830_000, { spaced: true })}
              </Text>
              <Text
                variant="display"
                adjustsFontSizeToFit
                numberOfLines={1}
                style={styles.center}
                allowFontScaling={false}
              >
                {formatCurrency(123_456_789, { spaced: true })}
              </Text>
              <Text variant="bodyStrong" tone="secondary" style={styles.center}>
                Saldo total
              </Text>
              <TabsUnderline
                items={[
                  { value: 'accounts', label: 'Cuentas' },
                  { value: 'goals', label: 'Objetivos' },
                ]}
                value={tabs}
                onChange={setTabs}
              />
            </Content>
          </Section>

          <Section
            title="7 · Filas de tarjeta"
            note="Se estiran al ancho; los textos largos se recortan sin empujar el monto."
          >
            <Content style={styles.gap}>
              <ListRow
                emoji="🏛️"
                title="BCR"
                subtitle="Banco de Costa Rica"
                trailing={formatCurrency(20_000)}
                gap={18}
              />
              <ListRow
                emoji="🛒"
                title="Supermercado"
                subtitle="Compras, 8:24 AM"
                trailing={formatCurrency(-18_000)}
                trailingTone="expense"
              />
              <ListRow
                emoji="💰"
                title="Salario"
                subtitle="Ingreso, 1:10 PM"
                trailing={formatCurrency(718_000, { showPlus: true })}
                trailingTone="income"
              />
              <ListRow
                emoji="💳"
                title="Spotify"
                subtitle="Mensual"
                trailing={formatCurrency(1_000)}
              />
              <ListRow
                emoji="📌"
                title="Viaje a la playa"
                subtitle="Objetivo:"
                trailing={formatCurrency(100_000)}
              />
              <ListRow
                emoji="🧾"
                title="Pago de tarjeta de crédito del banco nacional de Costa Rica"
                subtitle="Alimentación, servicios y compras del mes, 8:24 AM"
                trailing={formatCurrency(-1_250_000)}
                trailingTone="expense"
              />
              <SectionTitle size="large">Cuenta</SectionTitle>
              <SectionTitle>Recientes</SectionTitle>
              <SectionTitle size="small">Hoy</SectionTitle>
            </Content>
          </Section>

          <Section
            title="8 · Ajustes"
            note="Menú principal (margen 39, caja 50) y detalle (caja 44, interruptor, check, destructivo, sin ícono)."
          >
            <Content margin={39} style={styles.gap}>
              <SettingsGroup>
                <SettingsRow
                  menuIcon="user-round"
                  title="Información personal"
                  onPress={() => undefined}
                />
                <SettingsRow menuIcon="mail" title="Correo electrónico" onPress={() => undefined} />
                <SettingsRow menuIcon="key-round" title="Contraseña" onPress={() => undefined} />
              </SettingsGroup>
            </Content>
            <Content style={styles.gap}>
              <SettingsGroup>
                <SettingsRow
                  icon="book-open"
                  title="Centro de ayuda"
                  subtitle="Aprende a usar Pigxel"
                  onPress={() => undefined}
                />
                <SettingsRow
                  icon="shield-check"
                  title="Permisos de datos"
                  subtitle="Gestiona el acceso a tus datos"
                  onPress={() => undefined}
                />
                <SettingsRow
                  icon="trash-2"
                  title="Eliminar cuenta"
                  subtitle="Elimina tu cuenta y tus datos"
                  destructive
                  onPress={() => undefined}
                />
              </SettingsGroup>
              <SettingsGroup>
                <SettingsRow
                  icon="credit-card"
                  title="Suscripciones"
                  subtitle="Recordatorios de próximas fechas"
                  toggle={{ value: tg1, onChange: setTg1 }}
                />
                <SettingsRow
                  icon="target"
                  title="Objetivos"
                  subtitle="Progreso de tus metas de ahorro"
                  toggle={{ value: tg2, onChange: setTg2 }}
                />
              </SettingsGroup>
              <SettingsGroup dividerInset="noIcon">
                <SettingsRow
                  title="Español"
                  subtitle="Español"
                  trailing="check"
                  onPress={() => undefined}
                />
                <SettingsRow
                  title="English"
                  subtitle="Inglés"
                  trailing="none"
                  onPress={() => undefined}
                />
              </SettingsGroup>
            </Content>
          </Section>

          <Section
            title="9 · Segmentado"
            note="Se estira hasta 252,5 pt; cápsula blanca que se desliza."
          >
            <Content style={styles.gap}>
              <Segmented
                options={[
                  { value: 'expense', label: 'Gastos' },
                  { value: 'income', label: 'Ingresos' },
                  { value: 'both', label: 'Ambos' },
                ]}
                value={seg3}
                onChange={setSeg3}
              />
              <Segmented
                options={[
                  { value: 'active', label: 'Activo' },
                  { value: 'inactive', label: 'Inactivo' },
                ]}
                value={seg2}
                onChange={setSeg2}
              />
              <Segmented
                options={[
                  { value: 'weekly', label: 'Semanal' },
                  { value: 'monthly', label: 'Mensual' },
                  { value: 'yearly', label: 'Anual' },
                ]}
                value={plan}
                onChange={setPlan}
                fullWidth
              />
            </Content>
          </Section>

          <Section
            title="10 · Campos"
            note="Píldora de alto 60 con ancho flexible. Formulario (blanco) y auth (gris sobre blanco)."
          >
            <Content style={styles.gap}>
              <PillInput placeholder="Nombre" value={text} onChangeText={setText} />
              <PillInput placeholder="Monto inicial" keyboardType="number-pad" />
              <SearchField />
            </Content>
            <View style={styles.onWhiteFull}>
              <Content style={styles.gap}>
                <PillInput variant="auth" leftIcon="user" placeholder="Nombre" />
                <PillInput
                  variant="auth"
                  leftIcon="mail"
                  placeholder="Correo electrónico"
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
                <PillInput
                  variant="auth"
                  leftIcon="lock"
                  placeholder="Contraseña"
                  secureTextEntry
                  defaultValue="secreto123"
                />
                <PillInput
                  variant="auth"
                  leftIcon="mail"
                  placeholder="Correo electrónico"
                  defaultValue="mal@"
                  error="Correo inválido"
                />
              </Content>
            </View>
          </Section>

          <Section
            title="11 · Botones principales"
            note="Ancho flexible: ocupan el contenedor (en bienvenida, con margen 51)."
          >
            <Content style={styles.gap}>
              <PrimaryButton label="Crear" onPress={() => undefined} />
              <PrimaryButton
                label={loading ? 'Creando…' : 'Toca para simular carga'}
                loading={loading}
                onPress={() => {
                  setLoading(true);
                  setTimeout(() => setLoading(false), 1500);
                }}
              />
              <PrimaryButton label="Deshabilitado" disabled />
              <PrimaryButton label="Sin flecha" withArrow={false} />
              <PrimaryButton label="Texto muy largo para probar que no pisa la flecha del botón" />
            </Content>
            <View style={styles.onWhiteFull}>
              <Content margin={51} style={styles.gap}>
                <PrimaryButton label="Crear cuenta" withArrow={false} />
                <PrimaryButton variant="glass" leftIcon="mail" label="Iniciar sesión" />
              </Content>
            </View>
          </Section>

          <Section title="12 · Interruptor, progreso y aviso">
            <Content style={styles.gap}>
              <View style={styles.row}>
                <Toggle value={tg1} onValueChange={setTg1} accessibilityLabel="Encendido" />
                <Toggle value={tg2} onValueChange={setTg2} accessibilityLabel="Apagado" />
                <Toggle value disabled accessibilityLabel="Deshabilitado" />
              </View>
              <Card style={styles.goalCard}>
                <Text variant="bodyStrong">Viaje a la playa</Text>
                <ProgressBar percent={20} />
                <Text variant="micro" tone="secondary">
                  20% de tu meta
                </Text>
                <ProgressBar percent={58} />
                <ProgressBar percent={100} />
              </Card>
              <InfoNote>
                El límite solo genera alertas en Consulta. No bloquea tus gastos ni impide registrar
                movimientos.
              </InfoNote>
            </Content>
          </Section>

          <Section
            title="13 · Código de verificación"
            note="6 casillas que se reparten el ancho. Toca para escribir."
          >
            <Content style={styles.gap}>
              <OtpInput value={otp} onChange={setOtp} />
              <OtpInput value="123456" onChange={() => undefined} />
            </Content>
          </Section>

          <Section title="14 · Gráfica de línea" note="Ancho medido con onLayout. Toca un día.">
            <Content>
              <LineChart data={WEEK} selectedIndex={day} onSelectIndex={setDay} />
            </Content>
          </Section>

          <Section title="15 · Estado vacío">
            <Content>
              <EmptyState
                title="Sin notificaciones"
                description="Ahora mismo no tienes ninguna notificación. Puedes volver más tarde para revisar tu bandeja."
              />
            </Content>
          </Section>

          <Section
            title="16 · Emoji"
            note="Disparador de 80 pt (carita del Figma) y emoji del usuario dibujado por el sistema."
          >
            <Content style={styles.gap}>
              <EmojiPickerButton value={emoji} onChange={setEmoji} />
              <View style={styles.row}>
                {['🏛️', '💵', '🛒', '☕', '💰', '🚗', '💳', '📌', '👨‍👩‍👧‍👦', '🇨🇷'].map((e) => (
                  <EmojiBadge key={e} emoji={e} size={35} />
                ))}
              </View>
            </Content>
          </Section>

          <Section
            title="17 · Íconos"
            note="Un solo sistema de línea (Lucide), trazo de 2 pt. Menú Agregar con el color del Figma; pestañas activa/inactiva."
          >
            <Content style={styles.gap}>
              <Label>Menú Agregar (círculo 50)</Label>
              <View style={styles.row}>
                <IconCircle name="piggy-bank" color={addMenuTones.piggy} />
                <IconCircle name="notebook-text" color={addMenuTones.note} />
                <IconCircle name="credit-card" color={addMenuTones.card} />
                <IconCircle name="target" color={addMenuTones.goal} />
              </View>
              {ICON_GROUPS.map((group) => (
                <View key={group.title} style={styles.gap}>
                  <Label>{group.title}</Label>
                  <View style={styles.iconGrid}>
                    {group.names.map((name) => (
                      <View key={name} style={styles.iconCell}>
                        <View style={styles.iconPair}>
                          <Icon name={name} size={24} color={colors.black} />
                          <Icon name={name} size={24} color={colors.iconMuted} />
                        </View>
                        <Text variant="micro" tone="secondary" numberOfLines={1}>
                          {name}
                        </Text>
                      </View>
                    ))}
                  </View>
                </View>
              ))}
              <Text variant="micro" tone="secondary">
                {Object.keys(lucideIcons).length} íconos en el catálogo (icons/lucide.tsx).
              </Text>
            </Content>
          </Section>
        </ScreenWidthProvider>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  link: { marginTop: 4 },
  widthTitle: { marginTop: 16, marginBottom: 8 },
  chips: { flexDirection: 'row', gap: 8, marginBottom: 6, flexWrap: 'wrap' },
  chip2: {
    minWidth: 56,
    minHeight: 44,
    paddingHorizontal: 14,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.segment,
    borderWidth: 1,
    borderColor: colors.border,
  },
  chipActive: { backgroundColor: colors.black, borderColor: colors.black },
  frame: {
    alignSelf: 'center',
    marginTop: 16,
    backgroundColor: colors.bg,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: colors.border,
    paddingBottom: 16,
  },
  section: { marginTop: 28 },
  sectionBody: { marginTop: 12, gap: 12 },
  note: { marginTop: 2 },
  gap: { gap: 12 },
  row: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', gap: 12 },
  label: { marginBottom: 2 },
  center: { textAlign: 'center' },
  centerCol: { alignItems: 'center', gap: 16 },
  onWhite: { backgroundColor: colors.authBg, padding: 12, borderRadius: 16 },
  onWhiteFull: { backgroundColor: colors.authBg, paddingVertical: 16 },
  swatches: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  swatch: { width: 88 },
  chip: {
    height: 36,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 4,
  },
  headerDemo: {
    height: 140,
    overflow: 'hidden',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: colors.border,
  },
  goalCard: { padding: 16, gap: 10 },
  iconGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 14 },
  iconCell: { width: 84, alignItems: 'center', gap: 6 },
  iconPair: { flexDirection: 'row', gap: 8, alignItems: 'center', height: 28 },
});
