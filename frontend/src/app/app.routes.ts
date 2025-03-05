import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
// import { TicketEditComponent } from './ticket-edit/ticket-edit.component';
// import { TicketEscalationComponent } from './ticket-escalation/ticket-escalation.component';
import { HomeComponent } from './components/home/home.component';
import { TicketCreateComponent } from './components/ticket-create/ticket-create.component';
// import { SettingsComponent } from './settings/settings.component';
// import { TicketClosureComponent } from './ticket-closure/ticket-closure.component';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  // { path: '**', redirectTo: 'login' },
  {
    path: 'login',
    component: LoginComponent,
  },

  {
    path: 'home',
    component: HomeComponent,
  },
  // {
  //   path: 'settings',
  //   component: SettingsComponent,
  // },

  {
    path: 'ticketcreate',
    component: TicketCreateComponent,
  },
  // {
  //   path: 'ticketedit',
  //   component: TicketEditComponent,
  // },
  // {
  //   path: 'ticketedit',
  //   component: TicketEditComponent,
  // },
  // {
  //   path: 'messageCreation',
  //   component: MessageCreationComponent,
  // },

  // {
  //   path: 'ticketClosure',
  //   component: TicketClosureComponent,
  // },
  // {
  //   path: 'ticketEscalation',
  //   component: TicketEscalationComponent,
  // },

  // {
  //   path: 'dashboard',
  //   component: MainComponent,
  // },
];

// Not going to use Modules(for routing)
// @NgModule({
//   imports: [RouterModule.forRoot(routes)],
//   exports: [RouterModule],
// })
// export class AppRoutingModule {}
