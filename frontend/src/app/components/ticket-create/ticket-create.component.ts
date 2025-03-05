import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { PrimengModule } from '../../../primeng.module';
import { RouterService } from '../../services/router.service';
import { TicketService } from '../../services/ticket.service';
import { UserService } from '../../services/user.service';
import { StatusEnum } from '../../data/enums/StatusEnum';

@Component({
  selector: 'app-ticket-create',
  standalone: true,
  imports: [CommonModule, FormsModule, PrimengModule],
  templateUrl: './ticket-create.component.html',
  styleUrls: ['./ticket-create.component.css']
})
export class TicketCreateComponent {
  routerService = inject(RouterService);
  ticketService = inject(TicketService);
  userService = inject(UserService);

  // Form Fields
  title: string = '';
  description: string = '';
  category: string = '';
  priority: string = 'Medium'; // Default priority

  // Options for dropdowns
  priorityOptions = [
    { label: 'Low', value: 'Low' },
    { label: 'Medium', value: 'Medium' },
    { label: 'High', value: 'High' }
  ];

  categoryOptions = [
    { label: 'IT Support', value: 'IT Support' },
    { label: 'HR', value: 'HR' },
    { label: 'Facilities', value: 'Facilities' },
    { label: 'Finance', value: 'Finance' },
    { label: 'Other', value: 'Other' }
  ];

  submitTicket() {
    if (!this.title || !this.description || !this.category) {
      // Show error message
      return;
    }

    const currentUser = this.userService.getLoggedInUser();
    if (!currentUser) {
      // Handle not logged in
      return;
    }

    // Create new ticket
    const newTicket = {
      id: new Date().getTime(), // Generate a unique ID
      userId: parseInt(currentUser.id),
      status: StatusEnum.Open,
      title: this.title,
      description: this.description,
      dateAndTimeOfCreation: new Date().toISOString()
    };

    // Add to tickets array (this is for frontend demo, will be replaced with API call)
    this.ticketService['tickets'].push(newTicket);
    
    // Navigate back to home
    this.routerService.navigateToHome();
  }

  cancel() {
    this.routerService.navigateToHome();
  }
} 