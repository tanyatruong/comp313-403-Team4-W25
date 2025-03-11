import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PrimengModule } from '../../../primeng.module';
import { RouterService } from '../../services/router.service';
import { TicketService } from '../../services/ticket.service';
import { UserService } from '../../services/user.service';
import { Ticket } from '../../data/models/ticket.model';
import { PriorityEnum, PRIORITY_OPTIONS } from '../../data/enums/PriorityEnum';
import { CategoryEnum, CATEGORY_OPTIONS } from '../../data/enums/CategoryEnum';
import { StatusEnum, STATUS_OPTIONS } from '../../data/enums/StatusEnum';

@Component({
  selector: 'app-ticket-create',
  standalone: true,
  imports: [CommonModule, FormsModule, PrimengModule],
  templateUrl: './ticket-create.component.html',
  styleUrls: ['./ticket-create.component.css'],
})
export class TicketCreateComponent implements OnInit {
  newTicket: Partial<Ticket> = {
    title: '',
    description: '',
    category: CategoryEnum.General,
    priority: PriorityEnum.Medium,
  };

  categoryOptions = CATEGORY_OPTIONS;
  priorityOptions = PRIORITY_OPTIONS;
  statusOptions = STATUS_OPTIONS;

  errorMessage: string | null = null;

  constructor(
    private routerService: RouterService,
    private ticketService: TicketService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    const currentUser = this.userService.getLoggedInUser();
    if (currentUser) {
      this.newTicket.employeeNumber = currentUser.employeeNumber || '';
      this.newTicket.userId = currentUser.id ? parseInt(currentUser.id, 10) : 0;
    }
  }

  onSubmit(): void {
    if (this.validateForm()) {
      this.submitTicket();
    }
  }

  validateForm(): boolean {
    return !!(
      this.newTicket.title &&
      this.newTicket.description &&
      this.newTicket.category &&
      this.newTicket.priority
    );
  }

  goBack(): void {
    this.routerService.navigateToHome();
  }

  onReturnButtonClick() {
    this.goBack();
  }

  onDiscardButtonClick() {
    this.goBack();
  }

  onCompleteTicketCreationButtonClick() {
    this.onSubmit();
  }

  submitTicket(): void {
    if (!this.newTicket) {
      this.errorMessage = 'No ticket to save';
      return;
    }

    console.log('Creating ticket:', this.newTicket);

    // Make sure we're sending a complete ticket object
    this.ticketService.createTicket(this.newTicket).subscribe(
      (createdTicket) => {
        console.log('Ticket created successfully', createdTicket);
        this.routerService.navigateToHome();
      },
      (error) => {
        console.error('Error creating ticket:', error);
        this.errorMessage = 'Failed to create ticket';
      }
    );
  }
}
