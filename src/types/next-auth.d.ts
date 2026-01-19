import { DefaultSession } from 'next-auth';
import { SessionUser } from './index';

declare module 'next-auth' {
  interface Session {
    user: SessionUser;
  }

  interface User {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    emailVerified: Date | null;
    name?: string;
    image?: string;
    roles: string[];
    permissions: string[];
    accessToken: string;
    refreshToken: string;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    emailVerified: Date | null;
    name?: string;
    image?: string;
    roles: string[];
    permissions: string[];
    accessToken: string;
    refreshToken: string;
  }
}