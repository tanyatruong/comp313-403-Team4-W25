import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Ticket } from '../../data/models/ticket.model';
import { TicketService } from '../../services/ticket.service';
import { RouterService } from '../../services/router.service';
import { STATUS_OPTIONS } from '../../data/enums/StatusEnum';
import { PRIORITY_OPTIONS } from '../../data/enums/PriorityEnum';
import { CATEGORY_OPTIONS } from '../../data/enums/CategoryEnum';
import { PrimengModule } from '../../../primeng.module';

@Component({
  selector: 'app-ticket-edit',
  standalone: true,
  imports: [CommonModule, FormsModule, PrimengModule],
  templateUrl: './ticket-edit.component.html',
  styleUrls: ['./ticket-edit.component.css'],
})
export class TicketEditComponent implements OnInit {
  ticket: Ticket | null = null;
  statusOptions = STATUS_OPTIONS;
  priorityOptions = PRIORITY_OPTIONS;
  categoryOptions = CATEGORY_OPTIONS;
  errorMessage: string = '';

  constructor(
    private ticketService: TicketService,
    private routerService: RouterService
  ) {}

  ngOnInit(): void {
    // Get the current ticket from the service
    this.ticket = this.ticketService.currentTicket;

    // If no ticket is found, show error and redirect
    if (!this.ticket) {
      this.errorMessage = 'No ticket selected for editing';

      // Navigate back to home after a short delay
      setTimeout(() => this.routerService.navigateToHome(), 2000);
    }
  }

  saveTicket(): void {
    if (!this.ticket) {
      this.errorMessage = 'No ticket to save';
      return;
    }

    // First update the ticket
    this.ticketService.updateTicket(this.ticket.id!, this.ticket).subscribe(
      (updatedTicket) => {
        console.log('Ticket updated successfully', updatedTicket);

        this.routerService.navigateToHome();
      },
      (error) => {
        console.error('Error updating ticket:', error);
        this.errorMessage = 'Failed to update ticket';
      }
    );
  }

  cancel(): void {
    this.routerService.navigateToHome();
  }
}
