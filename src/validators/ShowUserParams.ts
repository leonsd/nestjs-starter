import { IsNumberString } from 'class-validator';

export class ShowUserParams {
  @IsNumberString()
  id: number;
}
