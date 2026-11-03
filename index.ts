import { main } from "./src/main.ts"
import { area as kyushu } from "./src/area/kyushu.ts"
import { area as shikoku } from "./src/area/shikoku.ts"
import { area as chugoku } from "./src/area/chugoku.ts"
import { area as kinki } from "./src/area/kinki.ts"
import { area as tokai } from "./src/area/tokai.ts"
import { area as kanto } from "./src/area/kanto.ts"
import { area as tohoku } from "./src/area/tohoku.ts"
import { area as hokkai } from "./src/area/hokkai.ts"
import { del } from "./src/db.ts";
import readline from "readline"
import { select } from "./src/db.ts"
import { writeFileSync } from "fs"
import iconv from "iconv-lite"

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

rl.question("どれ？(1:データ取得 2:データ出力):", async input => {
  if (input === "1") {
    await getData();
  } else if (input === "2") {
    outputData();
  }
});

async function getData() {
  rl.question("どれ？(1:九州 2:四国 3:中国　4:近畿 5:東海 6:関東 7:東北 8:北海道 9:全部):", async input => {
    del();
    if (input === "1") {
      await main(kyushu);
    } else if (input === "2") {
      await main(shikoku);
    } else if (input === "3") {
      await main(chugoku);
    } else if (input === "4") {
      await main(kinki);
    } else if (input === "5") {
      await main(tokai);
    } else if (input === "6") {
      await main(kanto);
    } else if (input === "7") {
      await main(tohoku);
    } else if (input === "8") {
      await main(hokkai);
    } else if (input === "9") {
      await main(kyushu);
      await main(shikoku);
      await main(chugoku);
      await main(kinki);
      await main(tokai);
      await main(kanto);
      await main(tohoku);
      await main(hokkai);
    }
    rl.close();
  });
}

function outputData() {
  rl.question("どれ？(1:csv出力):", async input => {
    if (input === "1") {
      const data = select();
      const list = data.map(a => `${a.ken_code},${a.ten_code},${a.id},${a.name},${a.zip},${a.address},${a.tel},"${a.dr_count}",${a.boss},${a.type},${a.status},"${a.dept}","${a.bed}"`);
      list.unshift("県番号,点数番号,医療機関番号,名称,郵便番号,住所,電話番号,医師数,管理者,種別,状態,診療科,ベッド数");
      var buf = iconv.encode(list.join("\n"), "cp932");
      writeFileSync("./hospitals.csv", buf);
    }
    rl.close();
  });
}