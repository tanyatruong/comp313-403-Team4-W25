import { Injectable, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { io, Socket } from 'socket.io-client';
import { environment } from '../../environments/environment';
import { AuthService } from './auth.service';
import { UserService } from './user.service';

export interface ChatMessage {
  _id: string;
  sender: string;
  recipient: string;
  message: string;
  ticketId?: string;
  read: boolean;
  createdAt: Date;
  
  // Additional fields for UI display
  senderName?: string;
  senderRole?: string;
}

export interface ActiveHrUser {
  id: string;
  name: string;
  department: string;
}

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private socket: Socket | null = null;
  private apiUrl = environment.apiUrl;
  
  // Subjects for reactive updates
  private messagesSubject = new BehaviorSubject<ChatMessage[]>([]);
  private newMessageSubject = new Subject<ChatMessage>();
  private typingSubject = new Subject<{userId: string, isTyping: boolean}>();
  private activeHrUsersSubject = new BehaviorSubject<ActiveHrUser[]>([]);
  private activeEmployeeUsersSubject = new BehaviorSubject<ActiveHrUser[]>([]);
  
  // Observable streams
  public messages$ = this.messagesSubject.asObservable();
  public newMessage$ = this.newMessageSubject.asObservable();
  public typing$ = this.typingSubject.asObservable();
  public activeHrUsers$ = this.activeHrUsersSubject.asObservable();
  public activeEmployeeUsers$ = this.activeEmployeeUsersSubject.asObservable();

  // Track currently selected chat
  private currentChatPartner: string | null = null;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private http: HttpClient,
    private authService: AuthService,
    private userService: UserService
  ) {
    // Initialize socket connection if in browser environment
    if (isPlatformBrowser(this.platformId)) {
      this.initializeSocketConnection();
    }
  }

  // Initialize socket.io connection
  private initializeSocketConnection(): void {
    if (!this.socket && this.authService.getToken()) {
      this.socket = io(environment.apiUrl.replace('/api', ''), {
        auth: {
          token: this.authService.getToken()
        }
      });
      
      this.setupSocketListeners();
    }
  }
  
  // Setup socket event listeners
  private setupSocketListeners(): void {
    
    // Listen for active employee users updates
    if (!this.socket) return;
        this.socket.on('active_employee_users', (users: ActiveHrUser[]) => {
    this.activeEmployeeUsersSubject.next(users);
    });

    // Listen for incoming messages
    this.socket.on('private_message', (message: ChatMessage) => {
      const currentMessages = this.messagesSubject.value;
      const updatedMessages = [...currentMessages, message];
      this.messagesSubject.next(updatedMessages);
      this.newMessageSubject.next(message);
      
      // Mark as read if from current chat partner
      if (this.currentChatPartner === message.sender) {
        this.markMessageAsRead(message.sender);
      }
    });
    
    // Listen for typing indicators
    this.socket.on('typing', (data: {sender: string, isTyping: boolean}) => {
      this.typingSubject.next({userId: data.sender, isTyping: data.isTyping});
    });
    
    // Listen for active HR users updates
    this.socket.on('active_hr_users', (users: ActiveHrUser[]) => {
      this.activeHrUsersSubject.next(users);
    });
    
    // Handle connection errors
this.socket.on('connect_error', (error: Error) => {
    console.error('Socket connection error:', error);
    
    // Retry connection after delay
    setTimeout(() => {
      this.socket?.connect();
    }, 5000);
  });
  }
  
  // Load chat history between current user and another user
  loadChatHistory(partnerId: string): Observable<ChatMessage[]> {
    this.currentChatPartner = partnerId;
    const currentUser = this.userService.getLoggedInUser();
    
    if (!currentUser || !currentUser._id) {
      return new Observable(subscriber => {
        subscriber.error('User not authenticated');
        subscriber.complete();
      });
    }
    
    return this.http.get<ChatMessage[]>(`${this.apiUrl}/chat/history/${currentUser._id}/${partnerId}`);
  }
  
  // Send a message
  sendMessage(recipientId: string, message: string, ticketId?: string): void {
    if (!this.socket) {
      this.initializeSocketConnection();
    }
    
    this.socket?.emit('private_message', {
      recipient: recipientId,
      message,
      ticketId
    });
    
    // Stop typing indicator when message is sent
    this.sendTypingIndicator(recipientId, false);
  }
  
  // Send typing indicator
  sendTypingIndicator(recipientId: string, isTyping: boolean): void {
    if (!this.socket) return;
    
    this.socket.emit('typing', {
      recipient: recipientId,
      isTyping
    });
  }
  
  // Mark messages from a sender as read
  markMessageAsRead(senderId: string): void {
    const currentUser = this.userService.getLoggedInUser();
    
    if (!currentUser || !currentUser._id) return;
    
    this.http.patch(`${this.apiUrl}/chat/read/${currentUser._id}/${senderId}`, {})
      .subscribe(() => {
        // Update read status in local messages
        const currentMessages = this.messagesSubject.value;
        const updatedMessages = currentMessages.map(msg => {
          if (msg.sender === senderId && !msg.read) {
            return {...msg, read: true};
          }
          return msg;
        });
        
        this.messagesSubject.next(updatedMessages);
      });
  }
  
  // Search chat messages
  searchMessages(searchTerm: string): Observable<ChatMessage[]> {
    const currentUser = this.userService.getLoggedInUser();
    
    if (!currentUser || !currentUser._id) {
      return new Observable(subscriber => {
        subscriber.error('User not authenticated');
        subscriber.complete();
      });
    }
    
    return this.http.get<ChatMessage[]>(`${this.apiUrl}/chat/search/${currentUser._id}/${searchTerm}`);
  }
  
  connect(): void {
    // Initialize socket connection if in browser environment
    if (isPlatformBrowser(this.platformId)) {
      if (!this.socket && this.authService.getToken()) {
        this.socket = io(environment.apiUrl.replace('/api', ''), {
          auth: {
            token: this.authService.getToken()
          }
        });
        
        this.setupSocketListeners();
      }
    }
  } 

  // Disconnect socket when service is destroyed
  disconnect(): void {
    this.socket?.disconnect();
    this.socket = null;
  }
}