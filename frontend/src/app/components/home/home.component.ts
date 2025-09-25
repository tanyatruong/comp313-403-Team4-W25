import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { RouterService } from '../../services/router.service';
import { TicketService } from '../../services/ticket.service';
import { UserService } from '../../services/user.service';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { Ticket } from '../../data/models/ticket.model';
import { User } from '../../data/models/user.model';
import { StatusEnum } from '../../data/enums/StatusEnum';
import { ChatService } from '../../services/chat.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit, OnDestroy {
  routerService = inject(RouterService);
  ticketService = inject(TicketService);
  userService = inject(UserService);
  authService = inject(AuthService);
  private chatService = inject(ChatService);

  tickets: Ticket[] = [];
  filteredTickets: Ticket[] = [];
  currentUser: User | null = null;

  // Modal State
  showDeleteModal: boolean = false;
  ticketToDelete: string | null = null;

  // Add these properties to store tickets by status
  openTickets: Ticket[] = [];
  inProgressTickets: Ticket[] = [];
  resolvedTickets: Ticket[] = [];
  closedTickets: Ticket[] = [];

  StatusEnum = StatusEnum;

  showChatbot = false;

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.loadUser();
    this.loadTickets();
    // Connect to socket for presence
    this.chatService.connect();
  }

  ngOnDestroy(): void {
    // Optional: keep connection if navigating around; disconnect if needed
    // this.chatService.disconnect();
  }

  loadUser() {
    this.currentUser = this.userService.getLoggedInUser();
  }
  loadTickets(): void {
    if (!this.currentUser) {
      console.error('No user is logged in.');
      return;
    }

    // Use the observable pattern for real backend data
    this.ticketService.loadTickets().subscribe((tickets: Ticket[]) => {
      // No filtering, just use tickets directly from the API
      const filteredTickets = tickets;

      // Store all tickets
      this.filteredTickets = filteredTickets;

      // Group tickets by status
      this.openTickets = filteredTickets.filter(
        (ticket: Ticket) => ticket.status === StatusEnum.Open
      );
      this.inProgressTickets = filteredTickets.filter(
        (ticket: Ticket) => ticket.status === StatusEnum.InProgress
      );
      this.resolvedTickets = filteredTickets.filter(
        (ticket: Ticket) => ticket.status === StatusEnum.Resolved
      );
      this.closedTickets = filteredTickets.filter(
        (ticket: Ticket) => ticket.status === StatusEnum.Closed
      );
    });
  }

  openUserEdit(): void {
    this.routerService.navigateToUserEdit();
  }

  editTicket(ticket: Ticket): void {
    // Set the current ticket in the service
    this.ticketService.currentTicket = ticket;

    // Store the ID in local storage as a backup
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem('currentTicketId', ticket.id || '');
    }

    // Then navigate
    this.routerService.navigateToTicketEdit();
  }

  deleteTicket(ticketId: string): void {
    this.showDeleteModal = true;
    this.ticketToDelete = ticketId;
  }

  confirmDelete(): void {
    if (this.ticketToDelete !== null) {
      this.filteredTickets = this.filteredTickets.filter(
        (ticket) => ticket.id?.toString() !== this.ticketToDelete
      );

      const ticketIndex = this.ticketService['tickets'].findIndex(
        (ticket) => ticket.id?.toString() === this.ticketToDelete
      );
      if (ticketIndex > -1) {
        this.ticketService['tickets'].splice(ticketIndex, 1);
      }
    }

    this.closeModal();
  }

  cancelDelete(): void {
    this.closeModal();
  }

  closeModal(): void {
    this.showDeleteModal = false;
    this.ticketToDelete = null;
  }

  addTicket(): void {
    this.routerService.navigateToTicketCreation();
  }

  navigateToHRDashboard(): void {
    this.routerService.navigateToHRDashboard();
  }

  logout(): void {
    this.authService.logout().subscribe({
      next: (response) => {
        console.log('Logout successful:', response);
      },
      error: (error) => {
        console.error('Logout error:', error);
      }
    });
  }
}
