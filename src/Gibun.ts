import kuromoji from "kuromoji.js";
import { MarkovChainText } from "markov-chain-base";
import { PresetName } from "./types/types.js";

const minPos = 10;
const maxPos = 200;

const MIN_LENGTH = 100;

export class Gibun {
  markovChain: any;
  tokenizer: Tokenizer | undefined;
  nouns: Set<string> = new Set();
  buildStatus: "building" | "ready" | "error" = "building";

  constructor() {
    this.markovChain = new MarkovChainText();
    kuromoji.builder().build((err: Error | null, tokenizer: Tokenizer) => {
      if (err) {
        this.buildStatus = "error";
        throw err;
      }
      this.tokenizer = tokenizer;
      this.buildStatus = "ready";
    });
  }

  async trainPreset(preset: PresetName) {
    const data = await import(`./presets/${preset}.js`).then((module) => module.default);
    await this.train(data);
  }

  async train(data: string | string[], options?: { split?: boolean }) {
    await this.ensureReady();
    let sentences = Array.isArray(data) ? data : [data];
    if (options?.split) {
      sentences = sentences.map(this.splitSentences).flat();
    }
    for (const sentence of sentences) {
      const tokens = this.tokenizer!.tokenize(sentence);
      this.registerNouns(tokens);
      const processedText = tokens.map((t) => t.surface_form).join(" ");
      this.markovChain.train(processedText);
    }
  }

  generate(params?: { minLength: number; maxLength?: number }) {
    const { minLength = MIN_LENGTH, maxLength } = params || {};
    let result = "";
    while (result.length < minLength) {
      const words = this.generatePoses();
      result += words.join("");
    }
    if (maxLength) result = result.slice(0, maxLength);
    return result;
  }

  generatePoses(): string[] {
    const randomNoun = this.getRandomNoun();
    return this.markovChain
      .generate(randomNoun, (poses: any[]) => poses.length <= maxPos)
      .split(/\s+/);
  }

  private registerNouns(tokens: TOKEN[]) {
    for (const token of tokens) {
      if (token.pos === "名詞") {
        this.nouns.add(String(token.surface_form));
      }
    }
  }

  private getRandomNoun() {
    const nouns = Array.from(this.nouns);
    return nouns[Math.floor(Math.random() * nouns.length)];
  }

  private async ensureReady(): Promise<boolean> {
    if (this.buildStatus !== "ready") {
      await new Promise((resolve) => setTimeout(resolve, 100));
      return this.ensureReady();
    }
    return true;
  }

  private splitSentences(text: string) {
    return text.split(/(?<=[。|！|？]+)/);
  }
}
