export interface UserModel {
  id: string;
  name: string;
  email: string;
  password: string;
  confirmationCode: string;
  isConfirmed: boolean;
  createdAt: Date;
  updatedAt: Date;
}
