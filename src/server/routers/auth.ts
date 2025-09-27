import { z } from 'zod';
import { router, publicProcedure, protectedProcedure } from '@/lib/trpc';
import { misisClient } from '@/lib/misis-client';
import User from '@/models/User';
import connectDB from '@/lib/mongodb';

export const authRouter = router({
  // Проверка статуса аутентификации
  getSession: protectedProcedure.query(async ({ ctx }) => {
    return {
      user: ctx.session.user,
      isAuthenticated: true,
    };
  }),

  // Получение профиля пользователя
  getProfile: protectedProcedure.query(async ({ ctx }) => {
    await connectDB();
    
    const user = await User.findById(ctx.session.user.id);
    if (!user) {
      throw new Error('Пользователь не найден');
    }

    return {
      id: user._id,
      email: user.email,
      misisLogin: user.misisLogin,
      misisData: user.misisData,
      isActive: user.isActive,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }),

  // Обновление данных MISIS
  refreshMisisData: protectedProcedure
    .input(z.object({
      login: z.string(),
      password: z.string(),
    }))
    .mutation(async ({ input, ctx }) => {
      await connectDB();
      
      try {
        // Получаем обновленные данные из MISIS
        const misisData = await misisClient.getStudentInfo(
          input.login,
          input.password
        );

        // Обновляем пользователя
        const user = await User.findById(ctx.session.user.id);
        if (!user) {
          throw new Error('Пользователь не найден');
        }

        user.misisData = misisData;
        await user.save();

        return {
          success: true,
          data: misisData,
        };
      } catch (error) {
        throw new Error('Не удалось обновить данные MISIS');
      }
    }),

  // Проверка учетных данных MISIS
  validateCredentials: publicProcedure
    .input(z.object({
      login: z.string(),
      password: z.string(),
    }))
    .mutation(async ({ input }) => {
      try {
        const isValid = await misisClient.validateCredentials(
          input.login,
          input.password
        );

        return {
          isValid,
        };
      } catch (error) {
        return {
          isValid: false,
        };
      }
    }),
});
