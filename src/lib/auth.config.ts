import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Email and password are required');
        }

        try {
          const response = await axios.post(`${API_URL}/auth/login`, {
            email: credentials.email,
            password: credentials.password,
          });

          const { user, accessToken, refreshToken } = response.data.data;

          if (user && accessToken) {
            return {
              id: user.id,
              email: user.email,
              emailVerified: user.emailVerified ? new Date(user.emailVerified) : null,
              name: `${user.firstName} ${user.lastName}`,
              image: user.avatarUrl || null,
              firstName: user.firstName,
              lastName: user.lastName,
              roles: user.roles.map((r: any) => r.name),
              permissions: user.permissions,
              accessToken,
              refreshToken,
            };
          }

          return null;
        } catch (error: any) {
          const message = error.response?.data?.message || 'Invalid credentials';
          throw new Error(message);
        }
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user, trigger, session }) {
      // Initial sign in
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.emailVerified = user.emailVerified || null;
        token.name = user.name;
        token.image = user.image;
        token.firstName = (user as any).firstName;
        token.lastName = (user as any).lastName;
        token.roles = (user as any).roles;
        token.permissions = (user as any).permissions;
        token.accessToken = (user as any).accessToken;
        token.refreshToken = (user as any).refreshToken;
      }

      // Update session from client
      if (trigger === 'update' && session) {
        token = { ...token, ...session };
      }

      return token;
    },

    async session({ session, token }) {
      if (token) {
        session.user = {
          id: token.id as string,
          email: token.email as string,
          emailVerified: token.emailVerified as Date | null,
          name: token.name as string,
          image: token.image as string,
          firstName: token.firstName as string,
          lastName: token.lastName as string,
          roles: token.roles as string[],
          permissions: token.permissions as string[],
          accessToken: token.accessToken as string,
          refreshToken: token.refreshToken as string,
        };
      }
      return session;
    },
  },

  pages: {
    signIn: '/login',
  },

  session: {
    strategy: 'jwt',
    maxAge: 7 * 24 * 60 * 60, // 7 days
  },

  secret: process.env.NEXTAUTH_SECRET,
});