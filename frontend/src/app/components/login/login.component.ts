import { Component, inject, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

//primeNG imports
import { PrimengModule } from '../../../primeng.module';

//my imports
import { UserService } from '../../services/user.service';
import { RouterService } from '../../services/router.service';
import { User } from '../../data/models/user.model';

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
  imports: [PrimengModule, FormsModule],
})
export class LoginComponent {
  @Input() email: string = '';
  @Input() password: string = '';

  userService = inject(UserService);
  routerService = inject(RouterService);
  router = inject(Router);

  errorMessage: string = '';

  // Combined login method that replaces both onLoginAttempt and onSubmit
  onLoginAttempt() {
    console.log(
      'Login Attempted:\n-email: ' +
        this.email +
        '\n-password: ' +
        this.password
    );

    this.userService.login(this.email, this.password).subscribe(
      (response) => {
        if (response.success) {
          console.log('Login successful');
          this.routerService.navigateToHome();
        } else {
          this.errorMessage = 'Invalid email or password';
        }
      },
      (error) => {
        console.error('Login failed:', error);
        this.errorMessage = 'Invalid credentials';
      }
    );
  }

  // when user opts to press enter instead of clicking login button
  onEnterButtonPress() {
    this.onLoginAttempt();
  }

  // Keeping this method as an alias to onLoginAttempt for any existing form bindings
  onSubmit(): void {
    this.onLoginAttempt();
  }

  // Method to fill demo credentials
  fillCredentials(employeeNumber: string, password: string): void {
    this.email = employeeNumber;
    this.password = password;
  }
}
