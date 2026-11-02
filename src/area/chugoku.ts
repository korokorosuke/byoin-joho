import { getExcels } from "./common.ts"

const ROOT = "https://kouseikyoku.mhlw.go.jp";
const SITE_PATH = `${ROOT}/chugokushikoku/chousaka/iryoukikanshitei.html`;
const FILE_NAME = "医科_[0-9]{2}_(.+)_コード内容別医療機関一覧表.xlsx";

export const area = {
  get: getExcels,
  info: {
    root: ROOT,
    site: SITE_PATH,
    file: FILE_NAME
  } as const
}