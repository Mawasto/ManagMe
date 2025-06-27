export type UserRole = 'admin' | 'devops' | 'developer';

export class User {
  id: string;
  firstName: string;
  lastName: string;
  role: UserRole;

  constructor(id: string, firstName: string, lastName: string, role: UserRole) {
    this.id = id;
    this.firstName = firstName;
    this.lastName = lastName;
    this.role = role;
  }
}
