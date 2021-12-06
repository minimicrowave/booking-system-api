import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
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
    const user = new User(username, password);

    await this.usersRepository.save(user);
  }

  async findOne(id: number) {
    return this.usersRepository.findOne(id);
  }

  async verify(username: string, password: string) {
    return !!(await this.usersRepository.findOne({ username, password }));
  }

  async update(updateUserDto: UpdateUserDto) {
    const { username, password, id } = updateUserDto;
    const user = new User(username, password, id);

    await this.usersRepository.save(user);
  }

  async remove(id: number) {
    const user = await this.findOne(id);
    await this.usersRepository.remove(user);
  }
}