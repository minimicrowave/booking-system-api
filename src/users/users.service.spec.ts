import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { UsersService } from './users.service';
import * as authUtils from 'src/utils/auth.util';

describe('UsersService', () => {
  const id = 1;
  const username = 'username';
  const password = 'password';

  const user = new User(username, password, id);

  let service: UsersService;
  let repository: Repository<User>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: getRepositoryToken(User), useClass: Repository },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    repository = module.get<Repository<User>>(getRepositoryToken(User));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(repository).toBeDefined();
  });

  describe('create()', () => {
    it('should successfully save new user', async () => {
      const createUserDto = new CreateUserDto({
        username,
        password,
      });

      jest.spyOn(repository, 'save').mockResolvedValueOnce(null);

      await service.create(createUserDto);

      expect(repository.save).toBeCalledTimes(1);
    });
  });

  describe('findOne()', () => {
    it('should return user with matching id', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValueOnce(user);
      expect(await service.findOne(id)).toBe(user);
    });

    it('should return null if there is no user with matching id', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValueOnce(null);
      expect(await service.findOne(id)).toBe(null);
    });
  });

  describe('verify()', () => {
    it('should return true if username and password combination is valid', async () => {
      jest
        .spyOn(repository, 'findOne')
        .mockResolvedValueOnce(new User(username, password));

      jest.spyOn(authUtils, 'doPasswordsMatch').mockResolvedValueOnce(true);
      expect(await service.verify(username, password)).toBe(true);
    });

    it('should return false if username and password combination is invalid', async () => {
      jest
        .spyOn(repository, 'findOne')
        .mockResolvedValueOnce(new User(username, password));

      jest.spyOn(authUtils, 'doPasswordsMatch').mockResolvedValueOnce(false);
      expect(await service.verify(username, password)).toBe(false);
    });

    it('should return false if user is not found', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValueOnce(null);
      expect(await service.verify(username, password)).toBe(false);
    });
  });

  describe('update()', () => {
    it("should successfully update user's information", async () => {
      const updateUserDto = new UpdateUserDto({
        id,
        username,
        password,
      });
      jest.spyOn(repository, 'save').mockResolvedValueOnce(null);
      await service.update(updateUserDto);
      expect(repository.save).toBeCalledTimes(1);
    });
  });

  describe('remove()', () => {
    it('should successfully delete user from db', async () => {
      jest.spyOn(service, 'findOne').mockResolvedValueOnce(user);
      jest.spyOn(repository, 'remove').mockResolvedValueOnce(null);

      await service.remove(id);
      expect(service.findOne).toBeCalledTimes(1);
      expect(repository.remove).toBeCalledTimes(1);
    });
  });
});
