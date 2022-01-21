import { Injectable } from '@nestjs/common';
import { User } from './model/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  private readonly users: User[] = [
    {
      userId: 1,
      name: 'John',
      username: 'john',
      password: 'doe',
    },
    {
      userId: 2,
      name: 'Mike',
      username: 'mike',
      password: 'tyson',
    },
  ];

  async findOne(username: string): Promise<User | undefined> {
    return this.users.find((user) => user.username === username);
  }

  async findOneById(userId: number): Promise<User | undefined> {
    return this.users.find((user) => user.userId === userId);
  }

  async save() {
    this.usersRepository.save();
  }
}
