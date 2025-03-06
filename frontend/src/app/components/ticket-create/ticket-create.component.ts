import { Component, inject, Input, ViewEncapsulation } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgStyle } from '@angular/common';
import { NgClass } from '@angular/common';

//primeNG imports
import { PrimengModule } from '../../../primeng.module';

//My imports
import { UserService } from '../../services/user.service';
import { RouterService } from '../../services/router.service';
import { StatusEnum } from '../../data/enums/StatusEnum';
import { TicketService } from '../../services/ticket.service';
import { Ticket } from '../../data/models/ticket.model';

@Component({
  selector: 'app-ticket-create',
  standalone: true,
  imports: [PrimengModule, NgStyle, NgClass],
  templateUrl: './ticket-create.component.html',
  styleUrl: './ticket-create.component.css',
})
export class TicketCreateComponent {
  private userService = inject(UserService);
  private routerService = inject(RouterService);
  private ticketService = inject(TicketService);

  user = this.userService.getLoggedInUser;
  private dateObj = new Date();
  ticket = {
    id: '100',
    userId: '0',
    status: StatusEnum.Open,
    title: 'title100',
    description: 'description100',
    dateAndTimeOfCreation:
      this.dateObj.getFullYear() +
      '/' +
      this.dateObj.getMonth() +
      '/' +
      this.dateObj.getDate() +
      ' @ ' +
      this.dateObj.getHours() +
      ':' +
      this.dateObj.getMinutes() +
      ':' +
      this.dateObj.getSeconds(),
  };

  targetEmployeeID!: number;

  onReturnButtonClick() {
    // This currently discards/does not save in progress ticket
    console.log('event: onReturnButtonClick');
    this.routerService.navigateToHome();
  }

  onDiscardButtonClick() {
    // This currently discards/does not save in progress ticket
    console.log('event: onDiscardButtonClick');
    this.onReturnButtonClick();
  }

  onCompleteTicketCreationButtonClick() {
    // This currently discards/does not save in progress ticket
    // this.onReturnButtonClick();
    console.log('event: onCompleteTicketCreationButtonClick');
  }
}
