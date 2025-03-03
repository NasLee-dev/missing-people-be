import { Controller, Get, Inject, Param } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './types';

@Controller('user')
export class UserController {
  constructor(@Inject(UserService) private readonly userService: UserService) {}

  @Get()
  getAllUsers(): Promise<User[]> {
    return this.userService.getAllUsers();
  }

  @Get(':id')
  getUser(@Param('id') id: number): Promise<User | null> {
    return this.userService.getUser(id);
  }
}
