import { User } from '../models/user';

export class UserManager {
  private static loggedInUser: User = new User('1', 'Jan', 'Kowalski');

  static getLoggedInUser(): User {
    return this.loggedInUser;
  }
}
