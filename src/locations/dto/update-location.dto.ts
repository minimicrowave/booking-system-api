import { PartialType } from '@nestjs/mapped-types';
import { CreateLocationDto } from './create-location.dto';

export class UpdateLocationDto extends PartialType(CreateLocationDto) {
  id: number;

  public constructor(init?: Partial<UpdateLocationDto>) {
    super();
    Object.assign(this, init);
  }
}
