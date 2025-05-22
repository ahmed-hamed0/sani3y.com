
import { createContext, useContext } from 'react';
import { User as SupabaseUser, Session as SupabaseSession } from '@supabase/supabase-js';
import { UserRole } from '@/types';

type UserData = SupabaseUser & {
  role?: UserRole | null;
};

export type AuthContextType = {
  user: UserData | null;
  session: SupabaseSession | null;
  loading: boolean;
  role: UserRole | null;
  isClient: boolean;
  isCraftsman: boolean;
  refreshProfile: () => Promise<void>;
};

export const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  loading: true,
  role: null,
  isClient: false,
  isCraftsman: false,
  refreshProfile: async () => {}
});
