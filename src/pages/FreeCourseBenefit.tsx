import { useMemo, useState } from 'react';
import { Link, Navigate, useLocation, useParams } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useAuth } from '@/contexts/AuthContext';
import { api } from '@/lib/api';
import { ApiCourse, FreeCourseBenefitStatus } from '@/lib/types';

const FreeCourseBenefit = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const location = useLocation();
  const queryClient = useQueryClient();
  const { user, isLoading: authLoading, myCourses } = useAuth();
  const [selectedTargetId, setSelectedTargetId] = useState<string | null>(null);
  const [localError, setLocalError] = useState<string | null>(null);

  const from = `${location.pathname}${location.search}${location.hash}`;

  const { data: sourceCourse, isLoading: sourceCourseLoading } = useQuery<ApiCourse | null>({
    queryKey: ['course', courseId],
    queryFn: () => (courseId ? api.getCourse(courseId) : Promise.resolve(null)),
    enabled: Boolean(courseId && user),
  });

  const {
    data: benefitStatus,
    isLoading: benefitLoading,
    isError: benefitIsError,
    error: benefitError,
  } = useQuery<FreeCourseBenefitStatus | null>({
    queryKey: ['free-course-benefit-status', courseId, user?.id],
    queryFn: () => (courseId ? api.getFreeCourseBenefitStatus(courseId) : Promise.resolve(null)),
    enabled: Boolean(courseId && user),
    retry: false,
  });

  const { data: paidCourses = [], isLoading: paidCoursesLoading } = useQuery<ApiCourse[]>({
    queryKey: ['free-course-benefit-target-courses', user?.id],
    queryFn: () => api.listCourses({ price: 'paid' }),
    enabled: Boolean(user && benefitStatus?.can_claim),
  });

  const claimMutation = useMutation({
    mutationFn: (targetCourseId: string) => {
      if (!courseId) throw new Error('source course is required');
      return api.claimFreeCourseBenefit(courseId, targetCourseId);
    },
    onSuccess: async (response) => {
      setSelectedTargetId(response.target_course.id);
      setLocalError(null);
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['free-course-benefit-status', courseId, user?.id] }),
        queryClient.invalidateQueries({ queryKey: ['course', response.target_course.id] }),
        queryClient.invalidateQueries({ queryKey: ['courses'] }),
      ]);
    },
    onError: (error) => {
      setLocalError(error instanceof Error ? error.message : 'Не удалось применить скидку.');
    },
  });

  const ownedCourseIds = useMemo(() => new Set(myCourses.map((course) => course.id)), [myCourses]);

  const availableTargetCourses = useMemo(
    () =>
      paidCourses.filter(
        (course) => !course.is_free && course.id !== courseId && !ownedCourseIds.has(course.id)
      ),
    [paidCourses, courseId, ownedCourseIds]
  );

  if (authLoading) {
    return (
      <Layout>
        <div className="flex min-h-[60vh] items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        </div>
      </Layout>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from }} replace />;
  }

  if (!courseId) {
    return <Navigate to="/courses" replace />;
  }

  return (
    <Layout>
      <section className="container mx-auto max-w-5xl px-4 py-10">
        <div className="mb-6 flex flex-col gap-2">
          <Link to={`/courses/${courseId}`} className="text-sm text-muted-foreground hover:text-foreground">
            ← Вернуться к курсу
          </Link>
          <h1 className="text-3xl font-semibold">Скидка за прохождение бесплатного курса</h1>
          <p className="text-muted-foreground">
            После 100% завершения бесплатного курса можно выбрать один платный курс со скидкой 10%.
          </p>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>{sourceCourse?.title || 'Источник скидки'}</CardTitle>
            <CardDescription>
              {benefitStatus?.completed_lessons ?? 0}/{benefitStatus?.total_lessons ?? 0} уроков завершено
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            {(sourceCourseLoading || benefitLoading) && (
              <p className="text-muted-foreground">Проверяем условия получения скидки...</p>
            )}
            {benefitStatus && (
              <>
                <p>
                  Прогресс: <span className="font-medium">{benefitStatus.completion_percent}%</span>
                </p>
                <p>
                  Размер скидки: <span className="font-medium">{benefitStatus.percent_off ?? 0}%</span>
                </p>
                {benefitStatus.already_claimed && benefitStatus.claimed_target_course && (
                  <p className="text-emerald-600">
                    Скидка уже применена к курсу: {benefitStatus.claimed_target_course.title}
                  </p>
                )}
              </>
            )}
            {benefitIsError && (
              <Alert variant="destructive">
                <AlertTitle>Скидка недоступна</AlertTitle>
                <AlertDescription>
                  {benefitError instanceof Error
                    ? benefitError.message
                    : 'Не удалось получить статус скидки.'}
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>

        {localError && (
          <Alert variant="destructive" className="mb-6">
            <AlertTitle>Ошибка</AlertTitle>
            <AlertDescription>{localError}</AlertDescription>
          </Alert>
        )}

        {benefitStatus?.can_claim && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Выберите платный курс для скидки</h2>
            {paidCoursesLoading ? (
              <p className="text-muted-foreground">Загружаем доступные курсы...</p>
            ) : availableTargetCourses.length === 0 ? (
              <Alert>
                <AlertTitle>Нет доступных курсов</AlertTitle>
                <AlertDescription>
                  Платные курсы для применения скидки не найдены.
                </AlertDescription>
              </Alert>
            ) : (
              <div className="grid gap-4 md:grid-cols-2">
                {availableTargetCourses.map((course) => {
                  const price = typeof course.current_price === 'number'
                    ? course.current_price
                    : typeof course.price === 'number'
                      ? course.price
                      : 0;
                  return (
                    <Card key={course.id}>
                      <CardHeader>
                        <CardTitle className="text-lg">{course.title}</CardTitle>
                        <CardDescription>{course.level}</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <p className="line-clamp-2 text-sm text-muted-foreground">{course.description}</p>
                        <p className="text-sm">
                          Текущая цена: <span className="font-medium">{price.toLocaleString('ru-RU')} сом</span>
                        </p>
                        <Button
                          className="w-full"
                          disabled={claimMutation.isPending}
                          onClick={() => claimMutation.mutate(course.id)}
                        >
                          {claimMutation.isPending ? 'Применяем скидку...' : 'Выбрать этот курс'}
                        </Button>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {benefitStatus && !benefitStatus.can_claim && !benefitStatus.already_claimed && (
          <Alert>
            <AlertTitle>Пока нельзя применить скидку</AlertTitle>
            <AlertDescription>
              Завершите бесплатный курс на 100%, после этого появится выбор платного курса.
            </AlertDescription>
          </Alert>
        )}

        {selectedTargetId && (
          <div className="mt-6">
            <Button asChild>
              <Link to={`/courses/${selectedTargetId}`}>Перейти к выбранному курсу</Link>
            </Button>
          </div>
        )}
      </section>
    </Layout>
  );
};

export default FreeCourseBenefit;
