import { main } from "./src/main.ts"
import { getExcels as getKyushuExcels, INFO as kyushuInfo } from "./src/area/kyushu.ts"
import { getExcels as getShikokuExcels, INFO as shikokuInfo } from "./src/area/shikoku.ts"
import { getExcels as getChugokuExcels, INFO as chugokuInfo } from "./src/area/chugoku.ts"
import { getExcels as getKinkiExcels, INFO as kinkiInfo } from "./src/area/kinki.ts"
import { getExcels as getTokaiExcels, INFO as tokaiInfo } from "./src/area/tokai.ts"
import { getExcels as getKantoExcels, INFO as kantoInfo } from "./src/area/kanto.ts"
import { getExcels as getTohokuExcels, INFO as tohokuInfo } from "./src/area/tohoku.ts"
import { getExcels as getHokkaiExcels, INFO as hokkaiInfo } from "./src/area/hokkai.ts"
import readline from "readline"

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

rl.question("どれが希望だい？(1:九州 2:四国 3:中国　4:近畿 5:東海 6:関東 7:東北 8:北海道 9:全部):", async input => {
  if (input === "1") {
    await main(getKyushuExcels, kyushuInfo);
  } else if (input === "2") {
    await main(getShikokuExcels, shikokuInfo);
  } else if (input === "3") {
    await main(getChugokuExcels, chugokuInfo);
  } else if (input === "4") {
    await main(getKinkiExcels, kinkiInfo);
  } else if (input === "5") {
    await main(getTokaiExcels, tokaiInfo);
  } else if (input === "6") {
    await main(getKantoExcels, kantoInfo);
  } else if (input === "7") {
    await main(getTohokuExcels, tohokuInfo);
  } else if (input === "8") {
    await main(getHokkaiExcels, hokkaiInfo);
  } else if (input === "9") {
    await main(getKyushuExcels, kyushuInfo);
    await main(getShikokuExcels, shikokuInfo);
    await main(getChugokuExcels, chugokuInfo);
    await main(getKinkiExcels, kinkiInfo);
    await main(getTokaiExcels, tokaiInfo);
    await main(getKantoExcels, kantoInfo);
    await main(getTohokuExcels, tohokuInfo);
    await main(getHokkaiExcels, hokkaiInfo);
  }
  rl.close();
});
