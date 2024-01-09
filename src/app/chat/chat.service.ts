import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import OpenAI from 'openai';

export interface Chat {
  single: boolean;
  history: Message [];
  title: string;
}

export interface Message {
  role: string;
  content: string;
}

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private openai: any;

  private chatsSubject = new BehaviorSubject<Chat[]>([]);
  chats$ = this.chatsSubject.asObservable();

  private currentChatSubject = new BehaviorSubject<Chat | null>(null);
  currentChat$ = this.currentChatSubject.asObservable();

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

  validateTitle(title: string) {
    return !this.chatsSubject.value.some(chat => title === chat.title);
  }

  formatTitle(title: string): string {
    return this.validateTitle(title) ? title : this.formatTitle(`${title} - copy`)
  }

  createChat(single: boolean) {
    // Create a new chat and add it to the chats array
    const newChat = { single, history: [], title: this.formatTitle('untitled') };
    const currentChats = this.chatsSubject.value;
    const updatedChats: Chat [] = [...currentChats, newChat];

    // Notify subscribers about the updated chats array
    this.chatsSubject.next(updatedChats);

    // Notify subscribers about the current chat
    this.currentChatSubject.next(newChat);
  }

  deleteChat(chat: Chat) {
    const currentChats = this.chatsSubject.value;
    const updatedChats = currentChats.filter(ch => chat.title !== ch.title)

    // Notify subscribers about the updated chats array
    this.chatsSubject.next(updatedChats);

    // If the current chat is deleted, select another chat as the current
    // and notify subscribers about the change
    if (this.currentChatSubject.value && chat.title === this.currentChatSubject.value.title) {
      this.currentChatSubject.next(updatedChats[0]);
    }
  }

  selectChat(chat: Chat) {
    this.currentChatSubject.next(chat);
  }

  send(messages: any[]): Promise<OpenAI.Chat.ChatCompletionMessage> {
    const params: OpenAI.Chat.ChatCompletionCreateParams = {
      messages,
      model: 'gpt-3.5-turbo',
    };
    return this.openai.chat.completions.create(params).then(({ choices }: OpenAI.Chat.ChatCompletion) => choices[0].message);
  }

  addMessage(newMessage: Message) {
    const currentChat = this.currentChatSubject.value;
    if (currentChat) {
      currentChat.history.push(newMessage);
      this.chatsSubject.next([...this.chatsSubject.value]);
      this.currentChatSubject.next({ ...currentChat });
    }
  }
}
