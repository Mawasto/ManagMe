import { User } from '../models/user';

export class UserManager {
  private static users: User[] = [
    new User('1', 'Jan', 'Kowalski', 'admin'),
    new User('2', 'Anna', 'Nowak', 'developer'),
    new User('3', 'Piotr', 'Wiśniewski', 'devops'),
  ];
  private static loggedInUser: User = UserManager.users[0];

  static getLoggedInUser(): User {
    return this.loggedInUser;
  }

  static getAllUsers(): User[] {
    return this.users;
  }
}
