import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { UserService } from '../services/user.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private userService: UserService, private router: Router) {}

  canActivate(): boolean {
    const user = this.userService.getLoggedInUser();

    if (user) {
      return true;
    }

    // Redirect to login page if not logged in
    this.router.navigate(['/login']);
    return false;
  }
}
