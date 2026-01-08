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

### プリセットを使用する

プリセットをトレーニングデータとして用います。

```typescript
import { gibun } from 'gibun';

async function test() {
  // プリセットを読み込む
  await gibun.trainPreset('business');
  
  // 文章を生成
  const result = gibun.generate({ minLength: 30, maxLength: 50 });
  console.log(result);
}

test();
```

### 独自文章を使用する

独自文章をトレーニングすることも可能です。

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

### 文章の分割オプション

`split` オプションを使用すると、句点で文章を自動的に分割してトレーニングできます。

```typescript
await gibun.train('吾輩は猫である。名前はまだ無い。', { split: true });
```

## プリセット一覧

以下のプリセットをサンプルとして同梱しています。

### 現代風ジャンル別
- `business` - ビジネス文書風（議事録、報告書など）
- `sns` - SNS投稿風（カジュアルな短文、絵文字入り）
- `blog` - ブログ記事風（です・ます調の説明文）
- `news` - ニュース記事風（客観的な報道文）

### プロフィール系
- `profile_business` - ビジネス向けプロフィール文
- `profile_sns` - SNS向けプロフィール文

### 文学作品
- `cat` - 吾輩は猫である（夏目漱石）


## API

### プリセットでトレーニング

事前に用意されたプリセットを使用してトレーニングします。

```typescript
gibun.trainPreset(preset: PresetName): Promise<void>
```

**パラメータ:**
- `preset`: プリセット名（文字列）

**例:**
```typescript
await gibun.trainPreset('business');
await gibun.trainPreset('sns');
await gibun.trainPreset('cat');
```

### トレーニング

文章を渡します。

```typescript
gibun.train(text: string | string[], options?: { split?: boolean }): Promise<void>
```

**パラメータ:**
- `text`: トレーニング用の文章（文字列または文字列配列）
- `options.split`: `true` の場合、句点で文章を自動分割します（デフォルト: `false`）

**例:**
```typescript
await gibun.train('吾輩は猫である。');
await gibun.train(['名前はまだ無い。', 'どこで生れたかとんと見当がつかぬ。']);
await gibun.train('吾輩は猫である。名前はまだ無い。', { split: true });
```

### 生成

文章を生成します。

```typescript
gibun.generate(params?: { minLength: number, maxLength?: number }): string
```

**パラメータ:**
- `minLength`: 最小文字数（デフォルト: 100）
- `maxLength`: 最大文字数（省略可）

**例:**
```typescript
gibun.generate({ minLength: 20, maxLength: 30 });
gibun.generate({ minLength: 50 }); // maxLengthなし
```

## クラスインスタンス

デフォルトのインスタンスではなく、独自のインスタンスを作成することもできます。

異なるトレーニングデータを分離して管理できます。

```typescript
import { Gibun } from 'gibun';

// ビジネス用のインスタンス
const businessGibun = new Gibun();
await businessGibun.trainPreset('business');
const businessText = businessGibun.generate({ minLength: 30, maxLength: 50 });

// SNS用のインスタンス
const snsGibun = new Gibun();
await snsGibun.trainPreset('sns');
const snsText = snsGibun.generate({ minLength: 20, maxLength: 40 });

// カスタムデータ用のインスタンス
const customGibun = new Gibun();
await customGibun.train('独自の文章データ');
const customText = customGibun.generate({ minLength: 20 });
```


## ライセンス

MIT
