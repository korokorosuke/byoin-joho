import { JSDOM } from "jsdom"
import admZip from "adm-zip"

export const IKA = "1";
export const SHIKA = "3";

export interface Info {
  root: string
  site: string
  file: string
  file3: string
}

export type IZipEntry = {
  name: string
  getData: () => Buffer
  tenCode: string
}

export async function getSite(url: string): Promise<string> {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`status: ${res.status} error`);
  }
  return await res.text();
}

export function getPath(root: string, s :string, next: boolean=false, extension: string=".zip", query: string="table a"): string{
  const dom = new JSDOM(s);
  const elems:NodeListOf<HTMLAnchorElement> = dom.window.document.querySelectorAll<HTMLAnchorElement>(query);
  for(const elem of elems){
    if(elem.href.endsWith(extension)){
      if(next){
        next = false;
      }else{
        return `${root}${elem.href}`;
      }
    }
  }
  throw new Error("Can't get file path");
}

export function getPathShika(root: string, s :string, extension: string=".zip", query: string="table a"): string{
  return getPath(root, s, true, extension, query);
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

export async function getExcels(info: Info): Promise<IZipEntry[]> {
  const html = await getSite(info.site);
  const zippath = getPath(info.root, html);
  const buffer = await getZip(zippath);
  const admzip = new admZip(buffer);
  const list = admzip.getEntries().filter(ent => !ent.isDirectory)
    .map(ent => ({ ...ent, tenCode: IKA }));
  const zippathShika = getPathShika(info.root, html);
  const bufferShika = await getZip(zippathShika);
  const admzipShika = new admZip(bufferShika);
  return [...list, ...admzipShika.getEntries().filter(ent => !ent.isDirectory)
    .map(ent => ({ ...ent, tenCode: SHIKA }))];
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

const DEPT = {
  "内": "内科", "小外": "小児外科", "リウ": "リウマチ科", "精": "精神科", "皮ひ": "皮膚泌尿器科",
  "アレ": "アレルギー科", "神": "神経科", "皮": "皮膚科", "病理": "病理診断科", "神内": "神経内科",
  "ひ": "泌尿器科", "臨床": "臨床検査科", "呼": "呼吸器科", "性": "性病科", "救命": "救急科",
  "胃": "胃腸科", "こう": "こう門科", "歯": "歯科", "消": "消化器科", "消胃": "消化器科",
  "産婦": "産婦人科", "矯歯": "矯正歯科", "循": "循環器科", "産": "産科", "小歯": "小児歯科",
  "小": "小児科", "婦": "婦人科", "歯外": "歯科口腔外科", "外": "外科", "眼": "眼科",
  "呼内": "呼吸器内科", "整外": "整形外科", "耳い": "耳鼻いんこう科", "耳": "耳鼻いんこう科", "透析": "人工透析内科",
  "形外": "形成外科", "気食": "気管食道科", "脳内": "脳神経内科", "美外": "美容外科", "リハ": "リハビリテーション科",
  "和漢": "漢方内科", "脳外": "脳神経外科", "放": "放射線科", "胸外": "胸部外科", "呼外": "呼吸器外科",
  "麻": "麻酔科", "心外": "心臓血管外科", "心内": "心療内科" } as const;

export const DEPT_MAP = new Map(Object.entries(DEPT));