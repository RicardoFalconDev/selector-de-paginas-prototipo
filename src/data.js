import { asset } from './asset.js';

const PATTERN_COUNT = 13;

/** Total de páginas del documento que se muestra en el selector. */
export const TOTAL_PAGES = 32;

/** Páginas del documento; las miniaturas reciclan las 13 hojas recortadas de los patrones de Figma. */
export const PAGES = Array.from({ length: TOTAL_PAGES }, (_, i) => ({
  number: i + 1,
  thumb: asset(`pages/clean-${(i % PATTERN_COUNT) + 1}.jpg`),
}));

/** Cantidad máxima de chips visibles antes de colapsar en "+N". */
export const MAX_VISIBLE_CHIPS = 7;

/** Selección inicial: la firma arranca en la página 1. */
export const DEFAULT_SELECTION = [1];
