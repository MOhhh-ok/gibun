declare module 'markov-chain-base' {
  export class MarkovChainBase {
    constructor();
    train(data: any): void;
    generate(start?: any, check?: (result: any) => boolean): any;
  }

  export class MarkovChainText extends MarkovChainBase {
    constructor();
    train(text: string): void;
    generate(start?: string, check?: (result: string[]) => boolean): string;
  }

  export class MarkovChainTextTool {
    constructor();
    train(text: string): void;
    generate(start?: string, check?: (result: string[]) => boolean): string;
  }
}
