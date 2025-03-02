import { Body, Controller, Get, Inject, Param, Post } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(@Inject(UserService) private readonly userService: UserService) {}

  @Get('all')
  getAllUsers(): string[] {
    return this.userService.getAllUsers();
  }

  @Get(':id')
  getUser(@Param('id') id: string): string[] {
    const index = parseInt(id);
    return this.userService.getUser(index);
  }

  @Post()
  createUser(@Body() body: { name: string }): string {
    const name = body.name;
    this.userService.create(name);
    return 'user created';
  }
}
