import { Injectable, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { type User } from '../data/models/user.model';
import { ApiService } from './api.service';
import { Observable, of, tap } from 'rxjs';
import { map, catchError, retry } from 'rxjs/operators';
import { StorageUtil } from '../utils/storage.util';
import { AuthService } from './auth.service';

@Injectable({ providedIn: 'root' })
export class UserService {
  private loggedInUser: User | null = null;

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
          this.loggedInUser = {
            ...response.user,
            userType: response.user?.role?.toLowerCase() || 'employee',
            employeeNumber: response.user?.employeeNumber || employeeNumber,
          };

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
}
