import type { Href } from 'expo-router';

/** Lo mínimo del router que necesitamos (compatible con `useRouter()`). */
interface BackRouter {
  canGoBack: () => boolean;
  back: () => void;
  replace: (href: Href) => void;
}

/** Vuelve atrás si hay historial; si no (p. ej. se abrió por enlace), va a `fallback`. */
export function goBackOr(router: BackRouter, fallback: Href): void {
  if (router.canGoBack()) router.back();
  else router.replace(fallback);
}
