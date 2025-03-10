import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { ApiService } from './api.service';
import { Ticket } from '../data/models/ticket.model';
import { StatusEnum } from '../data/enums/StatusEnum';
import { PriorityEnum } from '../data/enums/PriorityEnum';
import { CategoryEnum } from '../data/enums/CategoryEnum';

@Injectable({ providedIn: 'root' })
export class TicketService {
  // Keep a local cache of tickets
  private tickets: Ticket[] = [];
  private loaded = false;
  currentTicket: Ticket | null = null;

  // Add a flag to control API vs mock data
  private useMockData = false; // Now using real backend

  constructor(private apiService: ApiService) {}

  // Load all tickets from the backend
  loadTickets(): Observable<Ticket[]> {
    if (this.useMockData) {
      // Return existing tickets or create empty array if none exist
      if (!this.tickets.length) {
        // Create sample tickets for testing
        this.tickets = [
          {
            id: 't1',
            title: 'Sample Ticket 1',
            description: 'This is a test ticket',
            employeeNumber: 'emp1',
            assignedTo: '',
            status: StatusEnum.Open,
            priority: PriorityEnum.Medium,
            category: CategoryEnum.General,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          {
            id: 't2',
            title: 'Another Sample Ticket',
            description: 'This is another test ticket',
            employeeNumber: 'emp1',
            assignedTo: '',
            status: StatusEnum.InProgress,
            priority: PriorityEnum.High,
            category: CategoryEnum.Technical,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        ];
      }
      this.loaded = true;
      return of(this.tickets);
    }

    // Otherwise use the real API with mapping for MongoDB format
    return this.apiService.getTickets().pipe(
      map((tickets) => tickets.map((ticket) => this.mapMongoTicket(ticket))),
      tap((tickets) => {
        this.tickets = tickets;
        this.loaded = true;
      }),
      catchError((error) => {
        console.error('Error loading tickets', error);
        return throwError(() => new Error('Failed to load tickets'));
      })
    );
  }

  // Add this helper method to map MongoDB ticket format to your app's format
  private mapMongoTicket(ticket: any): Ticket {
    return {
      id: ticket._id,
      title: ticket.title,
      description: ticket.description,
      employeeNumber: ticket.employeeNumber,
      assignedTo: ticket.assignedTo || '',
      status: this.mapStatusFromBackend(ticket.status),
      priority: this.mapPriorityFromBackend(ticket.priority),
      category: this.mapCategoryFromBackend(ticket.category),
      sentiment: ticket.sentiment,
      comments: ticket.comments,
      attachments: ticket.attachments,
      createdAt: new Date(ticket.createdAt),
      updatedAt: new Date(ticket.updatedAt),
    };
  }

  // Helper methods to handle status format differences
  private mapStatusFromBackend(status: string): StatusEnum {
    switch (status) {
      case 'Open':
        return StatusEnum.Open;
      case 'In Progress':
        return StatusEnum.InProgress;
      case 'Resolved':
        return StatusEnum.Resolved;
      case 'Closed':
        return StatusEnum.Closed;
      default:
        return StatusEnum.Open;
    }
  }

  private mapPriorityFromBackend(priority: string): PriorityEnum {
    switch (priority) {
      case 'Low':
        return PriorityEnum.Low;
      case 'Medium':
        return PriorityEnum.Medium;
      case 'High':
        return PriorityEnum.High;
      default:
        return PriorityEnum.Medium;
    }
  }

  private mapCategoryFromBackend(category: string): CategoryEnum {
    // Add any missing categories to the CategoryEnum as needed
    switch (category) {
      case 'General':
        return CategoryEnum.General;
      case 'Technical':
        return CategoryEnum.Technical;
      case 'Payroll':
        return CategoryEnum.Payroll;
      case 'Benefits':
        return CategoryEnum.Benefits;
      case 'Facilities':
        return CategoryEnum.Facilities;
      // Handle other categories by returning a default if they don't match
      default:
        return CategoryEnum.General;
    }
  }

  // Get all tickets, loading them if needed
  getAllTickets(): Observable<Ticket[]> {
    // Simply load tickets from the API without local filtering
    return this.loadTickets();
  }

  // Get tickets by user ID - simplified to call API directly
  getOpenTicketsByUserId(userId: number): Observable<Ticket[]> {
    // This should now call a specific API endpoint that returns pre-filtered tickets
    return this.apiService.getTicketsByUserId(userId.toString()).pipe(
      map((tickets) => tickets.map((ticket) => this.mapMongoTicket(ticket))),
      catchError((error) => {
        console.error('Error loading user tickets', error);
        return throwError(() => new Error('Failed to load user tickets'));
      })
    );
  }

  // Create a new ticket
  createTicket(ticket: Partial<Ticket>): Observable<Ticket> {
    if (this.useMockData) {
      // Generate a mock ticket with an ID
      const newTicket: Ticket = {
        id: Math.random().toString(36).substr(2, 9),
        title: ticket.title || 'Untitled',
        description: ticket.description || '',
        employeeNumber: ticket.employeeNumber || 'unknown',
        assignedTo: ticket.assignedTo || '',
        status: StatusEnum.Open,
        priority: ticket.priority || PriorityEnum.Medium,
        category: ticket.category || CategoryEnum.General,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      // Add to local cache
      this.tickets.push(newTicket);
      console.log('Created mock ticket:', newTicket);

      return of(newTicket);
    }

    // Otherwise use the real API
    return this.apiService.createTicket(ticket).pipe(
      tap((newTicket) => {
        this.tickets.push(newTicket);
      }),
      catchError((error) => {
        console.error('Error creating ticket', error);
        return throwError(() => new Error('Failed to create ticket'));
      })
    );
  }

  // Update a ticket
  updateTicket(id: string, ticketData: Partial<Ticket>): Observable<Ticket> {
    return this.apiService.updateTicket(id, ticketData).pipe(
      tap((updatedTicket) => {
        const index = this.tickets.findIndex((t) => t.id?.toString() === id);
        if (index !== -1) {
          this.tickets[index] = { ...this.tickets[index], ...updatedTicket };
        }
      }),
      catchError((error) => {
        console.error('Error updating ticket', error);
        return throwError(() => new Error('Failed to update ticket'));
      })
    );
  }

  // Delete a ticket
  deleteTicket(id: number): Observable<boolean> {
    return this.apiService.deleteTicket(id.toString()).pipe(
      map(() => {
        this.tickets = this.tickets.filter(
          (t) => t.id?.toString() !== id.toString()
        );
        return true;
      }),
      catchError((error) => {
        console.error('Error deleting ticket', error);
        return throwError(() => new Error('Failed to delete ticket'));
      })
    );
  }

  // Update ticket status
  updateTicketStatus(
    ticketId: number | string,
    status: StatusEnum
  ): Observable<any> {
    if (this.useMockData) {
      // Mock implementation (for local testing only)
      const index = this.tickets.findIndex(
        (t) => t.id?.toString() === ticketId.toString()
      );
      if (index !== -1) {
        this.tickets[index] = {
          ...this.tickets[index],
          status: status,
        };
        console.log('Updated ticket status locally:', this.tickets[index]);
        return of(this.tickets[index]);
      }
      return of(null);
    } else {
      // Real implementation - send to MongoDB through API
      return this.apiService
        .updateTicketStatus(ticketId.toString(), status)
        .pipe(
          map((response) => {
            // Update local cache after successful server update
            const index = this.tickets.findIndex(
              (t) => t.id?.toString() === ticketId.toString()
            );
            if (index !== -1) {
              this.tickets[index] = {
                ...this.tickets[index],
                status: status,
              };
            }
            return response;
          }),
          catchError((error) => {
            console.error('Error updating ticket status:', error);
            return throwError(
              () => new Error('Failed to update ticket status')
            );
          })
        );
    }
  }

  // Assign ticket to HR
  assignTicket(ticketId: number, hrUserId: string): Observable<boolean> {
    if (this.useMockData) {
      const index = this.tickets.findIndex(
        (t) => t.id?.toString() === ticketId.toString()
      );
      if (index !== -1) {
        this.tickets[index] = {
          ...this.tickets[index],
          assignedTo: hrUserId,
        };
        console.log('Assigned ticket:', this.tickets[index]);
        return of(true);
      }
      return of(false);
    } else {
      return this.apiService.assignTicket(ticketId.toString(), hrUserId).pipe(
        map((response: any) => {
          if (response) {
            const index = this.tickets.findIndex(
              (t) => t.id === ticketId.toString()
            );
            if (index !== -1) {
              this.tickets[index] = {
                ...this.tickets[index],
                assignedTo: hrUserId,
              };
            }
            return true;
          }
          return false;
        }),
        catchError((error) => {
          console.error('Error assigning ticket', error);
          return throwError(() => new Error('Failed to assign ticket'));
        })
      );
    }
  }

  // Update ticket priority
  updateTicketPriority(
    ticketId: number | string,
    priority: PriorityEnum
  ): Observable<any> {
    if (this.useMockData) {
      // Mock implementation (for local testing only)
      const index = this.tickets.findIndex(
        (t) => t.id?.toString() === ticketId.toString()
      );
      if (index !== -1) {
        this.tickets[index] = {
          ...this.tickets[index],
          priority: priority,
        };
        console.log('Updated ticket priority locally:', this.tickets[index]);
        return of(this.tickets[index]);
      }
      return of(null);
    } else {
      // Real implementation - send to MongoDB through API
      return this.apiService
        .updateTicketPriority(ticketId.toString(), priority)
        .pipe(
          map((response) => {
            // Update local cache after successful server update
            const index = this.tickets.findIndex(
              (t) => t.id?.toString() === ticketId.toString()
            );
            if (index !== -1) {
              this.tickets[index] = {
                ...this.tickets[index],
                priority: priority,
              };
            }
            return response;
          }),
          catchError((error) => {
            console.error('Error updating ticket priority:', error);
            return throwError(
              () => new Error('Failed to update ticket priority')
            );
          })
        );
    }
  }

  getTicketById(id: string): Observable<Ticket> {
    // Check if it's in our cache first
    const cachedTicket = this.tickets.find((ticket) => ticket.id === id);
    if (cachedTicket) {
      return of(cachedTicket);
    }

    // Otherwise get it from the API
    return this.apiService
      .getTicketById(id)
      .pipe(map((ticket) => this.mapMongoTicket(ticket)));
  }
}
