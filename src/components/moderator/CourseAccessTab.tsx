import { useEffect, useMemo, useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Search, Loader2, Gift, UserRound, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';

import { api } from '@/lib/api';
import { ApiCourse, ModeratorUserSummary } from '@/lib/types';
import { cn, formatUsd } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const formatDate = (value?: string) => {
  if (!value) return '—';
  return new Intl.DateTimeFormat('ru-RU', { dateStyle: 'medium' }).format(new Date(value));
};

const getInitials = (user: ModeratorUserSummary) => {
  const source = user.name.trim() || user.email.trim();
  const parts = source.split(/\s+/).filter(Boolean);
  if (parts.length === 0) return 'U';
  return parts
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('');
};

const getCoursePriceLabel = (course: ApiCourse) => {
  const price =
    typeof course.current_price === 'number'
      ? course.current_price
      : typeof course.discount_price === 'number'
        ? course.discount_price
        : typeof course.price === 'number'
          ? course.price
          : null;
  return price === null ? 'Цена не указана' : formatUsd(price);
};

export function CourseAccessTab() {
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');
  const [selectedUser, setSelectedUser] = useState<ModeratorUserSummary | null>(null);
  const [selectedCourseId, setSelectedCourseId] = useState('');
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setDebouncedSearchQuery(searchQuery.trim());
    }, 300);

    return () => window.clearTimeout(timeoutId);
  }, [searchQuery]);

  const {
    data: courses = [],
    isLoading: isCoursesLoading,
    isError: isCoursesError,
  } = useQuery<ApiCourse[]>({
    queryKey: ['moderator-courses'],
    queryFn: () => api.adminListCourses(),
  });

  const availableCourses = useMemo(
    () => courses.filter((course) => !course.is_free && course.published !== false),
    [courses]
  );

  const selectedCourse = useMemo(
    () => availableCourses.find((course) => course.id === selectedCourseId) ?? null,
    [availableCourses, selectedCourseId]
  );

  useEffect(() => {
    if (selectedCourseId && !selectedCourse) {
      setSelectedCourseId('');
    }
  }, [selectedCourseId, selectedCourse]);

  const {
    data: users = [],
    error: usersError,
    isError: isUsersError,
    isFetching: isUsersFetching,
  } = useQuery<ModeratorUserSummary[]>({
    queryKey: ['moderator-user-search', debouncedSearchQuery],
    queryFn: () => api.adminSearchUsers(debouncedSearchQuery),
    enabled: debouncedSearchQuery.length >= 2,
  });

  const grantCourseAccess = useMutation({
    mutationFn: async () => {
      if (!selectedUser) {
        throw new Error('Сначала выберите пользователя.');
      }
      if (!selectedCourse) {
        throw new Error('Сначала выберите курс.');
      }

      return api.adminGrantCourseAccess({
        user_id: String(selectedUser.id),
        course_id: selectedCourse.id,
      });
    },
    onSuccess: (result) => {
      if (result.created) {
        toast.success('Курс открыт бесплатно', {
          description: `${result.user.email} получил доступ к курсу «${result.course.title}».`,
        });
      } else {
        toast(`Доступ уже открыт`, {
          description: `${result.user.email} уже имеет доступ к курсу «${result.course.title}».`,
        });
      }
      setSelectedCourseId('');
      setIsConfirmOpen(false);
    },
    onError: (error: Error) => {
      toast.error('Не удалось открыть курс', {
        description: error.message,
      });
    },
  });

  const handleConfirmGrant = async () => {
    await grantCourseAccess.mutateAsync();
  };

  const usersErrorMessage =
    usersError instanceof Error ? usersError.message : 'Ошибка при поиске пользователей.';

  return (
    <div className="space-y-6">
      <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle>Поиск пользователя</CardTitle>
          <CardDescription>
            Найдите ученика по имени или email и выберите, кому открыть платный курс.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Введите email или имя"
              className="pl-10 pr-10"
            />
            {isUsersFetching && (
              <Loader2 className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin text-muted-foreground" />
            )}
          </div>

          {debouncedSearchQuery.length < 2 ? (
            <div className="rounded-lg border border-dashed border-border/60 p-4 text-sm text-muted-foreground">
              Введите минимум 2 символа, чтобы начать поиск.
            </div>
          ) : isUsersError ? (
            <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
              {usersErrorMessage}
            </div>
          ) : users.length > 0 ? (
            <div className="space-y-2">
              {users.map((user) => {
                const isSelected = selectedUser?.id === user.id;
                return (
                  <button
                    key={user.id}
                    type="button"
                    onClick={() => setSelectedUser(user)}
                    className={cn(
                      'flex w-full items-center gap-3 rounded-lg border p-3 text-left transition-colors',
                      isSelected
                        ? 'border-primary bg-primary/5'
                        : 'border-border/50 bg-background/50 hover:border-primary/30'
                    )}
                  >
                    <Avatar className="h-11 w-11">
                      <AvatarImage src={user.avatar} alt={user.name} />
                      <AvatarFallback>{getInitials(user)}</AvatarFallback>
                    </Avatar>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{user.name}</span>
                        {isSelected && <Badge variant="secondary">Выбран</Badge>}
                      </div>
                      <div className="truncate text-sm text-muted-foreground">{user.email}</div>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {formatDate(user.date_joined)}
                    </div>
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="rounded-lg border border-dashed border-border/60 p-4 text-sm text-muted-foreground">
              По запросу ничего не найдено.
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle>Выдача доступа</CardTitle>
          <CardDescription>
            Выберите платный опубликованный курс и откройте его выбранному пользователю без оплаты.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="rounded-lg border border-border/50 bg-background/50 p-4">
            <div className="mb-3 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <UserRound className="h-4 w-4 text-primary" />
                <span className="font-medium">Выбранный пользователь</span>
              </div>
              {selectedUser && (
                <Button variant="ghost" size="sm" onClick={() => setSelectedUser(null)}>
                  Сбросить
                </Button>
              )}
            </div>
            {selectedUser ? (
              <div className="flex items-center gap-3">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={selectedUser.avatar} alt={selectedUser.name} />
                  <AvatarFallback>{getInitials(selectedUser)}</AvatarFallback>
                </Avatar>
                <div className="min-w-0">
                  <div className="font-medium">{selectedUser.name}</div>
                  <div className="text-sm text-muted-foreground">{selectedUser.email}</div>
                  <div className="text-xs text-muted-foreground">
                    На платформе с {formatDate(selectedUser.date_joined)}
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-sm text-muted-foreground">
                Сначала выберите пользователя в блоке выше.
              </div>
            )}
          </div>

          <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
            <div className="space-y-2">
              <div className="text-sm text-muted-foreground">Курс</div>
              <Select
                value={selectedCourseId}
                onValueChange={setSelectedCourseId}
                disabled={isCoursesLoading || availableCourses.length === 0}
              >
                <SelectTrigger>
                  <SelectValue
                    placeholder={
                      isCoursesLoading
                        ? 'Загружаем курсы...'
                        : availableCourses.length === 0
                          ? 'Нет доступных платных курсов'
                          : 'Выберите курс'
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  {availableCourses.map((course) => (
                    <SelectItem key={course.id} value={course.id}>
                      {course.title} · {getCoursePriceLabel(course)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Button
              className="w-full lg:w-auto"
              disabled={!selectedUser || !selectedCourse || grantCourseAccess.isPending}
              onClick={() => setIsConfirmOpen(true)}
            >
              {grantCourseAccess.isPending ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Gift className="mr-2 h-4 w-4" />
              )}
              Открыть бесплатно
            </Button>
          </div>

          {isCoursesError && (
            <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
              Не удалось загрузить список курсов.
            </div>
          )}

          {selectedCourse && (
            <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/10 p-4">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="mt-0.5 h-4 w-4 text-emerald-600" />
                <div>
                  <div className="font-medium">{selectedCourse.title}</div>
                  <div className="text-sm text-muted-foreground">
                    Уровень: {selectedCourse.level} · {getCoursePriceLabel(selectedCourse)}
                  </div>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <AlertDialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Открыть курс бесплатно?</AlertDialogTitle>
            <AlertDialogDescription>
              {selectedUser && selectedCourse
                ? `Пользователь ${selectedUser.email} получит доступ к курсу «${selectedCourse.title}» без оплаты.`
                : 'Подтвердите выдачу доступа.'}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={grantCourseAccess.isPending}>Отмена</AlertDialogCancel>
            <AlertDialogAction
              disabled={grantCourseAccess.isPending}
              onClick={(event) => {
                event.preventDefault();
                void handleConfirmGrant();
              }}
            >
              {grantCourseAccess.isPending ? 'Открываем...' : 'Подтвердить'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
