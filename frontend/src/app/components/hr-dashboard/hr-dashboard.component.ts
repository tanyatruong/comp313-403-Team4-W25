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
  
  // Filter and Sort options
  filterText: string = '';
  filterPriority: string = '';
  filterCategory: string = '';
  sortBy: string = 'dateAndTimeOfCreation';
  sortOrder: 'asc' | 'desc' = 'desc';
  
  // Category options
  categoryOptions = [
    { label: 'IT Support', value: 'IT Support' },
    { label: 'HR', value: 'HR' },
    { label: 'Facilities', value: 'Facilities' },
    { label: 'Finance', value: 'Finance' },
    { label: 'General', value: 'General' },
    { label: 'Other', value: 'Other' }
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
    // Get all tickets first
    const allTickets = this.ticketService.getAllTickets()
      .map(ticket => {
        // Create a new ticket object with default values for missing properties
        return {
          id: ticket.id,
          userId: ticket.userId,
          status: ticket.status,
          title: ticket.title,
          description: ticket.description,
          dateAndTimeOfCreation: ticket.dateAndTimeOfCreation,
          priority: 'Medium' as 'Low' | 'Medium' | 'High', // Default priority
          category: 'General' // Default category
        };
      });
    
    // Filter and sort the tickets
    const filteredTickets = this.applyFilters(allTickets);
    
    // Distribute tickets by status
    this.openTickets = filteredTickets.filter(ticket => ticket.status === StatusEnum.Open);
    this.inProgressTickets = filteredTickets.filter(ticket => ticket.status === StatusEnum.InProgress);
    this.resolvedTickets = filteredTickets.filter(ticket => ticket.status === StatusEnum.Resolved);
    this.closedTickets = filteredTickets.filter(ticket => ticket.status === StatusEnum.Closed);
  }
  
  applyFilters(tickets: Ticket[]): Ticket[] {
    let result = [...tickets];
    
    // Text search (searches in title and description)
    if (this.filterText) {
      const searchText = this.filterText.toLowerCase();
      result = result.filter(ticket => 
        ticket.title.toLowerCase().includes(searchText) || 
        ticket.description.toLowerCase().includes(searchText)
      );
    }
    
    // Priority filter
    if (this.filterPriority) {
      result = result.filter(ticket => ticket.priority === this.filterPriority);
    }
    
    // Category filter
    if (this.filterCategory) {
      result = result.filter(ticket => ticket.category === this.filterCategory);
    }
    
    // Sorting
    result = this.sortTickets(result);
    
    return result;
  }
  
  sortTickets(tickets: Ticket[]): Ticket[] {
    return tickets.sort((a, b) => {
      let comparison = 0;
      
      switch (this.sortBy) {
        case 'title':
          comparison = a.title.localeCompare(b.title);
          break;
        case 'priority':
          const priorityOrder = { 'High': 0, 'Medium': 1, 'Low': 2 };
          comparison = (priorityOrder[a.priority as keyof typeof priorityOrder] ?? 1) - 
                      (priorityOrder[b.priority as keyof typeof priorityOrder] ?? 1);
          break;
        case 'dateAndTimeOfCreation':
        default:
          // Assuming newer dates should be first
          comparison = new Date(b.dateAndTimeOfCreation).getTime() - 
                      new Date(a.dateAndTimeOfCreation).getTime();
          break;
      }
      
      // Reverse for ascending order
      return this.sortOrder === 'desc' ? comparison : -comparison;
    });
  }
  
  resetFilters(): void {
    this.filterText = '';
    this.filterPriority = '';
    this.filterCategory = '';
    this.loadTickets();
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
    
    this.loadTickets();
  }
  
  closeDetails(): void {
    this.selectedTicket = null;
  }
  
  goToHome(): void {
    this.routerService.navigateToHome();
  }
} 