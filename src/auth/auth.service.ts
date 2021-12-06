import { Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { doPasswordsMatch } from 'src/utils/auth.util';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(username: string, password: string) {
    const user = await this.usersService.findOneByUsername(username);

    // if user does not exist
    if (!user) return false;

    // check against saved hashed password
    return doPasswordsMatch(password, user.password);
  }

  async login(username: string) {
    const payload = {
      username,
      sub: (await this.usersService.findOneByUsername(username)).id,
    };
    return {
      access_token: await this.jwtService.sign(payload),
    };
  }
}
