import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import { getDb } from '@/lib/db';
import { getClientIp, rateLimiter } from '@/lib/security';

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Credentials({
      name: 'credentials',
      credentials: {
        username: { label: 'Usuario', type: 'text' },
        password: { label: 'Contraseña', type: 'password' },
      },
      async authorize(credentials, request) {
        const username = credentials?.username as string;
        const password = credentials?.password as string;
        const ip = getClientIp(request?.headers);
        const limit = rateLimiter.check(`login:${ip}:${username}`, 6, 15 * 60 * 1000);

        if (!limit.allowed) {
          return null;
        }

        const db = getDb();
        const user = db
          .prepare('SELECT id, username, password_hash FROM users WHERE username = ?')
          .get(username) as
          | { id: number; username: string; password_hash: string }
          | undefined;

        if (user && (await bcrypt.compare(password, user.password_hash))) {
          rateLimiter.reset(`login:${ip}:${username}`);
          return {
            id: String(user.id),
            name: user.username,
            email: `${user.username}@luprintech.local`,
          };
        }

        return null;
      },
    }),
  ],
  pages: {
    signIn: '/redes',
  },
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    authorized({ auth }) {
      return !!auth?.user;
    },
  },
});
