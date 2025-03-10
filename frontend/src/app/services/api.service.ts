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

  // Add a method to get authorization headers
  private getAuthHeaders(): HttpHeaders {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    const token = localStorage.getItem('token');
    if (token) {
      // Use Authorization: Bearer [token] format
      headers = headers.set('Authorization', `Bearer ${token}`);
      console.log(
        'Using auth token (first 15 chars):',
        token.substring(0, 15) + '...'
      );
    } else {
      console.error(
        '⚠️ Authentication token missing - request will fail with 401'
      );
    }

    return headers;
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
    return this.http.get<Ticket[]>(`${this.apiUrl}/tickets`, {
      headers: this.getAuthHeaders(),
    });
  }

  getTicketById(id: string): Observable<Ticket> {
    return this.http.get<Ticket>(`${this.apiUrl}/tickets/${id}`, {
      headers: this.getAuthHeaders(),
    });
  }

  // Update createTicket to use auth headers
  createTicket(ticket: Ticket): Observable<Ticket> {
    console.log('API Service: Creating new ticket:', ticket);
    return this.http
      .post<Ticket>(`${this.apiUrl}/tickets`, ticket, {
        headers: this.getAuthHeaders(),
      })
      .pipe(
        tap((response) => console.log('Server response:', response)),
        catchError((error) => {
          console.error('API Error:', error);
          return throwError(() => error);
        })
      );
  }

  // Also update other methods that need auth
  updateTicket(ticketId: string, ticket: Ticket): Observable<Ticket> {
    console.log('API Service: Updating ticket with status:', ticket.status);
    return this.http
      .put<Ticket>(`${this.apiUrl}/tickets/${ticketId}`, ticket, {
        headers: this.getAuthHeaders(),
      })
      .pipe(
        tap((response) => console.log('API Response:', response)),
        catchError((error) => {
          console.error('API Error:', error);
          return throwError(() => error);
        })
      );
  }

  deleteTicket(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/tickets/${id}`, {
      headers: this.getAuthHeaders(),
    });
  }

  // Get tickets by user ID
  getTicketsByUserId(userId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/tickets/user/${userId}`, {
      headers: this.getAuthHeaders(),
    });
  }

  // Update ticket status
  updateTicketStatus(ticketId: string, status: StatusEnum): Observable<any> {
    return this.http.patch(
      `${this.apiUrl}/tickets/${ticketId}/status`,
      { status },
      { headers: this.getAuthHeaders() }
    );
  }

  // Assign ticket to HR
  assignTicket(id: string, hrUserId: string): Observable<Ticket> {
    return this.http.patch<Ticket>(
      `${this.apiUrl}/tickets/${id}/assign`,
      { assignedTo: hrUserId },
      { headers: this.getAuthHeaders() }
    );
  }

  // Add this method to ApiService
  login(email: string, password: string): Observable<any> {
    return this.http
      .post<any>(`${this.apiUrl}/auth/login`, {
        employeeNumber: email,
        password,
      })
      .pipe(
        tap((response) => console.log('Login response:', response)),
        catchError((error) => {
          console.error('Login error:', error);
          return throwError(() => error);
        })
      );
  }

  // Add this method to update ticket priority
  updateTicketPriority(
    ticketId: string,
    priority: PriorityEnum
  ): Observable<any> {
    return this.http.patch(
      `${this.apiUrl}/tickets/${ticketId}/priority`,
      { priority },
      { headers: this.getAuthHeaders() }
    );
  }

  // Add a method to check token status
  public checkAuthStatus(): boolean {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('currentUser');
    console.log('Auth status check - Token exists:', !!token);
    console.log('Auth status check - User exists:', !!user);
    return !!token && !!user;
  }
}
