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
    kuromoji
      .builder({ dicPath: 'node_modules/kuromoji/dict' })
      .build((err, tokenizer) => {
        if (err) {
          this.buildStatus = 'error';
          throw err;
        }
        this.tokenizer = tokenizer;
        console.log('tokenizer inited');
        this.buildStatus = 'ready';
      });
  }

  async setSeed(seed: string) {
    await this.ensureReady();
    this.tokens = this.tokenizer!.tokenize(seed);
    const processedText = this.tokens.map((t) => t.surface_form).join(' ');
    this.markovChain.train(processedText);
  }

  generate(length: number) {
    const randomMeishi = this.getRandomMeishi();
    const generatedWords = this.markovChain.generate(randomMeishi, length);
    return generatedWords.replace(/\s/g, '');
  }

  private getRandomMeishi() {
    const meishiTokens = this.tokens.filter((t) => t.pos == '名詞');
    return meishiTokens[Math.floor(Math.random() * meishiTokens.length)]
      .surface_form;
  }

  async ensureReady(): Promise<boolean> {
    if (this.buildStatus !== 'ready') {
      await new Promise((resolve) => setTimeout(resolve, 100));
      return this.ensureReady();
    }
    return true;
  }
}
