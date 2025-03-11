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
  selector: 'app-ticket-edit',
  standalone: true,
  imports: [PrimengModule, NgStyle, NgClass],
  templateUrl: './ticket-edit.component.html',
  styleUrl: './ticket-edit.component.css',
  encapsulation: ViewEncapsulation.None,
})
export class TicketEditComponent {
  private userService = inject(UserService);
  private routerService = inject(RouterService);
  private ticketService = inject(TicketService);
  // @Input({ required: true }) ticketStatus!: string;
  // statusEnum = StatusEnum;
  // user = this.userService.getLoggedInUser();
  // @Input({ required: true }) ticket!: Ticket; // used in issue #10 pass ticket object to editTicket component
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

  getTicketStatusButtonStyling() {
    // let styleOBJ = { background-color: 'green' };
    // if (this.ticketStatus == this.statusEnum.AttentionRequired) {
    //   styleOBJ = { background-color: 'yellow' };
    // }
    // return styleOBJ;
  }

  onStatusLabelClick() {
    if (this.ticket.status == StatusEnum.InProgress) {
      this.ticket.status = StatusEnum.Open;
    } else if (this.ticket.status == StatusEnum.Open) {
      this.ticket.status = StatusEnum.InProgress;
    }
  }

  onReturnButtonClick() {
    // This currently discards/does not save in progress ticket
    this.routerService.navigateToHome();
  }

  onEscalateClick() {}
  onCloseTicketClick() {}
  onCreateButtonClick() {}
}
