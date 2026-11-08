/**
 * Remove acentos e caixa para permitir busca tolerante (ex.: "jesus" encontra "Jesús"/"JESUS").
 * Letras transcritas variam grafia e capitalização, então a busca não pode ser sensível a isso.
 */
export function normalizeText(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase();
}
