/** Soporte: construcción de `mailto:` (sin dependencias de React Native). */
export interface MailtoInput {
  to: string;
  subject: string;
  body?: string;
}

/** `mailto:` con asunto y cuerpo codificados (acentos, saltos de línea y símbolos seguros). */
export function buildMailto({ to, subject, body }: MailtoInput): string {
  const params = [`subject=${encodeURIComponent(subject)}`];
  if (body) params.push(`body=${encodeURIComponent(body)}`);
  return `mailto:${to.trim()}?${params.join('&')}`;
}

export interface DiagnosticInfo {
  appVersion: string;
  platform: string;
  osVersion: string;
}

/** Cuerpo del reporte de error: pide los pasos e incluye versión de la app, plataforma y sistema. */
export function buildBugReportBody({ appVersion, platform, osVersion }: DiagnosticInfo): string {
  return [
    'Describe qué pasó y qué esperabas que pasara:',
    '',
    '',
    'Pasos para repetirlo:',
    '1. ',
    '',
    '---',
    `Versión de Pigxel: ${appVersion}`,
    `Plataforma: ${platform}`,
    `Versión del sistema: ${osVersion}`,
  ].join('\n');
}

export type SupportKind = 'support' | 'feedback' | 'bug';

export const SUPPORT_SUBJECT: Record<SupportKind, string> = {
  support: 'Soporte técnico · Pigxel',
  feedback: 'Comentarios · Pigxel',
  bug: 'Reporte de error · Pigxel',
};
