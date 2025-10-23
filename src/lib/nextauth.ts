import { authService } from '@/services/auth.service';
import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';

export const { handlers, auth } = NextAuth({
    providers: [
        Credentials({
            name: 'Credentials',
            credentials: {
                email: { label: 'Email', type: 'text' },
                password: { label: 'Password', type: 'password' },
            },
            authorize: async (credentials) => {
                if (!credentials?.email || !credentials?.password) return null;
                const user = await authService.verifyCredentials(credentials.email, credentials.password);
                return user
                    ? { id: String(user.id), email: user.email, name: user.name }
                    : null;
            },
        }),
    ],
    session: { strategy: 'jwt' },
    secret: process.env.NEXTAUTH_SECRET!,
});
