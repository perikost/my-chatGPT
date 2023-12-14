import { Component } from '@angular/core';
import { ChatService } from './chat.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.scss',
  providers: [ChatService]
})
export class ChatComponent {
  public prompt: string = '';
  public chatHistory: any[] = [];

  constructor(private chat: ChatService) {}

  async submitPrompt(){
    try {
      const prompt = { role: "user", content: this.prompt };
      this.chatHistory.push(prompt);

      const answer = await this.chat.send([prompt]);
      this.chatHistory.push(answer)

    } catch (error) {
      console.log(error)
    }
  }
}
