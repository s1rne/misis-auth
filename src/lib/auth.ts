import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { misisClient } from '@/lib/misis-client';
import User from '@/models/User';
import UserSettings from '@/models/UserSettings';
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
          
          // Сначала пробуем локальную аутентификацию
          const user = await User.findOne({ misisLogin: credentials.login });
          
          if (user && user.password) {
            // Проверяем сохраненный пароль
            const isPasswordValid = await user.comparePassword(credentials.password);
            if (isPasswordValid) {
              return {
                id: user._id.toString(),
                email: user.email,
                name: user.misisData?.fullName || user.misisLogin,
                misisLogin: user.misisLogin,
              };
            }
          }

          // Если локальная аутентификация не удалась, проверяем через MISIS
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
          let userToSave = await User.findOne({ misisLogin: credentials.login });
          
          if (!userToSave) {
            userToSave = new User({
              email: misisData.personalEmail || `${credentials.login}@misis.ru`,
              misisLogin: credentials.login,
              password: credentials.password, // Исходный пароль для MISIS API
              misisData,
            });
            await userToSave.save();
            
            // Создаем настройки по умолчанию для нового пользователя
            const userSettings = new UserSettings({ 
              userId: userToSave._id.toString() 
            });
            await userSettings.save();
          } else {
            // Обновляем данные MISIS и пароль
            userToSave.misisData = misisData;
            userToSave.password = credentials.password; // Исходный пароль
            await userToSave.save();
          }

          return {
            id: userToSave._id.toString(),
            email: userToSave.email,
            name: misisData.fullName,
            misisLogin: userToSave.misisLogin,
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
