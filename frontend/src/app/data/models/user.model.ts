export interface User {
  employeeNumber: string; //{ type: String, required: true, unique: true }, // Example: "EMP001"
  employeeId: string; // Holds MongoDB _id reference
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
