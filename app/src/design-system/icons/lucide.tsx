import AtSign from 'lucide-react-native/icons/at-sign';
import ArrowRight from 'lucide-react-native/icons/arrow-right';
import BadgeCheck from 'lucide-react-native/icons/badge-check';
import Banknote from 'lucide-react-native/icons/banknote';
import Bell from 'lucide-react-native/icons/bell';
import BellDot from 'lucide-react-native/icons/bell-dot';
import BookOpen from 'lucide-react-native/icons/book-open';
import Bug from 'lucide-react-native/icons/bug';
import Bus from 'lucide-react-native/icons/bus';
import Calendar from 'lucide-react-native/icons/calendar';
import ChartColumn from 'lucide-react-native/icons/chart-column';
import ChartNoAxesColumn from 'lucide-react-native/icons/chart-no-axes-column';
import ChartNoAxesColumnIncreasing from 'lucide-react-native/icons/chart-no-axes-column-increasing';
import Check from 'lucide-react-native/icons/check';
import ChevronLeft from 'lucide-react-native/icons/chevron-left';
import ChevronRight from 'lucide-react-native/icons/chevron-right';
import CircleHelp from 'lucide-react-native/icons/circle-question-mark';
import Cloud from 'lucide-react-native/icons/cloud';
import CreditCard from 'lucide-react-native/icons/credit-card';
import Download from 'lucide-react-native/icons/download';
import Ellipsis from 'lucide-react-native/icons/ellipsis';
import Eye from 'lucide-react-native/icons/eye';
import EyeOff from 'lucide-react-native/icons/eye-off';
import FileLock2 from 'lucide-react-native/icons/file-lock';
import FileText from 'lucide-react-native/icons/file-text';
import Film from 'lucide-react-native/icons/film';
import Gauge from 'lucide-react-native/icons/gauge';
import Globe from 'lucide-react-native/icons/globe';
import GraduationCap from 'lucide-react-native/icons/graduation-cap';
import Headphones from 'lucide-react-native/icons/headphones';
import Heart from 'lucide-react-native/icons/heart';
import House from 'lucide-react-native/icons/house';
import Info from 'lucide-react-native/icons/info';
import KeyRound from 'lucide-react-native/icons/key-round';
import Layers from 'lucide-react-native/icons/layers';
import ListFilter from 'lucide-react-native/icons/list-filter';
import LogOut from 'lucide-react-native/icons/log-out';
import Lock from 'lucide-react-native/icons/lock';
import LockKeyhole from 'lucide-react-native/icons/lock-keyhole';
import Mail from 'lucide-react-native/icons/mail';
import MessageSquare from 'lucide-react-native/icons/message-square';
import MessageSquareText from 'lucide-react-native/icons/message-square-text';
import Monitor from 'lucide-react-native/icons/monitor';
import Moon from 'lucide-react-native/icons/moon';
import NotebookText from 'lucide-react-native/icons/notebook-text';
import Pencil from 'lucide-react-native/icons/pencil';
import PiggyBank from 'lucide-react-native/icons/piggy-bank';
import Play from 'lucide-react-native/icons/play';
import Plus from 'lucide-react-native/icons/plus';
import Popcorn from 'lucide-react-native/icons/popcorn';
import Search from 'lucide-react-native/icons/search';
import ShieldCheck from 'lucide-react-native/icons/shield-check';
import ShoppingBag from 'lucide-react-native/icons/shopping-bag';
import Sparkles from 'lucide-react-native/icons/sparkles';
import Sun from 'lucide-react-native/icons/sun';
import Tags from 'lucide-react-native/icons/tags';
import Target from 'lucide-react-native/icons/target';
import Trash2 from 'lucide-react-native/icons/trash';
import User from 'lucide-react-native/icons/user';
import UserRound from 'lucide-react-native/icons/user-round';
import Utensils from 'lucide-react-native/icons/utensils';
import Wallet from 'lucide-react-native/icons/wallet';
import X from 'lucide-react-native/icons/x';
import type { ComponentType } from 'react';

/**
 * ÚNICO sistema de íconos de línea de la app (Lucide). Se importan UNO A UNO desde
 * `lucide-react-native/icons/*` para que el bundle incluya solo estos 61 (no los ~1.700 del paquete).
 * Para añadir un ícono: importarlo aquí y agregarlo al mapa (el test de íconos verifica que exista).
 * Se usan con `<Icon name="…" />` (primitives/Icon.tsx); catálogo y mapa de reemplazo: docs/fidelity-iconos.md.
 */
export const lucideIcons = {
  'arrow-right': ArrowRight,
  'at-sign': AtSign,
  'badge-check': BadgeCheck,
  banknote: Banknote,
  bell: Bell,
  'bell-dot': BellDot,
  'book-open': BookOpen,
  bug: Bug,
  bus: Bus,
  calendar: Calendar,
  'chart-column': ChartColumn,
  'chart-no-axes-column': ChartNoAxesColumn,
  'chart-no-axes-column-increasing': ChartNoAxesColumnIncreasing,
  check: Check,
  'chevron-left': ChevronLeft,
  'chevron-right': ChevronRight,
  'circle-help': CircleHelp,
  cloud: Cloud,
  'credit-card': CreditCard,
  download: Download,
  ellipsis: Ellipsis,
  eye: Eye,
  'eye-off': EyeOff,
  'file-lock-2': FileLock2,
  'file-text': FileText,
  film: Film,
  gauge: Gauge,
  globe: Globe,
  'graduation-cap': GraduationCap,
  headphones: Headphones,
  heart: Heart,
  house: House,
  info: Info,
  'key-round': KeyRound,
  layers: Layers,
  'list-filter': ListFilter,
  lock: Lock,
  'log-out': LogOut,
  'lock-keyhole': LockKeyhole,
  mail: Mail,
  'message-square': MessageSquare,
  'message-square-text': MessageSquareText,
  monitor: Monitor,
  moon: Moon,
  'notebook-text': NotebookText,
  pencil: Pencil,
  'piggy-bank': PiggyBank,
  play: Play,
  plus: Plus,
  popcorn: Popcorn,
  search: Search,
  'shield-check': ShieldCheck,
  'shopping-bag': ShoppingBag,
  sparkles: Sparkles,
  sun: Sun,
  tags: Tags,
  target: Target,
  'trash-2': Trash2,
  user: User,
  'user-round': UserRound,
  utensils: Utensils,
  wallet: Wallet,
  x: X,
} as const;

export type LucideName = keyof typeof lucideIcons;
export type LucideComponent = ComponentType<{
  size?: number;
  color?: string;
  strokeWidth?: number;
}>;
