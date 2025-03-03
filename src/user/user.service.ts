/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable, Logger } from '@nestjs/common';
import { SupabaseService } from 'src/supabase/supabase.service';
import { User } from './types';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

  constructor(private supabaseService: SupabaseService) {}

  async getUser(index: number): Promise<User | null> {
    const { data, error } = await this.supabaseService
      .getClient()
      .from('user')
      .select('*')
      .eq('id', index);

    if (error) {
      this.logger.error(`Failed to get user: ${error.message}`);
      throw error;
    }

    if (data.length === 0) {
      return null;
    }

    return data[0] as User;
  }

  async getAllUsers(): Promise<User[]> {
    const { data, error } = await this.supabaseService
      .getClient()
      .from('user')
      .select('*');
    console.log('Query result:', { data, error });

    if (error) {
      this.logger.error(`Failed to get all users: ${error.message}`);
      throw error;
    }

    return data as User[];
  }

  async createUser(
    user: Omit<User, 'id' | 'createdAt' | 'updatedAt'>,
  ): Promise<User> {
    const { data, error } = await this.supabaseService
      .getClient()
      .from('user')
      .insert(user)
      .select()
      .single();

    if (error) {
      this.logger.error(`Failed to create user: ${error.message}`);
      throw error;
    }

    return data as User;
  }
}
