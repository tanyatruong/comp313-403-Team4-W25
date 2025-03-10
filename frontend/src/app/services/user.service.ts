import { Injectable } from '@angular/core';
import { type User } from '../data/models/user.model';
import { UserRoleEnum } from '../data/enums/UserRoleEnum';

@Injectable({ providedIn: 'root' })
export class UserService {
  users = [
    {
      employeeNumber: 'EMP000',
      employeeId: 'mongoid0',
      name: 'admin',
      email: 'admin@admin.com',
      phonenumber: '0',
      password: 'admin',
      role: UserRoleEnum.Admin,
      department: 'admin',
      createdAt: new Date(),
    },
    {
      employeeNumber: 'EMP001',
      employeeId: 'mongoid1',
      name: '1',
      email: '1@1.com',
      phonenumber: '1',
      password: '1',
      role: UserRoleEnum.Employee,
      department: 'engineering',
      createdAt: new Date(),
    },
    {
      employeeNumber: 'EMP002',
      employeeId: 'mongoid2',
      name: '2',
      email: '2@2.com',
      phonenumber: '2',
      password: '2',
      role: UserRoleEnum.HR,
      department: 'HR',
      createdAt: new Date(),
    },
    {
      id: '4',
      userType: 'hr',
      username: 'hr1',
      password: 'hr1',
    },
  ];

  loggedInUser!: User;

  authenticateUserLoginAndReturnResult(un: string, pw: string) {
    const user = this.users.find(
      (user) => user.username === un && user.password === pw
    );

    if (user === undefined) {
      //user not in system
      console.log('Login Unsuccessful');
      return false;
    } else {
      //user found in system
      console.log(
        'Login Successful:\n-username: ' +
          user.username +
          '\n-password: ' +
          user.password +
          '\n-userType: ' +
          user.userType
      );
      this.loggedInUser = {
        ...user,
        name: user.name || user.username || 'User',
        email: user.email || 'user@company.com',
        role:
          user.role ||
          (user.userType === 'hr' ? UserRoleEnum.HR : UserRoleEnum.Employee),
        createdAt: user.createdAt || new Date(),
      };
      return true;
    }
  }

  getLoggedInUser() {
    return this.loggedInUser;
  }

  // Get all HR users for assignment
  getHRUsers() {
    const hrUsers = this.users.filter(
      (user) => user.role === UserRoleEnum.HR || user.userType === 'hr'
    );

    // Ensure each user has all required fields
    return hrUsers.map((user) => ({
      ...user,
      id:
        user.id ||
        user.employeeId ||
        `hr-${Math.random().toString(36).substring(2, 9)}`,
      name: user.name || user.username || 'HR Employee',
      email: user.email || 'hr@company.com',
      role: user.role || UserRoleEnum.HR,
      employeeNumber: user.employeeNumber || 'EMP-HR',
      createdAt: user.createdAt || new Date(),
    }));
  }
}
