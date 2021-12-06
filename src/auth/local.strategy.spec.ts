import { UnauthorizedException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { User } from 'src/users/entities/user.entity';
import { AuthService } from './auth.service';
import { LocalStrategy } from './local.strategy';

describe('LocalStrategy', () => {
  let authService: AuthService;
  let localStrategy: LocalStrategy;

  const username = 'username';
  const password = 'password';

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LocalStrategy,
        {
          provide: AuthService,
          useFactory: jest.fn(() => ({
            validateUser: jest.fn(),
          })),
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    localStrategy = module.get<LocalStrategy>(LocalStrategy);
  });

  it('should be defined', () => {
    expect(localStrategy).toBeDefined();
    expect(authService).toBeDefined();
  });

  describe('validate()', () => {
    it('should return true if user credentials are correct', async () => {
      jest.spyOn(authService, 'validateUser').mockResolvedValueOnce(true);
      expect(await localStrategy.validate(username, password)).toBe(true);
    });

    it('should throw UnauthorizedException if user credentials are incorrect', async () => {
      jest.spyOn(authService, 'validateUser').mockResolvedValueOnce(false);

      await expect(localStrategy.validate(username, password)).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });
});
