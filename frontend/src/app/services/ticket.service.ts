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

  constructor(private apiService: ApiService) {}

  // Load all tickets from the backend
  loadTickets(): Observable<Ticket[]> {
    // Use the real API with mapping for MongoDB format
    return this.apiService.getTickets().pipe(
      map((tickets) => tickets.map((ticket) => this.mapMongoTicket(ticket))),
      tap((tickets) => {
        this.tickets = tickets;
        this.loaded = true;
      }),
      catchError((error) => this.handleApiError('loading tickets', error))
    );
  }

  // Helper method to map MongoDB ticket format to app's format
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
      default:
        return CategoryEnum.General;
    }
  }

  // Generic error handler
  private handleApiError(operation: string, error: any): Observable<never> {
    console.error(`Error ${operation}:`, error);
    return throwError(() => new Error(`Failed to ${operation}`));
  }

  // Update cache helper
  private updateTicketCache(
    ticketId: string,
    updatedData: Partial<Ticket>
  ): void {
    const index = this.tickets.findIndex(
      (t) => t.id?.toString() === ticketId.toString()
    );
    if (index !== -1) {
      this.tickets[index] = { ...this.tickets[index], ...updatedData };
    }
  }

  // Get tickets by user ID
  getOpenTicketsByUserId(userId: number): Observable<Ticket[]> {
    return this.apiService.getTicketsByUserId(userId.toString()).pipe(
      map((tickets) => tickets.map((ticket) => this.mapMongoTicket(ticket))),
      catchError((error) => this.handleApiError('loading user tickets', error))
    );
  }

  // Create a new ticket
  createTicket(ticket: Partial<Ticket>): Observable<Ticket> {
    // Add required fields for API
    const completeTicket = {
      ...ticket,
      status: ticket.status || StatusEnum.Open,
      createdAt: new Date(),
    } as Ticket;

    return this.apiService.createTicket(completeTicket).pipe(
      map((response) => {
        this.tickets.push(response);
        return response;
      }),
      catchError((error) => this.handleApiError('creating ticket', error))
    );
  }

  // Update a ticket
  updateTicket(
    ticketId: string | number,
    updatedTicket: Ticket
  ): Observable<Ticket> {
    return this.apiService
      .updateTicket(ticketId.toString(), updatedTicket)
      .pipe(
        map((response) => {
          // Update local cache after successful server update
          this.updateTicketCache(ticketId.toString(), response);
          return response;
        }),
        catchError((error) => this.handleApiError('updating ticket', error))
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
      catchError((error) => this.handleApiError('deleting ticket', error))
    );
  }

  // Update ticket status
  updateTicketStatus(ticketId: string, status: string): Observable<Ticket> {
    console.log(
      `TicketService: Updating ticket ${ticketId} status to ${status}`
    );

    // Ensure we're passing the right parameters
    return this.apiService.updateTicketStatus(ticketId, status).pipe(
      tap((updatedTicket) =>
        console.log('Status updated successfully:', updatedTicket)
      ),
      catchError((error) => {
        console.error('TicketService: Failed to update status', error);
        return throwError(
          () =>
            new Error(
              `Failed to update ticket status: ${
                error.message || 'Unknown error'
              }`
            )
        );
      })
    );
  }

  // Assign ticket to HR
  assignTicket(ticketId: number, hrUserId: string): Observable<boolean> {
    return this.apiService.assignTicket(ticketId.toString(), hrUserId).pipe(
      map((response: any) => {
        if (response) {
          this.updateTicketCache(ticketId.toString(), { assignedTo: hrUserId });
          return true;
        }
        return false;
      }),
      catchError((error) => this.handleApiError('assigning ticket', error))
    );
  }

  // Update ticket priority
  updateTicketPriority(
    ticketId: number | string,
    priority: PriorityEnum
  ): Observable<any> {
    return this.apiService
      .updateTicketPriority(ticketId.toString(), priority)
      .pipe(
        map((response) => {
          // Update local cache after successful server update
          this.updateTicketCache(ticketId.toString(), { priority });
          return response;
        }),
        catchError((error) =>
          this.handleApiError('updating ticket priority', error)
        )
      );
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
