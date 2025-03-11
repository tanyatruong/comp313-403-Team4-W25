import { Routes } from '@angular/router';
import { HrDashboardComponent } from './components/hr-dashboard/hr-dashboard.component';
import { HrAuthGuard } from './guards/hr-auth.guard';
import { AuthGuard } from './guards/auth.guard';
import { ProfileComponent } from './components/profile/profile.component';
import { EmployeeManagementComponent } from './components/admin/employee-management/employee-management.component';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  {
    path: 'login',
    loadComponent: () =>
      import('./components/login/login.component').then(
        (c) => c.LoginComponent
      ),
  },

  {
    path: 'home',
    loadComponent: () =>
      import('./components/home/home.component').then((c) => c.HomeComponent),
    canActivate: [AuthGuard],
  },

  {
    path: 'ticketcreate',
    loadComponent: () =>
      import('./components/ticket-create/ticket-create.component').then(
        (c) => c.TicketCreateComponent
      ),
    canActivate: [AuthGuard],
  },
  {
    path: 'ticket-edit',
    loadComponent: () =>
      import('./components/ticket-edit/ticket-edit.component').then(
        (c) => c.TicketEditComponent
      ),
    canActivate: [AuthGuard],
  },
  {
    path: 'hr-dashboard',
    component: HrDashboardComponent,
    canActivate: [HrAuthGuard],
  },
  {
    path: 'profile',
    component: ProfileComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'admin/employees',
    component: EmployeeManagementComponent,
    canActivate: [AuthGuard],
  },
  { path: '**', redirectTo: 'login' },
];
