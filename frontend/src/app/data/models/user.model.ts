export interface User {
  employeeId: string;
  name: string;
  email: string;
  phonenumber: string;
  password: string;
  role: string; //aka userType //UserRoleEnum: ['Employee', 'HR', 'Admin']
  department: string;
  createdAt: Date;
}
// export interface User {
//   id: string;
//   userType: string;
//   username: string;
//   password: string;
// }
