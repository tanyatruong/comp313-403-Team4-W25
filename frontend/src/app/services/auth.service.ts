import { Injectable } from '@angular/core';
import { StorageUtil } from '../utils/storage.util';

@Injectable({ providedIn: 'root' })
export class AuthService {
  getToken(): string | null {
    return StorageUtil.getItem('token');
  }

  setToken(token: string): void {
    StorageUtil.setItem('token', token);
  }

  clearToken(): void {
    StorageUtil.removeItem('token');
  }
}
