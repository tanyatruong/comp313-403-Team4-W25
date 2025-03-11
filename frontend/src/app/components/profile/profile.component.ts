import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PrimengModule } from '../../../primeng.module';
import { UserService } from '../../services/user.service';
import { User } from '../../data/models/user.model';
import { MessageService } from 'primeng/api';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule, PrimengModule, RouterModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
  providers: [MessageService],
})
export class ProfileComponent implements OnInit {
  user: User | null = null;
  phone: string = '';
  isSaving: boolean = false;

  constructor(
    private userService: UserService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.loadUserData();
  }

  loadUserData(): void {
    // Instead of loading basic data first, go straight to the full profile
    this.userService.getFullUserProfile().subscribe(
      (userData) => {
        this.user = userData;
        this.phone = userData.phone || '';
      },
      (error) => {
        console.error('Failed to load user profile:', error);
        // Fallback to basic data only if API call fails
        this.user = this.userService.getLoggedInUser();
        this.phone = this.user?.phone || '';
      }
    );
  }

  updatePhoneNumber(): void {
    if (!this.user) return;

    this.isSaving = true;

    this.userService
      .updateUserField(this.user._id!, 'phone', this.phone)
      .subscribe({
        next: (updatedUser) => {
          this.isSaving = false;
          this.messageService.add({
            severity: 'success',
            summary: 'Profile Updated',
            detail: 'Your phone number has been updated successfully',
          });

          // Update local user data
          this.user = updatedUser;
        },
        error: (error) => {
          this.isSaving = false;
          console.error('Error updating phone number:', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Update Failed',
            detail: 'Could not update your profile. Please try again.',
          });
        },
      });
  }
}
