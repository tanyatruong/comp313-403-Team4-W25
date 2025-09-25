import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, BehaviorSubject } from 'rxjs';
import { StorageUtil } from '../utils/storage.util';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private isLoggedInSubject = new BehaviorSubject<boolean>(this.hasToken());
  public isLoggedIn$ = this.isLoggedInSubject.asObservable();

  constructor(private http: HttpClient, private router: Router) {}

  getToken(): string | null {
    return StorageUtil.getItem('token');
  }

  setToken(token: string): void {
    StorageUtil.setItem('token', token);
    this.isLoggedInSubject.next(true);
  }

  clearToken(): void {
    StorageUtil.removeItem('token');
    StorageUtil.removeItem('user');
    this.isLoggedInSubject.next(false);
  }

  hasToken(): boolean {
    return !!this.getToken();
  }

  getCurrentUser(): any {
    const userStr = StorageUtil.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  }

  setUser(user: any): void {
    StorageUtil.setItem('user', JSON.stringify(user));
  }

  logout(): Observable<any> {
    return new Observable(observer => {
      this.http.post(`${environment.apiUrl}/auth/logout`, {}).subscribe({
        next: (response) => {
          this.clearToken();
          this.router.navigate(['/login']);
          observer.next(response);
          observer.complete();
        },
        error: (error) => {
          // Even if the server request fails, clear local storage and redirect
          this.clearToken();
          this.router.navigate(['/login']);
          observer.next({ message: 'Logged out locally' });
          observer.complete();
        }
      });
    });
  }
}
