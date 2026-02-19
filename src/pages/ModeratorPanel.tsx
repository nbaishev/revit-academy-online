import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart3, BookOpen, Settings, Award } from 'lucide-react';
import { StatisticsTab } from '@/components/moderator/StatisticsTab';
import { CoursesManagementTab } from '@/components/moderator/CoursesManagementTab';
import { CourseCompletionTab } from '@/components/moderator/CourseCompletionTab';

export default function ModeratorPanel() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <Layout>
        <div className="flex min-h-[60vh] items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        </div>
      </Layout>
    );
  }

  // Redirect if not moderator/admin
  if (!user || !['moderator', 'admin'].includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl gradient-primary">
              <Settings className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Панель модератора</h1>
              <p className="text-muted-foreground">Управление платформой и курсами</p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="statistics" className="space-y-6">
          <TabsList className="grid w-full max-w-2xl grid-cols-3">
            <TabsTrigger value="statistics" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Статистика
            </TabsTrigger>
            <TabsTrigger value="courses" className="flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              Курсы
            </TabsTrigger>
            <TabsTrigger value="completion" className="flex items-center gap-2">
              <Award className="h-4 w-4" />
              Сертификаты
            </TabsTrigger>
          </TabsList>

          <TabsContent value="statistics">
            <StatisticsTab />
          </TabsContent>

          <TabsContent value="courses">
            <CoursesManagementTab />
          </TabsContent>

          <TabsContent value="completion">
            <CourseCompletionTab />
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}
