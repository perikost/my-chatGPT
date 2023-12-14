import { Injectable } from '@angular/core';
import OpenAI from 'openai';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private openai: any;

  constructor() { 
    try {
      this.openai = new OpenAI({
        dangerouslyAllowBrowser: true,
        apiKey: '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',
      });
    } catch (error) {
      console.log(error)
    }
  }

  send(messages: any[]): Promise<OpenAI.Chat.ChatCompletionMessage> {
    const params: OpenAI.Chat.ChatCompletionCreateParams = {
      messages,
      model: 'gpt-3.5-turbo',
    };
    return this.openai.chat.completions.create(params).then(({ choices }: OpenAI.Chat.ChatCompletion) => choices[0].message);
  }
}
