import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  id: number;

  public constructor(init?: Partial<UpdateUserDto>) {
    super();
    Object.assign(this, init);
  }
}
