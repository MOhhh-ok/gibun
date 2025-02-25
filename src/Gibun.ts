const { MarkovChainText } = require('markov-chain-base');
import kuromoji from 'kuromoji.js';
import Tokenizer from 'kuromoji.js/dist/types/kuromoji-core/Tokenizer';
import { TOKEN } from 'kuromoji.js/dist/types/kuromoji-core/util/IpadicFormatter';

export class Gibun {
  markovChain: any;
  tokenizer: Tokenizer | undefined;
  tokens: TOKEN[] = [];
  buildStatus: 'building' | 'ready' | 'error' = 'building';

  constructor() {
    this.markovChain = new MarkovChainText();
    kuromoji.builder().build((err, tokenizer) => {
      if (err) {
        this.buildStatus = 'error';
        throw err;
      }
      this.tokenizer = tokenizer;
      this.buildStatus = 'ready';
    });
  }

  async setSeed(seed: string) {
    await this.ensureReady();
    this.tokens = this.tokenizer!.tokenize(seed);
    const processedText = this.tokens.map((t) => t.surface_form).join(' ');
    this.markovChain.train(processedText);
  }

  generate(maxPos: number) {
    const words = this.generatePoses(maxPos);
    return words.join('');
  }

  generatePoses(maxPos: number): string[] {
    const randomNoun = this.getRandomNoun();
    return this.markovChain.generate(randomNoun, maxPos - 1).split(/\s+/);
  }

  private getRandomNoun() {
    const meishiTokens = this.tokens.filter((t) => t.pos == '名詞');
    return meishiTokens[Math.floor(Math.random() * meishiTokens.length)]
      .surface_form;
  }

  private async ensureReady(): Promise<boolean> {
    if (this.buildStatus !== 'ready') {
      await new Promise((resolve) => setTimeout(resolve, 100));
      return this.ensureReady();
    }
    return true;
  }
}
