import { type Hospital, selectById, selectByName } from "../db.ts"
export { type Hospital } from "../db.ts"

export function getById(id: string): Hospital[]{
  return selectById(id);
}

export function getByName(name: string): Hospital[]{
  return selectByName(name);
}