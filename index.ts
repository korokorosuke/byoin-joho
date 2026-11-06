import { main } from "./src/main.ts"
import { area as kyushu } from "./src/area/kyushu.ts"
import { area as shikoku } from "./src/area/shikoku.ts"
import { area as chugoku } from "./src/area/chugoku.ts"
import { area as kinki } from "./src/area/kinki.ts"
import { area as tokai } from "./src/area/tokai.ts"
import { area as kanto } from "./src/area/kanto.ts"
import { area as tohoku } from "./src/area/tohoku.ts"
import { area as hokkai } from "./src/area/hokkai.ts"
import { del } from "./src/db.ts"
import readline from "readline"
import { selectAll } from "./src/db.ts"
import { writeFileSync } from "fs"
import iconv from "iconv-lite"
import { spawn } from "child_process"
import { Temporal } from "@js-temporal/polyfill"

function dialogue() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  rl.question("どれ？(1:データ取得 2:データ出力 3:ビューア起動):", async input => {
    if (input === "1") {
      rl.question("どれ？(1:九州 2:四国 3:中国　4:近畿 5:東海 6:関東 7:東北 8:北海道 9:全部):", async input => {
        await getData(input);
        rl.close();
      });
    } else if (input === "2") {
      rl.question("どれ？(1:csv出力):", async input => {
        outputData(input);
        rl.close();
      });
    } else if (input === "3") {
      startViewer();
    }
  });
}

async function getData(input: string) {
  const start_time = Temporal.Now.plainDateTimeISO();
  console.log(`開始: ${start_time.toString({ smallestUnit: "second" })}`);
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
    await Promise.allSettled([
      main(kyushu),
      main(shikoku),
      main(chugoku),
      main(kinki),
      main(tokai),
      main(kanto),
      main(tohoku),
      main(hokkai),
    ]);
  }
  const end_time = Temporal.Now.plainDateTimeISO();
  const diff = start_time.until(end_time, { largestUnit: "minutes" });
  console.log(`終了: ${end_time.toString({ smallestUnit: "second" })}`);
  console.log(`経過時間: ${diff.minutes}分 ${diff.seconds}秒`);
}

function outputData(input: string) {
  if (input === "1") {
    const data = selectAll();
    const list = data.map(a => `${a.ken_code},${a.ten_code},${a.id},${a.name},${a.zip},${a.address},${a.tel},"${a.dr_count}",${a.boss},${a.type},${a.status},"${a.memo}","${a.dept}","${a.bed}"`);
    list.unshift("県番号,点数番号,医療機関番号,名称,郵便番号,住所,電話番号,医師数,管理者,種別,状態,メモ,診療科,ベッド数");
    var buf = iconv.encode(list.join("\n"), "cp932");
    writeFileSync("./hospitals.csv", buf);
  }
}

function startViewer() {
  console.log("終了する場合は、ctrl+cを2回押すか、画面を閉じてださい。");
  console.log("以下のURLにアクセスしてください。");
  const child = spawn("bun", ["run", "view"]);
  child.stdout.on("data", (data) => {
    console.log(`${data}`);
  });
}

const argv = Bun.argv;
if (argv.length <= 2) {
  dialogue();
} else if (argv.length === 3 && argv[3] === "3") {
  startViewer();
} else if (argv.length >= 4) {
  if (argv[2] === "1" && argv[3]) {
    getData(argv[3]);
  } else if (argv[2] === "2" && argv[3]) {
    outputData(argv[3]);
  } else if (argv[2] === "3") {
    startViewer();
  } else {
    dialogue();
  }
}