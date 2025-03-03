import {
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
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
      // 더 구체적인 오류 메시지 제공
      if (error.code === 'invalid_credentials') {
        throw new UnauthorizedException(
          '이메일 또는 비밀번호가 올바르지 않습니다.',
        );
      }
      throw new UnauthorizedException(error.message);
    }

    return data;
  }

  async setAdminRole(userId: string) {
    const { data, error } = await this.supabaseService
      .getAdminClient()
      .auth.admin.updateUserById(userId, {
        app_metadata: {
          // user_metadata 대신 app_metadata 사용
          role: 'admin',
        },
      });

    if (error) {
      throw new InternalServerErrorException(
        `Failed to set admin role: ${error.message}`,
      );
    }

    return data;
  }

  async signInAndSetSession(email: string, password: string) {
    try {
      console.log(`Attempting to sign in with email: ${email}`);

      const { data, error } = await this.supabaseService
        .getClient()
        .auth.signInWithPassword({
          email,
          password,
        });

      if (error) {
        console.error('Supabase auth error:', error);
        throw new UnauthorizedException(error.message);
      }

      // 세션 설정
      console.log('Sign in successful, setting session');
      const { session } = data;
      this.supabaseService.setSession(session);

      return data;
    } catch (error) {
      console.error('Error in signInAndSetSession:', error);
      if (error instanceof UnauthorizedException) {
        throw error; // 이미 처리된 오류는 그대로 전달
      }
      throw new InternalServerErrorException(
        'Authentication failed due to server error',
      );
    }
  }

  // 현재 사용자 정보 가져오기 메서드 추가
  async getCurrentUser() {
    try {
      const { data, error } = await this.supabaseService
        .getClient()
        .auth.getUser();

      if (error) throw error;
      return data.user;
    } catch (error) {
      console.error('Error getting current user:', error);
      throw new InternalServerErrorException('Failed to get user information');
    }
  }

  // 로그아웃 메서드 추가
  async signOut() {
    try {
      const { error } = await this.supabaseService.getClient().auth.signOut();

      if (error) throw error;
      return { success: true };
    } catch (error) {
      console.error('Error signing out:', error);
      throw new InternalServerErrorException('Failed to sign out');
    }
  }
}
