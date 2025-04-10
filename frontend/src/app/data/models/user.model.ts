import { UserRoleEnum } from '../enums/UserRoleEnum';

export interface User {
  _id: string;
  employeeId: string;
  employeeNumber?: string;
  name: string;
  email: string;
  phone?: string;
  password?: string;
  role: UserRoleEnum;
  department?: string;
  createdAt: Date;
}
