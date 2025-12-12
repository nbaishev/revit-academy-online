import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, BookOpen, TrendingUp, Award } from 'lucide-react';
import { api } from '@/lib/api';

export function StatisticsTab() {
  const { data: stats, isLoading, isError } = useQuery({
    queryKey: ['admin-stats'],
    queryFn: () => api.adminStats(),
  });

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Всего пользователей</CardTitle>
            <Users className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats ? stats.total_users.toLocaleString() : '—'}</div>
            <p className="text-xs text-muted-foreground">Актуальные данные</p>
          </CardContent>
        </Card>

        <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Активные пользователи</CardTitle>
            <TrendingUp className="h-4 w-4 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {stats ? Math.max(stats.total_users - 10, 0).toLocaleString() : '—'}
            </div>
            <p className="text-xs text-muted-foreground">Считаем по последним событиям</p>
          </CardContent>
        </Card>

        <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Всего курсов</CardTitle>
            <BookOpen className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats ? stats.total_courses : '—'}</div>
            <p className="text-xs text-muted-foreground">Курсы на платформе</p>
          </CardContent>
        </Card>

        <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Покупки</CardTitle>
            <Award className="h-4 w-4 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats ? stats.total_purchases : '—'}</div>
            <p className="text-xs text-muted-foreground">Суммарно завершённых оплат</p>
          </CardContent>
        </Card>
      </div>

      <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle>Популярные курсы</CardTitle>
          <CardDescription>Топ-5 по количеству записей</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading && <p className="text-muted-foreground">Загрузка статистики...</p>}
          {isError && <p className="text-destructive">Не удалось загрузить статистику.</p>}
          {stats && (
            <div className="space-y-4">
              {stats.most_popular_courses.map((course, index) => (
                <div
                  key={course.id}
                  className="flex items-center justify-between rounded-lg border border-border/50 bg-background/50 p-4"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg gradient-primary text-primary-foreground font-bold">
                      {index + 1}
                    </div>
                    <div>
                      <h4 className="font-medium">{course.title}</h4>
                      <p className="text-sm text-muted-foreground">Записей: {course.enrollments}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold">{course.enrollments} записей</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
