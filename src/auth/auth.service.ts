import { Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { doPasswordsMatch } from 'src/utils/auth.util';

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) {}

  async validateUser(username: string, password: string) {
    const user = await this.usersService.findOneByUsername(username);

    // if user does not exist
    if (!user) return false;

    // check against saved hashed password
    return doPasswordsMatch(password, user.password);
  }
}
