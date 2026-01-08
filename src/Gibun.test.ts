import { describe, expect, test } from "vitest";
import { Gibun } from "./Gibun.js";
import { PRESET_NAMES } from "./types/types.js";

describe("プリセットの読み込みテスト", () => {
  test.each(PRESET_NAMES)("%s プリセットが正常に読み込まれる", async (presetName) => {
    const gibun = new Gibun();

    // プリセットの読み込みがエラーなく完了することを確認
    await expect(gibun.trainPreset(presetName)).resolves.toBeUndefined();

    // 学習後に名詞が登録されていることを確認
    expect(gibun.nouns.size).toBeGreaterThan(0);

    // ビルドステータスが正常であることを確認
    expect(gibun.buildStatus).toBe("ready");
  });
});

describe("各プリセットの生成結果確認（目視用）", () => {
  test.each(PRESET_NAMES)("%s プリセットでテキストを生成", async (presetName) => {
    const gibun = new Gibun();
    await gibun.trainPreset(presetName);

    const result = gibun.generate({ minLength: 30, maxLength: 100 });

    // 生成結果が空でないことを確認
    expect(result).toBeTruthy();
    expect(result.length).toBeGreaterThan(0);

    // 目視確認用の出力
    console.log(`\n${"=".repeat(60)}`);
    console.log(`📝 プリセット: ${presetName}`);
    console.log(`${"=".repeat(60)}`);
    console.log(result);
    console.log(`${"=".repeat(60)}\n`);
  });
});

describe("生成パラメータのテスト", () => {
  test("minLength と maxLength が正しく機能する", async () => {
    const gibun = new Gibun();
    await gibun.trainPreset("cat");

    const result = gibun.generate({ minLength: 50, maxLength: 80 });

    expect(result.length).toBeGreaterThanOrEqual(50);
    expect(result.length).toBeLessThanOrEqual(80);

    console.log("\n📏 長さ指定テスト (50-80文字):");
    console.log(`文字数: ${result.length}`);
    console.log(result);
  });

  test("minLength のみ指定した場合", async () => {
    const gibun = new Gibun();
    await gibun.trainPreset("sns");

    const result = gibun.generate({ minLength: 30 });

    expect(result.length).toBeGreaterThanOrEqual(30);

    console.log("\n📏 最小長のみ指定テスト (30文字以上):");
    console.log(`文字数: ${result.length}`);
    console.log(result);
  });
});
