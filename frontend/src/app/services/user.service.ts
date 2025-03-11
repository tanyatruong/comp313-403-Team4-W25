import { Injectable, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { type User } from '../data/models/user.model';
import { ApiService } from './api.service';
import { Observable, of, tap, throwError } from 'rxjs';
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
          // After login, fetch the complete user profile including phone
          this.apiService
            .get<User>(`/users/${response.user._id}`)
            .subscribe((fullUser) => {
              this.loggedInUser = {
                ...fullUser,
              } as User;

              if (isPlatformBrowser(this.platformId)) {
                StorageUtil.setItem(
                  'currentUser',
                  JSON.stringify(this.loggedInUser)
                );

                if (response.token) {
                  this.authService.setToken(response.token);
                  console.log('Token stored in localStorage');
                } else {
                  console.error(
                    'No token received from authentication response'
                  );
                }
              }
            });
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

  // Get all users (for admin)
  getAllUsers(): Observable<User[]> {
    // Use the new admin-protected endpoint
    return this.apiService.get<User[]>('/users/all').pipe(
      catchError((error) => {
        if (error.status === 403) {
          console.error('Unauthorized: Admin privileges required');
          // Show appropriate message to the user
        } else {
          console.error('Error fetching all users:', error);
        }
        return of([]);
      })
    );
  }

  // Update a single field for a user
  updateUserField(
    userId: string,
    fieldName: string,
    value: any
  ): Observable<User> {
    const updateData = { [fieldName]: value };
    return this.apiService.patch<User>(`/users/${userId}`, updateData).pipe(
      tap((updatedUser) => {
        // If this is the current user, update the local data
        if (this.loggedInUser && this.loggedInUser._id === userId) {
          this.loggedInUser = { ...this.loggedInUser, [fieldName]: value };
          if (isPlatformBrowser(this.platformId)) {
            StorageUtil.setItem(
              'currentUser',
              JSON.stringify(this.loggedInUser)
            );
          }
        }
      }),
      catchError((error) => {
        console.error(`Error updating user ${fieldName}:`, error);
        return throwError(() => new Error(`Failed to update ${fieldName}`));
      })
    );
  }

  // Update an entire user (for admin)
  updateUser(userId: string, userData: Partial<User>): Observable<User> {
    return this.apiService.put<User>(`/users/${userId}`, userData).pipe(
      catchError((error) => {
        console.error('Error updating user:', error);
        return throwError(() => new Error('Failed to update user'));
      })
    );
  }

  // Create a new user (for admin)
  createUser(userData: Partial<User>): Observable<User> {
    return this.apiService.post<User>('/users', userData).pipe(
      catchError((error) => {
        console.error('Error creating user:', error);
        return throwError(() => new Error('Failed to create user'));
      })
    );
  }

  // Delete a user (for admin)
  deleteUser(userId: string): Observable<void> {
    return this.apiService.delete<void>(`/users/${userId}`).pipe(
      catchError((error) => {
        console.error('Error deleting user:', error);
        return throwError(() => new Error('Failed to delete user'));
      })
    );
  }

  // Modify this method to use the /me endpoint for current user
  getFullUserProfile(userId?: string): Observable<User> {
    // If no userId is provided or if it matches the current user's ID,
    // use the /me endpoint which doesn't require an ID
    const useCurrentUserEndpoint =
      !userId ||
      (this.loggedInUser &&
        ((this.loggedInUser as any).id === userId ||
          this.loggedInUser._id === userId));

    if (useCurrentUserEndpoint) {
      console.log('Using /me endpoint for current user profile');
      return this.apiService.get<User>('/users/me').pipe(
        catchError((error) => {
          console.log('Current user endpoint failed, using fallback', error);
          return of(this.loggedInUser || ({} as User));
        }),
        tap((userData) => {
          console.log('User profile data retrieved:', userData);
          // Update stored user data with any fields from the response
          if (userData) {
            this.loggedInUser = {
              ...this.loggedInUser,
              ...userData,
            };

            // Store in localStorage if needed
            if (isPlatformBrowser(this.platformId)) {
              StorageUtil.setItem(
                'currentUser',
                JSON.stringify(this.loggedInUser)
              );
            }
          }
        })
      );
    } else {
      // For other users (admin viewing other profiles)
      return this.apiService.get<User>(`/users/${userId}`);
    }
  }
}
