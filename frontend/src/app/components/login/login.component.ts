import { Component, inject, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';

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
  @Input({ required: true }) username!: string;
  @Input({ required: true }) password!: string;

  userService = inject(UserService);
  routerService = inject(RouterService);

  onLoginAttempt() {
    // start login process
    console.log(
      'Login Attempted:\n-username: ' +
        this.username +
        '\n-password: ' +
        this.password
    );
    if (
      this.userService.authenticateUserLoginAndReturnResult(
        this.username,
        this.password
      )
    ) {
      //reroute to next page CURRENTLY SET TO EDITTICKET COMPONENT
      this.routerService.navigateToHome();
    }
  }

  // when user opts to press enter instead of clicking login button
  onEnterButtonPress() {
    this.onLoginAttempt();
  }
}
