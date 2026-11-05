import { JSDOM } from "jsdom"
import { getSite, IKA, SHIKA, type Info, type IZipEntry } from "./common.ts"

const ROOT = "https://kouseikyoku.mhlw.go.jp";
const SITE_PATH = `${ROOT}/tohoku/gyomu/gyomu/hoken_kikan/itiran.html`;
const FILE_NAME = "(?<name>.+).xlsx";

function getPaths(root: string, s :string, pred: (elem: HTMLAnchorElement)=>boolean): string[] {
  const dom = new JSDOM(s);
  const elems:NodeListOf<HTMLAnchorElement> = dom.window.document.querySelectorAll<HTMLAnchorElement>("table a");
  let isExists = false;
  const list = [];
  for(const elem of elems){
    if(pred(elem)){
      list.push(`${root}${elem.href}`);
      isExists = true;
      continue;
    }
    if (isExists) {
      break;
    }
  }
  if (list.length > 0) {
    return list;
  }
  throw new Error("Can't get zip file path");
}

function getPathsIka(root: string, s: string){
  return getPaths(root, s, elem => (elem.text.startsWith("医科［") || elem.text.startsWith("歯科併設")) && elem.href.endsWith(".xlsx"));
}

function getPathsShika(root: string, s: string): string[] {
  return getPaths(root, s, elem => (elem.text.startsWith("歯科［") || elem.text.startsWith("医科併設")) && elem.href.endsWith(".xlsx"));
}

async function getExcel(path: string): Promise<Buffer> {
  const res = await fetch(path);
  if (!res.ok) {
    throw new Error("download error");
  }

  const zip = await res.blob();
  const arrayBuffer = await zip.arrayBuffer();
  return Buffer.from(arrayBuffer);
}

async function getExcels(info: Info): Promise<IZipEntry[]> {
  const html = await getSite(info.site);
  const paths = getPathsIka(info.root, html);
  let list: IZipEntry[] = [];
  for(const path of paths){
    const buffer = await getExcel(path);
    list.push({
      name: "東北.xlsx",
      getData: () => buffer,
      tenCode: IKA
    });
  }
  const pathsShika = getPathsShika(info.root, html);
  for(const path of pathsShika){
    const buffer = await getExcel(path);
    list.push({
      name: "東北歯科.xlsx",
      getData: () => buffer,
      tenCode: SHIKA
    });
  }
  return list;
}

export const area = {
  get: getExcels,
  info: {
    root: ROOT,
    site: SITE_PATH,
    file: FILE_NAME,
    file3: FILE_NAME
  } as const
}