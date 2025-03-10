import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PrimengModule } from '../../../primeng.module';
import { RouterService } from '../../services/router.service';
import { TicketService } from '../../services/ticket.service';
import { UserService } from '../../services/user.service';
import { Ticket } from '../../data/models/ticket.model';
import { PriorityEnum } from '../../data/enums/PriorityEnum';
import { CategoryEnum } from '../../data/enums/CategoryEnum';

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

  categories = [
    { name: 'General Inquiry', value: CategoryEnum.General },
    { name: 'Technical Support', value: CategoryEnum.Technical },
    { name: 'Payroll Issue', value: CategoryEnum.Payroll },
    { name: 'Benefits Question', value: CategoryEnum.Benefits },
    { name: 'Office Facilities', value: CategoryEnum.Facilities },
  ];

  priorities = [
    { name: 'Low', value: PriorityEnum.Low },
    { name: 'Medium', value: PriorityEnum.Medium },
    { name: 'High', value: PriorityEnum.High },
  ];

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
      const createdTicket = this.ticketService.createTicket(this.newTicket);
      console.log('Ticket created successfully:', createdTicket);
      this.routerService.navigateToHome();
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
}
