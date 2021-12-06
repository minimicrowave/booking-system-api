import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from 'src/users/users.service';
import { AuthService } from './auth.service';
import * as authUtils from 'src/utils/auth.util';
import { User } from 'src/users/entities/user.entity';
import { JwtService } from '@nestjs/jwt';

describe('AuthService', () => {
  const id = 1;
  const username = 'username';
  const password = 'password';

  const user = new User(username, password, id);

  let authService: AuthService;
  let usersService: UsersService;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useFactory: jest.fn(() => ({
            findOneByUsername: jest.fn(),
          })),
        },
        {
          provide: JwtService,
          useFactory: jest.fn(() => ({
            sign: jest.fn(),
          })),
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);
    jwtService = module.get<JwtService>(JwtService);
  });

  it('should be defined', () => {
    expect(authService).toBeDefined();
    expect(usersService).toBeDefined();
    expect(jwtService).toBeDefined();
  });

  describe('validateUser()', () => {
    it('should return true if username and password combination is valid', async () => {
      jest.spyOn(usersService, 'findOneByUsername').mockResolvedValueOnce(user);

      jest.spyOn(authUtils, 'doPasswordsMatch').mockResolvedValueOnce(true);
      expect(await authService.validateUser(username, password)).toBe(true);
    });

    it('should return false if username and password combination is invalid', async () => {
      jest.spyOn(usersService, 'findOneByUsername').mockResolvedValueOnce(user);

      jest.spyOn(authUtils, 'doPasswordsMatch').mockResolvedValueOnce(false);
      expect(await authService.validateUser(username, password)).toBe(false);
    });

    it('should return false if user is not found', async () => {
      jest.spyOn(usersService, 'findOneByUsername').mockResolvedValueOnce(null);
      expect(await authService.validateUser(username, password)).toBe(false);
    });
  });

  describe('login()', () => {
    it('should return access token', async () => {
      const accessToken = 'testAccessToken';
      jest.spyOn(usersService, 'findOneByUsername').mockResolvedValueOnce(user);
      jest.spyOn(jwtService, 'sign').mockReturnValueOnce(accessToken);

      expect(await authService.login(username)).toStrictEqual({
        access_token: accessToken,
      });
    });
  });
});
