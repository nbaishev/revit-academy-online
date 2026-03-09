import { useMemo, useState } from 'react';
import { Navigate, Link, useLocation, useParams } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { api } from '@/lib/api';
import {
  EntranceQuizStartResponse,
  EntranceQuizStatus,
  EntranceQuizSubmitResponse,
} from '@/lib/types';
import { useAuth } from '@/contexts/AuthContext';

const formatMoney = (value: number) => `${value.toLocaleString('ru-RU')} сом`;

const EntranceTest = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const location = useLocation();
  const queryClient = useQueryClient();
  const { user, isLoading: authLoading } = useAuth();

  const [attempt, setAttempt] = useState<EntranceQuizStartResponse | null>(null);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [submitResult, setSubmitResult] = useState<EntranceQuizSubmitResponse | null>(null);
  const [localError, setLocalError] = useState<string | null>(null);

  const from = `${location.pathname}${location.search}${location.hash}`;

  const { data: course, isLoading: isCourseLoading } = useQuery({
    queryKey: ['course', courseId],
    queryFn: () => (courseId ? api.getCourse(courseId) : Promise.resolve(null)),
    enabled: Boolean(courseId && user),
  });

  const {
    data: status,
    isLoading: isStatusLoading,
    isError: isStatusError,
    error: statusError,
  } = useQuery<EntranceQuizStatus | null>({
    queryKey: ['entrance-quiz-status', courseId, user?.id],
    queryFn: () => (courseId ? api.getEntranceQuizStatus(courseId) : Promise.resolve(null)),
    enabled: Boolean(courseId && user),
    retry: false,
  });

  const startMutation = useMutation({
    mutationFn: () => {
      if (!courseId) throw new Error('courseId is required');
      return api.startEntranceQuiz(courseId);
    },
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
      setLocalError(null);
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['entrance-quiz-status', courseId, user?.id] }),
        queryClient.invalidateQueries({ queryKey: ['course', courseId] }),
        queryClient.invalidateQueries({ queryKey: ['courses'] }),
      ]);
    },
    onError: (error) => {
      setLocalError(error instanceof Error ? error.message : 'Не удалось отправить ответы.');
    },
  });

  const allQuestionsAnswered = useMemo(() => {
    if (!attempt) return false;
    return attempt.questions.every((question) => Boolean(selectedAnswers[question.id]));
  }, [attempt, selectedAnswers]);

  const handleSelectOption = (questionId: number, optionId: number) => {
    setSelectedAnswers((prev) => ({ ...prev, [questionId]: optionId }));
    setLocalError(null);
  };

  const handleSubmit = () => {
    if (!attempt) return;
    if (!allQuestionsAnswered) {
      setLocalError('Ответьте на все вопросы перед отправкой.');
      return;
    }
    submitMutation.mutate();
  };

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
      <section className="container mx-auto max-w-4xl px-4 py-10">
        <div className="mb-6 flex flex-col gap-2">
          <Link to={`/courses/${courseId}`} className="text-sm text-muted-foreground hover:text-foreground">
            ← Вернуться к курсу
          </Link>
          <h1 className="text-3xl font-semibold">Входной тест</h1>
          <p className="text-muted-foreground">
            Пройдите тест и получите скидку 50% на курс.
          </p>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>{course?.title || 'Курс'}</CardTitle>
            <CardDescription>
              Порог прохождения: {status?.pass_score ?? '—'}% · Осталось попыток: {status?.attempts_left ?? '—'}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            {(isCourseLoading || isStatusLoading) && <p className="text-muted-foreground">Загружаем данные теста...</p>}
            {!isStatusLoading && status && (
              <>
                <p>
                  Цена после успешного теста: <span className="font-medium">{formatMoney(status.discounted_price)}</span>
                </p>
                {status.has_active_reward && status.reward_expires_at && (
                  <p className="text-emerald-600">
                    Скидка уже активна до {new Date(status.reward_expires_at).toLocaleString('ru-RU')}.
                  </p>
                )}
              </>
            )}
            {isStatusError && (
              <Alert variant="destructive">
                <AlertTitle>Тест недоступен</AlertTitle>
                <AlertDescription>
                  {statusError instanceof Error ? statusError.message : 'Не удалось получить статус теста.'}
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

        {!attempt && !submitResult && status && !status.can_start && !status.has_active_reward && (
          <Alert>
            <AlertTitle>Лимит попыток исчерпан</AlertTitle>
            <AlertDescription>
              В этой версии новые попытки может открыть только администратор.
            </AlertDescription>
          </Alert>
        )}

        {attempt && !submitResult && (
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
                        onClick={() => handleSelectOption(question.id, option.id)}
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
              onClick={handleSubmit}
              disabled={submitMutation.isPending || !allQuestionsAnswered}
              className="w-full"
            >
              {submitMutation.isPending ? 'Проверяем ответы...' : 'Отправить ответы'}
            </Button>
          </div>
        )}

        {submitResult && (
          <Card>
            <CardHeader>
              <CardTitle>
                {submitResult.passed ? 'Тест пройден' : 'Тест не пройден'}
              </CardTitle>
              <CardDescription>
                Результат: {submitResult.score_percent}% ({submitResult.correct_count}/{submitResult.total_questions})
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {submitResult.passed ? (
                <Alert>
                  <AlertTitle>Скидка активирована</AlertTitle>
                  <AlertDescription>
                    {submitResult.reward?.percent_off ?? 50}% на курс до{' '}
                    {submitResult.reward?.expires_at
                      ? new Date(submitResult.reward.expires_at).toLocaleString('ru-RU')
                      : 'окончания срока действия'}.
                  </AlertDescription>
                </Alert>
              ) : (
                <Alert>
                  <AlertTitle>Можно попробовать еще</AlertTitle>
                  <AlertDescription>
                    Осталось попыток: {submitResult.attempts_left}.
                  </AlertDescription>
                </Alert>
              )}

              <div className="flex flex-col gap-3 sm:flex-row">
                <Button asChild>
                  <Link to={`/courses/${courseId}`}>Вернуться к курсу</Link>
                </Button>
                {!submitResult.passed && submitResult.attempts_left > 0 && (
                  <Button
                    variant="outline"
                    onClick={() => {
                      setAttempt(null);
                      setSubmitResult(null);
                      setSelectedAnswers({});
                    }}
                  >
                    Начать новую попытку
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </section>
    </Layout>
  );
};

export default EntranceTest;
