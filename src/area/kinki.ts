import admZip from "adm-zip"
import { getSite, getZip, getPath, getPathShika, IKA, SHIKA, type Info, type IZipEntry } from "./common.ts"

const ROOT = "https://kouseikyoku.mhlw.go.jp";
const SITE_PATH = `${ROOT}/kinki/tyousa/shinkishitei.html`;
const FILE_NAME = "^[0-9]{4}\.[0-9]?[0-9]_kikanzentai_(?<name>.+)_ika(heisetu)?.xlsx";
const FILE_NAME3 = "^[0-9]{4}\.[0-9]?[0-9]_kikanzentai_(?<name>.+)_sika(heisetu)?.xlsx";

export async function getExcels(info: Info): Promise<IZipEntry[]> {
  const html = await getSite(info.site);
  const zippath = getPath(info.root, html);
  const buffer = await getZip(zippath);
  const admzip = new admZip(buffer);
  const list = admzip.getEntries().filter(ent => !ent.isDirectory)
    .map(ent => ({ ...ent, tenCode: ent.name.includes("ikaheisetu") ? SHIKA : IKA }));
  const zippathShika = getPathShika(info.root, html);
  const bufferShika = await getZip(zippathShika);
  const admzipShika = new admZip(bufferShika);
  return [...list, ...admzipShika.getEntries().filter(ent => !ent.isDirectory)
    .map(ent => ({ ...ent, tenCode: ent.name.includes("sikaheisetu") ? IKA : SHIKA }))];
}

export const area = {
  get: getExcels,
  info: {
    root: ROOT,
    site: SITE_PATH,
    file: FILE_NAME,
    file3: FILE_NAME3
  } as const
}