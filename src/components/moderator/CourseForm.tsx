import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ApiCourse, CourseDeliveryMode } from '@/lib/types';
import { Plus, Trash2, ImageIcon } from 'lucide-react';

type CourseLevel = 'Начинающий' | 'Средний' | 'Продвинутый';

const normalizeTelegramUsername = (value: string) =>
  value
    .trim()
    .replace(/^https?:\/\/t\.me\//i, '')
    .replace(/^t\.me\//i, '')
    .replace(/^@+/, '')
    .replace(/\/+$/, '');

export type LessonInput = {
  id: string;
  title: string;
  duration?: string;
  video_url: string;
  order?: number;
};

export type ModuleInput = {
  id: string;
  title: string;
  order?: number;
  lessons: LessonInput[];
};

export type CourseFormValues = {
  title: string;
  description: string;
  full_description?: string;
  level: CourseLevel;
  delivery_mode: CourseDeliveryMode;
  mentor_telegram_username?: string | null;
  is_free: boolean;
  price?: number | null;
  discount_price?: number | null;
  preview_image?: File | null;
  background_video_url?: string;
  is_featured?: boolean;
  modules: ModuleInput[];
};

interface CourseFormProps {
  course?: ApiCourse;
  onSubmit: (data: CourseFormValues) => void | Promise<void>;
  onCancel: () => void;
}

export function CourseForm({ course, onSubmit, onCancel }: CourseFormProps) {
  const [title, setTitle] = useState(course?.title || '');
  const [description, setDescription] = useState(course?.description || '');
  const [fullDescription, setFullDescription] = useState(course?.full_description || '');
  const [level, setLevel] = useState<CourseLevel>((course?.level as CourseLevel) || 'Начинающий');
  const [deliveryMode, setDeliveryMode] = useState<CourseDeliveryMode>(course?.delivery_mode || 'online');
  const [mentorTelegramUsername, setMentorTelegramUsername] = useState(course?.mentor_telegram_username || '');
  const [isFree, setIsFree] = useState(course?.is_free ?? true);
  const [price, setPrice] = useState(course?.price?.toString() || '');
  const [discountPrice, setDiscountPrice] = useState(course?.discount_price?.toString() || '');
  const [previewImageFile, setPreviewImageFile] = useState<File | null>(null);
  const [previewImagePreview, setPreviewImagePreview] = useState(course?.preview_image || '');
  const [backgroundVideoUrl, setBackgroundVideoUrl] = useState(course?.background_video_url || '');
  const [isFeatured, setIsFeatured] = useState(course?.is_featured ?? false);
  const [modules, setModules] = useState<ModuleInput[]>([]);

  useEffect(() => {
    setPreviewImageFile(null);
    setPreviewImagePreview(course?.preview_image || '');
  }, [course?.id, course?.preview_image]);

  useEffect(() => {
    if (!previewImageFile) return;
    const previewUrl = URL.createObjectURL(previewImageFile);
    setPreviewImagePreview(previewUrl);
    return () => URL.revokeObjectURL(previewUrl);
  }, [previewImageFile]);

  const parseOrder = (raw: string) => {
    const parsed = Number(raw);
    return raw === '' || Number.isNaN(parsed) ? undefined : parsed;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const parsedPrice = price !== '' ? Number(price) : null;
    const parsedDiscountPrice = discountPrice !== '' ? Number(discountPrice) : null;
    const normalizedMentorTelegramUsername =
      normalizeTelegramUsername(mentorTelegramUsername) || null;

    const payload: CourseFormValues = {
      title,
      description,
      full_description: fullDescription,
      level,
      delivery_mode: deliveryMode,
      mentor_telegram_username:
        deliveryMode === 'offline' ? normalizedMentorTelegramUsername : null,
      is_free: isFree,
      price: isFree ? null : parsedPrice,
      discount_price: isFree ? null : parsedDiscountPrice,
      preview_image: previewImageFile || undefined,
      background_video_url: backgroundVideoUrl || undefined,
      is_featured: isFeatured,
      modules: deliveryMode === 'offline' ? [] : modules,
    };

    onSubmit(payload);
  };

  const addModule = () => {
    setModules([
      ...modules,
      {
        id: `module-${Date.now()}`,
        title: '',
        order: modules.length + 1,
        lessons: [],
      },
    ]);
  };

  const updateModule = (index: number, field: keyof ModuleInput, value: string) => {
    const updated = [...modules];
    updated[index] = { ...updated[index], [field]: field === 'order' ? parseOrder(value) : value };
    setModules(updated);
  };

  const removeModule = (index: number) => {
    setModules(modules.filter((_, i) => i !== index));
  };

  const addLesson = (moduleIndex: number) => {
    const updated = [...modules];
    const newLesson: LessonInput = {
      id: `lesson-${Date.now()}`,
      title: '',
      duration: '',
      video_url: '',
      order: (modules[moduleIndex]?.lessons?.length || 0) + 1,
    };
    updated[moduleIndex].lessons.push(newLesson);
    setModules(updated);
  };

  const updateLesson = (
    moduleIndex: number,
    lessonIndex: number,
    field: keyof LessonInput,
    value: string
  ) => {
    const updated = [...modules];
    const lesson = updated[moduleIndex].lessons[lessonIndex];
    updated[moduleIndex].lessons[lessonIndex] = {
      ...lesson,
      [field]: field === 'order' ? parseOrder(value) : value,
    };
    setModules(updated);
  };

  const removeLesson = (moduleIndex: number, lessonIndex: number) => {
    const updated = [...modules];
    updated[moduleIndex].lessons = updated[moduleIndex].lessons.filter((_, i) => i !== lessonIndex);
    setModules(updated);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Basic Info */}
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="title">Название курса</Label>
          <Input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Введите название курса"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Краткое описание</Label>
          <Textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Краткое описание для карточки курса"
            rows={2}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="fullDescription">Полное описание</Label>
          <Textarea
            id="fullDescription"
            value={fullDescription}
            onChange={(e) => setFullDescription(e.target.value)}
            placeholder="Подробное описание курса"
            rows={4}
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="level">Уровень</Label>
            <Select value={level} onValueChange={(val) => setLevel(val as CourseLevel)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Начинающий">Начинающий</SelectItem>
                <SelectItem value="Средний">Средний</SelectItem>
                <SelectItem value="Продвинутый">Продвинутый</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="deliveryMode">Формат курса</Label>
            <Select
              value={deliveryMode}
              onValueChange={(value) => setDeliveryMode(value as CourseDeliveryMode)}
            >
              <SelectTrigger id="deliveryMode">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="online">Онлайн</SelectItem>
                <SelectItem value="offline">Оффлайн</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex items-center justify-between rounded-lg border border-border p-4">
          <div>
            <Label htmlFor="isFree">Бесплатный курс</Label>
            <p className="text-sm text-muted-foreground">
              Если выключить, потребуется указать цену
            </p>
          </div>
          <Switch id="isFree" checked={isFree} onCheckedChange={setIsFree} />
        </div>

        {!isFree && (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="price">Цена (сом)</Label>
              <Input
                id="price"
                type="number"
                min="0"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="Введите цену курса"
                required={!isFree}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="discountPrice">Цена со скидкой (сом)</Label>
              <Input
                id="discountPrice"
                type="number"
                min="0"
                value={discountPrice}
                onChange={(e) => setDiscountPrice(e.target.value)}
                placeholder="Введите цену со скидкой"
              />
              <p className="text-xs text-muted-foreground">
                Оставьте пустым, если скидки нет.
              </p>
            </div>
          </div>
        )}

        {deliveryMode === 'offline' && (
          <div className="space-y-2">
            <Label htmlFor="mentorTelegramUsername">Telegram ментора</Label>
            <Input
              id="mentorTelegramUsername"
              value={mentorTelegramUsername}
              onChange={(e) => setMentorTelegramUsername(e.target.value)}
              placeholder="@mentor_username или https://t.me/mentor_username"
              required={deliveryMode === 'offline'}
            />
            <p className="text-xs text-muted-foreground">
              Укажите публичный username. Ссылка записи будет собрана автоматически.
            </p>
          </div>
        )}

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="previewImage">Обложка курса</Label>
            <Input
              id="previewImage"
              type="file"
              accept="image/*"
              onChange={(e) => setPreviewImageFile(e.target.files?.[0] || null)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="backgroundVideo">Фоновое видео (опционально)</Label>
            <Input
              id="backgroundVideo"
              value={backgroundVideoUrl}
              onChange={(e) => setBackgroundVideoUrl(e.target.value)}
              placeholder="Ссылка на видео"
            />
          </div>
        </div>

        {previewImagePreview && (
          <div className="flex items-center gap-3 rounded-lg border border-border p-3">
            <img
              src={previewImagePreview}
              alt="Превью курса"
              className="h-16 w-24 rounded-md object-cover"
            />
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <ImageIcon className="h-4 w-4" />
              <span>{previewImageFile ? 'Выбрана новая обложка' : 'Текущая обложка'}</span>
            </div>
          </div>
        )}

        <div className="flex items-center justify-between rounded-lg border border-border p-4">
          <div>
            <Label htmlFor="isFeatured">Показывать в избранном</Label>
            <p className="text-sm text-muted-foreground">Будет отображаться в подборках</p>
          </div>
          <Switch id="isFeatured" checked={isFeatured} onCheckedChange={setIsFeatured} />
        </div>
      </div>

      {/* Modules */}
      {deliveryMode === 'online' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label>Модули и уроки</Label>
            <Button type="button" variant="ghost" size="sm" onClick={addModule}>
              <Plus className="mr-1 h-4 w-4" />
              Добавить модуль
            </Button>
          </div>
          <div className="space-y-4">
            {modules.map((module, moduleIndex) => (
              <div
                key={module.id}
                className="rounded-lg border border-border p-4 space-y-4"
              >
                <div className="flex flex-wrap items-start gap-2">
                  <div className="flex-1 space-y-2 min-w-[200px]">
                    <Label>Модуль {moduleIndex + 1}</Label>
                    <Input
                      value={module.title}
                      onChange={(e) => updateModule(moduleIndex, 'title', e.target.value)}
                      placeholder="Название модуля"
                    />
                  </div>
                  <div className="w-24 space-y-2">
                    <Label>Порядок</Label>
                    <Input
                      type="number"
                      min={1}
                      value={module.order ?? moduleIndex + 1}
                      onChange={(e) => updateModule(moduleIndex, 'order', e.target.value)}
                    />
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="mt-6"
                    onClick={() => removeModule(moduleIndex)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>

                <div className="ml-4 space-y-2 border-l-2 border-border/50 pl-4">
                  {module.lessons.map((lesson, lessonIndex) => (
                    <div
                      key={lesson.id}
                      className="grid gap-2 rounded-lg bg-muted/30 p-3 sm:grid-cols-4"
                    >
                      <Input
                        value={lesson.title}
                        onChange={(e) =>
                          updateLesson(moduleIndex, lessonIndex, 'title', e.target.value)
                        }
                        placeholder="Название урока"
                      />
                      <Input
                        value={lesson.duration}
                        onChange={(e) =>
                          updateLesson(moduleIndex, lessonIndex, 'duration', e.target.value)
                        }
                        placeholder="Длительность"
                      />
                      <Input
                        value={lesson.video_url}
                        onChange={(e) =>
                          updateLesson(moduleIndex, lessonIndex, 'video_url', e.target.value)
                        }
                        placeholder="Ссылка на видео"
                        className="sm:col-span-2"
                      />
                      <div className="flex items-center justify-between sm:col-span-4">
                        <div className="flex items-center gap-2">
                          <Label className="text-xs text-muted-foreground">Порядок</Label>
                          <Input
                            type="number"
                            min={1}
                            value={lesson.order ?? lessonIndex + 1}
                            onChange={(e) =>
                              updateLesson(moduleIndex, lessonIndex, 'order', e.target.value)
                            }
                            className="w-20"
                          />
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => removeLesson(moduleIndex, lessonIndex)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="w-full"
                    onClick={() => addLesson(moduleIndex)}
                  >
                    <Plus className="mr-1 h-4 w-4" />
                    Добавить урок
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-3 justify-end">
        <Button type="button" variant="outline" onClick={onCancel}>
          Отмена
        </Button>
        <Button type="submit" className="gradient-primary text-primary-foreground">
          {course ? 'Сохранить' : 'Создать курс'}
        </Button>
      </div>
    </form>
  );
}
