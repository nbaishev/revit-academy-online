import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, BookOpen, TrendingUp, Award } from 'lucide-react';
import { courses } from '@/data/courses';

// Mock statistics data
const stats = {
  totalUsers: 1247,
  activeUsers: 856,
  totalCourses: courses.length,
  activeCourses: courses.filter(c => c.lessonsCount > 0).length,
  totalEnrollments: 3421,
  completionRate: 67,
};

const popularCourses = courses
  .map(course => ({
    ...course,
    enrollments: Math.floor(Math.random() * 500) + 100,
  }))
  .sort((a, b) => b.enrollments - a.enrollments)
  .slice(0, 5);

export function StatisticsTab() {
  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Всего пользователей
            </CardTitle>
            <Users className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.totalUsers.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-500">+12%</span> за месяц
            </p>
          </CardContent>
        </Card>

        <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Активные пользователи
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.activeUsers.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-500">+8%</span> за месяц
            </p>
          </CardContent>
        </Card>

        <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Всего курсов
            </CardTitle>
            <BookOpen className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.totalCourses}</div>
            <p className="text-xs text-muted-foreground">
              {stats.activeCourses} активных
            </p>
          </CardContent>
        </Card>

        <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Завершаемость курсов
            </CardTitle>
            <Award className="h-4 w-4 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.completionRate}%</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-500">+5%</span> за месяц
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Popular Courses */}
      <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle>Популярные курсы</CardTitle>
          <CardDescription>Топ-5 курсов по количеству записей</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {popularCourses.map((course, index) => (
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
                    <p className="text-sm text-muted-foreground">
                      {course.level} • {course.duration}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-semibold">{course.enrollments} записей</div>
                  <div className="text-sm text-muted-foreground">⭐ {course.rating}</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Activity Overview */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>Записи на курсы</CardTitle>
            <CardDescription>Общее количество записей</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-primary">
              {stats.totalEnrollments.toLocaleString()}
            </div>
            <p className="mt-2 text-sm text-muted-foreground">
              Среднее количество записей на курс:{' '}
              <span className="font-medium text-foreground">
                {Math.round(stats.totalEnrollments / stats.totalCourses)}
              </span>
            </p>
          </CardContent>
        </Card>

        <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>Активность платформы</CardTitle>
            <CardDescription>Показатели за последние 30 дней</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Новые пользователи</span>
                <span className="font-medium">+142</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Завершённые курсы</span>
                <span className="font-medium">89</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Просмотренные уроки</span>
                <span className="font-medium">4,521</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
