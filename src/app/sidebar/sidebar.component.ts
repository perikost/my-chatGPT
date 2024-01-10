import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faPlus, faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import { NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { Chat, ChatService } from '../chat/chat.service';
import { Subscription } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { FilterPipe } from './filter.pipe';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterOutlet, NgbModule, FontAwesomeModule, FormsModule, FilterPipe],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent implements OnInit, OnDestroy {
  private chatsSubscription: Subscription | undefined;
  private currentChatSubscription: Subscription | undefined;
  public chats: Chat [] = [];
  public currentChat: Chat | null | undefined;

  @ViewChild('editChatModal') public editChatModal: TemplateRef<any> | undefined;

  faPlus = faPlus;
  faEdit = faEdit;
  faTrash = faTrash;

  constructor(private chatService: ChatService, private modalService: NgbModal) {

  }

  ngOnInit() {
    this.chatsSubscription = this.chatService.chats$.subscribe(chats => {
      this.chats = chats;
    });

    this.currentChatSubscription = this.chatService.currentChat$.subscribe(chat => {
      this.currentChat = chat;
    });
  }

  newChat(single: boolean) {
    this.chatService.createChat(single);
  }

  editChatTitle(chat: Chat) {
    this.modalService.open(this.editChatModal, { centered: true }).result.then(
      (result) => {
        this.chatService.updateChatTitle(chat, result);
      },
      (reason) => {
        console.log('Modal dismissed')
      },
    );
  }

  selectChat(chat: Chat) {
    this.chatService.selectChat(chat);
  }

  deleteChat(chat: Chat) {
    this.chatService.deleteChat(chat)
  }

  ngOnDestroy() {
    if (this.chatsSubscription) {
      this.chatsSubscription.unsubscribe();
    }

    if (this.currentChatSubscription) {
      this.currentChatSubscription.unsubscribe();
    }
  }

}
