import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Ticket } from '../data/models/ticket.model';
import { User } from '../data/models/user.model';
import { StatusEnum } from '../data/enums/StatusEnum';
import { PriorityEnum } from '../data/enums/PriorityEnum';
import { tap, catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  // Update to use localhost Express server
  private apiUrl = 'http://localhost:3000/api';

  constructor(private http: HttpClient) {}

  // HTTP Headers
  private getHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Content-Type': 'application/json',
    });
  }

  // User endpoints
  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}/users`);
  }

  getUserById(id: string): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/users/${id}`);
  }

  authenticateUser(email: string, password: string): Observable<User> {
    return this.http.post<User>(`${this.apiUrl}/auth/login`, {
      employeeNumber: email,
      password,
    });
  }

  // Ticket endpoints
  getTickets(): Observable<Ticket[]> {
    return this.http.get<Ticket[]>(`${this.apiUrl}/tickets`);
  }

  getTicketById(id: string): Observable<Ticket> {
    return this.http.get<Ticket>(`${this.apiUrl}/tickets/${id}`);
  }

  createTicket(ticket: Partial<Ticket>): Observable<Ticket> {
    return this.http.post<Ticket>(`${this.apiUrl}/tickets`, ticket);
  }

  updateTicket(ticketId: string, ticket: Ticket): Observable<Ticket> {
    console.log('API Service: Updating ticket with status:', ticket.status);
    return this.http
      .put<Ticket>(`${this.apiUrl}/tickets/${ticketId}`, ticket)
      .pipe(
        tap((response) => console.log('API Response:', response)),
        catchError((error) => {
          console.error('API Error:', error);
          return throwError(() => error);
        })
      );
  }

  deleteTicket(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/tickets/${id}`);
  }

  // Get tickets by user ID
  getTicketsByUserId(userId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/tickets/user/${userId}`);
  }

  // Update ticket status
  updateTicketStatus(ticketId: string, status: StatusEnum): Observable<any> {
    return this.http.patch(`${this.apiUrl}/tickets/${ticketId}/status`, {
      status,
    });
  }

  // Assign ticket to HR
  assignTicket(id: string, hrUserId: string): Observable<Ticket> {
    return this.http.patch<Ticket>(`${this.apiUrl}/tickets/${id}/assign`, {
      assignedTo: hrUserId,
    });
  }

  // Add this method to ApiService
  login(email: string, password: string): Observable<User> {
    return this.http.post<User>(`${this.apiUrl}/auth/login`, {
      employeeNumber: email,
      password,
    });
  }

  // Add this method to update ticket priority
  updateTicketPriority(
    ticketId: string,
    priority: PriorityEnum
  ): Observable<any> {
    return this.http.patch(`${this.apiUrl}/tickets/${ticketId}/priority`, {
      priority,
    });
  }
}
