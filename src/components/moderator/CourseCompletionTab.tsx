import { useEffect, useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Loader2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { api } from '@/lib/api';
import { ApiCourse } from '@/lib/types';

const formatDateTime = (value?: string | null) => {
  if (!value) return '—';
  return new Intl.DateTimeFormat('ru-RU', { dateStyle: 'medium', timeStyle: 'short' }).format(
    new Date(value)
  );
};

export function CourseCompletionTab() {
  const [selectedCourseId, setSelectedCourseId] = useState('');
  const [completedOnly, setCompletedOnly] = useState(true);

  const { data: courses = [], isLoading: isCoursesLoading, isError: isCoursesError } = useQuery<ApiCourse[]>({
    queryKey: ['moderator-courses'],
    queryFn: () => api.adminListCourses(),
  });

  useEffect(() => {
    if (!selectedCourseId && courses.length > 0) {
      setSelectedCourseId(courses[0].id);
    }
  }, [courses, selectedCourseId]);

  const {
    data: completions,
    isLoading: isCompletionsLoading,
    isError: isCompletionsError,
  } = useQuery({
    queryKey: ['moderator-course-completions', selectedCourseId, completedOnly],
    queryFn: () => api.adminCourseCompletions(selectedCourseId, completedOnly),
    enabled: Boolean(selectedCourseId),
  });

  const completionRate = useMemo(() => {
    if (!completions || completions.total_users === 0) return 0;
    return Math.round((completions.completed_users / completions.total_users) * 100);
  }, [completions]);

  return (
    <div className="space-y-6">
      <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle>Прохождение курсов</CardTitle>
          <CardDescription>Список учеников для выдачи сертификатов (100% прохождение)</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-[2fr_1fr]">
            <div className="space-y-2">
              <div className="text-sm text-muted-foreground">Курс</div>
              <Select value={selectedCourseId} onValueChange={setSelectedCourseId} disabled={isCoursesLoading}>
                <SelectTrigger>
                  <SelectValue placeholder="Выберите курс" />
                </SelectTrigger>
                <SelectContent>
                  {courses.map((course) => (
                    <SelectItem key={course.id} value={course.id}>
                      {course.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-end">
              <label className="inline-flex items-center gap-2 text-sm">
                <Checkbox
                  checked={completedOnly}
                  onCheckedChange={(value) => setCompletedOnly(Boolean(value))}
                />
                Только 100%
              </label>
            </div>
          </div>

          {isCoursesError && (
            <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
              Не удалось загрузить список курсов.
            </div>
          )}

          {isCompletionsError && (
            <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
              Не удалось загрузить прохождение курса.
            </div>
          )}
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Всего учеников</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{completions?.total_users ?? 0}</div>
          </CardContent>
        </Card>
        <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Завершили 100%</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{completions?.completed_users ?? 0}</div>
          </CardContent>
        </Card>
        <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Доля завершения</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{completionRate}%</div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle>Детализация по ученикам</CardTitle>
          <CardDescription>
            {completions?.course ? `${completions.course.title} (${completions.course.total_lessons} уроков)` : '—'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isCompletionsLoading ? (
            <div className="flex items-center gap-2 text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
              Загружаем данные...
            </div>
          ) : completions && completions.results.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Ученик</TableHead>
                  <TableHead>Прогресс</TableHead>
                  <TableHead>Статус</TableHead>
                  <TableHead>Когда завершил</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {completions.results.map((entry) => (
                  <TableRow key={entry.user_id}>
                    <TableCell>
                      <div className="font-medium">{entry.name}</div>
                      <div className="text-xs text-muted-foreground">{entry.email}</div>
                    </TableCell>
                    <TableCell>
                      {entry.completed_lessons}/{entry.total_lessons} ({Math.round(entry.progress_percent)}%)
                    </TableCell>
                    <TableCell>
                      {entry.is_completed ? (
                        <Badge className="bg-green-500 text-white hover:bg-green-500">100% завершен</Badge>
                      ) : (
                        <Badge variant="secondary">В процессе</Badge>
                      )}
                    </TableCell>
                    <TableCell>{formatDateTime(entry.last_completed_at)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-sm text-muted-foreground">Нет данных по выбранному фильтру.</div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
