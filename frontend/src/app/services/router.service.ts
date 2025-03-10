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

  navigateToTicketEdit(): void {
    // Make sure we're storing the currentTicket in localStorage if needed
    // or pass it properly through router state
    this.router.navigate(['/edit-ticket']);
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

  navigateToHRDashboard() {
    this.router.navigate(['/hr-dashboard']);
  }

  //   navigateToError(errorCode: number) {
  //     this.router.navigate(['/error'], { queryParams: { code: errorCode } });
  //   }
}
