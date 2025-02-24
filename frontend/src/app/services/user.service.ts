import { Injectable } from '@angular/core';
import { type User } from '../data/models/user.model';

@Injectable({ providedIn: 'root' })
export class UserService {
  users = [
    {
      id: '0',
      userType: 'admin',
      username: 'admin',
      password: 'admin',
    },
    {
      id: '1',
      userType: 'user',
      username: 'u1',
      password: 'u1',
    },
    {
      id: '2',
      userType: 'user',
      username: 'u2',
      password: 'u2',
    },
    {
      id: '3',
      userType: 'user',
      username: 'u3',
      password: 'u3',
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
