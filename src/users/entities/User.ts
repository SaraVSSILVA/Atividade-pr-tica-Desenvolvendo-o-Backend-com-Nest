import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  BeforeInsert,
  BeforeUpdate,
} from 'typeorm';
import * as bcrypt from 'bcrypt';

// Enum para definir os papéis de usuário
export enum UserRole {
  ADMIN = 'ADMIN',
  USER = 'USER',
}

@Entity({ name: 'users' }) // Nome da tabela no banco de dados
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  username: string;

  @Column()
  password: string;

  // Nova coluna para armazenar o papel do usuário
  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.USER, // O papel padrão é USER
  })
  role: UserRole;

  // Lógica para criptografar a senha antes de salvar
  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword() {
    if (this.password) {
      this.password = await bcrypt.hash(this.password, 10);
    }
  }
}
