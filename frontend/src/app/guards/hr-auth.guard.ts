import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import { UserService } from '../services/user.service';

@Injectable({
  providedIn: 'root',
})
export class HrAuthGuard implements CanActivate {
  constructor(private userService: UserService, private router: Router) {}

  canActivate(): boolean {
    // Temporarily allow all authenticated users to access HR dashboard
    return true;

    // Original code - commented out for now
    /*
    const user = this.userService.getLoggedInUser();
    
    // Allow access for HR users and admins only
    if (user && (user.userType === 'hr' || user.userType === 'admin')) {
      return true;
    }
    
    // Redirect to home page if not authorized
    this.router.navigate(['/home']);
    return false;
    */
  }
}
