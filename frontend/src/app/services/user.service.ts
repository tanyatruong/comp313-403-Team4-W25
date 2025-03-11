import { Injectable, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { type User } from '../data/models/user.model';
import { UserRoleEnum } from '../data/enums/UserRoleEnum';
import { ApiService } from './api.service';
import { Observable, of, tap } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
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

  authenticateUser(
    employeeNumber: string,
    password: string
  ): Observable<boolean> {
    return this.apiService.login(employeeNumber, password).pipe(
      tap((response) => {
        console.log('Authentication response:', response);
        this.loggedInUser = {
          ...response.user,
          userType: response.user?.role?.toLowerCase() || 'employee',
          employeeNumber: response.user?.employeeNumber || employeeNumber,
        };

        if (isPlatformBrowser(this.platformId)) {
          StorageUtil.setItem('currentUser', JSON.stringify(this.loggedInUser));

          if (response.token) {
            this.authService.setToken(response.token);
            console.log('Token stored in localStorage');
          } else {
            console.error('No token received from authentication response');
          }
        }
      }),
      map((response) => !!response?.user),
      catchError((error) => {
        console.error('Authentication error:', error);
        return of(false);
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

  getToken(): string | null {
    return isPlatformBrowser(this.platformId)
      ? StorageUtil.getItem('token')
      : null;
  }

  isAuthenticated(): boolean {
    return (
      isPlatformBrowser(this.platformId) &&
      !!StorageUtil.getItem('token') &&
      !!this.getLoggedInUser()
    );
  }

  logout(): void {
    this.loggedInUser = null;
    if (isPlatformBrowser(this.platformId)) {
      StorageUtil.removeItem('currentUser');
      StorageUtil.removeItem('token');
    }
  }

  login(
    email: string,
    password: string
  ): Observable<{ user: User; token: string }> {
    return this.apiService.login(email, password).pipe(
      tap((response: any) => {
        if (response.user) {
          this.loggedInUser = response.user;
          StorageUtil.setItem('currentUser', JSON.stringify(response.user));
        }

        if (response.token) {
          console.log('Storing token:', response.token);
          StorageUtil.setItem('token', response.token);
        }
      })
    );
  }
}
