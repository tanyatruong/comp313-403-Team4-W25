import { Injectable, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { type User } from '../data/models/user.model';
import { UserRoleEnum } from '../data/enums/UserRoleEnum';
import { ApiService } from './api.service';
import { Observable, of, tap } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class UserService {
  users = [
    {
      employeeNumber: 'EMP000',
      employeeId: { $oid: 'mongoid0' },
      name: 'Admin User',
      email: 'admin@admin.com',
      phone: '000-000-0000',
      password: 'admin',
      role: UserRoleEnum.Admin,
      department: 'Administration',
      createdAt: { $date: new Date().toISOString() },
    },
    {
      employeeNumber: 'EMP001',
      employeeId: { $oid: 'mongoid1' },
      name: 'Employee One',
      email: '1@1.com',
      phone: '111-111-1111',
      password: '1',
      role: UserRoleEnum.Employee,
      department: 'Engineering',
      createdAt: { $date: new Date().toISOString() },
    },
    {
      employeeNumber: 'EMP002',
      employeeId: { $oid: 'mongoid2' },
      name: 'HR Representative',
      email: '2@2.com',
      phone: '222-222-2222',
      password: '2',
      role: UserRoleEnum.HR,
      department: 'Human Resources',
      createdAt: { $date: new Date().toISOString() },
    },
    {
      employeeNumber: 'EMP003',
      employeeId: { $oid: 'mongoid3' },
      name: 'HR Manager',
      email: 'hr1@company.com',
      phone: '333-333-3333',
      password: 'hr1',
      role: UserRoleEnum.HR,
      department: 'Human Resources',
      createdAt: { $date: new Date().toISOString() },
    },
  ];

  private loggedInUser: User | null = null;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private apiService: ApiService
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
        // Store the user details
        this.loggedInUser = {
          ...response.user, // Assuming the response structure has a user property
          userType: response.user?.role?.toLowerCase() || 'employee',
          employeeNumber: response.user?.employeeNumber || employeeNumber,
        };

        if (isPlatformBrowser(this.platformId)) {
          // Store user in localStorage
          localStorage.setItem(
            'currentUser',
            JSON.stringify(this.loggedInUser)
          );

          // Store the actual token from the response, not a dummy one
          if (response.token) {
            localStorage.setItem('token', response.token);
            console.log('Token stored in localStorage');
          } else {
            console.error('No token received from authentication response');
          }
        }
      }),
      map((response) => !!response?.user), // Return true if user exists in response
      catchError((error) => {
        console.error('Authentication error:', error);
        return of(false);
      })
    );
  }

  // Helper to maintain backward compatibility
  private getUserTypeFromRole(role: UserRoleEnum): string {
    switch (role) {
      case UserRoleEnum.Admin:
        return 'admin';
      case UserRoleEnum.HR:
        return 'hr';
      case UserRoleEnum.Employee:
        return 'employee';
      default:
        return 'employee';
    }
  }

  getLoggedInUser(): User | null {
    if (this.loggedInUser) {
      return this.loggedInUser;
    }

    if (isPlatformBrowser(this.platformId)) {
      const storedUser = localStorage.getItem('currentUser');
      if (storedUser) {
        this.loggedInUser = JSON.parse(storedUser);
        return this.loggedInUser;
      }
    }

    return null;
  }

  isAuthenticated(): boolean {
    return (
      isPlatformBrowser(this.platformId) &&
      !!localStorage.getItem('authToken') &&
      !!this.getLoggedInUser()
    );
  }

  logout(): void {
    this.loggedInUser = null;
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('currentUser');
      localStorage.removeItem('authToken');
    }
  }

  // Get all HR users for assignment
  getHRUsers() {
    const hrUsers = this.users.filter((user) => user.role === UserRoleEnum.HR);

    // Convert MongoDB style documents to User objects
    return hrUsers.map((user) => ({
      id: user.employeeId.$oid,
      employeeId: user.employeeId.$oid,
      employeeNumber: user.employeeNumber,
      name: user.name,
      email: user.email,
      role: UserRoleEnum.HR,
      userType: 'hr',
      department: user.department,
      createdAt: new Date(user.createdAt.$date),
    }));
  }

  login(
    email: string,
    password: string
  ): Observable<{ user: User; token: string }> {
    return this.apiService.login(email, password).pipe(
      tap((response: any) => {
        if (response.user) {
          this.loggedInUser = response.user;
          localStorage.setItem('currentUser', JSON.stringify(response.user));
        }

        if (response.token) {
          console.log('Storing token:', response.token);
          localStorage.setItem('token', response.token);
        }
      })
    );
  }
}
