export { getExcels } from "./common.ts"

const ROOT = "https://kouseikyoku.mhlw.go.jp";
const SITE_PATH = `${ROOT}/kinki/tyousa/shinkishitei.html`;
const FILE_NAME = "^[0-9]{4}\.[0-9]?[0-9]_kikanzentai_(.+)_ika(heisetu)?.xlsx";

export const INFO = {
  root: ROOT,
  site: SITE_PATH,
  file: FILE_NAME
} as const;