import { Database } from "bun:sqlite";
import type { OutData } from "./excel.ts"

interface Hospital {
  ken_code: string
  id: string
  name: string
  zip: string
  address: string
  tel: string
  dr_count: string
  boss: string
  type: string
  status: string
  dept: string
  bed: string
}

const SQL_CREATE = `
  create table if not exists hospitals (
    ken_code text,
    id text,
    name text,
    zip text,
    address text,
    tel text,
    dr_count text,
    boss text,
    type text,
    status text,
    dept text,
    bed text,
    PRIMARY KEY (ken_code, id)
  );
`;

const SQL_UPSERT = `
  insert into hospitals
    (ken_code, id, name, zip, address, tel, dr_count, boss, type, status, dept, bed)
  values
    ($ken_code, $id, $name, $zip, $address, $tel, $dr_count, $boss, $type, $status, $dept, $bed);
  on conflict (ken_code, id)
  do update set
    name = excluded.name, zip = excluded.zip, address = excluded.address, tel = excluded.tel,
    dr_count = excluded.dr_count, boss = excluded.boss, type = excluded.type, status = excluded.status,
    dept = excluded.dept, bed = excluded.bed
`;

const DB = "zzzhosp.db";

export function del(){
  try{
    const db = new Database(DB);
    const del = db.prepare("delete from hospitals");
    del.run();
    db.close();
  } catch (_e) {
  }
}

export function write(list: OutData[]) {
  const db = new Database(DB);
  db.run(SQL_CREATE);
  const insert = db.prepare(SQL_UPSERT);
  for(const data of list){
    try{
      insert.run({
        $ken_code: data.kenCode,
        $id: data.id,
        $name: data.name,
        $zip: data.address.zip,
        $address: data.address.address,
        $tel: data.tel,
        $dr_count: data.drCount,
        $boss: data.boss,
        $type: data.type,
        $status: data.status,
        $dept: data.deptbeds.dept,
        $bed: data.deptbeds.bed.map(val=>`${val.name}:${val.count}`).join(","),
      });
    } catch (e) {
      console.log(e);
      console.log(`${data.id}:${data.name}`)
    }
  }
  db.close();
}

export function select(): Hospital[]{
  const db = new Database(DB);
  const query = db.query("SELECT * FROM hospitals");
  const res = query.all() as Hospital[];
  db.close();
  return res;
}