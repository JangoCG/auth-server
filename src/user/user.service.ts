import { Injectable } from '@nestjs/common';
import { User } from './model/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from '../auth/model/create-user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async findByEmail(email: string): Promise<User | undefined> {
    return this.usersRepository.findOne({ email });
  }

  async findById(userId: number): Promise<User | undefined> {
    return this.usersRepository.findOne({ userId });
  }

  async save(createUserDto: CreateUserDto) {
    const userEntity = this.usersRepository.create(createUserDto);
    return this.usersRepository.save(userEntity);
  }

  async updateUser(user: User) {
    return this.usersRepository.save(user);
  }
}
