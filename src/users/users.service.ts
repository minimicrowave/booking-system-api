import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { doPasswordsMatch, hashPassword } from 'src/utils/auth.util';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const { username, password } = createUserDto;
    const user = new User(username, hashPassword(password));

    await this.usersRepository.save(user);
  }

  findOneById(id: number) {
    return this.usersRepository.findOne(id);
  }

  findOneByUsername(username: string) {
    return this.usersRepository.findOne({ username });
  }

  async update(updateUserDto: UpdateUserDto) {
    const { username, password, id } = updateUserDto;
    const user = new User(username, password, id);

    await this.usersRepository.save(user);
  }

  async remove(id: number) {
    const user = await this.findOneById(id);
    await this.usersRepository.remove(user);
  }
}
