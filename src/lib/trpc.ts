import { initTRPC, TRPCError } from '@trpc/server';
import { NextRequest } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/mongodb';

// Инициализация tRPC
const t = initTRPC.context<{
  req: NextRequest;
  session: any;
}>().create();

// Подключение к базе данных
const createContext = async ({ req }: { req: NextRequest }) => {
  await connectDB();
  
  // Получаем cookies из запроса для getServerSession
  const cookies = req.headers.get('cookie') || '';
  
  const session = await getServerSession({
    ...authOptions,
    req: {
      headers: {
        cookie: cookies,
      },
    } as any,
  });
  
  return {
    req,
    session,
  };
};

// Базовые процедуры
export const router = t.router;
export const publicProcedure = t.procedure;

// Защищенная процедура (требует аутентификации)
export const protectedProcedure = t.procedure.use(({ ctx, next }) => {
  if (!ctx.session?.user) {
    throw new TRPCError({
      code: 'UNAUTHORIZED',
      message: 'Необходима аутентификация',
    });
  }
  return next({
    ctx: {
      ...ctx,
      session: { ...ctx.session, user: ctx.session.user },
    },
  });
});

// Процедура для администраторов
export const adminProcedure = t.procedure.use(({ ctx, next }) => {
  if (!ctx.session?.user) {
    throw new TRPCError({
      code: 'UNAUTHORIZED',
      message: 'Необходима аутентификация',
    });
  }
  
  // Здесь можно добавить проверку роли администратора
  // if (ctx.session.user.role !== 'admin') {
  //   throw new TRPCError({
  //     code: 'FORBIDDEN',
  //     message: 'Недостаточно прав',
  //   });
  // }
  
  return next({
    ctx: {
      ...ctx,
      session: { ...ctx.session, user: ctx.session.user },
    },
  });
});

export { createContext };
