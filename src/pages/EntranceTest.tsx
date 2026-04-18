import { useMemo, useState } from 'react';
import { Link, Navigate, useLocation } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useAuth } from '@/contexts/AuthContext';
import { api } from '@/lib/api';
import { ApiCourse, EntranceQuizStartResponse, EntranceQuizStatus, EntranceQuizSubmitResponse } from '@/lib/types';
import { formatUsd } from '@/lib/utils';

const EntranceTest = () => {
  const location = useLocation();
  const queryClient = useQueryClient();
  const { user, isLoading: authLoading, myCourses } = useAuth();

  const [attempt, setAttempt] = useState<EntranceQuizStartResponse | null>(null);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [submitResult, setSubmitResult] = useState<EntranceQuizSubmitResponse | null>(null);
  const [localError, setLocalError] = useState<string | null>(null);

  const from = `${location.pathname}${location.search}${location.hash}`;

  const {
    data: status,
    isLoading: statusLoading,
    isError: statusIsError,
    error: statusError,
  } = useQuery<EntranceQuizStatus>({
    queryKey: ['entrance-quiz-status', user?.id],
    queryFn: () => api.getEntranceQuizStatus(),
    enabled: Boolean(user),
    retry: false,
  });

  const { data: paidCourses = [], isLoading: paidCoursesLoading } = useQuery<ApiCourse[]>({
    queryKey: ['entrance-quiz-target-courses', user?.id],
    queryFn: () => api.listCourses({ price: 'paid' }),
    enabled: Boolean(user && (status?.can_claim || status?.already_claimed)),
  });

  const ownedCourseIds = useMemo(() => new Set(myCourses.map((course) => course.id)), [myCourses]);
  const availableTargetCourses = useMemo(
    () => paidCourses.filter((course) => !ownedCourseIds.has(course.id)),
    [paidCourses, ownedCourseIds]
  );

  const startMutation = useMutation({
    mutationFn: () => api.startEntranceQuiz(),
    onSuccess: (data) => {
      setAttempt(data);
      setSelectedAnswers({});
      setSubmitResult(null);
      setLocalError(null);
    },
    onError: (error) => {
      setLocalError(error instanceof Error ? error.message : 'Не удалось начать тест.');
    },
  });

  const submitMutation = useMutation({
    mutationFn: () => {
      if (!attempt) throw new Error('Попытка не запущена');
      const payload = attempt.questions.map((question) => ({
        question_id: question.id,
        option_id: selectedAnswers[question.id],
      }));
      return api.submitEntranceQuiz(attempt.attempt_id, payload);
    },
    onSuccess: async (data) => {
      setSubmitResult(data);
      setAttempt(null);
      setSelectedAnswers({});
      setLocalError(null);
      await queryClient.invalidateQueries({ queryKey: ['entrance-quiz-status', user?.id] });
    },
    onError: (error) => {
      setLocalError(error instanceof Error ? error.message : 'Не удалось отправить ответы.');
    },
  });

  const claimMutation = useMutation({
    mutationFn: (targetCourseId: string) => api.claimEntranceQuizCourse(targetCourseId),
    onSuccess: async () => {
      setLocalError(null);
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['entrance-quiz-status', user?.id] }),
        queryClient.invalidateQueries({ queryKey: ['courses'] }),
      ]);
    },
    onError: (error) => {
      setLocalError(error instanceof Error ? error.message : 'Не удалось применить скидку к курсу.');
    },
  });

  const allQuestionsAnswered = useMemo(() => {
    if (!attempt) return false;
    return attempt.questions.every((question) => Boolean(selectedAnswers[question.id]));
  }, [attempt, selectedAnswers]);

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

  return (
    <Layout>
      <section className="container mx-auto max-w-5xl px-4 py-10">
        <div className="mb-6 flex flex-col gap-2">
          <Link to="/courses" className="text-sm text-muted-foreground hover:text-foreground">
            ← Вернуться к курсам
          </Link>
          <h1 className="text-3xl font-semibold">Входной тест</h1>
          <p className="text-muted-foreground">
            Пройдите тест, затем выберите курс для скидки 50%.
          </p>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Статус тестирования</CardTitle>
            <CardDescription>
              Осталось попыток: {status?.attempts_left ?? '—'}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            {statusLoading && <p className="text-muted-foreground">Загружаем статус...</p>}
            {status && (
              <>
                <p>
                  Попыток использовано: <span className="font-medium">{status.attempts_used}</span> из {status.max_attempts}
                </p>
                <p>
                  Тест пройден: <span className="font-medium">{status.has_passed ? 'Да' : 'Нет'}</span>
                </p>
                {status.already_claimed && status.claimed_target_course && (
                  <p className="text-emerald-600">
                    Скидка 50% уже применена к курсу: {status.claimed_target_course.title}
                  </p>
                )}
              </>
            )}
            {statusIsError && (
              <Alert variant="destructive">
                <AlertTitle>Не удалось получить статус</AlertTitle>
                <AlertDescription>
                  {statusError instanceof Error ? statusError.message : 'Ошибка загрузки статуса теста.'}
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

        {!attempt && !submitResult && status?.can_start && (
          <Button onClick={() => startMutation.mutate()} disabled={startMutation.isPending}>
            {startMutation.isPending ? 'Запускаем тест...' : 'Начать тест'}
          </Button>
        )}

        {attempt && (
          <div className="space-y-6">
            {attempt.questions.map((question, index) => (
              <Card key={question.id}>
                <CardHeader>
                  <CardTitle className="text-base">
                    {index + 1}. {question.text}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {question.options.map((option) => {
                    const isSelected = selectedAnswers[question.id] === option.id;
                    return (
                      <button
                        key={option.id}
                        type="button"
                        onClick={() => {
                          setSelectedAnswers((prev) => ({ ...prev, [question.id]: option.id }));
                          setLocalError(null);
                        }}
                        className={`w-full rounded-lg border px-4 py-3 text-left transition-colors ${
                          isSelected
                            ? 'border-primary bg-primary/10 text-primary'
                            : 'border-border hover:bg-muted'
                        }`}
                      >
                        {option.text}
                      </button>
                    );
                  })}
                </CardContent>
              </Card>
            ))}

            <Button
              onClick={() => {
                if (!allQuestionsAnswered) {
                  setLocalError('Ответьте на все вопросы перед отправкой.');
                  return;
                }
                submitMutation.mutate();
              }}
              disabled={submitMutation.isPending || !allQuestionsAnswered}
              className="w-full"
            >
              {submitMutation.isPending ? 'Проверяем ответы...' : 'Отправить ответы'}
            </Button>
          </div>
        )}

        {!attempt && submitResult && (
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>{submitResult.passed ? 'Тест пройден' : 'Тест не пройден'}</CardTitle>
              <CardDescription>
                Результат: {submitResult.score_percent}% ({submitResult.correct_count}/{submitResult.total_questions})
              </CardDescription>
            </CardHeader>
            <CardContent>
              {!submitResult.passed ? (
                <Alert>
                  <AlertTitle>Можно попробовать снова</AlertTitle>
                  <AlertDescription>Осталось попыток: {submitResult.attempts_left}.</AlertDescription>
                </Alert>
              ) : (
                <Alert>
                  <AlertTitle>Отлично</AlertTitle>
                  <AlertDescription>Теперь выберите курс ниже для применения скидки 50%.</AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
        )}

        {status?.can_claim && (
          <div className="mt-8 space-y-4">
            <h2 className="text-xl font-semibold">Выберите курс для скидки 50%</h2>
            {paidCoursesLoading ? (
              <p className="text-muted-foreground">Загружаем курсы...</p>
            ) : availableTargetCourses.length === 0 ? (
              <Alert>
                <AlertTitle>Нет доступных курсов</AlertTitle>
                <AlertDescription>Подходящие платные курсы не найдены.</AlertDescription>
              </Alert>
            ) : (
              <div className="grid gap-4 md:grid-cols-2">
                {availableTargetCourses.map((course) => {
                  const displayedPrice =
                    typeof course.current_price === 'number'
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
                          Текущая цена: <span className="font-medium">{formatUsd(displayedPrice)}</span>
                        </p>
                        <Button
                          className="w-full"
                          disabled={claimMutation.isPending}
                          onClick={() => claimMutation.mutate(course.id)}
                        >
                          {claimMutation.isPending ? 'Применяем скидку...' : 'Выбрать курс'}
                        </Button>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {status?.already_claimed && status.claimed_target_course && (
          <div className="mt-8">
            <Button asChild size="lg">
              <Link to={`/courses/${status.claimed_target_course.id}`}>
                Перейти к выбранному курсу
              </Link>
            </Button>
          </div>
        )}
      </section>
    </Layout>
  );
};

export default EntranceTest;
