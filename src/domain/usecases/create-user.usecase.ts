export interface CreateUserModel {
  name: string;
  email: string;
  password: string;
}

export abstract class CreateUser {
  abstract create(data: CreateUserModel): Promise<any>;
}
