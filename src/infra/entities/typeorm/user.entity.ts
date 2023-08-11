import { Exclude } from 'class-transformer';
import { ApiHideProperty } from '@nestjs/swagger';
import { Entity, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity({ name: 'users' })
export class User {
  @Column()
  id: string;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  @Exclude()
  @ApiHideProperty()
  password: string;

  @Column({ name: 'confirmation_code' })
  @Exclude()
  @ApiHideProperty()
  confirmationCode: string;

  @Column({ name: 'is_confirmed' })
  isConfirmed: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
