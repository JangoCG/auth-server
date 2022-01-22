import { Injectable } from '@nestjs/common';
import { User } from './model/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from '../auth/dto/create-account.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  private readonly users: User[] = [
    {
      userId: 1,
      email: 'john',
      password: 'doe',
    },
    {
      userId: 2,
      email: 'mike',
      password: 'tyson',
    },
  ];

  async findByEmail(email: string): Promise<User | undefined> {
    return this.usersRepository.findOne({ email });
  }

  async findById(userId: number): Promise<User | undefined> {
    return this.users.find((user) => user.userId === userId);
  }

  async save(createUserDto: CreateUserDto) {
    const userEntity = this.usersRepository.create(createUserDto);
    return this.usersRepository.save(userEntity);
    // return this.usersRepository.create(u);
  }
}
