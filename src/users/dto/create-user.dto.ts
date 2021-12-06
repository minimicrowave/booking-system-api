export class CreateUserDto {
  username: string;
  password: string;

  public constructor(init?: Partial<CreateUserDto>) {
    Object.assign(this, init);
  }
}
