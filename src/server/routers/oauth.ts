import { z } from 'zod';
import { router, protectedProcedure, adminProcedure } from '@/lib/trpc';
import Application from '@/models/Application';
import AccessToken from '@/models/AccessToken';
import AuthCode from '@/models/AuthCode';
import UserSettings from '@/models/UserSettings';
import connectDB from '@/lib/mongodb';

export const oauthRouter = router({
  // Создание нового OAuth приложения
  createApplication: protectedProcedure
    .input(z.object({
      name: z.string().min(1, 'Название обязательно'),
      description: z.string().optional(),
      redirectUris: z.array(z.string().url()).min(1, 'Необходим хотя бы один redirect URI'),
      scopes: z.array(z.string()).min(1, 'Необходим хотя бы один scope'),
    }))
    .mutation(async ({ input, ctx }) => {
      try {
        await connectDB();
        
        const userId = ctx.session.user.id;
        
        // Получаем настройки пользователя или создаем по умолчанию
        let userSettings = await UserSettings.findOne({ userId });
        if (!userSettings) {
          userSettings = new UserSettings({ userId });
          await userSettings.save();
        }

        console.log("userSettings", userSettings);
        
        // Проверяем количество существующих приложений
        const existingApplicationsCount = await Application.countDocuments({ 
          ownerId: userId,
          isActive: true 
        });
        console.log("existingApplicationsCount", existingApplicationsCount);
        
        if (existingApplicationsCount >= userSettings.maxApplications) {
          throw new Error(`Превышен лимит приложений. Максимум: ${userSettings.maxApplications}`);
        }
        
        // Используем статический метод для создания приложения с автогенерацией credentials
        const application = await Application.createWithGeneratedCredentials({
          ...input,
          ownerId: userId,
        });

        console.log("application created with credentials:", {
          id: application._id,
          name: application.name,
          clientId: application.clientId,
          clientSecret: application.clientSecret ? "***" : "не сгенерирован"
        });
        
        await application.save();
        
        console.log("application saved", application);
        
        return {
          id: application._id,
          name: application.name,
          description: application.description,
          clientId: application.clientId,
          clientSecret: application.clientSecret,
          redirectUris: application.redirectUris,
          scopes: application.scopes,
          isActive: application.isActive,
          createdAt: application.createdAt,
        };
      } catch (error) {
        console.error('Error creating OAuth application:', error);
        throw new Error('Не удалось создать OAuth приложение');
      }
    }),

  // Получение списка приложений пользователя
  getMyApplications: protectedProcedure.query(async ({ ctx }) => {
    await connectDB();
    
    const applications = await Application.find({
      ownerId: ctx.session.user.id,
    }).sort({ createdAt: -1 });
    
    return applications.map(app => ({
      id: app._id,
      name: app.name,
      description: app.description,
      clientId: app.clientId,
      redirectUris: app.redirectUris,
      scopes: app.scopes,
      isActive: app.isActive,
      createdAt: app.createdAt,
      updatedAt: app.updatedAt,
    }));
  }),

  // Получение приложения по ID
  getApplication: protectedProcedure
    .input(z.object({
      id: z.string(),
    }))
    .query(async ({ input, ctx }) => {
      await connectDB();
      
      const application = await Application.findOne({
        _id: input.id,
        ownerId: ctx.session.user.id,
      });
      
      if (!application) {
        throw new Error('Приложение не найдено');
      }
      
      return {
        id: application._id,
        name: application.name,
        description: application.description,
        clientId: application.clientId,
        clientSecret: application.clientSecret,
        redirectUris: application.redirectUris,
        scopes: application.scopes,
        isActive: application.isActive,
        createdAt: application.createdAt,
        updatedAt: application.updatedAt,
      };
    }),

  // Обновление приложения
  updateApplication: protectedProcedure
    .input(z.object({
      id: z.string(),
      name: z.string().min(1).optional(),
      description: z.string().optional(),
      redirectUris: z.array(z.string().url()).optional(),
      scopes: z.array(z.string()).optional(),
      isActive: z.boolean().optional(),
    }))
    .mutation(async ({ input, ctx }) => {
      await connectDB();
      
      const { id, ...updateData } = input;
      
      const application = await Application.findOneAndUpdate(
        { _id: id, ownerId: ctx.session.user.id },
        updateData,
        { new: true }
      );
      
      if (!application) {
        throw new Error('Приложение не найдено');
      }
      
      return {
        id: application._id,
        name: application.name,
        description: application.description,
        clientId: application.clientId,
        redirectUris: application.redirectUris,
        scopes: application.scopes,
        isActive: application.isActive,
        updatedAt: application.updatedAt,
      };
    }),

  // Удаление приложения
  deleteApplication: protectedProcedure
    .input(z.object({
      id: z.string(),
    }))
    .mutation(async ({ input, ctx }) => {
      await connectDB();
      
      const result = await Application.deleteOne({
        _id: input.id,
        ownerId: ctx.session.user.id,
      });
      
      if (result.deletedCount === 0) {
        throw new Error('Приложение не найдено');
      }
      
      return { success: true };
    }),

  // Получение токенов пользователя
  getMyTokens: protectedProcedure.query(async ({ ctx }) => {
    await connectDB();
    
    const tokens = await AccessToken.find({
      userId: ctx.session.user.id,
      isRevoked: false,
    }).populate('clientId', 'name').sort({ createdAt: -1 });
    
    return tokens.map(token => ({
      id: token._id,
      clientName: (token.clientId as any)?.name || 'Unknown',
      scopes: token.scopes,
      expiresAt: token.expiresAt,
      createdAt: token.createdAt,
    }));
  }),

  // Отзыв токена
  revokeToken: protectedProcedure
    .input(z.object({
      tokenId: z.string(),
    }))
    .mutation(async ({ input, ctx }) => {
      await connectDB();
      
      const token = await AccessToken.findOneAndUpdate(
        { _id: input.tokenId, userId: ctx.session.user.id },
        { isRevoked: true },
        { new: true }
      );
      
      if (!token) {
        throw new Error('Токен не найден');
      }
      
      return { success: true };
    }),

  // Получение настроек пользователя
  getUserSettings: protectedProcedure
    .query(async ({ ctx }) => {
      await connectDB();
      
      const userId = ctx.session.user.id;
      let userSettings = await UserSettings.findOne({ userId });
      
      if (!userSettings) {
        // Создаем настройки по умолчанию
        userSettings = new UserSettings({ userId });
        await userSettings.save();
      }
      
      return {
        maxApplications: userSettings.maxApplications,
      };
    }),

  // Обновление настроек пользователя (только для админов)
  updateUserSettings: adminProcedure
    .input(z.object({
      userId: z.string(),
      maxApplications: z.number().min(0).optional(),
    }))
    .mutation(async ({ input }) => {
      await connectDB();
      
      let userSettings = await UserSettings.findOne({ userId: input.userId });
      
      if (!userSettings) {
        userSettings = new UserSettings({ userId: input.userId });
      }
      
      if (input.maxApplications !== undefined) {
        userSettings.maxApplications = input.maxApplications;
      }
      
      await userSettings.save();
      
      return {
        maxApplications: userSettings.maxApplications,
      };
    }),
});
