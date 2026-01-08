# Gibun

Gibunは、日本語のフェイク文章を生成するライブラリです。

形態素解析とマルコフ連鎖を使用し、ある程度自然な文章を生成します。

GPTなどの生成AIを使用するほどでもない、テストデータ生成などでご使用ください。

## インストール

kuromoji.jsと一緒にインストールします。

```bash
npm i -D gibun kuromoji.js
```

## 使い方

サンプル文章を設定して、生成します。

```typescript
import { gibun } from 'gibun';

async function test() {
  await gibun.train(
    `
    私はその人を常に先生と呼んでいた。だからここでもただ先生と書くだけで本名は打ち明けない。
    これは世間をはばかる遠慮というよりも、そのほうが私にとって自然だからである。
    私はその人の記憶を呼び起こすごとに、すぐ「先生」と言いたくなる。
    筆を執っても心持ちは同じことである。
    よそよそしい頭かしら文も字じなどはとても使う気にならない。
    `
  );

  const result = gibun.generate({ minLength: 20, maxLength: 30 });
  console.log(result); // 自然だからである。これは同じことである。私は同じことで本名は
}

test();
```

## API

### トレーニング

文章を渡します。

```typescript
gibun.train(text: string | string[]): Promise<void>
```

例：
```typescript
await gibun.train('吾輩は猫である。');
await gibun.train(['名前はまだ無い。', 'どこで生れたかとんと見当がつかぬ。']);
```

### 生成

文章を生成します。

- params
  - minLength: 最小文字数
  - maxLength?: 最大文字数

```typescript
gibun.generate(params: { minLength: number, maxLength?: number }): string
```

例:

```typescript
gibun.generate({minLength: 20, maxLength: 30})
```

## サンプルデータ

以下のプリセットをサンプルとして同梱しています。

### 文学作品
- `samples.cat` - 吾輩は猫である（夏目漱石）

### 現代風ジャンル別
- `samples.business` - ビジネス文書風（議事録、報告書など）
- `samples.sns` - SNS投稿風（カジュアルな短文、絵文字入り）
- `samples.blog` - ブログ記事風（です・ます調の説明文）
- `samples.news` - ニュース記事風（客観的な報道文）

下記のようにインポートしてご利用ください。

```typescript
import { gibun, samples } from 'gibun';

// ビジネス文書風
await gibun.train(samples.business);
const businessText = gibun.generate({ minLength: 30, maxLength: 50 });

// SNS投稿風
await gibun.train(samples.sns);
const snsText = gibun.generate({ minLength: 20, maxLength: 40 });

// ブログ記事風
await gibun.train(samples.blog);
const blogText = gibun.generate({ minLength: 30, maxLength: 50 });

// ニュース記事風
await gibun.train(samples.news);
const newsText = gibun.generate({ minLength: 30, maxLength: 50 });

// 吾輩は猫である
await gibun.train(samples.cat);
const catText = gibun.generate({ minLength: 30, maxLength: 50 });
```

## ライセンス

MIT
