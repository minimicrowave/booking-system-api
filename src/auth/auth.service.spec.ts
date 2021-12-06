import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from 'src/users/users.service';
import { AuthService } from './auth.service';
import * as authUtils from 'src/utils/auth.util';
import { User } from 'src/users/entities/user.entity';

describe('AuthService', () => {
  const id = 1;
  const username = 'username';
  const password = 'password';

  const user = new User(username, password, id);

  let authService: AuthService;
  let usersService: UsersService;

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
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(authService).toBeDefined();
    expect(usersService).toBeDefined();
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
});
