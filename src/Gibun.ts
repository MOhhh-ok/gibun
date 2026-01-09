import { MarkovChainBase, MarkovChainText } from "markov-chain-base";
import { createKuromojinTokenizer, createTinySegmenterTokenizer } from "./adaptors.js";
import blogPreset from "./presets/blog.js";
import businessPreset from "./presets/business.js";
import catPreset from "./presets/cat.js";
import newsPreset from "./presets/news.js";
import profileBusinessPreset from "./presets/profile_business.js";
import profileSnsPreset from "./presets/profile_sns.js";
import snsPreset from "./presets/sns.js";
import { PresetName, Token, Tokenizer } from "./types/types.js";

const presetMap: Record<PresetName, string> = {
  business: businessPreset,
  sns: snsPreset,
  blog: blogPreset,
  news: newsPreset,
  profile_business: profileBusinessPreset,
  profile_sns: profileSnsPreset,
  cat: catPreset,
};

const minPos = 10;
const maxPos = 200;

const MIN_LENGTH = 100;

export type GibunParams = {
  tokenizer?: Tokenizer;
};

export class Gibun {
  tokenizer: Tokenizer;
  markovChain: MarkovChainBase;
  nouns: Set<string> = new Set();
  buildStatus: "building" | "ready" | "error" = "ready";

  constructor(params?: GibunParams) {
    this.tokenizer = params?.tokenizer || createTinySegmenterTokenizer();
    this.markovChain = new MarkovChainText();
  }

  async trainPreset(preset: PresetName) {
    const data = presetMap[preset];
    if (!data) {
      throw new Error(`Preset "${preset}" not found`);
    }
    await this.train(data);
  }

  async train(data: string | string[]) {
    await this.ensureReady();
    let sentences = Array.isArray(data) ? data : [data];
    sentences = sentences.map(this.splitSentences).flat();
    for (const sentence of sentences) {
      const tokens = await this.tokenizer(sentence);
      const nounTokens = tokens.filter(t => t.isNoun);
      nounTokens.forEach(noun => this.nouns.add(noun.value));
      const joined = tokens.map((t) => t.value).join(" ");
      this.markovChain.train(joined);
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
