import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Ticket } from '../../data/models/ticket.model';
import { TicketService } from '../../services/ticket.service';
import { RouterService } from '../../services/router.service';
import { StatusEnum } from '../../data/enums/StatusEnum';
import { PriorityEnum } from '../../data/enums/PriorityEnum';
import { CategoryEnum } from '../../data/enums/CategoryEnum';
import { UserService } from '../../services/user.service';
import { PrimengModule } from '../../../primeng.module';

@Component({
  selector: 'app-edit-ticket',
  standalone: true,
  imports: [CommonModule, FormsModule, PrimengModule],
  templateUrl: './edit-ticket.component.html',
  styleUrls: ['./edit-ticket.component.css'],
})
export class EditTicketComponent implements OnInit {
  ticket: Ticket | null = null;
  statusOptions = Object.values(StatusEnum);
  priorityOptions = Object.values(PriorityEnum);
  categoryOptions = Object.values(CategoryEnum);
  errorMessage: string = '';

  constructor(
    private ticketService: TicketService,
    private routerService: RouterService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    // Get the current ticket from the service
    this.ticket = this.ticketService.currentTicket;

    // If no ticket is found, try to get it from localStorage
    if (!this.ticket) {
      const ticketId = localStorage.getItem('currentTicketId');
      if (ticketId) {
        this.ticketService.getTicketById(ticketId).subscribe(
          (ticket) => {
            this.ticket = ticket;
          },
          (error) => {
            console.error('Error loading ticket:', error);
            this.errorMessage = 'Could not load ticket details';
            setTimeout(() => this.routerService.navigateToHome(), 2000);
          }
        );
      } else {
        this.errorMessage = 'No ticket selected for editing';
        setTimeout(() => this.routerService.navigateToHome(), 2000);
      }
    }
  }

  saveTicket(): void {
    if (!this.ticket) {
      this.errorMessage = 'No ticket to save';
      return;
    }

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
