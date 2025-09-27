'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
// import { useEffect } from 'react';

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // const { data: session, status } = useSession();
  // const router = useRouter();

  // useEffect(() => {
  //   if (status === 'loading') return;
    
  //   if (session) {
  //     router.push('/');
  //   }
  // }, [session, status, router]);

  // if (status === 'loading') {
  //   return (
  //     <div className="min-h-screen bg-gradient-to-br from-background to-muted flex items-center justify-center">
  //       <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
  //     </div>
  //   );
  // }

  // if (session) {
  //   return null; // Будет редирект
  // }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted">
      {children}
    </div>
  );
}
