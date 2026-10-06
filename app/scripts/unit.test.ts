/// <reference types="node" />
/**
 * Pruebas unitarias (sin red ni React Native): npm run test:unit
 * Cubre: validación de emoji, soporte por versión del sistema, búsqueda, semana y mapeadores.
 */
import assert from 'node:assert/strict';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { describe, it } from 'node:test';

import { emojiCatalog } from '../src/design-system/emoji/data';
import {
  buildIndex,
  normalize,
  searchEmojis,
  supportedOnly,
} from '../src/design-system/emoji/search';
import { maxEmojiVersion } from '../src/design-system/emoji/support';
import { countGraphemes, isSingleEmoji, validateEmoji } from '../src/lib/emoji';
import { toFriendlyError } from '../src/data/supabase/errors';
import {
  accountFromRow,
  categoryFromRow,
  profileFromRow,
  settingsFromRow,
  settingsPatchToRow,
  transactionFromRow,
  type TransactionWithCategory,
} from '../src/data/supabase/mappers';
import {
  WEEK_LABELS,
  buildWeeklySeries,
  monthRange,
  periodRange,
  sumAmounts,
  weekRange,
  weekdayIndex,
} from '../src/data/supabase/week';
import { createRepositoriesFromClient } from '../src/data/supabase/factory';
import { goalFromRow, subscriptionFromRow } from '../src/data/supabase/mappers';
import { getHomeSummary } from '../src/features/accounts/homeSummary';
import { computeConsult } from '../src/features/consult/calc';
import { getConsultContext } from '../src/features/consult/context';
import {
  addPlanPeriod,
  monthlyEquivalent,
  parseLocalDate,
  toLocalDateString,
} from '../src/lib/planPeriod';
import { percent } from '../src/lib/utils';
import type { Repositories } from '../src/data/repositories';
import { monotonePath } from '../src/design-system/components/lineChartMath';
import { colors } from '../src/design-system/tokens/colors';
import { layout } from '../src/design-system/tokens/spacing';
import {
  authPasswordSchema,
  forgotPasswordSchema,
  newPasswordSchema,
  signInSchema,
  signUpSchema,
  verifyCodeSchema,
} from '../src/features/auth/schemas';
import {
  RESEND_SECONDS,
  countdownEnd,
  formatCountdown,
  remainingSeconds,
} from '../src/lib/countdown';
import { OTP_LENGTH, isOtpComplete, parseOtpInput } from '../src/lib/otp';
import { ALL_SCREENS, SCREEN_GROUPS } from '../src/core/dev/screens-index';
import { IMPLEMENTED_SCREENS } from '../src/core/dev/screens-status';
import {
  computeBalance,
  defaultSelectedDay,
  filterByCategory,
  groupTransactionsByDay,
  netDailySeries,
  signedAmount,
  transactionSubtitle,
  NO_CATEGORY,
} from '../src/features/transactions/activity';
import { dayHeading, dayKey, formatLongDate, weekdayPosition } from '../src/lib/dates';
import { PLAN_LABEL } from '../src/features/subscriptions/labels';
import * as metrics from '../src/design-system/tokens/metrics';
import { ICON_REPLACEMENTS } from '../src/design-system/icons/iconTokens';

describe('validateEmoji', () => {
  const valid: [string, string][] = [
    ['🏛️', 'con selector de variación'],
    ['💵', 'simple'],
    ['👨‍👩‍👧‍👦', 'familia (ZWJ, 11 unidades UTF-16)'],
    ['👍🏽', 'tono de piel'],
    ['🇨🇷', 'bandera por país'],
    ['🏴󠁧󠁢󠁥󠁮󠁧󠁿', 'bandera por etiquetas'],
    ['1️⃣', 'tecla'],
    ['☕', 'BMP sin VS16'],
    ['❤️', 'corazón con VS16'],
    ['🧑‍💻', 'persona programadora'],
  ];
  for (const [emoji, label] of valid) {
    it(`acepta ${label}`, () => assert.equal(validateEmoji(emoji), true, emoji));
  }

  const invalid: [string, string][] = [
    ['', 'vacío'],
    ['a', 'letra'],
    ['😀😀', 'dos emojis'],
    ['😀a', 'emoji + letra'],
    ['abc', 'texto'],
    ['😀‍', 'ZWJ colgante'],
    ['12', 'dígitos'],
    ['🇨', 'indicador regional suelto'],
    ['x'.repeat(20), 'demasiado largo'],
  ];
  for (const [text, label] of invalid) {
    it(`rechaza ${label}`, () => assert.equal(validateEmoji(text), false, text));
  }

  it('isSingleEmoji y Intl.Segmenter coinciden en los válidos', () => {
    for (const [emoji] of valid) {
      assert.equal(isSingleEmoji(emoji), true, emoji);
      const g = countGraphemes(emoji);
      if (g !== null) assert.equal(g, 1, `${emoji} debe ser 1 grafema`);
    }
  });

  it('todo el catálogo del selector pasa la validación', () => {
    const bad = emojiCatalog.filter((e) => !validateEmoji(e.e)).map((e) => e.e);
    assert.deepEqual(bad, []);
  });
});

describe('maxEmojiVersion', () => {
  it('iOS compara versión mayor/menor como enteros', () => {
    assert.equal(maxEmojiVersion({ os: 'ios', version: '18.3' }), 15.1);
    assert.equal(maxEmojiVersion({ os: 'ios', version: '18.4' }), 16);
    assert.equal(maxEmojiVersion({ os: 'ios', version: '18.10' }), 16);
    assert.equal(maxEmojiVersion({ os: 'ios', version: '26.0' }), 16);
    assert.equal(maxEmojiVersion({ os: 'ios', version: '26.4.1' }), 17);
    assert.equal(maxEmojiVersion({ os: 'ios', version: '12.0' }), 11);
  });
  it('Android por nivel de API', () => {
    assert.equal(maxEmojiVersion({ os: 'android', version: 28 }), 11);
    assert.equal(maxEmojiVersion({ os: 'android', version: 33 }), 14);
    assert.equal(maxEmojiVersion({ os: 'android', version: 36 }), 16);
    assert.equal(maxEmojiVersion({ os: 'android', version: 21 }), 5);
  });
  it('web no filtra', () => assert.equal(maxEmojiVersion({ os: 'web', version: 1 }), Infinity));
});

describe('búsqueda de emoji', () => {
  const index = buildIndex(emojiCatalog);
  it('normaliza acentos y mayúsculas', () => assert.equal(normalize('  CAFÉ '), 'cafe'));
  it('encuentra por nombre en español sin acentos', () => {
    const found = searchEmojis(index, 'carrito', Infinity).map((e) => e.e);
    assert.ok(found.includes('🛒'), 'carrito → 🛒');
  });
  it('encuentra por palabra clave', () => {
    const found = searchEmojis(index, 'supermercado', Infinity).map((e) => e.e);
    assert.ok(found.includes('🛒'));
  });
  it('exige todas las palabras', () => {
    const found = searchEmojis(index, 'familia niño', Infinity).map((e) => e.e);
    assert.ok(found.length > 0);
    assert.equal(searchEmojis(index, 'carrito zzzz', Infinity).length, 0);
  });
  it('consulta vacía no devuelve nada', () => assert.deepEqual(searchEmojis(index, '  ', 99), []));
  it('oculta emojis más nuevos que el sistema', () => {
    const newest = emojiCatalog.filter((e) => e.v >= 17);
    assert.ok(newest.length > 0, 'hay emojis de la versión 17 en el catálogo');
    const visible = supportedOnly(index, 15.1);
    assert.ok(visible.every((e) => e.v <= 15.1));
    assert.ok(visible.length < index.length);
  });
});

describe('semana lunes–domingo', () => {
  it('weekdayIndex: lunes = 0, domingo = 6', () => {
    assert.equal(weekdayIndex(new Date(2026, 9, 5)), 0); // lunes 5 oct 2026
    assert.equal(weekdayIndex(new Date(2026, 9, 11)), 6); // domingo 11 oct 2026
  });
  it('weekRange desde un domingo y desde un lunes', () => {
    const fromSunday = weekRange(new Date(2026, 9, 11, 23, 59));
    assert.equal(fromSunday.start.getTime(), new Date(2026, 9, 5).getTime());
    assert.equal(fromSunday.end.getTime(), new Date(2026, 9, 12).getTime());
    const fromMonday = weekRange(new Date(2026, 9, 5, 0, 0, 1));
    assert.equal(fromMonday.start.getTime(), new Date(2026, 9, 5).getTime());
  });
  it('weekRange cruza el cambio de mes', () => {
    const r = weekRange(new Date(2026, 9, 1)); // jueves 1 oct 2026
    assert.equal(r.start.getTime(), new Date(2026, 8, 28).getTime());
    assert.equal(r.end.getTime(), new Date(2026, 9, 5).getTime());
  });
  it('la serie tiene 7 puntos y su suma es el total', () => {
    const rows = [
      { amount: 18_000, occurred_at: new Date(2026, 9, 5, 8, 24).toISOString() }, // lun
      { amount: 750, occurred_at: new Date(2026, 9, 5, 16, 0).toISOString() }, // lun
      { amount: 26_100, occurred_at: new Date(2026, 9, 9, 6, 38).toISOString() }, // vie
      { amount: 500, occurred_at: new Date(2026, 9, 11, 23, 59).toISOString() }, // dom
    ];
    const series = buildWeeklySeries(rows);
    assert.deepEqual(
      series.map((p) => p.label),
      [...WEEK_LABELS],
    );
    assert.equal(series[0]?.value, 18_750);
    assert.equal(series[4]?.value, 26_100);
    assert.equal(series[6]?.value, 500);
    assert.equal(
      series.reduce((t, p) => t + p.value, 0),
      sumAmounts(rows),
    );
  });
});

describe('mapeadores', () => {
  const tx = (over: Partial<TransactionWithCategory>): TransactionWithCategory => ({
    id: 't1',
    user_id: 'u1',
    account_id: 'a1',
    category_id: null,
    type: 'expense',
    title: '',
    amount: 100,
    occurred_at: '2026-10-05T14:24:00+00:00',
    created_at: '2026-10-05T14:24:00+00:00',
    category: null,
    ...over,
  });

  it('transacción con categoría', () => {
    const t = transactionFromRow(
      tx({ title: 'Supermercado', category_id: 'c1', category: { name: 'Compras', icon: '🛒' } }),
    );
    assert.equal(t.title, 'Supermercado');
    assert.equal(t.categoryLabel, 'Compras');
    assert.equal(t.icon, '🛒');
  });
  it('gasto sin categoría', () => {
    const t = transactionFromRow(tx({ title: 'Taxi' }));
    assert.equal(t.categoryLabel, 'Sin categoría');
    assert.equal(t.icon, '💸');
  });
  it('ingreso sin categoría', () => {
    const t = transactionFromRow(tx({ type: 'income', title: 'Salario' }));
    assert.equal(t.categoryLabel, 'Ingreso');
    assert.equal(t.icon, '💰');
  });
  it('título vacío cae a la categoría', () => {
    const t = transactionFromRow(tx({ category: { name: 'Café', icon: '☕' } }));
    assert.equal(t.title, 'Café');
  });
  it('cuenta y categoría conservan el emoji exacto', () => {
    const acc = accountFromRow(
      {
        id: 'a',
        user_id: 'u',
        name: 'BCR',
        description: 'Banco de Costa Rica',
        icon: '🏛️',
        initial_amount: 20_000,
        created_at: '',
      },
      738_000,
    );
    assert.equal(acc.icon, '🏛️');
    assert.equal(acc.balance, 738_000);
    assert.equal(
      categoryFromRow({ id: 'c', user_id: 'u', name: 'Familia', icon: '👨‍👩‍👧‍👦', created_at: '' }).icon,
      '👨‍👩‍👧‍👦',
    );
  });
  it('perfil y ajustes (etapa 1)', () => {
    const p = profileFromRow({
      id: 'u',
      full_name: 'Kevin',
      username: 'kevin',
      email: 'k@x.com',
      phone: null,
      created_at: '',
      updated_at: '',
    });
    assert.equal(p.fullName, 'Kevin');
    const s = settingsFromRow({
      user_id: 'u',
      currency: 'CRC',
      language: 'es',
      appearance: 'system',
      limit_enabled: true,
      limit_amount: 300_000,
      limit_period: 'monthly',
      notify_subscriptions: true,
      notify_goals: true,
      notify_limit: true,
      notify_activity: false,
      notify_news: true,
      notify_email: true,
      updated_at: '',
    });
    assert.equal(s.spendingLimit.amount, 300_000);
    assert.deepEqual(settingsPatchToRow({ spendingLimit: { amount: 1 } }), { limit_amount: 1 });
  });
});

describe('errores amigables', () => {
  it('usa el mensaje específico del repositorio antes que el genérico', () => {
    const err = toFriendlyError(
      { code: '23505', message: 'duplicate key' },
      { '23505': 'Ya tienes una categoría con ese nombre' },
    );
    assert.equal(err.message, 'Ya tienes una categoría con ese nombre');
    assert.equal(toFriendlyError({ code: '23505' }).message, 'Ese dato ya existe');
  });
  it('mensaje genérico para errores desconocidos', () => {
    assert.equal(toFriendlyError(new Error('boom')).message, 'Algo salió mal. Intenta de nuevo.');
  });
});

describe('addPlanPeriod (próximo cobro)', () => {
  const ymd = (d: Date) => toLocalDateString(d);
  it('semanal: +7 días, también al cruzar mes y año', () => {
    assert.equal(ymd(addPlanPeriod(new Date(2026, 9, 6), 'weekly')), '2026-10-13');
    assert.equal(ymd(addPlanPeriod(new Date(2026, 9, 28), 'weekly')), '2026-11-04');
    assert.equal(ymd(addPlanPeriod(new Date(2026, 11, 29), 'weekly')), '2027-01-05');
  });
  it('mensual: 31 ene + 1 mes = 28 feb (29 en bisiesto)', () => {
    assert.equal(ymd(addPlanPeriod(new Date(2027, 0, 31), 'monthly')), '2027-02-28');
    assert.equal(ymd(addPlanPeriod(new Date(2028, 0, 31), 'monthly')), '2028-02-29');
  });
  it('mensual: 31 ago + 1 mes = 30 sep; dic → ene del año siguiente', () => {
    assert.equal(ymd(addPlanPeriod(new Date(2026, 7, 31), 'monthly')), '2026-09-30');
    assert.equal(ymd(addPlanPeriod(new Date(2026, 11, 15), 'monthly')), '2027-01-15');
    assert.equal(ymd(addPlanPeriod(new Date(2026, 9, 6), 'monthly')), '2026-11-06');
  });
  it('anual: 29 feb 2028 + 1 año = 28 feb 2029', () => {
    assert.equal(ymd(addPlanPeriod(new Date(2028, 1, 29), 'yearly')), '2029-02-28');
    assert.equal(ymd(addPlanPeriod(new Date(2026, 9, 6), 'yearly')), '2027-10-06');
  });
  it('no modifica la fecha original', () => {
    const from = new Date(2026, 9, 6);
    addPlanPeriod(from, 'monthly');
    assert.equal(ymd(from), '2026-10-06');
  });
  it('parseLocalDate / toLocalDateString son inversas (sin corrimiento por UTC)', () => {
    const d = parseLocalDate('2026-10-11');
    assert.equal(d.getDate(), 11);
    assert.equal(toLocalDateString(d), '2026-10-11');
    assert.equal(new Date(d.toISOString()).getDate(), 11);
  });
});

describe('costo mensual equivalente', () => {
  it('semanal ×52/12, anual ÷12, mensual igual', () => {
    assert.equal(Math.round(monthlyEquivalent(700, 'weekly') * 100) / 100, 3033.33);
    assert.equal(monthlyEquivalent(12_000, 'yearly'), 1_000);
    assert.equal(monthlyEquivalent(4_500, 'monthly'), 4_500);
  });
});

describe('progreso de objetivos', () => {
  it('20.000/100.000 = 20 y 350.000/600.000 = 58', () => {
    assert.equal(percent(20_000, 100_000), 20);
    assert.equal(percent(350_000, 600_000), 58);
  });
  it('tope en 100 y metas inválidas en 0', () => {
    assert.equal(percent(200, 100), 100);
    assert.equal(percent(5, 0), 0);
    assert.equal(percent(-5, 100), 0);
  });
  it('goalFromRow expone progressPercent y conserva el emoji', () => {
    const g = goalFromRow({
      id: 'g',
      user_id: 'u',
      name: 'Laptop',
      icon: '📌',
      target_amount: 600_000,
      current_amount: 350_000,
      created_at: '',
    });
    assert.equal(g.progressPercent, 58);
    assert.equal(g.icon, '📌');
  });
});

describe('subscriptionFromRow', () => {
  it('convierte la fecha "solo día" a medianoche local (el día no se corre)', () => {
    const s = subscriptionFromRow({
      id: 's',
      user_id: 'u',
      name: 'Spotify',
      icon: '💳',
      cost: 1_000,
      status: 'active',
      plan: 'monthly',
      next_charge_at: '2026-10-11',
      created_at: '',
    });
    assert.equal(new Date(s.nextChargeAt).getDate(), 11);
    assert.equal(s.plan, 'monthly');
  });
});

describe('rangos de periodo', () => {
  it('monthRange: mes calendario [1 → 1 del siguiente]', () => {
    const r = monthRange(new Date(2026, 9, 17, 12));
    assert.equal(r.start.getTime(), new Date(2026, 9, 1).getTime());
    assert.equal(r.end.getTime(), new Date(2026, 10, 1).getTime());
    assert.equal(monthRange(new Date(2026, 11, 31)).end.getTime(), new Date(2027, 0, 1).getTime());
  });
  it('periodRange elige semana o mes', () => {
    const now = new Date(2026, 9, 7);
    assert.equal(periodRange('weekly', now).start.getTime(), weekRange(now).start.getTime());
    assert.equal(periodRange('monthly', now).start.getTime(), monthRange(now).start.getTime());
  });
});

describe('computeConsult', () => {
  const limit = { enabled: true, amount: 300_000, period: 'monthly' as const };

  it('saldo ¢830.000 − ¢700.000 = ¢130.000', () => {
    const r = computeConsult({ balance: 830_000, amount: 700_000 });
    assert.equal(r.remaining, 130_000);
    assert.equal(r.canAfford, true);
    assert.equal(r.limitStatus, 'off');
    assert.equal(r.remainingAfterLimit, undefined);
  });
  it('monto mayor que el saldo → negativo y no alcanza (pero no se bloquea nada)', () => {
    const r = computeConsult({ balance: 830_000, amount: 900_000 });
    assert.equal(r.remaining, -70_000);
    assert.equal(r.canAfford, false);
  });
  it('monto igual al saldo → 0 y alcanza', () => {
    const r = computeConsult({ balance: 1_000, amount: 1_000 });
    assert.equal(r.remaining, 0);
    assert.equal(r.canAfford, true);
  });
  it('límite apagado → off aunque se pase', () => {
    const r = computeConsult({
      balance: 10_000_000,
      amount: 999_999,
      limit: { ...limit, enabled: false },
      spentInPeriod: 500_000,
    });
    assert.equal(r.limitStatus, 'off');
  });
  it('límite activo: ok / near / exceeded con sus umbrales (80 % y 100 %)', () => {
    const at = (spent: number, amount: number) =>
      computeConsult({ balance: 1_000_000, amount, limit, spentInPeriod: spent });
    assert.equal(at(0, 100_000).limitStatus, 'ok');
    assert.equal(at(100_000, 140_000).limitStatus, 'ok'); // 240.000 = 80 % exacto: aún ok
    assert.equal(at(100_000, 140_001).limitStatus, 'near'); // 240.001
    assert.equal(at(100_000, 200_000).limitStatus, 'near'); // 300.000 = 100 % exacto: no "supera" → near
    assert.equal(at(100_000, 200_001).limitStatus, 'exceeded'); // 300.001
  });
  it('remainingAfterLimit = límite − (gastado + monto), puede ser negativo', () => {
    const r = computeConsult({ balance: 500_000, amount: 50_000, limit, spentInPeriod: 280_000 });
    assert.equal(r.remainingAfterLimit, -30_000);
    assert.equal(r.limitStatus, 'exceeded');
    assert.equal(r.canAfford, true, 'el límite nunca bloquea');
  });
  it('entradas no numéricas no rompen el cálculo', () => {
    const r = computeConsult({
      balance: 1_000,
      amount: Number.NaN,
      limit,
      spentInPeriod: Number.NaN,
    });
    assert.equal(r.remaining, 1_000);
    assert.equal(r.limitStatus, 'ok');
  });
});

describe('getHomeSummary y getConsultContext (repositorios falsos)', () => {
  const fake = {
    accounts: {
      getTotalBalance: async () => 698_150,
      list: async () => [{ id: 'a' }, { id: 'b' }],
    },
    transactions: {
      list: async (f?: { limit?: number }) =>
        Array.from({ length: f?.limit ?? 0 }, (_, i) => ({ id: `t${i}` })),
      getSpentInPeriod: async (p: string) => (p === 'monthly' ? 44_850 : 18_750),
    },
    subscriptions: { list: async () => [{ id: 's' }] },
    goals: { list: async () => [{ id: 'g1' }, { id: 'g2' }] },
    settings: {
      getSettings: async () => ({
        spendingLimit: { enabled: true, amount: 300_000, period: 'monthly' },
      }),
    },
  } as unknown as Repositories;

  it('getHomeSummary reúne saldo, cuentas, 3 recientes, suscripciones y objetivos', async () => {
    const s = await getHomeSummary(fake);
    assert.equal(s.totalBalance, 698_150);
    assert.equal(s.accounts.length, 2);
    assert.equal(s.recent.length, 3);
    assert.equal(s.subscriptions.length, 1);
    assert.equal(s.goals.length, 2);
  });
  it('getConsultContext trae saldo, límite y gasto del periodo del límite', async () => {
    const c = await getConsultContext(fake);
    assert.equal(c.balance, 698_150);
    assert.equal(c.limit.amount, 300_000);
    assert.equal(c.spentInPeriod, 44_850);
  });
});

describe('createRepositoriesFromClient', () => {
  it('compone los 7 repositorios reales (ninguno pendiente)', () => {
    const repos = createRepositoriesFromClient({} as never);
    assert.deepEqual(Object.keys(repos).sort(), [
      'accounts',
      'auth',
      'categories',
      'goals',
      'settings',
      'subscriptions',
      'transactions',
    ]);
    const methods: Record<string, string[]> = {
      auth: ['getSession', 'signUp', 'signIn', 'signOut', 'changePassword', 'onAuthStateChange'],
      accounts: ['list', 'create', 'getTotalBalance'],
      categories: ['list', 'create'],
      transactions: ['list', 'create', 'getPeriodTotal', 'getWeeklySeries', 'getSpentInPeriod'],
      subscriptions: ['list', 'create', 'getMonthlyCost'],
      goals: ['list', 'create'],
      settings: ['getProfile', 'updateProfile', 'getSettings', 'updateSettings'],
    };
    for (const [name, list] of Object.entries(methods)) {
      for (const m of list) {
        const repo = repos[name as keyof Repositories] as unknown as Record<string, unknown>;
        assert.equal(typeof repo[m], 'function', `${name}.${m}`);
      }
    }
  });
});

describe('gráfica: monotonePath', () => {
  const nums = (d: string) => (d.match(/-?\d+\.?\d*/g) ?? []).map(Number);

  it('vacío y un punto', () => {
    assert.equal(monotonePath([]), '');
    assert.equal(monotonePath([{ x: 3, y: 4 }]), 'M3 4');
  });
  it('pasa por todos los puntos y empieza/termina en los extremos', () => {
    const pts = [
      { x: 0, y: 90 },
      { x: 40, y: 70 },
      { x: 80, y: 30 },
      { x: 120, y: 50 },
    ];
    const d = monotonePath(pts);
    assert.ok(d.startsWith('M0.00 90.00'));
    const n = nums(d);
    assert.deepEqual(n.slice(-2), [120, 50]);
    for (const p of pts.slice(1)) {
      assert.ok(d.includes(`${p.x.toFixed(2)} ${p.y.toFixed(2)}`), `pasa por (${p.x}, ${p.y})`);
    }
  });
  it('no se sale del rango vertical de los datos (sin desborde en mesetas ni picos)', () => {
    const ys = [97, 97, 60, 32, 40, 97, 80];
    const pts = ys.map((y, i) => ({ x: i * 44, y }));
    const d = monotonePath(pts);
    const all = nums(d);
    // Las coordenadas Y son las posiciones impares tras la M inicial.
    const yValues = all.filter((_, i) => i % 2 === 1);
    assert.ok(Math.min(...yValues) >= 32 - 1e-6, `mínimo ${Math.min(...yValues)}`);
    assert.ok(Math.max(...yValues) <= 97 + 1e-6, `máximo ${Math.max(...yValues)}`);
  });
  it('serie constante → línea recta (sin ondulación)', () => {
    const pts = [0, 1, 2, 3].map((i) => ({ x: i * 40, y: 50 }));
    assert.ok(
      nums(monotonePath(pts))
        .filter((_, i) => i % 2 === 1)
        .every((y) => y === 50),
    );
  });
});

describe('tokens ↔ muestreo del Figma (docs/measurements.json)', () => {
  const measured = JSON.parse(
    readFileSync(join(__dirname, '../docs/measurements.json'), 'utf8'),
  ) as {
    samples: Record<string, string>;
    measures: Record<string, { w: number; h: number }[]>;
  };
  const pairs: [string, string][] = [
    ['card.fill', colors.card],
    ['card.border', colors.border],
    ['field.auth.fill', colors.fieldAuth],
    ['field.auth.border', colors.border],
    ['field.form.fill', colors.white],
    ['field.placeholder.color', colors.textPlaceholder],
    ['field.icon.color', colors.iconMuted],
    ['primaryButton.fill', colors.buttonPrimary],
    ['primaryButton.text.color', colors.buttonPrimaryText],
    ['segmented.fill', colors.segment],
    ['segmented.active.fill', colors.segmentActive],
    ['segmented.label.inactive', colors.textSecondary],
    ['search.fill', colors.search],
    ['emojiCircle.fill', colors.emojiCircle],
    ['emojiCircle.glyph.color', colors.iconMuted],
    ['headerIcon.fill', colors.headerIconBox],
    ['rowIcon.fill', colors.iconBox],
    ['detail.description.color', colors.textSecondary],
    ['divider.color', colors.divider],
    ['chevron.color', colors.chevron],
    ['toggle.on.fill', colors.toggleOn],
    ['toggle.off.fill', colors.toggleOff],
    ['toggle.knob.fill', colors.toggleKnob],
    ['progress.track', colors.progressTrack],
    ['progress.fill', colors.blue],
    ['goalAmount.blue', colors.blue],
    ['infoNote.fill', colors.infoNoteBg],
    ['infoNote.text.color', colors.infoNoteText],
    ['otp.cell.fill', colors.otpCell],
    ['amount.expense.color', colors.expense],
    ['amount.income.color', colors.income],
    ['chart.line.color', colors.chartLine],
    ['screen.auth.bg', colors.authBg],
  ];
  for (const [key, token] of pairs) {
    it(`${key} = ${token}`, () => {
      assert.ok(key in measured.samples, `falta la muestra ${key}`);
      assert.equal(measured.samples[key]?.toUpperCase(), token.toUpperCase());
    });
  }

  it('medidas: tarjeta 330×74, campo y botón 330×60, segmentado 253×48, buscador 351×53, tab bar 249×61', () => {
    const size = (k: string) => `${measured.measures[k]?.[0]?.w}×${measured.measures[k]?.[0]?.h}`;
    assert.equal(
      size('Tarjeta de fila 330×74 (Agregar)'),
      `${metrics.figmaReference.card.width}×${metrics.figmaReference.card.height}`,
    );
    assert.equal(
      size('Botón negro con flecha'),
      `${metrics.figmaReference.primaryButton.width}×${layout.primaryButton.height}`,
    );
    assert.equal(
      size('Campo en píldora (Agregar)'),
      `${metrics.figmaReference.contentWidth}×${layout.field.height}`,
    );
    assert.equal(size('Control segmentado (contenedor)'), `253×${layout.segmented.height}`);
    assert.equal(
      size('Buscador'),
      `${metrics.figmaReference.search.width}×${layout.search.height}`,
    );
    assert.equal(
      size('Tab bar (flotante, pantallas de detalle)'),
      `${layout.tabBar.width}×${layout.tabBar.height}`,
    );
    assert.equal(
      size('Tab bar · pestaña seleccionada'),
      `${layout.tabBar.activeWidth}×${layout.tabBar.height}`,
    );
    assert.equal(
      size('Círculo disparador de emoji'),
      `${layout.emojiTrigger.size}×${layout.emojiTrigger.size}`,
    );
    assert.equal(
      size('Ícono de encabezado (detalle)'),
      `${layout.headerIcon.size}×${layout.headerIcon.size}`,
    );
    assert.equal(size('Interruptor (encendido)'), `${layout.toggle.width}×${layout.toggle.height}`);
    assert.equal(size('Caja informativa (Límite)'), `${metrics.figmaReference.contentWidth}×89`);
    assert.equal(
      size('Gráfica de línea (imagen)'),
      `${metrics.figmaReference.chart.width}×${layout.chart.height}`,
    );
  });
});

describe('modelo de ancho responsivo (metrics)', () => {
  const WIDTHS = [360, 375, 390, 402, 430, 768];

  it('contenido = columna − 2 × margen (36); la columna nunca pasa de 440', () => {
    assert.equal(metrics.contentWidth(360), 288);
    assert.equal(metrics.contentWidth(375), 303);
    assert.equal(metrics.contentWidth(390), 318);
    assert.equal(metrics.contentWidth(402), 330, 'a 402 pt coincide con el ancho del Figma');
    assert.equal(metrics.contentWidth(430), 358);
    assert.equal(metrics.contentWidth(768), 368, 'iPad: columna de 440 centrada');
  });
  it('nunca hay desborde: contenido + 2 márgenes ≤ ancho de pantalla en todos los anchos', () => {
    for (const w of WIDTHS) {
      for (const margin of [
        metrics.SCREEN_MARGIN,
        metrics.WELCOME_MARGIN,
        metrics.SETTINGS_MENU_MARGIN,
      ]) {
        assert.ok(metrics.contentWidth(w, margin) + margin * 2 <= w, `w=${w} margen=${margin}`);
        assert.ok(metrics.contentWidth(w, margin) >= 0);
      }
    }
  });
  it('casillas OTP: 6 casillas + 5 espacios = ancho del bloque, siempre dentro del contenido', () => {
    for (const w of WIDTHS) {
      const block = metrics.otpBlockWidth(w);
      const cell = metrics.otpCellWidth(block);
      assert.ok(Math.abs(cell * 6 + 5.4 * 5 - block) < 1e-9);
      assert.ok(block <= metrics.contentWidth(w));
      assert.ok(cell >= 40, `casilla de ${cell} a ${w} pt`);
    }
    assert.ok(
      Math.abs(metrics.otpCellWidth(metrics.otpBlockWidth(402)) - 49) <= 0.5,
      'a 402 pt ≈ 49 como en el Figma',
    );
  });
  it('segmentado: se estira hasta 252,5 y nunca excede el contenido', () => {
    for (const w of WIDTHS)
      assert.ok(metrics.segmentedWidth(metrics.contentWidth(w)) <= metrics.contentWidth(w));
    assert.equal(metrics.segmentedWidth(metrics.contentWidth(402)), 252.5);
    assert.equal(metrics.segmentedWidth(metrics.contentWidth(360)), 252.5);
  });
  it('tab bar (249) centrada con margen positivo en todos los anchos', () => {
    for (const w of WIDTHS) assert.ok(metrics.centeredLeft(w, 249) >= 55, `w=${w}`);
  });
  it('filas: siempre queda espacio de texto positivo junto al monto', () => {
    for (const w of WIDTHS)
      assert.ok(metrics.rowTextWidth(metrics.contentWidth(w)) > 100, `w=${w}`);
  });
  it('overflow(): 0 cuando el elemento ocupa exactamente el contenido; negativo si se desborda', () => {
    assert.equal(metrics.overflow(402, 330), 0);
    assert.ok(
      metrics.overflow(360, 330) < 0,
      'un ancho fijo de 330 SÍ se desborda a 360 (el problema original)',
    );
    assert.equal(metrics.overflow(390, metrics.contentWidth(390)), 0);
  });
  it('el layout ya no expone anchos fijos del Figma para el contenido', () => {
    const keys = JSON.stringify(layout);
    for (const forbidden of ['"contentWidth"', '"blockWidth"'])
      assert.ok(!keys.includes(forbidden), forbidden);
    assert.ok(
      !('width' in layout.card) &&
        !('width' in layout.primaryButton) &&
        !('width' in layout.search),
    );
  });
});

describe('íconos unificados (Lucide)', () => {
  const root = join(__dirname, '..');
  const lucideSrc = readFileSync(join(root, 'src/design-system/icons/lucide.tsx'), 'utf8');
  const imports = [
    ...lucideSrc.matchAll(/import (\w+) from 'lucide-react-native\/icons\/([\w-]+)';/g),
  ].map((m) => ({ id: m[1] as string, file: m[2] as string }));
  const keys = [...lucideSrc.matchAll(/^  '?([a-z0-9-]+)'?: (\w+),$/gm)].map((m) => ({
    name: m[1] as string,
    id: m[2] as string,
  }));

  it('cada ícono del catálogo apunta a un archivo que existe en lucide-react-native', () => {
    assert.ok(imports.length >= 60, `catálogo de ${imports.length}`);
    for (const { file } of imports) {
      assert.ok(
        existsSync(join(root, `node_modules/lucide-react-native/dist/esm/icons/${file}.mjs`)),
        `no existe lucide-react-native/icons/${file}`,
      );
    }
  });
  it('el mapa tiene una entrada por importación y sin duplicados', () => {
    assert.deepEqual(new Set(keys.map((k) => k.id)), new Set(imports.map((i) => i.id)));
    assert.equal(new Set(keys.map((k) => k.name)).size, keys.length);
  });
  it('todos los reemplazos del mapa viejo → nuevo existen en el catálogo', () => {
    const names = new Set(keys.map((k) => k.name));
    for (const [old, now] of Object.entries(ICON_REPLACEMENTS))
      assert.ok(names.has(now), `${old} → ${now} no está en el catálogo`);
  });
  it('los íconos que piden las pantallas están en el catálogo', () => {
    const needed =
      'book-open circle-help headphones message-square bug info shield-check download trash-2 file-text file-lock-2 lock-keyhole eye eye-off sun moon monitor globe check banknote bell chart-column sparkles utensils bus popcorn film heart house graduation-cap shopping-bag ellipsis badge-check'.split(
        ' ',
      );
    const names = new Set(keys.map((k) => k.name));
    for (const n of needed) assert.ok(names.has(n), `falta ${n}`);
  });
  it('ningún archivo de src importa íconos de assets/icons/** (solo la marca puede)', () => {
    const bad: string[] = [];
    const walkDir = (dir: string) => {
      for (const e of readdirSync(dir, { withFileTypes: true })) {
        const p = join(dir, e.name);
        if (e.isDirectory()) walkDir(p);
        else if (/\.(ts|tsx)$/.test(e.name)) {
          const text = readFileSync(p, 'utf8');
          for (const m of text.matchAll(
            /(?:from|require\()\s*['"][^'"]*assets\/(icons\/[^'"]*)['"]/g,
          ))
            bad.push(`${p.replace(root, '')}: ${m[1]}`);
        }
      }
    };
    walkDir(join(root, 'src'));
    assert.deepEqual(bad, []);
  });
  it('los SVG antiguos siguen en disco como respaldo', () => {
    for (const f of [
      'tabs/wallet.svg',
      'ui/plus.svg',
      'settings/person.svg',
      'add/piggy-green.svg',
    ]) {
      assert.ok(existsSync(join(root, 'assets/icons', f)), f);
    }
  });
});

describe('esquemas de autenticación', () => {
  const ok = {
    name: 'Kevin',
    email: 'kevin@correo.com',
    password: 'Clave1234',
    confirmPassword: 'Clave1234',
  };
  const fails = (
    schema: {
      safeParse: (v: unknown) => {
        success: boolean;
        error?: { issues: { message: string; path: PropertyKey[] }[] };
      };
    },
    value: unknown,
  ) => {
    const r = schema.safeParse(value);
    assert.equal(r.success, false);
    return r.error?.issues ?? [];
  };

  it('registro válido y nombre recortado', () => {
    const r = signUpSchema.safeParse({ ...ok, name: '  Ana  ', email: '  ana@correo.com ' });
    assert.equal(r.success, true);
    if (r.success) {
      assert.equal(r.data.name, 'Ana');
      assert.equal(r.data.email, 'ana@correo.com');
    }
  });
  it('nombre: mínimo 2 caracteres (con espacios no cuenta)', () => {
    assert.equal(signUpSchema.safeParse({ ...ok, name: 'A' }).success, false);
    assert.equal(signUpSchema.safeParse({ ...ok, name: '  A ' }).success, false);
    assert.equal(signUpSchema.safeParse({ ...ok, name: '   ' }).success, false);
    assert.equal(signUpSchema.safeParse({ ...ok, name: 'Al' }).success, true);
  });
  it('correo inválido', () => {
    for (const email of ['', 'sin-arroba', 'a@', '@b.com', 'a b@c.com']) {
      assert.equal(signUpSchema.safeParse({ ...ok, email }).success, false, email);
    }
  });
  it('contraseña: ≥ 8 con letra y número; bordes de longitud', () => {
    assert.equal(authPasswordSchema.safeParse('abcdefg1').success, true, '8 exactos');
    assert.equal(authPasswordSchema.safeParse('abcdef1').success, false, '7 caracteres');
    assert.equal(authPasswordSchema.safeParse('12345678').success, false, 'sin letra');
    assert.equal(authPasswordSchema.safeParse('abcdefgh').success, false, 'sin número');
    assert.equal(
      authPasswordSchema.safeParse('ABCDEFG1').success,
      true,
      'solo mayúsculas también sirve',
    );
    assert.equal(authPasswordSchema.safeParse('contraseña1').success, true, 'acentos y ñ');
    assert.equal(
      authPasswordSchema.safeParse('a1      ').success,
      true,
      'los espacios cuentan como caracteres',
    );
    assert.equal(authPasswordSchema.safeParse('').success, false);
  });
  it('mensajes en español bajo el campo correcto', () => {
    const short = fails(signUpSchema, { ...ok, password: 'a1', confirmPassword: 'a1' });
    assert.ok(short.some((i) => i.message === 'Mínimo 8 caracteres' && i.path[0] === 'password'));
    const noNumber = fails(signUpSchema, {
      ...ok,
      password: 'abcdefgh',
      confirmPassword: 'abcdefgh',
    });
    assert.ok(noNumber.some((i) => i.message === 'Incluye al menos un número'));
    const noLetter = fails(signUpSchema, {
      ...ok,
      password: '12345678',
      confirmPassword: '12345678',
    });
    assert.ok(noLetter.some((i) => i.message === 'Incluye al menos una letra'));
  });
  it('confirmación distinta → error en confirmPassword', () => {
    const issues = fails(signUpSchema, { ...ok, confirmPassword: 'otra1234' });
    assert.ok(
      issues.some(
        (i) => i.path[0] === 'confirmPassword' && i.message === 'Las contraseñas no coinciden',
      ),
    );
    assert.equal(signUpSchema.safeParse({ ...ok, confirmPassword: '' }).success, false);
  });
  it('inicio de sesión: correo válido y contraseña no vacía (sin reglas de fuerza)', () => {
    assert.equal(signInSchema.safeParse({ email: 'a@b.co', password: 'x' }).success, true);
    assert.equal(signInSchema.safeParse({ email: 'a@b.co', password: '' }).success, false);
    assert.equal(signInSchema.safeParse({ email: 'mal', password: 'x' }).success, false);
  });
  it('recuperar contraseña: solo correo', () => {
    assert.equal(forgotPasswordSchema.safeParse({ email: 'a@b.co' }).success, true);
    assert.equal(forgotPasswordSchema.safeParse({ email: '' }).success, false);
  });
  it('nueva contraseña: mismas reglas y confirmación', () => {
    assert.equal(
      newPasswordSchema.safeParse({ password: 'Nueva1234', confirmPassword: 'Nueva1234' }).success,
      true,
    );
    assert.equal(
      newPasswordSchema.safeParse({ password: 'Nueva1234', confirmPassword: 'Nueva12345' }).success,
      false,
    );
    assert.equal(
      newPasswordSchema.safeParse({ password: 'corta1', confirmPassword: 'corta1' }).success,
      false,
    );
  });
  it('código: exactamente 6 dígitos', () => {
    assert.equal(verifyCodeSchema.safeParse({ code: '123456' }).success, true);
    for (const code of ['', '12345', '1234567', '12345a', '12 456'])
      assert.equal(verifyCodeSchema.safeParse({ code }).success, false, code);
  });
});

describe('código OTP (parseo)', () => {
  it('deja solo dígitos y corta a 6', () => {
    assert.equal(parseOtpInput('123456'), '123456');
    assert.equal(parseOtpInput('123 456'), '123456');
    assert.equal(parseOtpInput('Tu código es 482915.'), '482915');
    assert.equal(parseOtpInput('1234567890'), '123456');
    assert.equal(parseOtpInput('abc'), '');
    assert.equal(parseOtpInput(''), '');
  });
  it('pegar el código completo en la primera casilla lo reparte; borrar retrocede', () => {
    const pasted = parseOtpInput('987654');
    assert.deepEqual(pasted.split(''), ['9', '8', '7', '6', '5', '4']);
    assert.equal(parseOtpInput(pasted.slice(0, -1)), '98765', 'borrar un carácter');
    assert.equal(parseOtpInput('12', 4), '12');
  });
  it('isOtpComplete', () => {
    assert.equal(isOtpComplete('123456'), true);
    assert.equal(isOtpComplete('12345'), false);
    assert.equal(isOtpComplete('12345a'), false);
    assert.equal(OTP_LENGTH, 6);
  });
});

describe('cuenta regresiva del reenvío', () => {
  it('empieza en 59 y termina en 0 (00:59 → 00:00)', () => {
    const t0 = 1_000_000;
    const end = countdownEnd(t0);
    assert.equal(RESEND_SECONDS, 59);
    assert.equal(remainingSeconds(end, t0), 59);
    assert.equal(formatCountdown(remainingSeconds(end, t0)), '00:59');
    assert.equal(remainingSeconds(end, t0 + 1_000), 58);
    assert.equal(remainingSeconds(end, t0 + 58_000), 1);
    assert.equal(remainingSeconds(end, t0 + 59_000), 0);
    assert.equal(formatCountdown(remainingSeconds(end, t0 + 59_000)), '00:00');
  });
  it('nunca baja de 0 aunque pase el tiempo (segundo plano)', () => {
    const end = countdownEnd(0);
    assert.equal(remainingSeconds(end, 10 * 60_000), 0);
  });
  it('redondea hacia arriba entre ticks (58,2 s restantes → 59)', () => {
    const end = countdownEnd(0);
    assert.equal(remainingSeconds(end, 800), 59);
    assert.equal(remainingSeconds(end, 1_001), 58);
  });
  it('formato mm:ss', () => {
    assert.equal(formatCountdown(5), '00:05');
    assert.equal(formatCountdown(60), '01:00');
    assert.equal(formatCountdown(75), '01:15');
    assert.equal(formatCountdown(-3), '00:00');
  });
  it('un reenvío reinicia la cuenta en 59', () => {
    const t1 = 5_000_000;
    assert.equal(remainingSeconds(countdownEnd(t1), t1), 59);
  });
});

describe('índice de pantallas (herramienta de revisión)', () => {
  const root = join(__dirname, '..');
  it('tiene las 36 pantallas del Figma, sin repetir, cada una con su captura', () => {
    assert.equal(ALL_SCREENS.length, 36);
    assert.equal(new Set(ALL_SCREENS.map((x) => x.key)).size, 36);
    for (const { key } of ALL_SCREENS)
      assert.ok(existsSync(join(root, '../design-spec/app-screens', `${key}.png`)), key);
  });
  it('cada ruta del índice corresponde a un archivo real en src/app', () => {
    for (const { key, href } of ALL_SCREENS) {
      if (href.startsWith('/_dev/')) continue; // el 404 se prueba abriendo una ruta que no existe
      const base = href === '/' ? 'index' : `${href.slice(1)}${href === '/(tabs)' ? '/index' : ''}`;
      const candidates = [`src/app/${base}.tsx`, `src/app/${base}/index.tsx`];
      assert.ok(
        candidates.some((c) => existsSync(join(root, c))),
        `${key}: ${href}`,
      );
    }
  });
  it('las pantallas marcadas como listas existen en el índice', () => {
    const keys = new Set(ALL_SCREENS.map((x) => x.key));
    for (const k of IMPLEMENTED_SCREENS) assert.ok(keys.has(k), k);
    assert.equal(
      SCREEN_GROUPS.reduce((n, g) => n + g.screens.length, 0),
      36,
    );
  });
});

describe('Actividad (etapa 7.2)', () => {
  const now = new Date(2026, 9, 6, 15, 0); // martes 6 de octubre de 2026
  const tx = (
    id: string,
    d: Date,
    type: 'income' | 'expense',
    categoryId: string | null,
    amount = 1000,
  ) => ({
    id,
    type,
    title: id,
    amount,
    accountId: 'a',
    categoryId,
    categoryLabel: 'Compras',
    icon: '🛍️',
    occurredAt: d.toISOString(),
  });

  it('encabezados de fecha en español', () => {
    assert.equal(dayHeading(new Date(2026, 9, 6, 8), now), 'Hoy');
    assert.equal(dayHeading(new Date(2026, 9, 5, 23), now), 'Ayer');
    assert.equal(dayHeading(new Date(2026, 9, 1, 9), now), 'jueves 1 de octubre');
    assert.equal(formatLongDate(new Date(2026, 9, 6), now), 'martes 6 de octubre');
    assert.equal(formatLongDate(new Date(2025, 11, 31), now), 'miércoles 31 de diciembre de 2025');
  });

  it('agrupa por día conservando el orden', () => {
    const groups = groupTransactionsByDay(
      [
        tx('a', new Date(2026, 9, 6, 10), 'expense', null),
        tx('b', new Date(2026, 9, 6, 8), 'income', null),
        tx('c', new Date(2026, 9, 5, 20), 'expense', null),
        tx('d', new Date(2026, 9, 1, 9), 'expense', null),
      ],
      now,
    );
    assert.deepEqual(
      groups.map((g) => g.label),
      ['Hoy', 'Ayer', 'jueves 1 de octubre'],
    );
    assert.deepEqual(
      groups.map((g) => g.items.length),
      [2, 1, 1],
    );
    assert.equal(groups[0]!.key, dayKey(new Date(2026, 9, 6)));
    assert.deepEqual(groupTransactionsByDay([], now), []);
  });

  it('balance del modo Ambos y serie neta', () => {
    assert.equal(computeBalance(5000, 1500), 3500);
    assert.equal(computeBalance(1000, 4000), -3000);
    const inc = ['Lun', 'Mar', 'Mié'].map((label, i) => ({ label, value: [100, 0, 50][i]! }));
    const exp = ['Lun', 'Mar', 'Mié'].map((label, i) => ({ label, value: [30, 20, 80][i]! }));
    const net = netDailySeries(inc, exp);
    assert.deepEqual(
      net.map((p) => p.value),
      [70, -20, -30],
    );
    assert.equal(
      net.reduce((n, p) => n + p.value, 0),
      computeBalance(150, 130),
    );
  });

  it('día seleccionado por defecto = hoy (Lun=0 … Dom=6)', () => {
    assert.equal(defaultSelectedDay(now), 1);
    assert.equal(weekdayPosition(new Date(2026, 9, 4)), 6); // domingo
    assert.equal(weekdayPosition(new Date(2026, 9, 5)), 0); // lunes
  });

  it('filtro por categoría y signo', () => {
    const list = [
      tx('a', now, 'expense', 'c1'),
      tx('b', now, 'income', 'c2'),
      tx('c', now, 'expense', null),
    ];
    assert.equal(filterByCategory(list, null).length, 3);
    assert.deepEqual(
      filterByCategory(list, 'c1').map((t) => t.id),
      ['a'],
    );
    assert.deepEqual(
      filterByCategory(list, NO_CATEGORY).map((t) => t.id),
      ['c'],
    );
    assert.equal(signedAmount(list[0]!), -1000);
    assert.equal(signedAmount(list[1]!), 1000);
    assert.match(transactionSubtitle(list[0]!), /^Compras, \d{1,2}:\d{2}/);
  });

  it('etiquetas de plan', () => {
    assert.deepEqual(PLAN_LABEL, { weekly: 'Semanal', monthly: 'Mensual', yearly: 'Anual' });
  });
});

import {
  AMOUNT_MAX,
  formatAmountInput,
  parseAmountInput,
  sanitizeAmountDigits,
} from '../src/lib/amountInput';
import { createAccountSchema } from '../src/features/accounts/schemas';
import { createCategorySchema } from '../src/features/categories/schemas';
import { createGoalSchema } from '../src/features/goals/schemas';
import { createSubscriptionSchema } from '../src/features/subscriptions/schemas';
import { createTransactionSchema } from '../src/features/transactions/schemas';
import {
  NO_CATEGORY_VALUE,
  categoryIdFromChoice,
  resolveAccountId,
} from '../src/features/transactions/form';
import { limitLine } from '../src/features/consult/limitText';

describe('lote 7.3 · entrada de montos', () => {
  it('separador de miles en vivo, solo dígitos y tope', () => {
    assert.equal(formatAmountInput('700000'), '¢700.000');
    assert.equal(formatAmountInput('¢7.000.000'), '¢7.000.000');
    assert.equal(formatAmountInput(''), '');
    assert.equal(formatAmountInput('abc'), '');
    assert.equal(sanitizeAmountDigits('007'), '7');
    assert.equal(sanitizeAmountDigits('1.5'), '15');
    assert.equal(sanitizeAmountDigits('9999999999'), '999999999');
    assert.equal(Number(sanitizeAmountDigits('1000000000')) <= AMOUNT_MAX, true);
  });
  it('parseo', () => {
    assert.equal(parseAmountInput('¢700.000'), 700000);
    assert.equal(parseAmountInput(''), 0);
    assert.equal(parseAmountInput('¢'), 0);
  });
});

describe('lote 7.3 · esquemas de formularios', () => {
  it('cuenta: monto inicial vacío = 0, nombre recortado, tope', () => {
    const ok = createAccountSchema.parse({ name: '  BCR ', icon: '🏛️', initialAmount: '' });
    assert.equal(ok.name, 'BCR');
    assert.equal(ok.initialAmount, 0);
    assert.equal(
      createAccountSchema.safeParse({ name: '', icon: '🏛️', initialAmount: '1' }).success,
      false,
    );
    assert.equal(
      createAccountSchema.safeParse({ name: 'x'.repeat(61), icon: '🏛️', initialAmount: '1' })
        .success,
      false,
    );
    assert.equal(
      createAccountSchema.safeParse({ name: 'A', icon: '', initialAmount: '1' }).success,
      false,
    );
    assert.equal(
      createAccountSchema.safeParse({ name: 'A', icon: '🏛️', initialAmount: '1000000000' }).success,
      false,
    );
    assert.equal(
      createAccountSchema.safeParse({ name: 'A', icon: '🏛️', initialAmount: '999999999' }).success,
      true,
    );
  });
  it('categoría', () => {
    assert.equal(createCategorySchema.safeParse({ name: 'Mascotas', icon: '🐶' }).success, true);
    assert.equal(createCategorySchema.safeParse({ name: ' ', icon: '🐶' }).success, false);
  });
  it('objetivo: meta > 0 e inicial ≤ meta', () => {
    const base = { name: 'Viaje', icon: '✈️' };
    assert.equal(
      createGoalSchema.safeParse({ ...base, targetAmount: '100', initialAmount: '' }).success,
      true,
    );
    assert.equal(
      createGoalSchema.safeParse({ ...base, targetAmount: '100', initialAmount: '100' }).success,
      true,
    );
    assert.equal(
      createGoalSchema.safeParse({ ...base, targetAmount: '100', initialAmount: '101' }).success,
      false,
    );
    assert.equal(
      createGoalSchema.safeParse({ ...base, targetAmount: '0', initialAmount: '0' }).success,
      false,
    );
  });
  it('suscripción', () => {
    const base = { name: 'Netflix', icon: '🎬', cost: '5000', status: 'active', plan: 'monthly' };
    assert.equal(createSubscriptionSchema.safeParse(base).success, true);
    assert.equal(createSubscriptionSchema.safeParse({ ...base, cost: '0' }).success, false);
    assert.equal(createSubscriptionSchema.safeParse({ ...base, plan: 'daily' }).success, false);
  });
  it('ingreso/gasto: descripción opcional, monto > 0, cuenta obligatoria', () => {
    const base = { type: 'expense', amount: '1500', title: '', accountId: 'a1', categoryId: null };
    assert.equal(createTransactionSchema.safeParse(base).success, true);
    assert.equal(createTransactionSchema.safeParse({ ...base, amount: '0' }).success, false);
    assert.equal(createTransactionSchema.safeParse({ ...base, amount: '12.5' }).success, false);
    assert.equal(createTransactionSchema.safeParse({ ...base, accountId: '' }).success, false);
  });
  it('cuenta por defecto y categoría elegida', () => {
    const accs = [{ id: 'a' }, { id: 'b' }] as never[];
    assert.equal(resolveAccountId(accs, null), 'a');
    assert.equal(resolveAccountId(accs, 'b'), 'b');
    assert.equal(resolveAccountId(accs, 'zzz'), 'a');
    assert.equal(resolveAccountId([], null), null);
    assert.equal(categoryIdFromChoice(NO_CATEGORY_VALUE), null);
    assert.equal(categoryIdFromChoice(null), null);
    assert.equal(categoryIdFromChoice('c1'), 'c1');
  });
});

describe('lote 7.3 · Consultar', () => {
  const limit = { enabled: true, amount: 100_000, period: 'monthly' as const };
  it('resultado: positivo, cero y negativo', () => {
    assert.equal(computeConsult({ balance: 830000, amount: 700000 }).remaining, 130000);
    assert.equal(computeConsult({ balance: 1000, amount: 1000 }).remaining, 0);
    assert.equal(computeConsult({ balance: 1000, amount: 1500 }).remaining, -500);
  });
  it('línea de límite: apagado, ok, cerca, superado', () => {
    const line = (l: typeof limit | null, spent: number, amount: number) =>
      limitLine(
        computeConsult({ balance: 1_000_000, amount, limit: l, spentInPeriod: spent }),
        l,
        spent,
        amount,
      );
    assert.equal(line(null, 0, 50_000), null);
    assert.equal(line({ ...limit, enabled: false }, 0, 50_000), null);
    assert.equal(line(limit, 0, 50_000), null);
    assert.equal(line(limit, 35_000, 50_000), 'Con esto usarías el 85 % de tu límite mensual');
    assert.equal(line(limit, 80_000, 50_000), 'Superarías tu límite mensual en ¢30.000');
  });
});

import {
  changePasswordSchema,
  limitSchema,
  phoneSchema,
  profileSchema,
  usernameSchema,
} from '../src/features/settings/schemas';
import { CURRENCIES, currencySymbol, setActiveCurrency } from '../src/lib/currency';
import { formatCurrency } from '../src/lib/formatCurrency';
import { formatShortDate } from '../src/lib/dates';

describe('lote 7.4 · ajustes', () => {
  it('perfil: nombre 2–60, usuario 3–30 en minúsculas, teléfono opcional', () => {
    assert.equal(
      profileSchema.safeParse({ fullName: 'Ke', username: 'kev', phone: '' }).success,
      true,
    );
    assert.equal(
      profileSchema.safeParse({ fullName: 'K', username: 'kev', phone: '' }).success,
      false,
    );
    assert.equal(
      profileSchema.safeParse({ fullName: 'x'.repeat(61), username: 'kev', phone: '' }).success,
      false,
    );
    assert.equal(usernameSchema.safeParse('kevin.m_1').success, true);
    assert.equal(usernameSchema.safeParse('Kevin').success, false);
    assert.equal(usernameSchema.safeParse('ab').success, false);
    assert.equal(usernameSchema.safeParse('a'.repeat(31)).success, false);
    assert.equal(usernameSchema.safeParse('con espacio').success, false);
    assert.equal(phoneSchema.safeParse('').success, true);
    assert.equal(phoneSchema.safeParse('+506 8888 8888').success, true);
    assert.equal(phoneSchema.safeParse('123456').success, false);
    assert.equal(phoneSchema.safeParse('1'.repeat(16)).success, false);
    assert.equal(phoneSchema.safeParse('abc1234567').success, false);
  });
  it('contraseña de Ajustes', () => {
    const ok = { currentPassword: 'x', newPassword: 'Abcdefg1', repeatPassword: 'Abcdefg1' };
    assert.equal(changePasswordSchema.safeParse(ok).success, true);
    for (const bad of ['abcdefg1', 'ABCDEFG1', 'Abcdefgh', 'Abc1']) {
      assert.equal(
        changePasswordSchema.safeParse({ ...ok, newPassword: bad, repeatPassword: bad }).success,
        false,
        bad,
      );
    }
    assert.equal(
      changePasswordSchema.safeParse({ ...ok, repeatPassword: 'Otra1234' }).success,
      false,
    );
    assert.equal(changePasswordSchema.safeParse({ ...ok, currentPassword: '' }).success, false);
  });
  it('límite: activo exige monto > 0; inactivo permite 0', () => {
    assert.equal(
      limitSchema.safeParse({ enabled: true, amount: '0', period: 'weekly' }).success,
      false,
    );
    assert.equal(
      limitSchema.safeParse({ enabled: false, amount: '0', period: 'monthly' }).success,
      true,
    );
    assert.equal(
      limitSchema.safeParse({ enabled: true, amount: '300000', period: 'monthly' }).success,
      true,
    );
    assert.equal(
      limitSchema.safeParse({ enabled: true, amount: '5', period: 'daily' }).success,
      false,
    );
  });
  it('moneda por código', () => {
    assert.deepEqual(
      CURRENCIES.map((c) => c.code),
      ['CRC', 'USD', 'EUR', 'GBP'],
    );
    assert.equal(currencySymbol('USD'), '$');
    assert.equal(formatCurrency(1500), '¢1.500');
    setActiveCurrency('USD');
    assert.equal(formatCurrency(1500), '$1.500');
    assert.equal(formatCurrency(-1500, { spaced: true }), '-$ 1.500');
    setActiveCurrency('EUR');
    assert.equal(formatCurrency(20, { showPlus: true }), '+€20');
    setActiveCurrency('CRC');
    assert.equal(formatCurrency(1500), '¢1.500');
  });
  it('"Próxima fecha" en español y hora local', () => {
    assert.equal(formatShortDate(parseLocalDate('2026-10-11')), '11 oct. 2026');
    assert.equal(formatShortDate(parseLocalDate('2026-01-01')), '1 ene. 2026');
  });
});

import { DELETE_ACCOUNT_UNAVAILABLE, isFunctionUnavailable } from '../src/data/supabase/errors';
import { createMockRepositories } from '../src/data/mock';
import { buildDataExport, serializeExport } from '../src/features/settings/exportData';
import { FAQ, HELP_CENTER } from '../src/features/settings/helpContent';
import {
  APPEARANCE_OPTIONS,
  LANGUAGE_OPTIONS,
  NOTIFICATION_ITEMS,
  withNotificationPref,
} from '../src/features/settings/options';
import { SUPPORT_SUBJECT, buildBugReportBody, buildMailto } from '../src/features/settings/support';

describe('lote 7.5 · ajustes de la app', () => {
  it('exportación: forma del JSON, sin tokens ni identificadores internos del perfil', async () => {
    const repos = createMockRepositories();
    const data = await buildDataExport(repos, new Date('2026-10-06T12:00:00Z'));
    assert.equal(data.app, 'Pigxel');
    assert.equal(data.exportedAt, '2026-10-06T12:00:00.000Z');
    for (const k of [
      'profile',
      'settings',
      'accounts',
      'categories',
      'transactions',
      'subscriptions',
      'goals',
    ]) {
      assert.ok(k in data, k);
    }
    assert.deepEqual(Object.keys(data.profile).sort(), ['email', 'fullName', 'phone', 'username']);
    const json = serializeExport(data);
    assert.deepEqual(JSON.parse(json), JSON.parse(JSON.stringify(data)));
    assert.doesNotMatch(json, /token|password|contrase|service_role|apikey/i);
    assert.ok(json.includes('\n  "'), 'legible (con sangría)');
    assert.ok(data.accounts.length > 0);
  });
  it('FAQ y centro de ayuda: 4–6 textos no vacíos y sin repetir', () => {
    for (const list of [FAQ, HELP_CENTER]) {
      assert.ok(list.length >= 4 && list.length <= 6);
      for (const i of list) {
        assert.ok(i.question.trim().length > 5 && i.answer.trim().length > 20);
      }
      assert.equal(new Set(list.map((i) => i.question)).size, list.length);
    }
  });
  it('mailto: codificación y campos', () => {
    const url = buildMailto({
      to: ' ayuda@pigxel.app ',
      subject: 'Reporte de error · Pigxel',
      body: 'Línea 1\nCon & signo = ñ',
    });
    assert.ok(url.startsWith('mailto:ayuda@pigxel.app?subject='));
    assert.ok(url.includes('subject=Reporte%20de%20error%20%C2%B7%20Pigxel'));
    assert.ok(url.includes('body=L%C3%ADnea%201%0ACon%20%26%20signo%20%3D%20%C3%B1'));
    assert.equal(url.includes(' '), false);
    assert.equal(buildMailto({ to: 'a@b.co', subject: 'x' }), 'mailto:a@b.co?subject=x');
    const body = buildBugReportBody({ appVersion: '1.0.0', platform: 'iOS', osVersion: '26.0' });
    assert.match(body, /Versión de Pigxel: 1\.0\.0/);
    assert.match(body, /Plataforma: iOS/);
    assert.match(body, /Versión del sistema: 26\.0/);
    assert.deepEqual(Object.keys(SUPPORT_SUBJECT).sort(), ['bug', 'feedback', 'support']);
  });
  it('preferencias de notificaciones', () => {
    assert.deepEqual(
      NOTIFICATION_ITEMS.map((i) => i.key),
      ['subscriptions', 'goals', 'limit', 'activity', 'news'],
    );
    const prefs = {
      subscriptions: true,
      goals: true,
      limit: true,
      activity: false,
      news: true,
      email: true,
    };
    const next = withNotificationPref(prefs, 'activity', true);
    assert.equal(next.activity, true);
    assert.equal(prefs.activity, false);
    assert.deepEqual({ ...next, activity: false }, prefs);
    assert.equal(APPEARANCE_OPTIONS.length, 3);
    assert.deepEqual(
      LANGUAGE_OPTIONS.map((l) => l.value),
      ['es', 'en', 'pt', 'fr', 'de'],
    );
  });
  it('eliminar cuenta: función inexistente se reconoce', () => {
    assert.equal(isFunctionUnavailable({ context: { status: 404 } }), true);
    assert.equal(isFunctionUnavailable({ name: 'FunctionsFetchError' }), true);
    assert.equal(
      isFunctionUnavailable({ name: 'FunctionsHttpError', context: { status: 500 } }),
      false,
    );
    assert.equal(DELETE_ACCOUNT_UNAVAILABLE, 'Esta función aún no está disponible');
  });
  it('mock: deleteAccount cierra sesión sin fallar', async () => {
    await createMockRepositories().settings.deleteAccount();
  });
  it('cierre del frontend: 36 pantallas, todas listas, con archivo y sin stubs', () => {
    const all = SCREEN_GROUPS.flatMap((g) => g.screens);
    assert.equal(all.length, 36);
    const root = join(__dirname, '../src/app');
    for (const s of all) {
      assert.ok(IMPLEMENTED_SCREENS.has(s.key), `${s.key} no está marcada como lista`);
      if (s.key === 'error-404') continue; // abre una ruta inexistente a propósito
      const path = s.href === '/' ? 'index' : s.href.slice(1);
      const candidates = [`${path}.tsx`, `${path}/index.tsx`];
      const file = candidates.map((c) => join(root, c)).find(existsSync);
      assert.ok(file, `sin archivo para ${s.href}`);
      assert.doesNotMatch(
        readFileSync(file as string, 'utf8'),
        /ScreenPlaceholder/,
        `${s.href} sigue siendo stub`,
      );
    }
    assert.equal(IMPLEMENTED_SCREENS.size, 36);
  });
});
