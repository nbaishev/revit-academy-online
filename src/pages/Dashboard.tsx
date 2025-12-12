import { Link, Navigate } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  BookOpen,
  Play,
  ArrowRight,
  LogOut,
  Mail,
  User,
  Layers,
} from 'lucide-react';

const Dashboard = () => {
  const { user, logout, getCourseProgress, myCourses, isLoading } = useAuth();

  if (!user && !isLoading) {
    return <Navigate to="/" replace />;
  }

  if (isLoading || !user) {
    return (
      <Layout>
        <div className="flex min-h-[60vh] items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        <div className="grid gap-8 lg:grid-cols-4">
          <div className="lg:col-span-1">
            <div className="sticky top-24 rounded-2xl border border-border bg-card p-6">
              <div className="mb-6 text-center">
                <Avatar className="mx-auto mb-4 h-20 w-20">
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback className="gradient-primary text-2xl text-primary-foreground">
                    {user.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <h2 className="text-xl font-semibold">{user.name}</h2>
                <p className="text-sm text-muted-foreground">{user.email}</p>
              </div>

              <div className="mb-6 space-y-3 border-y border-border py-6">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Курсов в обучении</span>
                  <span className="font-medium">{myCourses.length}</span>
                </div>
              </div>

              <div className="mb-6 space-y-3">
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <User className="h-4 w-4" />
                  <span>{user.name}</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <Mail className="h-4 w-4" />
                  <span>{user.email}</span>
                </div>
              </div>

              <Button
                onClick={logout}
                variant="outline"
                className="w-full text-destructive hover:bg-destructive hover:text-destructive-foreground"
              >
                <LogOut className="mr-2 h-4 w-4" />
                Выйти
              </Button>
            </div>
          </div>

          <div className="lg:col-span-3">
            <h1 className="mb-2 text-3xl font-bold">Мои курсы</h1>
            <p className="mb-8 text-muted-foreground">Продолжайте обучение с того места, где остановились</p>

            {myCourses.length > 0 ? (
              <div className="space-y-4">
                {myCourses.map((course) => {
                  const progress = getCourseProgress(course.id);

                  return (
                    <div
                      key={course.id}
                      className="group overflow-hidden rounded-2xl border border-border bg-card transition-shadow hover:shadow-card"
                    >
                      <div className="flex flex-col md:flex-row">
                        <div className="relative aspect-video w-full md:aspect-square md:w-48">
                          <div className="absolute inset-0 flex items-center justify-center gradient-primary">
                            <BookOpen className="h-12 w-12 text-primary-foreground/50" />
                          </div>
                        </div>

                        <div className="flex flex-1 flex-col p-6">
                          <div className="mb-2 flex items-start justify-between">
                            <h3 className="text-xl font-semibold group-hover:text-primary">
                              {course.title}
                            </h3>
                            {course.is_free && (
                              <span className="rounded-full bg-green-500/10 px-3 py-1 text-xs font-medium text-green-500">
                                Бесплатно
                              </span>
                            )}
                          </div>

                          <p className="mb-4 flex-1 text-sm text-muted-foreground line-clamp-2">
                            {course.description}
                          </p>

                          <div className="mb-4">
                            <div className="mb-2 flex items-center justify-between text-sm">
                              <span className="text-muted-foreground">Прогресс</span>
                              <span className="font-medium">{Math.round(progress)}%</span>
                            </div>
                            <Progress value={progress} className="h-2" />
                          </div>

                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <Layers className="h-4 w-4" />
                                {course.modules_count ?? 0} модулей
                              </span>
                              <span className="flex items-center gap-1">
                                <BookOpen className="h-4 w-4" />
                                {course.lessons_count ?? 0} уроков
                              </span>
                            </div>

                            <Button asChild variant="default" size="sm">
                              <Link to={`/courses/${course.id}`}>
                                <Play className="mr-2 h-4 w-4" />
                                Продолжить
                              </Link>
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="rounded-2xl border border-border bg-card p-12 text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
                  <BookOpen className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="mb-2 text-xl font-semibold">У вас пока нет курсов</h3>
                <p className="mb-6 text-muted-foreground">
                  Выберите курс из каталога, чтобы начать обучение
                </p>
                <Button asChild>
                  <Link to="/courses">
                    Перейти к курсам
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
