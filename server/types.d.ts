// Local type declaration file
declare module 'express' {
  const express: any;
  export = express;
}

declare module 'openai' {
  export class AzureOpenAI {
    constructor(config: any);
    chat: {
      completions: {
        create(params: any): Promise<any>;
      };
    };
  }
}

declare module 'dotenv' {
  export function config(options?: any): any;
}