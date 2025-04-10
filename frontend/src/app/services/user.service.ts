import { Injectable, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { type User } from '../data/models/user.model';
import { ApiService } from './api.service';
import { Observable, of, tap, throwError } from 'rxjs';
import { map, catchError, retry } from 'rxjs/operators';
import { StorageUtil } from '../utils/storage.util';
import { AuthService } from './auth.service';
import {Ticket} from '../data/models/ticket.model';

@Injectable({ providedIn: 'root' })
export class UserService {
  private loggedInUser: User | null = null;
  private users: User[] = [];

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private apiService: ApiService,
    private authService: AuthService
  ) {
    this.getLoggedInUser();
  }

  // Combined login method replacing both authenticateUser and login
  login(
    employeeNumber: string,
    password: string
  ): Observable<{ success: boolean; user?: User; token?: string }> {
    return this.apiService.login(employeeNumber, password).pipe(
      tap((response) => {
        if (response.user) {

          //TODO: removed unnecessary attr name change from role -> userType
          // this.loggedInUser = {
          //   ...response.user,
          //   userType: response.user?.role?.toLowerCase() || 'employee',
          //   employeeNumber: response.user?.employeeNumber || employeeNumber,
          // };

          this.loggedInUser = this.mapMongoUser(response.user);

          if (isPlatformBrowser(this.platformId)) {
            StorageUtil.setItem(
              'currentUser',
              JSON.stringify(this.loggedInUser)
            );

            if (response.token) {
              this.authService.setToken(response.token);
              console.log('Token stored in localStorage');
            } else {
              console.error('No token received from authentication response');
            }
          }
        }
      }),
      map((response) => ({
        success: !!response?.user,
        user: response?.user,
        token: response?.token,
      })),
      catchError((error) => {
        console.error('Authentication error:', error);
        return of({ success: false });
      })
    );
  }

  getLoggedInUser(): User | null {
    if (this.loggedInUser) {
      return this.loggedInUser;
    }

    if (isPlatformBrowser(this.platformId)) {
      const storedUser = StorageUtil.getItem('currentUser');
      if (storedUser) {
        this.loggedInUser = JSON.parse(storedUser);
        return this.loggedInUser;
      }
    }

    return null;
  }

  isAuthenticated(): boolean {
    return !!this.authService.getToken() && !!this.getLoggedInUser();
  }

  logout(): void {
    this.loggedInUser = null;
    if (isPlatformBrowser(this.platformId)) {
      StorageUtil.removeItem('currentUser');
      this.authService.clearToken();
    }
  }

  getUserById(id: string): Observable<User> {
    return this.apiService.get<any>(`/users/${id}`).pipe(
      map((user) => this.mapMongoUser(user)),
      catchError((error) => this.handleApiError('loading user', error))
    );
  }

  // Simplified HR users fetch with basic retry
  getHrUsers(): Observable<{ id: string; username: string }[]> {
    return this.apiService.get<User[]>('/users/hr').pipe(
      map((users: User[]) =>
        users.map((user) => ({
          id: user._id,
          username: user.name,
        }))
      ),
      retry(1), // Simple retry once if it fails
      catchError((error) => {
        // Log error but don't break the UI
        if (error.status === 401) {
          console.debug('Authorization error while fetching HR users');
        } else {
          console.error('Error fetching HR users:', error);
        }
        return of([]);
      })
    );
  }

  updateUser(id: string, user: Partial<User>): Observable<User> {

    // StorageUtil.setItem(
    //   'currentUser',
    //   JSON.stringify(this.loggedInUser)
    // );

    return this.apiService.put<any>(`/users/${id}`, user).pipe(
      map((response) => this.mapMongoUser(response)),
      // tap((updatedUser) => this.updateUserCache(id, updatedUser)),
      tap((updatedUser) => {
        this.updateUserCache(id, updatedUser);

        StorageUtil.setItem(
          'currentUser',
          JSON.stringify(this.loggedInUser)
        );
      }),
      catchError((error) => this.handleApiError('updating users', error))
    );

  }

  // Helper method to map MongoDB ticket format to app's format
  private mapMongoUser(user: any): User {
    return {
      _id: user._id,
      employeeNumber: user.employeeNumber,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      employeeId: user.employeeId,
      createdAt: new Date(user.createdAt),
    };
  }

  // Generic error handler
  private handleApiError(operation: string, error: any): Observable<never> {
    console.error(`Error ${operation}:`, error);
    return throwError(() => new Error(`Failed to ${operation}`));
  }

  // Update cache helper
  private updateUserCache(
    ticketId: string,
    updatedData: Partial<Ticket>
  ): void {
    const index = this.users.findIndex(
      (t) => t._id?.toString() === ticketId.toString()
    );
    if (index !== -1) {
      this.users[index] = { ...this.users[index], ...updatedData };
    }
  }

  // // Get tickets by user ID
  // getOpenTicketsByUserId(userId: number): Observable<Ticket[]> {
  //   return this.apiService.getTicketsByUserId(userId.toString()).pipe(
  //     map((tickets) => tickets.map((ticket) => this.mapMongoTicket(ticket))),
  //     catchError((error) => this.handleApiError('loading user tickets', error))
  //   );
  // }

  // Remove from cache
  private removeFromCache(id: string): void {
    this.users = this.users.filter(
      (t) => t._id?.toString() !== id.toString()
    );
  }
}
