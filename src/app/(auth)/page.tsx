'use client';

import { useSession } from 'next-auth/react';
import { trpc } from '@/lib/trpc-client';
import { WelcomeSection } from '@/components/dashboard/welcome-section';
import { StatsCard } from '@/components/dashboard/stats-card';
import { ProfileCard } from '@/components/dashboard/profile-card';
import { ApiEndpointsCard } from '@/components/dashboard/api-endpoints-card';
import { ApplicationsList } from '@/components/oauth/application-card';
import { 
  Key, 
  Activity,
  Code,
  Globe
} from 'lucide-react';
import { DevelopmentRibbon } from '@/components/ui/development-ribbon';

export default function Home() {
  const { data: session } = useSession();
  const { data: profile } = trpc.auth.getProfile.useQuery();
  const { data: applications, isLoading } = trpc.oauth.getMyApplications.useQuery();

  return (
    <>
      <WelcomeSection 
        userName={session?.user.name || ''}
        profileName={profile?.misisData?.fullName}
      />

      {/* Stats Cards */}
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="OAuth Приложения"
          value={applications?.length || 0}
          description="Активных приложений"
          icon={Key}
        />
        
        <DevelopmentRibbon variant="development">
          <StatsCard
            title="Активные токены"
            value="-"
            description="В разработке"
            icon={Activity}
          />
        </DevelopmentRibbon>
        
        <DevelopmentRibbon variant="comingSoon">
          <StatsCard
            title="API Запросы"
            value="-"
            description="За сегодня"
            icon={Code}
          />
        </DevelopmentRibbon>
        
        <StatsCard
          title="Статус"
          value="Онлайн"
          description="Все системы работают"
          icon={Globe}
        />
      </div>

      <div className="grid gap-4 md:gap-6 lg:grid-cols-3">
        {/* Profile Card */}
        <ProfileCard
          userName={session?.user.name || ''}
          userEmail={session?.user.email || ''}
          profile={profile}
          isLoading={!profile}
        />

        {/* OAuth Applications */}
        <div className="lg:col-span-2">
          <ApplicationsList 
            applications={applications} 
            isLoading={isLoading} 
          />
        </div>
      </div>

      {/* API Info */}
      <ApiEndpointsCard />
    </>
  );
}
