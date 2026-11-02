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