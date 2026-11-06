import ExcelJS from "exceljs"
import { reFind } from "./util.ts"
import { KEN_MAP } from "./area/common.ts"

const COL_NO = 1;
const COL_ID = 2;
const COL_NAME = 3;
const COL_ZIP = 4;
const COL_TEL = 5;
const COL_DR_COUNT = 5;
const COL_BOSS = 7;
const COL_DEPT = 9;
const COL_TYPE = 10;
const COL_KEN = 2;

const SEEK_COUNT = 20;

const IKA = "1";
const SHIKA = "3";

type Ok = {
  ok: true
  no: number
  row: number
}
type Ng = {
  ok: false
}
type Next = Ok | Ng;

export interface DeptAndBed{
  dept: string
  bed: {
    name: string
    count: number
  }[],
}

export interface Address{
  zip: string
  address: string
}

export interface Memo{
  type: string
  status: string
  memo: string
}

export interface OutData {
  kenCode: string
  tenCode: string
  no: string
  id: string
  name: string
  address: Address
  tel: string
  drCount: string
  boss: string
  type: string
  status: string
  memo: string
  deptbeds: DeptAndBed
}

function next(sheet: ExcelJS.Worksheet, row: number): Next {
  let cnt = 0;
  while (cnt < SEEK_COUNT) {
    row++;
    const val = sheet.getCell(row, COL_NO).text;
    if(val && val.trim()){
      const no = Number(val);
      if (!isNaN(no)) {
        return { ok: true, no, row };
      }
    }
    cnt++;
  }
  return {
    ok: false,
  };
}

function getDeptAndBed(sheet: ExcelJS.Worksheet, row: number, col: number, nextRow: number): DeptAndBed{
  let data: DeptAndBed = {
    dept: "",
    bed: [],
  };
  let isDeptFind = false;
  let tempCount = "";
  let isTemp = false;
  for (let i = nextRow - 1; i >= row; i--){
    const val = sheet.getCell(i, col).text;
    if (isTemp) {
      data.bed.push({ name: val.trim(), count: parseInt(tempCount) });
      isTemp = false;
      tempCount = "";
    }else if (/.+[0-9]+/.test(val)) {
      const res = /(.+)\s+([0-9]+)/.exec(val);
      if (isTemp && res && res.length >= 1 && res[0]) {
        data.bed.push({ name: res[0].trim(), count: parseInt(tempCount) });
        isTemp = false;
        tempCount = "";
      }else if (res && res.length >= 2 && res[1] && res[2]) {
        if(res[1].trim() === ""){
          isTemp = true;
          tempCount = res[2];
        } else {
          data.bed.push({ name: res[1].trim(), count: parseInt(res[2]) });
        }
      }
    }else if (!isDeptFind && val) {
      data.dept = val.replace(/[・　、]/g, ",");
      isDeptFind = true;
    }
  }
  if(data.bed.length > 0){
    data.bed.reverse();
  }
  return data;
}

function getAddress(val: string, ken: string): Address {
  const temp = new RegExp("([0-9]{3})[-ー－]([0-9]{4})(.+)").exec(val);
  if (temp && temp.length >= 4 && temp[1] && temp[2] && temp[3]) {
    return {
      zip: `${temp[1]}-${temp[2]}`,
      address: temp[3].startsWith(ken) ? temp[3].trim() : `${ken}${temp[3].trim()}`,
    };
  }
  return { zip: "", address: ken };
}

function getMemo(sheet: ExcelJS.Worksheet, row: number, nextRow: number): Memo {
  let type = "";
  let status = "";
  let memo = [];
  for (let i = row; i < nextRow; i++){
    const val = sheet.getCell(i, COL_TYPE).text;
    if (val === "") {
      break;
    } else if (val === "病院" || val === "診療所") {
      type = val;
    } else if (val === "現存" || val === "休止") {
      status = val;
    } else {
      memo.push(val);
    }
  }
  return { type, status, memo: memo.join(",") };
}

function getDrCount(sheet: ExcelJS.Worksheet, row: number, nextRow: number): string[] {
  const re1 = new RegExp("常　勤:[ 　]+([0-9]+)");
  const re2 = new RegExp("非常勤:[ 　]+([0-9]+)");
  const list = [];
  for (let i = row + 1; i < nextRow; i++){
    const val = sheet.getCell(i, COL_DR_COUNT).text;
    if (re1.test(val)) {
      const res = re1.exec(val);
      if (res && res.length >= 2 && res[1]) {
        list.push(`常勤:${res[1]}`);
      }
    }else if(re2.test(val)) {
      const res = re2.exec(val);
      if (res && res.length >= 2 && res[1]) {
        list.push(`非常勤:${res[1]}`);
      }
    }
  }
  return list;
}

//東北のExcelは２行目(他は、３行目)に県がある対応
function getFirstRow(sheet: ExcelJS.Worksheet): number {
  let row = 1;
  while (sheet.getCell(row, 1).text === "") {
    row++;
  }
  return row;
}

export async function getInfo(bs: Buffer, kenmei: string, tenCode: string): Promise<OutData[]> {
  const workbook = new ExcelJS.Workbook()
  await workbook.xlsx.load(new Uint8Array(bs).buffer);
  const list: OutData[] = [];
  //東北は、各県でシートが分かれているので、全シートを処理（他のエリアは、県ごとにファイルが分かれている）
  for await (const sheet of workbook.worksheets){
    let ken = reFind("\\[(.+)\\]", sheet.getCell(getFirstRow(sheet), COL_KEN).text);
    if (!ken) {
      ken = kenmei === "東京" ? "東京都" : (kenmei === "北海道" ? "北海道" : `${kenmei}県`);
    }
    const kenCode = KEN_MAP.get(ken) ?? "00";

    const first = next(sheet, 1);
    let row: number;
    if(first.ok){
      row = first.row;
    } else {
      throw new Error("No data");
    }

    let isEnd = false;
    let nextRow = 0;
    while(true || !isEnd){
      const val = next(sheet, row);
      if (val.ok) {
        nextRow = val.row;
      }else{
        isEnd = true;
        nextRow = row + SEEK_COUNT;
      }

      const SEPARATOR = "・.,\\- ";
      const temp = sheet.getCell(row + 1, COL_ID).text;
      let anotherId;
      let anotherCode;
      if (new RegExp(`\\([0-9${SEPARATOR}]+\\)`, "g").test(temp)) {
        anotherId = temp.replaceAll(new RegExp(`[()${SEPARATOR}]`, "g"), "");
        if (tenCode === IKA) {
          anotherCode = SHIKA;
        } else {
          anotherCode = IKA;
        }
      }

      const memo = getMemo(sheet, row, nextRow);
      const data: OutData = {
        kenCode,
        tenCode,
        no: sheet.getCell(row, COL_NO).text,
        id: sheet.getCell(row, COL_ID).text.replaceAll(new RegExp(`[${SEPARATOR}]`, "g"), ""),
        name: sheet.getCell(row, COL_NAME).text,
        address: getAddress(sheet.getCell(row, COL_ZIP).text, ken),
        tel: sheet.getCell(row, COL_TEL).text,
        drCount: getDrCount(sheet, row, nextRow).join(","),
        boss: sheet.getCell(row, COL_BOSS).text,
        type: memo.type,
        status: memo.status,
        memo: memo.memo,
        deptbeds: getDeptAndBed(sheet, row, COL_DEPT, nextRow),
      }
      list.push(data);
      if (anotherId && anotherCode) {
        list.push({ ...data, tenCode: anotherCode, id: anotherId });
      }
      if (isEnd) {
        break;
      }else{
        row = nextRow;
      }
    }
  }
  return list;
}