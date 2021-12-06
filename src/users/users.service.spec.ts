import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { UsersService } from './users.service';

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

  describe('findOneById()', () => {
    it('should return user with matching id', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValueOnce(user);
      expect(await service.findOneById(id)).toBe(user);
    });

    it('should return null if there is no user with matching id', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValueOnce(null);
      expect(await service.findOneById(id)).toBe(null);
    });
  });

  describe('findOneByUsername()', () => {
    it('should return true if username and password combination is valid', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValueOnce(user);

      expect(await service.findOneByUsername(username)).toBe(user);
    });

    it('should return false if user is not found', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValueOnce(null);
      expect(await service.findOneByUsername(username)).toBe(null);
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
      jest.spyOn(service, 'findOneById').mockResolvedValueOnce(user);
      jest.spyOn(repository, 'remove').mockResolvedValueOnce(null);

      await service.remove(id);
      expect(service.findOneById).toBeCalledTimes(1);
      expect(repository.remove).toBeCalledTimes(1);
    });
  });
});
