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
  private useMockData = true; // Set to false when backend is ready

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

    // Otherwise use the real API
    return this.apiService.getTickets().pipe(
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

  // Get all tickets, loading them if needed
  getAllTickets(): Ticket[] {
    if (!this.loaded) {
      this.loadTickets().subscribe();
    }
    return this.tickets.map((ticket) => ({
      ...ticket,
      id: ticket.id?.toString(),
    }));
  }

  // Get tickets by user ID
  getOpenTicketsByUserId(userId: number): Ticket[] {
    const strUserId = userId.toString();
    return this.tickets.filter(
      (ticket) =>
        ticket.userId?.toString() === strUserId &&
        ticket.status !== StatusEnum.Closed
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
  updateTicketStatus(id: number, status: StatusEnum): Observable<Ticket> {
    if (this.useMockData) {
      // Find and update ticket in local cache
      const index = this.tickets.findIndex(
        (t) => t.id?.toString() === id.toString()
      );
      if (index !== -1) {
        this.tickets[index] = {
          ...this.tickets[index],
          status: status,
        };
        return of(this.tickets[index]);
      }
      return throwError(() => new Error('Ticket not found'));
    } else {
      return this.apiService.updateTicketStatus(id.toString(), status).pipe(
        tap((updatedTicket) => {
          const index = this.tickets.findIndex(
            (t) => t.id?.toString() === id.toString()
          );
          if (index !== -1) {
            this.tickets[index] = {
              ...this.tickets[index],
              status: updatedTicket.status,
            };
          }
        }),
        catchError((error) => {
          console.error('Error updating ticket status', error);
          return throwError(() => new Error('Failed to update ticket status'));
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
  updateTicketPriority(id: string, priority: PriorityEnum): Observable<Ticket> {
    if (this.useMockData) {
      const index = this.tickets.findIndex((t) => t.id === id);
      if (index !== -1) {
        this.tickets[index] = { ...this.tickets[index], priority };
        return of(this.tickets[index]);
      }
      return throwError(() => new Error('Ticket not found'));
    } else {
      return this.apiService.updateTicket(id, { priority }).pipe(
        tap((updatedTicket) => {
          const index = this.tickets.findIndex((t) => t.id === id);
          if (index !== -1) {
            this.tickets[index] = { ...this.tickets[index], priority };
          }
        }),
        catchError((error) => {
          console.error('Error updating ticket priority', error);
          return throwError(
            () => new Error('Failed to update ticket priority')
          );
        })
      );
    }
  }
}
