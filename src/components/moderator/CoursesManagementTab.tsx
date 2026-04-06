import { useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Search, Edit, Trash2, Eye, Loader2, Star, ImageIcon, MessageCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { CourseForm, CourseFormValues, ModuleInput } from './CourseForm';
import { api } from '@/lib/api';
import { serializeLessonMaterials } from '@/lib/lessonMaterials';
import { ApiCourse } from '@/lib/types';
import { pluralizeRu } from '@/lib/utils';
import { toast } from 'sonner';

export function CoursesManagementTab() {
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<ApiCourse | null>(null);

  const { data: courses = [], isLoading, isError } = useQuery<ApiCourse[]>({
    queryKey: ['moderator-courses'],
    queryFn: () => api.adminListCourses(),
  });

  const syncModules = async (courseId: string, modules: ModuleInput[]) => {
    for (const [moduleIndex, module] of modules.entries()) {
      if (!module.title.trim()) continue;
      const createdModule = await api.adminCreateModule(courseId, {
        title: module.title,
        order: module.order ?? moduleIndex + 1,
      });

      for (const [lessonIndex, lesson] of module.lessons.entries()) {
        if (!lesson.title.trim() || !lesson.video_url.trim()) continue;
        await api.adminCreateLesson(courseId, {
          module_id: Number(createdModule.id),
          title: lesson.title,
          video_url: lesson.video_url,
          duration: lesson.duration,
          order: lesson.order ?? lessonIndex + 1,
          additional_materials: serializeLessonMaterials(lesson.materials),
        });
      }
    }
  };

  const createCourse = useMutation({
    mutationFn: async (data: CourseFormValues) => {
      const { modules, ...coursePayload } = data;
      const newCourse = await api.adminCreateCourse(coursePayload);
      if (data.delivery_mode === 'online' && modules.length) {
        await syncModules(newCourse.id, modules);
      }
      return newCourse;
    },
    onSuccess: () => {
      toast.success('Курс успешно создан');
      setIsAddDialogOpen(false);
      queryClient.invalidateQueries({ queryKey: ['moderator-courses'] });
    },
    onError: (err: Error) => toast.error('Не удалось создать курс', { description: err.message }),
  });

  const updateCourse = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: CourseFormValues }) => {
      const { modules, ...coursePayload } = data;
      const updated = await api.adminUpdateCourse(id, coursePayload);
      if (data.delivery_mode === 'online' && modules.length) {
        await syncModules(id, modules);
      }
      return updated;
    },
    onSuccess: () => {
      toast.success('Курс обновлен');
      setEditingCourse(null);
      queryClient.invalidateQueries({ queryKey: ['moderator-courses'] });
    },
    onError: (err: Error) => toast.error('Не удалось обновить курс', { description: err.message }),
  });

  const deleteCourse = useMutation({
    mutationFn: (courseId: string) => api.adminDeleteCourse(courseId),
    onSuccess: () => {
      toast.success('Курс удален');
      queryClient.invalidateQueries({ queryKey: ['moderator-courses'] });
    },
    onError: (err: Error) => toast.error('Не удалось удалить курс', { description: err.message }),
  });

  const filteredCourses = useMemo(
    () =>
      courses.filter(
        (course) =>
          course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          course.description.toLowerCase().includes(searchQuery.toLowerCase())
      ),
    [courses, searchQuery]
  );

  const handleAddCourse = async (courseData: CourseFormValues) => {
    await createCourse.mutateAsync(courseData);
  };

  const handleEditCourse = async (courseData: CourseFormValues) => {
    if (!editingCourse) return;
    await updateCourse.mutateAsync({ id: editingCourse.id, data: courseData });
  };

  const handleDeleteCourse = (courseId: string) => {
    deleteCourse.mutate(courseId);
  };

  return (
    <div className="space-y-6">
      {/* Header with search and add button */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Поиск курсов..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gradient-primary text-primary-foreground">
              <Plus className="mr-2 h-4 w-4" />
              Добавить курс
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Создать новый курс</DialogTitle>
              <DialogDescription>Данные сохранятся в базе через API</DialogDescription>
            </DialogHeader>
            <CourseForm
              onSubmit={handleAddCourse}
              onCancel={() => setIsAddDialogOpen(false)}
            />
          </DialogContent>
        </Dialog>
      </div>

      <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle>Все курсы ({filteredCourses.length})</CardTitle>
          <CardDescription>Управление курсами платформы</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
              Загружаем курсы...
            </div>
          )}
          {isError && (
            <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-4 text-destructive">
              Не удалось загрузить курсы. Проверьте доступ и токен модератора.
            </div>
          )}

          {!isLoading && !isError && (
            <div className="space-y-4">
              {filteredCourses.map((course) => {
                const isFree = course.is_free || course.price === null || course.price === undefined;
                const isOffline = course.delivery_mode === 'offline';
                const priceValue = typeof course.price === 'number' ? course.price : null;
                const discountValue = typeof course.discount_price === 'number' ? course.discount_price : null;
                const hasDiscount =
                  !isFree &&
                  priceValue !== null &&
                  discountValue !== null &&
                  discountValue > 0 &&
                  discountValue < priceValue;
                const priceLabel = priceValue !== null ? priceValue.toLocaleString('ru-RU') : '';
                const discountLabel = discountValue !== null ? discountValue.toLocaleString('ru-RU') : '';
                const lessonsCount = course.lessons_count ?? 0;
                const modulesCount = course.modules_count ?? 0;
                return (
                  <div
                    key={course.id}
                    className="flex flex-col gap-4 rounded-lg border border-border/50 bg-background/50 p-4 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div className="flex items-start gap-4">
                      <div className="relative h-16 w-24 overflow-hidden rounded-lg bg-muted">
                        {course.preview_image ? (
                          <img
                            src={course.preview_image}
                            alt={course.title}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center text-muted-foreground">
                            <ImageIcon className="h-6 w-6" />
                          </div>
                        )}
                        {course.is_featured && (
                          <div className="absolute left-1 top-1 rounded-full bg-primary px-2 py-0.5 text-[10px] font-semibold text-primary-foreground">
                            Хит
                          </div>
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className="font-medium">{course.title}</h4>
                          <Badge variant="secondary" className="bg-background/80">
                            {course.level}
                          </Badge>
                          {isOffline && (
                            <Badge className="bg-sky-500/10 text-sky-700 hover:bg-sky-500/10">
                              Оффлайн
                            </Badge>
                          )}
                          {course.is_featured && (
                            <Badge className="bg-amber-500 text-white">
                              <Star className="mr-1 h-3 w-3" />
                              Избранный
                            </Badge>
                          )}
                          {isFree ? (
                            <Badge variant="secondary" className="bg-green-500/10 text-green-600">
                              Бесплатно
                            </Badge>
                          ) : hasDiscount ? (
                            <Badge variant="secondary" className="flex items-baseline gap-2">
                              <span className="line-through text-muted-foreground">{priceLabel}</span>
                              <span className="font-semibold">{discountLabel} сом</span>
                            </Badge>
                          ) : (
                            <Badge variant="secondary">
                              {priceLabel} сом
                            </Badge>
                          )}
                        </div>
                        <p className="mt-1 text-sm text-muted-foreground line-clamp-1">
                          {course.description}
                        </p>
                        <div className="mt-2 flex items-center gap-4 text-xs text-muted-foreground">
                          {isOffline ? (
                            <span className="flex items-center gap-1">
                              <MessageCircle className="h-3.5 w-3.5" />
                              Telegram запись к ментору
                            </span>
                          ) : (
                            <>
                              <span>
                                {modulesCount} {pluralizeRu(modulesCount, ['модуль', 'модуля', 'модулей'])}
                              </span>
                              <span>•</span>
                              <span>
                                {lessonsCount} {pluralizeRu(lessonsCount, ['урок', 'урока', 'уроков'])}
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="icon" asChild>
                        <Link to={`/courses/${course.id}`}>
                          <Eye className="h-4 w-4" />
                        </Link>
                      </Button>
                      <Dialog
                        open={editingCourse?.id === course.id}
                        onOpenChange={(open) => !open && setEditingCourse(null)}
                      >
                        <DialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setEditingCourse(course)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                          <DialogHeader>
                            <DialogTitle>Редактировать курс</DialogTitle>
                            <DialogDescription>
                              Обновление информации сохраняется через API
                            </DialogDescription>
                          </DialogHeader>
                          <CourseForm
                            key={course.id}
                            course={course}
                            onSubmit={handleEditCourse}
                            onCancel={() => setEditingCourse(null)}
                          />
                        </DialogContent>
                      </Dialog>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-destructive hover:text-destructive"
                        onClick={() => handleDeleteCourse(course.id)}
                        disabled={deleteCourse.isPending}
                      >
                        {deleteCourse.isPending ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Trash2 className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                );
              })}

              {filteredCourses.length === 0 && (
                <div className="py-12 text-center text-muted-foreground">
                  Курсы не найдены
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
