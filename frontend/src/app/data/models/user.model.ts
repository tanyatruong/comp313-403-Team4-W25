import { UserRoleEnum } from '../enums/UserRoleEnum';

export interface User {
  id?: string; // For frontend use
  employeeNumber?: string;
  name: string;
  email: string;
  phonenumber?: string;
  role: UserRoleEnum;
  department?: string;
  createdAt: Date;
  userType?: string; // Add back for backward compatibility
  username?: string; // Add back for backward compatibility
  // Only include other fields used in UI components
  password?: string; // Only needed for authentication
}
