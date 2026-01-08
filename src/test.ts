import { gibun } from "./index.js";

async function test() {
  // await gibun.train(samples.cat);
  // await gibun.train(samples.kokoro);
  // await gibun.train(
  //   `
  //   私はその人を常に先生と呼んでいた。だからここでもただ先生と書くだけで本名は打ち明けない。
  //   これは世間をはばかる遠慮というよりも、そのほうが私にとって自然だからである。
  //   私はその人の記憶を呼び起こすごとに、すぐ「先生」と言いたくなる。
  //   筆を執っても心持ちは同じことである。
  //   よそよそしい頭かしら文も字じなどはとても使う気にならない。
  //   `
  // );

  // await gibun.train('吾輩は猫である。');
  // await gibun.train(['名前はまだ無い。', 'どこで生れたかとんと見当がつかぬ。']);

  const result = gibun.generate({ minLength: 10, maxLength: 20 }); //
  console.log(result); // 吾輩はまだ無い。猫で生れたかとんと見当が
  // console.log(result); // 自然だからである。これは同じことである。私は同じことで本名は
}

test();
