import { withAuth } from "next-auth/middleware";

export default withAuth(
  function middleware(req) {
    // Дополнительная логика middleware при необходимости
    console.log('🔒 Protected route accessed:', req.nextUrl.pathname);
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        // Проверяем наличие токена
        if (!token) {
          console.log('❌ No token found, redirecting to signin');
          return false;
        }
        
        console.log('✅ User authorized:', token.email);
        return true;
      },
    },
    pages: {
      signIn: '/auth/signin',
    },
  }
);

export const config = {
  matcher: [
    "/oauth/:path*",
    "/settings",
    "/docs",
  ],
};
