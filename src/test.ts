import { gibun } from './index';

async function test() {
  await gibun.setSeed(`
吾輩は猫である。
名前はまだ無い。
どこで生れたかとんと見当がつかぬ。
何でも薄暗いじめじめした所でニャーニャー泣いていた事だけは記憶している。
吾輩はここで始めて人間というものを見た。
  `);

  const result = gibun.generate(10);
  console.log(result);
}

test();
