import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    // テスト中のconsole.logを表示
    silent: false,
    // より詳細な出力
    reporters: ["verbose"],
    // 並列実行を無効化（出力が混ざらないように）
    pool: "forks",
    maxWorkers: 1,
    isolate: false,
  },
});
