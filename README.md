# Gibun

Gibunは、日本語のフェイク文章を生成するライブラリです。

形態素解析とマルコフ連鎖を使用し、ある程度自然な文章を生成します。

GPTなどの生成AIを使用するほどでもない、テストデータ生成などでご使用ください。

## デモ

下記でデモを確認できます。ブラウザのみで動いています。

https://mohhh-ok.github.io/gibun/

## インストール

```bash
npm i -D gibun
```

デフォルトでは軽量な`tiny-segmenter`を使用します。より高精度な形態素解析が必要な場合は、`kuromojin`を追加でインストールしてください。

```bash
npm i -D gibun kuromojin
```

## 使い方

### 基本的な使い方

デフォルトでは`tiny-segmenter`による形態素解析を使用します。

```typescript
import { Gibun } from 'gibun';

const gibun = new Gibun();

// プリセットを読み込む
await gibun.trainPreset('business');

// 文章を生成
const result = gibun.generate({ minLength: 30, maxLength: 50 });
console.log(result);
```

### カスタムTokenizerを使用する

より高精度な形態素解析が必要な場合は、`createKuromojinTokenizer`を使用できます。

```typescript
import { Gibun, createKuromojinTokenizer } from 'gibun';

// kuromojinを使用するインスタンスを作成
const gibun = new Gibun({
  tokenizer: createKuromojinTokenizer()
});

await gibun.trainPreset('business');
const result = gibun.generate({ minLength: 30, maxLength: 50 });
console.log(result);
```

独自のTokenizerを実装することもできます。

```typescript
import { Gibun, Token } from 'gibun';

// カスタムTokenizerを作成
const customTokenizer = async (text: string): Promise<Token[]> => {
  // 独自の形態素解析処理
  const tokens = yourCustomAnalyzer(text);
  return tokens.map(token => ({
    value: token.surface,
    isNoun: token.partOfSpeech === '名詞'
  }));
};

const gibun = new Gibun({
  tokenizer: customTokenizer
});
```

### 独自文章を使用する

独自文章をトレーニングすることも可能です。

```typescript
import { Gibun } from 'gibun';

const gibun = new Gibun();

await gibun.train(`
  私はその人を常に先生と呼んでいた。だからここでもただ先生と書くだけで本名は打ち明けない。
  これは世間をはばかる遠慮というよりも、そのほうが私にとって自然だからである。
  私はその人の記憶を呼び起こすごとに、すぐ「先生」と言いたくなる。
  筆を執っても心持ちは同じことである。
  よそよそしい頭かしら文も字じなどはとても使う気にならない。
`);

const result = gibun.generate({ minLength: 20, maxLength: 30 });
console.log(result); // 自然だからである。これは同じことである。私は同じことで本名は
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

## Tokenizerについて

### デフォルトTokenizer（TinySegmenter）

デフォルトでは`tiny-segmenter`を使用します。

**メリット:**
- 軽量で高速
- Node.js・ブラウザ両対応
- 辞書不要

**デメリット:**
- 名詞の抽出ができないため、生成文章の冒頭が不自然になる可能性がある

### KuromojinTokenizer

より高精度な形態素解析には`kuromojin`を使用できます。

**メリット:**
- 名詞の抽出により生成文章の冒頭が安定する
- 高精度な形態素解析

**デメリット:**
- Node.jsのみ対応（ブラウザ未対応）
- 辞書ファイルの読み込みが必要

### カスタムTokenizer

独自の形態素解析エンジン（MeCab、Sudachiなど）を使用することも可能です。`Tokenizer`型に準拠した関数を実装してください。

```typescript
type Token = {
  value: string;    // トークンの文字列
  isNoun: boolean;  // 名詞かどうか
};

type Tokenizer = (text: string) => Promise<Token[]>;
```

## 複数インスタンスの管理

異なるトレーニングデータやTokenizerを分離して管理できます。

```typescript
import { Gibun, createKuromojinTokenizer } from 'gibun';

// ビジネス用（高精度）
const businessGibun = new Gibun({
  tokenizer: createKuromojinTokenizer()
});
await businessGibun.trainPreset('business');
const businessText = businessGibun.generate({ minLength: 30, maxLength: 50 });

// SNS用（軽量）
const snsGibun = new Gibun(); // デフォルトのtiny-segmenterを使用
await snsGibun.trainPreset('sns');
const snsText = snsGibun.generate({ minLength: 20, maxLength: 40 });
```


## ライセンス

MIT
