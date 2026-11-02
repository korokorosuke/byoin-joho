import { main } from "./src/main.ts"
import { area as kyushu } from "./src/area/kyushu.ts"
import { area as shikoku } from "./src/area/shikoku.ts"
import { area as chugoku } from "./src/area/chugoku.ts"
import { area as kinki } from "./src/area/kinki.ts"
import { area as tokai } from "./src/area/tokai.ts"
import { area as kanto } from "./src/area/kanto.ts"
import { area as tohoku } from "./src/area/tohoku.ts"
import { area as hokkai } from "./src/area/hokkai.ts"
import readline from "readline"

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

rl.question("どれが希望だい？(1:九州 2:四国 3:中国　4:近畿 5:東海 6:関東 7:東北 8:北海道 9:全部):", async input => {
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
