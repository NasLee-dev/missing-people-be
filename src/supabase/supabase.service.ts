import { Injectable } from '@nestjs/common';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class SupabaseService {
  private supabase: SupabaseClient;
  private supabaseAdmin: SupabaseClient;

  constructor(private configService: ConfigService) {
    this.supabase = createClient(
      this.configService.get('SUPABASE_URL') || '',
      this.configService.get('SUPABASE_KEY') || '',
    );

    this.supabaseAdmin = createClient(
      this.configService.get('SUPABASE_URL') || '',
      this.configService.get('SUPABASE_SERVICE_ROLE_KEY') || '',
    );
  }
  getClient() {
    return this.supabase;
  }

  getAdminClient() {
    return this.supabaseAdmin;
  }

  setSession(session) {
    if (!session) {
      console.error('Cannot set undefined session');
      return;
    }
    try {
      this.supabase.auth.setSession(session);
    } catch (error) {
      console.error('Error setting session:', error);
      throw error;
    }
  }
}
