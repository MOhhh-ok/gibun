import { Token } from "./types/types.js";

/**
 * TinySegmenterを使用。Node.jsとBrowser両対応
 */
export const createTinySegmenterTokenizer = () => {
  return async (text: string): Promise<Token[]> => {
    const TinySegmenter = (await import("tiny-segmenter")).default;
    const segmenter = new TinySegmenter();
    const tokens = segmenter.segment(text) as string[];
    return tokens.map((token) => ({
      value: token,
      isNoun: true,
    }));
  };
};

/**
 * kuromojinを使用。Node.jsのみ
 */
export const createKuromojinTokenizer = () => {
  return async (text: string): Promise<Token[]> => {
    const { tokenize } = await import("kuromojin");
    const tokens = await tokenize(text);
    return tokens.map((token) => ({
      value: token.surface_form,
      isNoun: token.pos === "名詞",
    }));
  };
};

/** うまく動かない */
const createKuromojinBrowserTokenizer = (params: { dicPath: string }) => {
  return async (text: string): Promise<Token[]> => {
    const { getTokenizer } = await import("kuromojin");
    const tokenizer = await getTokenizer({
      // https://形式はkuromojiの不具合で読み込めない
      dicPath: params.dicPath,
    });
    const tokens = tokenizer.tokenize(text);
    return tokens.map((token) => ({
      value: token.surface_form,
      isNoun: token.pos === "名詞",
    }));
  };
};
