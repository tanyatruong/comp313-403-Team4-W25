import { Component, inject, Input, ViewEncapsulation } from '@angular/core';
import { NgStyle } from '@angular/common';
import { NgClass } from '@angular/common';

//primeNG imports
import { PrimengModule } from '../../../primeng.module';

//My imports
import { UserService } from '../../services/user.service';
import { RouterService } from '../../services/router.service';
import { StatusEnum } from '../../data/enums/StatusEnum';
import { TicketService } from '../../services/ticket.service';

@Component({
  selector: 'app-ticket-edit',
  standalone: true,
  imports: [PrimengModule, NgStyle, NgClass],
  templateUrl: './ticket-edit.component.html',
  styleUrl: './ticket-edit.component.css',
  encapsulation: ViewEncapsulation.None,
})
export class TicketEditComponent {
  private routerService = inject(RouterService);
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

  onStatusLabelClick() {
    if (this.ticket.status == StatusEnum.InProgress) {
      this.ticket.status = StatusEnum.Open;
    } else if (this.ticket.status == StatusEnum.Open) {
      this.ticket.status = StatusEnum.InProgress;
    }
  }

  onReturnButtonClick() {
    this.routerService.navigateToHome();
  }

  onEscalateClick() {}
  onCloseTicketClick() {}
  onCreateButtonClick() {}
}
