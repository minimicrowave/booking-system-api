export class CreateLocationDto {
  name: string;

  public constructor(init?: Partial<CreateLocationDto>) {
    Object.assign(this, init);
  }
}
