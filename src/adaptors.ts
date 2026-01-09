import { Token } from "./types/types.js";

// kuromojinのトークンをGibunのToken型に変換
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

export const createKuromojinBrowserTokenizer = () => {
  return async (text: string): Promise<Token[]> => {
    const { getTokenizer } = await import("kuromojin");
    const tokenizer = await getTokenizer({
      dicPath: "https://cdn.jsdelivr.net/npm/kuromoji@0.1.2/dict",
    });
    const tokens = tokenizer.tokenize(text);
    return tokens.map((token) => ({
      value: token.surface_form,
      isNoun: token.pos === "名詞",
    }));
  };
};
