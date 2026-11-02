export { getExcels } from "./common.ts"

const ROOT = "https://kouseikyoku.mhlw.go.jp";
const SITE_PATH = `${ROOT}//shikoku/gyomu/gyomu/hoken_kikan/shitei/index.html`;
const FILE_NAME = "01_[0-9]{2}[_ ](.+) 医科 コード内容別医療機関一覧表.xlsx";

export const INFO = {
  root: ROOT,
  site: SITE_PATH,
  file: FILE_NAME
} as const;