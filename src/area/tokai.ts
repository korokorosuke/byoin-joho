import admZip from "adm-zip"
import iconv from "iconv-lite"
import { getSite, getZip, getPath, IKA, SHIKA, type Info, type IZipEntry } from "./common.ts"

const ROOT = "https://kouseikyoku.mhlw.go.jp";
const SITE_PATH = `${ROOT}/tokaihokuriku/newpage_00287.html`;
const FILE_NAME = "[0-9]{4}（(?<name>.+)医科）コード内容別医療機関一覧表.xlsx";
const FILE_NAME3 = "[0-9]{4}（(?<name>.+)歯科）コード内容別医療機関一覧表.xlsx";

async function getExcels(info: Info): Promise<IZipEntry[]> {
  const html = await getSite(info.site);
  const path = getPath(info.root, html, false, ".zip", "ul a");
  const buffer = await getZip(path);
  const admzip = new admZip(buffer,
    {
      decoder: {
        decode: (buf: Buffer) => iconv.decode(buf, "cp932"),
        encode: (str: string) => iconv.encode(str, "cp932"),
      }
    });
  const list = admzip.getEntries().filter(ent => !ent.isDirectory)
    .map(ent => ({...ent, tenCode: IKA}));
  const pathShika = getPath(info.root, html, true, ".zip", "ul a");
  const bufferShika = await getZip(pathShika);
  const admzipShika = new admZip(bufferShika,
    {
      decoder: {
        decode: (buf: Buffer) => iconv.decode(buf, "cp932"),
        encode: (str: string) => iconv.encode(str, "cp932"),
      }
    });
  return [...list, ...admzipShika.getEntries().filter(ent => !ent.isDirectory)
    .map(ent => ({...ent, tenCode: SHIKA}))];
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