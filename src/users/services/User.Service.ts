import { UserEntity } from '../entities/User';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Bcrypt } from '../../auth/bcrypt/bcrypt';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    private bcrypt: Bcrypt,
  ) {}

  async findByUser(username: string): Promise<UserEntity | null> {
    return await this.userRepository.findOne({
      where: {
        username: username,
      },
    });
  }

  async findAll(): Promise<UserEntity[]> {
    return await this.userRepository.find();
  }

  async findById(id: number): Promise<UserEntity> {
    const user = await this.userRepository.findOne({
      where: {
        id,
      },
    });

    if (!user) throw new HttpException('User not found!', HttpStatus.NOT_FOUND);

    return user;
  }

  async create(user: UserEntity): Promise<UserEntity> {
    const searchUser = await this.findByUser(user.username);

    if (searchUser)
      throw new HttpException('User already exists!', HttpStatus.BAD_REQUEST);

    user.password = await this.bcrypt.encryptPassword(user.password);
    return await this.userRepository.save(user);
  }

  async update(user: UserEntity): Promise<UserEntity> {
    await this.findById(user.id);

    const searchUser = await this.findByUser(user.username);

    if (searchUser && searchUser.id !== user.id)
      throw new HttpException(
        'User (username) already registered!',
        HttpStatus.BAD_REQUEST,
      );

    user.password = await this.bcrypt.encryptPassword(user.password);
    return await this.userRepository.save(user);
  }
}
