import { Component, OnDestroy, OnInit } from '@angular/core';
import { Chat, ChatService } from './chat.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.scss'
})
export class ChatComponent implements OnInit, OnDestroy {
  private subscription: Subscription | undefined;
  public prompt: string = '';
  public chat: Chat | null = null;

  constructor(private chatService: ChatService) {}

  ngOnInit() {
    this.subscription = this.chatService.currentChat$.subscribe(chat => {
      this.chat = chat;
      this.prompt = '';
    });
  }

  async submitPrompt(){
    try {
      const prompt = { role: "user", content: this.prompt };
      this.chatService.addMessage(prompt);

      if (this.chat) {
        const answer = this.chat.single 
          ? await this.chatService.send([prompt])
          : await this.chatService.send(this.chat.history)
        this.chatService.addMessage(answer);
      }
    } catch (error) {
      console.log(error)
    }
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
