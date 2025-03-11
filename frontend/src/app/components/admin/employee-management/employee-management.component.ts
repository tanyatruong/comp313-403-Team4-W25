import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PrimengModule } from '../../../../primeng.module';
import { UserService } from '../../../services/user.service';
import { User } from '../../../data/models/user.model';
import { MessageService, ConfirmationService } from 'primeng/api';
import { TooltipModule } from 'primeng/tooltip';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-employee-management',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    PrimengModule,
    TooltipModule,
    RouterModule,
  ],
  templateUrl: './employee-management.component.html',
  styleUrls: ['./employee-management.component.css'],
  providers: [MessageService, ConfirmationService],
})
export class EmployeeManagementComponent implements OnInit {
  employees: User[] = [];
  selectedEmployee: User | null = null;
  loading: boolean = false;
  displayDialog: boolean = false;
  isNewEmployee: boolean = false;
  roles: { label: string; value: string }[] = [
    { label: 'Employee', value: 'employee' },
    { label: 'HR', value: 'hr' },
    { label: 'Admin', value: 'admin' },
  ];

  constructor(
    private userService: UserService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit(): void {
    this.loadEmployees();
  }

  loadEmployees(): void {
    this.loading = true;
    this.userService.getAllUsers().subscribe({
      next: (employees) => {
        this.employees = employees;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading employees:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to load employees',
        });
        this.loading = false;
      },
    });
  }

  editEmployee(employee: User): void {
    this.selectedEmployee = { ...employee };
    this.isNewEmployee = false;
    this.displayDialog = true;
  }

  createNewEmployee(): void {
    this.selectedEmployee = {} as User;
    this.isNewEmployee = true;
    this.displayDialog = true;
  }

  saveEmployee(): void {
    if (!this.selectedEmployee) return;

    this.loading = true;

    if (this.isNewEmployee) {
      this.userService.createUser(this.selectedEmployee).subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Employee created successfully',
          });
          this.loadEmployees();
          this.displayDialog = false;
          this.loading = false;
        },
        error: (error) => {
          console.error('Error creating employee:', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to create employee',
          });
          this.loading = false;
        },
      });
    } else {
      if (!this.selectedEmployee._id) return;

      this.userService
        .updateUser(this.selectedEmployee._id, this.selectedEmployee)
        .subscribe({
          next: () => {
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: 'Employee updated successfully',
            });
            this.loadEmployees();
            this.displayDialog = false;
            this.loading = false;
          },
          error: (error) => {
            console.error('Error updating employee:', error);
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Failed to update employee',
            });
            this.loading = false;
          },
        });
    }
  }

  deleteEmployee(employee: User): void {
    this.confirmationService.confirm({
      message: `Are you sure you want to delete ${employee.name}?`,
      header: 'Confirm Delete',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        if (!employee._id) return;

        this.loading = true;
        this.userService.deleteUser(employee._id).subscribe({
          next: () => {
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: 'Employee deleted successfully',
            });
            this.loadEmployees();
            this.loading = false;
          },
          error: (error) => {
            console.error('Error deleting employee:', error);
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Failed to delete employee',
            });
            this.loading = false;
          },
        });
      },
    });
  }
}
