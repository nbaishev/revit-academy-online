import { Layout } from '@/components/layout/Layout';
import { HeroSection } from '@/components/home/HeroSection';
import { StatsSection } from '@/components/home/StatsSection';
import { ClientsSection } from '@/components/home/ClientsSection';
import { FeaturesSection } from '@/components/home/FeaturesSection';
import { TargetAudienceSection } from '@/components/home/TargetAudienceSection';
import { OutcomesSection } from '@/components/home/OutcomesSection';
import { FeaturedCourses } from '@/components/home/FeaturedCourses';
import { CTASection } from '@/components/home/CTASection';

const Index = () => {
  return (
    <Layout>
      <HeroSection />
      <StatsSection />
      <FeaturesSection />
      <ClientsSection />
      <TargetAudienceSection />
      <OutcomesSection />
      <FeaturedCourses />
      <CTASection />
    </Layout>
  );
};

export default Index;
