import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class RouterService {
  constructor(private router: Router) {}

  //   navigateToProfile(userId: number) {
  //     if (userId) {
  //       this.router.navigate(['/profile', userId]);
  //     } else {
  //       this.router.navigate(['/login']);
  //     }
  //   }
  navigateToHome() {
    this.router.navigate(['/home']);
  }

  navigateToSettings() {
    this.router.navigate(['/settings']);
  }

  navigateToTicketCreation() {
    this.router.navigate(['/ticketcreate']);
  }

  navigateToTicketEdit() {
    this.router.navigate(['/ticketedit']);
  }

  navigateToMessageCreation() {
    this.router.navigate(['/messageCreation']);
  }

  navigateToTicketClosure() {
    this.router.navigate(['/ticketClosure']);
  }

  navigateToTicketEscalation() {
    this.router.navigate(['/ticketEscalation']);
  }

  //   navigateToError(errorCode: number) {
  //     this.router.navigate(['/error'], { queryParams: { code: errorCode } });
  //   }
}
