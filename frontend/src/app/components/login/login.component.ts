import { Component, inject, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

//primeNG imports
import { PrimengModule } from '../../../primeng.module';

//my imports
import { UserService } from '../../services/user.service';
import { RouterService } from '../../services/router.service';
@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
  imports: [PrimengModule, FormsModule],
})
export class LoginComponent {
  @Input({ required: true }) email!: string;
  @Input({ required: true }) password!: string;

  userService = inject(UserService);
  routerService = inject(RouterService);
  router = inject(Router);

  errorMessage: string = '';

  onLoginAttempt() {
    // start login process
    console.log(
      'Login Attempted:\n-email: ' +
        this.email +
        '\n-password: ' +
        this.password
    );
    const isAuthenticated =
      this.userService.authenticateUserLoginAndReturnResult(
        this.email,
        this.password
      );

    if (isAuthenticated) {
      this.routerService.navigateToHome();
    } else {
      this.errorMessage = 'Invalid email or password';
    }
  }

  // when user opts to press enter instead of clicking login button
  onEnterButtonPress() {
    this.onLoginAttempt();
  }

  loginWithCredentials(): void {
    const isAuthenticated =
      this.userService.authenticateUserLoginAndReturnResult(
        this.email,
        this.password
      );

    if (isAuthenticated) {
      this.router.navigate(['/home']);
    } else {
      this.errorMessage = 'Invalid email or password';
    }
  }
}
