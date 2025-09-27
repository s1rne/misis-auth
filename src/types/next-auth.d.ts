import NextAuth from 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      email: string;
      name: string;
      misisLogin: string;
    };
  }

  interface User {
    misisLogin: string;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    misisLogin: string;
  }
}
