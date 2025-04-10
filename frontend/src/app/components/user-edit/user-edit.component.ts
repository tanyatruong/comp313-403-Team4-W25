import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { User } from '../../data/models/user.model';
import { UserService } from '../../services/user.service';
import { RouterService } from '../../services/router.service';
import { STATUS_OPTIONS } from '../../data/enums/StatusEnum';
import { PRIORITY_OPTIONS } from '../../data/enums/PriorityEnum';
import { CATEGORY_OPTIONS } from '../../data/enums/CategoryEnum';
import { PrimengModule } from '../../../primeng.module';

@Component({
  selector: 'app-user-edit',
  standalone: true,
  imports: [CommonModule, FormsModule, PrimengModule],
  templateUrl: './user-edit.component.html',
  styleUrls: ['./user-edit.component.css'],
})
export class UserEditComponent implements OnInit {
  user: User | null = null;
  statusOptions = STATUS_OPTIONS;
  priorityOptions = PRIORITY_OPTIONS;
  categoryOptions = CATEGORY_OPTIONS;
  errorMessage: string = '';

  showChatbot = false;
  
  constructor(
    private userService: UserService,
    private routerService: RouterService
  ) {}

  ngOnInit(): void {
    // Get the current user from the service
    this.user = this.userService.getLoggedInUser();

    // If no user is found, show error and redirect
    if (!this.user) {
      this.errorMessage = 'No user selected for editing';

      // Navigate back to home after a short delay
      setTimeout(() => this.routerService.navigateToHome(), 2000);
    }
  }

  saveUser(): void {
    if (!this.user) {
      this.errorMessage = 'No user to save';
      return;
    }

    // First update the user
    this.userService.updateUser(this.user._id!, this.user).subscribe(
      (updatedUser) => {
        console.log('User updated successfully', updatedUser);

        this.routerService.navigateToHome();
      },
      (error) => {
        console.error('Error updating user:', error);
        this.errorMessage = 'Failed to update user';
      }
    );
  }

  cancel(): void {
    this.routerService.navigateToHome();
  }
}
