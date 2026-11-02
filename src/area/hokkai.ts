import { JSDOM } from "jsdom"
import { getSite, getPath, type Info, type IZipEntry } from "./common.ts"

const ROOT = "https://kouseikyoku.mhlw.go.jp";
const SITE_PATH = `${ROOT}/hokkaido/gyomu/gyomu/hoken_kikan/code_ichiran.html`;
const FILE_NAME = "(.+).xlsx";

export const INFO = {
  root: ROOT,
  site: SITE_PATH,
  file: FILE_NAME
} as const;

async function getExcel(path: string): Promise<Buffer> {
  const res = await fetch(path);
  if (!res.ok) {
    throw new Error("download error");
  }

  const zip = await res.blob();
  const arrayBuffer = await zip.arrayBuffer();
  return Buffer.from(arrayBuffer);
}

export async function getExcels(info: Info): Promise<IZipEntry[]> {
  const html = await getSite(info.site);
  const path = getPath(info.root, html, ".xlsx");
  const buffer = await getExcel(path);
  return [{
    name: "北海道.xlsx",
    getData: () => buffer
  }];
}