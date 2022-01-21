import { Injectable } from '@nestjs/common';
import { User } from './model/user.entity';

@Injectable()
export class UserService {
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
}
