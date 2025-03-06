import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PrimengModule } from '../../../primeng.module';
import { TicketService } from '../../services/ticket.service';
import { UserService } from '../../services/user.service';
import { RouterService } from '../../services/router.service';
import { Ticket } from '../../data/models/ticket.model';
import { User } from '../../data/models/user.model';
import { StatusEnum } from '../../data/enums/StatusEnum';

@Component({
  selector: 'app-hr-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, PrimengModule],
  templateUrl: './hr-dashboard.component.html',
  styleUrls: ['./hr-dashboard.component.css']
})
export class HrDashboardComponent implements OnInit {
  // Add this line to expose StatusEnum to the template
  StatusEnum = StatusEnum;
  
  // Tickets organized by status
  openTickets: Ticket[] = [];
  inProgressTickets: Ticket[] = [];
  resolvedTickets: Ticket[] = [];
  closedTickets: Ticket[] = [];
  
  // Selected ticket for details panel
  selectedTicket: Ticket | null = null;
  
  // HR representatives for assignment
  hrUsers: User[] = [];
  selectedHrId: string = '';
  
  // Status options for dropdown
  statusOptions = [
    { label: 'Open', value: StatusEnum.Open },
    { label: 'In Progress', value: StatusEnum.InProgress },
    { label: 'Resolved', value: StatusEnum.Resolved },
    { label: 'Closed', value: StatusEnum.Closed }
  ];
  
  // Priority options for dropdown
  priorityOptions = [
    { label: 'Low', value: 'Low' },
    { label: 'Medium', value: 'Medium' },
    { label: 'High', value: 'High' }
  ];
  
  constructor(
    private ticketService: TicketService,
    private userService: UserService,
    private routerService: RouterService
  ) {}
  
  ngOnInit(): void {
    this.loadTickets();
    this.hrUsers = this.userService.getHRUsers();
  }
  
  loadTickets(): void {
    this.openTickets = this.ticketService.getTicketsByStatus(StatusEnum.Open)
      .map(ticket => ({...ticket, priority: 'Medium', category: 'General'}));
    this.inProgressTickets = this.ticketService.getTicketsByStatus(StatusEnum.InProgress)
      .map(ticket => ({...ticket, priority: 'Medium', category: 'General'}));
    this.resolvedTickets = this.ticketService.getTicketsByStatus(StatusEnum.Resolved)
      .map(ticket => ({...ticket, priority: 'Medium', category: 'General'}));
    this.closedTickets = this.ticketService.getTicketsByStatus(StatusEnum.Closed)
      .map(ticket => ({...ticket, priority: 'Medium', category: 'General'}));
  }
  
  selectTicket(ticket: Ticket): void {
    this.selectedTicket = ticket;
    this.selectedHrId = ticket.assignedToId || '';
  }
  
  assignTicket(): void {
    if (this.selectedTicket && this.selectedHrId) {
      this.ticketService.assignTicket(this.selectedTicket.id, this.selectedHrId);
      this.loadTickets();
    }
  }
  
  updateStatus(ticket: Ticket, newStatus: StatusEnum): void {
    this.ticketService.updateTicketStatus(ticket.id, newStatus);
    this.loadTickets();
    
    // If we were viewing the updated ticket, refresh the selection
    if (this.selectedTicket && this.selectedTicket.id === ticket.id) {
      const foundTicket = this.ticketService.getAllTickets().find(t => t.id === ticket.id);
      this.selectedTicket = foundTicket ? {...foundTicket, priority: 'Medium', category: 'General'} : null;
    }
  }
  
  updatePriority(ticket: Ticket, priority: 'Low' | 'Medium' | 'High'): void {
    this.ticketService.updateTicketPriority(ticket.id, priority);
    
    // If we were viewing the updated ticket, refresh the selection
    if (this.selectedTicket && this.selectedTicket.id === ticket.id) {
      const foundTicket = this.ticketService.getAllTickets().find(t => t.id === ticket.id);
      this.selectedTicket = foundTicket ? {...foundTicket, priority, category: 'General'} : null;
    }
  }
  
  closeDetails(): void {
    this.selectedTicket = null;
  }
  
  goToHome(): void {
    this.routerService.navigateToHome();
  }
} 