import type {DirectorRole} from './schema';

export const PALETTE_IDS = [
  'deep-ocean',
  'violet-sunset',
  'teal-signal',
  'editorial-cream',
  'acid-action',
  'paper-sketch',
] as const;

export type PaletteId = (typeof PALETTE_IDS)[number];

export type Palette = {
  id: PaletteId;
  canvas: string;
  surface: string;
  card: string;
  foreground: string;
  muted: string;
  accent: string;
  line: string;
};

export const PALETTES: Record<PaletteId, Palette> = {
  'deep-ocean': {
    id: 'deep-ocean', canvas: '#0b1325', surface: '#141d32', card: '#183153',
    foreground: '#f6f2e8', muted: '#b8c2d3', accent: '#ff6846', line: '#55d7ff',
  },
  'violet-sunset': {
    id: 'violet-sunset', canvas: '#100f23', surface: '#191634', card: '#292451',
    foreground: '#fff7ed', muted: '#d8cfea', accent: '#f43f8d', line: '#8b6cff',
  },
  'teal-signal': {
    id: 'teal-signal', canvas: '#071b22', surface: '#0f2b33', card: '#17404a',
    foreground: '#effffb', muted: '#b7d8d4', accent: '#54f2d2', line: '#55d7ff',
  },
  'editorial-cream': {
    id: 'editorial-cream', canvas: '#f4f0e8', surface: '#fffaf0', card: '#eee4d3',
    foreground: '#18181b', muted: '#5f5b55', accent: '#d92d20', line: '#2563eb',
  },
  'acid-action': {
    id: 'acid-action', canvas: '#111827', surface: '#1b2436', card: '#273248',
    foreground: '#f8fafc', muted: '#bdc7d8', accent: '#c7f000', line: '#facc15',
  },
  'paper-sketch': {
    id: 'paper-sketch', canvas: '#e8dfcb', surface: '#f4efe4', card: '#fffaf0',
    foreground: '#252933', muted: '#6b675e', accent: '#e97a5f', line: '#4a8fa3',
  },
};

export const paletteForRole = (role: DirectorRole, index: number, hasIllustration = false): PaletteId => {
  if (hasIllustration) return 'paper-sketch';
  if (role === 'hook') return 'deep-ocean';
  if (role === 'contrast' || role === 'problem') return 'editorial-cream';
  if (role === 'mechanism' || role === 'steps') return 'teal-signal';
  if (role === 'payoff' || role === 'cta') return 'acid-action';
  if (role === 'data' || role === 'evidence') return index % 2 ? 'violet-sunset' : 'deep-ocean';
  return index % 2 ? 'violet-sunset' : 'deep-ocean';
};
