import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import { UserService } from '../services/user.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router, private userService: UserService) {}

  canActivate(): boolean {
    if (this.userService.isAuthenticated()) {
      return true;
    }

    // Not logged in, redirect to login
    this.router.navigate(['/login']);
    return false;
  }
}
