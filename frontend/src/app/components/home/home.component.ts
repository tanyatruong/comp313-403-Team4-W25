import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RouterService } from '../../services/router.service';
import { TicketService } from '../../services/ticket.service';
import { UserService } from '../../services/user.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { Ticket } from '../../data/models/ticket.model';
import { User } from '../../data/models/user.model';
import { StatusEnum } from '../../data/enums/StatusEnum';
import { PriorityEnum } from '../../data/enums/PriorityEnum';
import { CategoryEnum } from '../../data/enums/CategoryEnum';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  routerService = inject(RouterService);
  ticketService = inject(TicketService);
  userService = inject(UserService);

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

  constructor(private router: Router) {}

  ngOnInit(): void {
    // this.loadUserAndTickets();
    this.loadUser();
    this.loadTickets();
  }

  // loadUserAndTickets(): void {
  //   this.currentUser = this.userService.getLoggedInUser();

  //   if (!this.currentUser) {
  //     console.error('No user is logged in.');
  //     return;
  //   }

  //   if (this.currentUser.userType === 'admin') {
  //     this.filteredTickets = [...this.ticketService['tickets']];
  //   } else {
  //     const userId = parseInt(this.currentUser.id, 10);
  //     this.filteredTickets = this.ticketService.getOpenTicketsByUserId(userId);
  //   }
  // }

  loadUser() {
    this.currentUser = this.userService.getLoggedInUser();
  }
  loadTickets() {
    if (!this.currentUser) {
      console.error('No user is logged in.');
      return;
    }

    let tickets: Ticket[] = [];

    if (this.currentUser.userType === 'admin') {
      tickets = [...this.ticketService['tickets']].map((ticket) => ({
        ...ticket,
        priority: ticket.priority || PriorityEnum.Medium,
        category: ticket.category || CategoryEnum.General,
      }));
    } else {
      const userId = this.currentUser.id
        ? parseInt(this.currentUser.id, 10)
        : 0;
      tickets = this.ticketService
        .getOpenTicketsByUserId(userId)
        .map((ticket) => ({
          ...ticket,
          priority: ticket.priority || PriorityEnum.Medium,
          category: ticket.category || CategoryEnum.General,
        }));
    }

    // Store all tickets for filtering
    this.filteredTickets = tickets;

    // Group tickets by status
    this.openTickets = tickets.filter(
      (ticket) => ticket.status === StatusEnum.Open
    );
    this.inProgressTickets = tickets.filter(
      (ticket) => ticket.status === StatusEnum.InProgress
    );
    this.resolvedTickets = tickets.filter(
      (ticket) => ticket.status === StatusEnum.Resolved
    );
    this.closedTickets = tickets.filter(
      (ticket) => ticket.status === StatusEnum.Closed
    );
  }

  openSettings(): void {
    this.routerService.navigateToSettings();
  }

  editTicket(ticket: Ticket): void {
    console.log('Navigating to edit page for ticket ID:', ticket.id);
    this.ticketService.currentTicket = ticket;
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

      console.log(`Ticket with ID ${this.ticketToDelete} deleted.`);
    }

    this.closeModal();
  }

  confirmDeleteV2(): void {
    // Rest POST delete ticket
    //  Rest Response returns Boolean based on success of fail
    // based on response delete locally too

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
}
