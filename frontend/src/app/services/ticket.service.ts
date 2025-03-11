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
  currentTicket: Ticket | null = null;

  constructor(private apiService: ApiService) {}

  // CRUD Operations
  loadTickets(): Observable<Ticket[]> {
    return this.apiService.get<any[]>('/tickets').pipe(
      map((tickets) => tickets.map((ticket) => this.mapMongoTicket(ticket))),
      tap((tickets) => (this.tickets = tickets)),
      catchError((error) => this.handleApiError('loading tickets', error))
    );
  }

  getTicketById(id: string): Observable<Ticket> {
    return this.apiService.get<any>(`/tickets/${id}`).pipe(
      map((ticket) => this.mapMongoTicket(ticket)),
      catchError((error) => this.handleApiError('loading ticket', error))
    );
  }

  createTicket(ticket: Partial<Ticket>): Observable<Ticket> {
    const completeTicket = {
      ...ticket,
      status: ticket.status || StatusEnum.Open,
      createdAt: new Date(),
    } as Ticket;

    return this.apiService.post<any>('/tickets', completeTicket).pipe(
      map((response) => this.mapMongoTicket(response)),
      tap((newTicket) => this.tickets.push(newTicket)),
      catchError((error) => this.handleApiError('creating ticket', error))
    );
  }

  updateTicket(id: string, ticket: Partial<Ticket>): Observable<Ticket> {
    return this.apiService.put<any>(`/tickets/${id}`, ticket).pipe(
      map((response) => this.mapMongoTicket(response)),
      tap((updatedTicket) => this.updateTicketCache(id, updatedTicket)),
      catchError((error) => this.handleApiError('updating ticket', error))
    );
  }

  deleteTicket(id: string): Observable<void> {
    return this.apiService.delete<void>(`/tickets/${id}`).pipe(
      map(() => void 0),
      tap(() => this.removeFromCache(id)),
      catchError((error) => this.handleApiError('deleting ticket', error))
    );
  }

  // Specialized Operations
  updateTicketStatus(id: string, status: StatusEnum): Observable<Ticket> {
    return this.apiService.patch<any>(`/tickets/${id}/status`, { status }).pipe(
      map((response) => this.mapMongoTicket(response)),
      tap((updatedTicket) => this.updateTicketCache(id, updatedTicket)),
      catchError((error) => this.handleApiError('updating status', error))
    );
  }

  updateTicketPriority(id: string, priority: PriorityEnum): Observable<Ticket> {
    return this.apiService
      .patch<any>(`/tickets/${id}/priority`, { priority })
      .pipe(
        map((response) => this.mapMongoTicket(response)),
        tap((updatedTicket) => this.updateTicketCache(id, updatedTicket)),
        catchError((error) => this.handleApiError('updating priority', error))
      );
  }

  assignTicket(id: string, hrUserId: string): Observable<Ticket> {
    return this.apiService
      .patch<any>(`/tickets/${id}/assign`, { assignedTo: hrUserId })
      .pipe(
        map((response) => this.mapMongoTicket(response)),
        tap((updatedTicket) => this.updateTicketCache(id, updatedTicket)),
        catchError((error) => this.handleApiError('assigning ticket', error))
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

  // Remove from cache
  private removeFromCache(id: string): void {
    this.tickets = this.tickets.filter(
      (t) => t.id?.toString() !== id.toString()
    );
  }
}
