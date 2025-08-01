// types/stores.d.ts
declare module '#imports' {
  export * from 'pinia';
}

declare module '~/stores/auth' {
  import { DefineStoreOptions } from 'pinia';
  
  interface User {
    name: string;
    role: string;
    avatar?: string;
  }

  interface AuthState {
    user: User | null;
  }

  interface AuthActions {
    logout(): void;
  }

  type AuthStore = DefineStoreOptions<string, AuthState, {}, AuthActions>;
  
  export const useAuthStore: () => {
    user: User | null;
    logout: () => void;
  };
}
