import { Injectable, NotFoundException } from '@nestjs/common';

@Injectable()
export class UserService {
  private readonly users: string[] = ['이우택', '이우택2'];

  getUser(index: number): string[] {
    if (index < 0 || index >= this.users.length) {
      throw new NotFoundException(`User with index ${index} not found`);
    }
    return [this.users[index]];
  }

  getAllUsers(): string[] {
    return this.users;
  }

  create(name: string): void {
    this.users.push(name);
  }
}
