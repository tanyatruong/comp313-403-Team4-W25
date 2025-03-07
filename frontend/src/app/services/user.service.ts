import { Injectable } from '@angular/core';
import { type User } from '../data/models/user.model';
import { UserRoleEnum } from '../data/enums/UserRoleEnum';

@Injectable({ providedIn: 'root' })
export class UserService {
  users = [
    {
      employeeId: '0',
      name: 'admin',
      email: 'admin@admin.com',
      phonenumber: '0',
      password: 'admin',
      role: UserRoleEnum.Admin,
      department: 'admin',
      createdAt: new Date(),
    },
    {
      employeeId: '1',
      name: '1',
      email: '1@1.com',
      phonenumber: '1',
      password: '1',
      role: UserRoleEnum.Employee,
      department: 'engineering',
      createdAt: new Date(),
    },
    {
      employeeId: '2',
      name: '2',
      email: '2@2.com',
      phonenumber: '2',
      password: '2',
      role: UserRoleEnum.HR,
      department: 'engineering',
      createdAt: new Date(),
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
      this.loggedInUser = user;
      return true;
    }
  }

  getLoggedInUser() {
    return this.loggedInUser;
  }
}
