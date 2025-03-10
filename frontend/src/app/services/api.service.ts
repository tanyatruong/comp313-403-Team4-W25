import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Ticket } from '../data/models/ticket.model';
import { User } from '../data/models/user.model';

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

  updateTicket(id: string, ticket: Partial<Ticket>): Observable<Ticket> {
    return this.http.put<Ticket>(`${this.apiUrl}/tickets/${id}`, ticket);
  }

  deleteTicket(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/tickets/${id}`);
  }

  // Get tickets by user ID
  getTicketsByUserId(userId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/tickets/user/${userId}`);
  }

  // Update ticket status
  updateTicketStatus(id: string, status: string): Observable<Ticket> {
    return this.http.patch<Ticket>(`${this.apiUrl}/tickets/${id}/status`, {
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
}
