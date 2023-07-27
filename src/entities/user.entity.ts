import { hashSync } from 'bcrypt';
import { Exclude } from 'class-transformer';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  BeforeInsert,
} from 'typeorm';
import { generateConfirmationCode } from '../utils/string';

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  @Exclude()
  password: string;

  @Column({ name: 'confirmation_code' })
  @Exclude()
  confirmationCode: string;

  @Column({ name: 'is_confirmed' })
  isConfirmed: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @BeforeInsert()
  private setConfirmationCode = () => {
    this.confirmationCode = generateConfirmationCode();
  };

  @BeforeInsert()
  private hashPassword = () => {
    const salt = 10;
    this.password = hashSync(String(this.password), salt);
  };
}
