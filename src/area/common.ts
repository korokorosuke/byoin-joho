import { JSDOM } from "jsdom"
import admZip from "adm-zip"

export interface Info {
  root: string
  site: string
  file: string
}

export type IZipEntry = {
  name: string
  getData: () => Buffer
}

export async function getSite(url: string): Promise<string> {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`status: ${res.status} error`);
  }
  return await res.text();
}

export function getPath(root: string, s :string, extension: string=".zip", query: string="table a"): string{
  const dom = new JSDOM(s);
  const elems:NodeListOf<HTMLAnchorElement> = dom.window.document.querySelectorAll<HTMLAnchorElement>(query);
  for(const elem of elems){
    if(elem.href.endsWith(extension)){
      return `${root}${elem.href}`;
    }
  }
  throw new Error("Can't get file path");
}

export async function getZip(path: string): Promise<Buffer> {
  const res = await fetch(path);
  if (!res.ok) {
    throw new Error("download error");
  }

  const zip = await res.blob();
  const arrayBuffer = await zip.arrayBuffer();
  return Buffer.from(arrayBuffer);
}

export async function getExcels(info: Info): Promise<admZip.IZipEntry[]> {
  const html = await getSite(info.site);
  const zippath = getPath(info.root, html);
  const buffer = await getZip(zippath);
  const admzip = new admZip(buffer);
  return admzip.getEntries().filter(ent => !ent.isDirectory);
}

export const KEN_CODE = {
  "北海道": "01", "青森県": "02", "岩手県": "03", "宮城県": "04", "秋田県": "05",
  "山形県": "06", "福島県": "07", "茨城県": "08", "栃木県": "09", "群馬県": "10",
  "埼玉県": "11", "千葉県": "12", "東京都": "13", "神奈川県": "14", "新潟県": "15",
  "富山県": "16", "石川県": "17", "福井県": "18", "山梨県": "19", "長野県": "20",
  "岐阜県": "21", "静岡県": "22", "愛知県": "23", "三重県": "24", "滋賀県": "25",
  "京都府": "26", "大阪府": "27", "兵庫県": "28", "奈良県": "29", "和歌山県": "30",
  "鳥取県": "31", "島根県": "32", "岡山県": "33", "広島県": "34", "山口県": "35",
  "徳島県": "36", "香川県": "37", "愛媛県": "38", "高知県": "39", "福岡県": "40",
  "佐賀県": "41", "長崎県": "42", "熊本県": "43", "大分県": "44", "宮崎県": "45",
  "鹿児島県": "46", "沖縄県": "47", } as const;

export const KEN_MAP = new Map(Object.entries(KEN_CODE));