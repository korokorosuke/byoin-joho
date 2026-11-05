import { getExcels } from "./common.ts"

const ROOT = "https://kouseikyoku.mhlw.go.jp";
const SITE_PATH = `${ROOT}//shikoku/gyomu/gyomu/hoken_kikan/shitei/index.html`;
const FILE_NAME = "01_[0-9]{2}[_ ](?<name>.+) 医科 コード内容別医療機関一覧表.xlsx";
const FILE_NAME3 = "01_[0-9]{2}[_ ](?<name>.+) 歯科 コード内容別医療機関一覧表.xlsx";

export const area = {
  get: getExcels,
  info: {
    root: ROOT,
    site: SITE_PATH,
    file: FILE_NAME,
    file3: FILE_NAME3,
  } as const
}