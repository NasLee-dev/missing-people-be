import { Injectable } from '@nestjs/common';
import { SupabaseService } from 'src/supabase/supabase.service';

@Injectable()
export class AuthService {
  constructor(private readonly supabaseService: SupabaseService) {}

  async signIn(email: string, password: string) {
    const { data, error } = await this.supabaseService
      .getClient()
      .auth.signInWithPassword({
        email,
        password,
      });

    if (error) {
      throw new Error('Failed to sign in');
    }

    return data;
  }

  async setAdminRole(userId: string) {
    const { data, error } = await this.supabaseService
      .getAdminClient()
      .auth.admin.updateUserById(userId, {
        user_metadata: {
          role: 'admin',
        },
      });

    if (error) {
      throw new Error('Failed to set admin role');
    }

    return data;
  }

  async signInAndSetSession(email: string, password: string) {
    const { data, error } = await this.supabaseService
      .getClient()
      .auth.signInWithPassword({
        email,
        password,
      });

    if (error) {
      throw new Error('Failed to sign in');
    }

    const { session } = data;

    this.supabaseService.setSession(session);

    return data;
  }
}
