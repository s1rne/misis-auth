import { router } from '@/lib/trpc';
import { authRouter } from './routers/auth';
import { oauthRouter } from './routers/oauth';

export const appRouter = router({
  auth: authRouter,
  oauth: oauthRouter,
});

export type AppRouter = typeof appRouter;
