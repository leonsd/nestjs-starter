import { CreateUserModel } from '../../../domain/usecases/create-user.usecase';

export abstract class CreateUserRepository {
  abstract create(createUserModel: CreateUserModel): Promise<any>;
}
