import { z } from 'zod';
import { router, protectedProcedure, adminProcedure } from '@/lib/trpc';
import OAuthApplication from '@/models/OAuthApplication';
import OAuthToken from '@/models/OAuthToken';
import OAuthCode from '@/models/OAuthCode';
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
        
        const application = new OAuthApplication({
          ...input,
          ownerId: ctx.session.user.id,
        });
        
        await application.save();
        
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
    
    const applications = await OAuthApplication.find({
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
      
      const application = await OAuthApplication.findOne({
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
      
      const application = await OAuthApplication.findOneAndUpdate(
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
      
      const result = await OAuthApplication.deleteOne({
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
    
    const tokens = await OAuthToken.find({
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
      
      const token = await OAuthToken.findOneAndUpdate(
        { _id: input.tokenId, userId: ctx.session.user.id },
        { isRevoked: true },
        { new: true }
      );
      
      if (!token) {
        throw new Error('Токен не найден');
      }
      
      return { success: true };
    }),
});
