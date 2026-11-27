/** Obras publicadas. Implementação completa na T5; hoje não há obra publicada. */
export type ObraResumo = { slug: string };

export function getPublishedObras(): ObraResumo[] {
  return [];
}

export function hasPublishedObras() {
  return getPublishedObras().length > 0;
}
