import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { misisClient } from '@/lib/misis-client';
import User from '@/models/User';
import connectDB from '@/lib/mongodb';

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'MISIS',
      credentials: {
        login: { label: 'Логин', type: 'text' },
        password: { label: 'Пароль', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials?.login || !credentials?.password) {
          return null;
        }

        try {
          await connectDB();
          
          // Проверяем учетные данные через MISIS
          const isValid = await misisClient.validateCredentials(
            credentials.login,
            credentials.password
          );

          if (!isValid) {
            return null;
          }

          // Получаем информацию о студенте
          const misisData = await misisClient.getStudentInfo(
            credentials.login,
            credentials.password
          );

          // Ищем или создаем пользователя
          let user = await User.findOne({ misisLogin: credentials.login });
          
          if (!user) {
            user = new User({
              email: misisData.personalEmail || `${credentials.login}@misis.ru`,
              misisLogin: credentials.login,
              misisData,
            });
            await user.save();
          } else {
            // Обновляем данные MISIS
            user.misisData = misisData;
            await user.save();
          }

          return {
            id: user._id.toString(),
            email: user.email,
            name: misisData.fullName,
            misisLogin: user.misisLogin,
          };
        } catch (error) {
          console.error('Auth error:', error);
          return null;
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.misisLogin = user.misisLogin;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.sub!;
        session.user.misisLogin = token.misisLogin as string;
      }
      return session;
    }
  },
  pages: {
    signIn: '/auth/signin',
  },
  session: {
    strategy: 'jwt',
  },
  secret: process.env.NEXTAUTH_SECRET,
};
