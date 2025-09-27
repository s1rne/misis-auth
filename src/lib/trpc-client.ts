import { createTRPCReact } from '@trpc/react-query';
import { httpBatchLink } from '@trpc/client';
import { type AppRouter } from '@/server/root';

export const trpc = createTRPCReact<AppRouter>();

export const trpcClient = trpc.createClient({
  links: [
    httpBatchLink({
      url: '/api/trpc',
      headers() {
        // Получаем cookies для передачи сессии
        if (typeof window !== 'undefined') {
          return {
            cookie: document.cookie,
          };
        }
        return {};
      },
    }),
  ],
});
