import { useState } from 'react';
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
import { Course, Module, Lesson } from '@/data/courses';
import { Plus, Trash2 } from 'lucide-react';

interface CourseFormProps {
  course?: Course;
  onSubmit: (data: Partial<Course>) => void;
  onCancel: () => void;
}

type CourseLevel = 'Начинающий' | 'Средний' | 'Продвинутый';

export function CourseForm({ course, onSubmit, onCancel }: CourseFormProps) {
  const [title, setTitle] = useState(course?.title || '');
  const [shortDescription, setShortDescription] = useState(course?.shortDescription || '');
  const [description, setDescription] = useState(course?.description || '');
  const [duration, setDuration] = useState(course?.duration || '');
  const [level, setLevel] = useState<CourseLevel>(course?.level || 'Начинающий');
  const [isFree, setIsFree] = useState(course?.price === null);
  const [price, setPrice] = useState(course?.price?.toString() || '');
  const [modules, setModules] = useState<Module[]>(course?.modules || []);
  const [outcomes, setOutcomes] = useState<string[]>(
    course?.outcomes || ['']
  );
  const [targetAudience, setTargetAudience] = useState<string[]>(
    course?.targetAudience || ['']
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const totalLessons = modules.reduce((acc, m) => acc + m.lessons.length, 0);
    
    onSubmit({
      title,
      shortDescription,
      description,
      duration,
      level,
      price: isFree ? null : Number(price),
      modules,
      lessonsCount: totalLessons,
      outcomes: outcomes.filter(Boolean),
      targetAudience: targetAudience.filter(Boolean),
    });
  };

  const addModule = () => {
    setModules([
      ...modules,
      {
        id: `module-${Date.now()}`,
        title: '',
        lessons: [],
      },
    ]);
  };

  const updateModule = (index: number, field: keyof Module, value: string) => {
    const updated = [...modules];
    updated[index] = { ...updated[index], [field]: value };
    setModules(updated);
  };

  const removeModule = (index: number) => {
    setModules(modules.filter((_, i) => i !== index));
  };

  const addLesson = (moduleIndex: number) => {
    const updated = [...modules];
    const newLesson: Lesson = {
      id: `lesson-${Date.now()}`,
      title: '',
      duration: '',
      videoId: '',
    };
    updated[moduleIndex].lessons.push(newLesson);
    setModules(updated);
  };

  const updateLesson = (
    moduleIndex: number,
    lessonIndex: number,
    field: keyof Lesson,
    value: string
  ) => {
    const updated = [...modules];
    updated[moduleIndex].lessons[lessonIndex] = {
      ...updated[moduleIndex].lessons[lessonIndex],
      [field]: value,
    };
    setModules(updated);
  };

  const removeLesson = (moduleIndex: number, lessonIndex: number) => {
    const updated = [...modules];
    updated[moduleIndex].lessons = updated[moduleIndex].lessons.filter(
      (_, i) => i !== lessonIndex
    );
    setModules(updated);
  };

  const addListItem = (
    list: string[],
    setList: React.Dispatch<React.SetStateAction<string[]>>
  ) => {
    setList([...list, '']);
  };

  const updateListItem = (
    index: number,
    value: string,
    list: string[],
    setList: React.Dispatch<React.SetStateAction<string[]>>
  ) => {
    const updated = [...list];
    updated[index] = value;
    setList(updated);
  };

  const removeListItem = (
    index: number,
    list: string[],
    setList: React.Dispatch<React.SetStateAction<string[]>>
  ) => {
    setList(list.filter((_, i) => i !== index));
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
          <Label htmlFor="shortDescription">Краткое описание</Label>
          <Textarea
            id="shortDescription"
            value={shortDescription}
            onChange={(e) => setShortDescription(e.target.value)}
            placeholder="Краткое описание для карточки курса"
            rows={2}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Полное описание</Label>
          <Textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Подробное описание курса"
            rows={4}
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="duration">Длительность</Label>
            <Input
              id="duration"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              placeholder="Например: 12 часов"
              required
            />
          </div>

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
        </div>

        <div className="flex items-center justify-between rounded-lg border border-border p-4">
          <div>
            <Label htmlFor="isFree">Бесплатный курс</Label>
            <p className="text-sm text-muted-foreground">
              Курс будет доступен всем пользователям
            </p>
          </div>
          <Switch id="isFree" checked={isFree} onCheckedChange={setIsFree} />
        </div>

        {!isFree && (
          <div className="space-y-2">
            <Label htmlFor="price">Цена (₽)</Label>
            <Input
              id="price"
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="Введите цену курса"
              required={!isFree}
            />
          </div>
        )}
      </div>

      {/* Learning Outcomes */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label>Чему научитесь</Label>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => addListItem(outcomes, setOutcomes)}
          >
            <Plus className="mr-1 h-4 w-4" />
            Добавить
          </Button>
        </div>
        <div className="space-y-2">
          {outcomes.map((outcome, index) => (
            <div key={index} className="flex gap-2">
              <Input
                value={outcome}
                onChange={(e) =>
                  updateListItem(index, e.target.value, outcomes, setOutcomes)
                }
                placeholder="Навык или результат обучения"
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => removeListItem(index, outcomes, setOutcomes)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      </div>

      {/* Target Audience */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label>Для кого курс</Label>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => addListItem(targetAudience, setTargetAudience)}
          >
            <Plus className="mr-1 h-4 w-4" />
            Добавить
          </Button>
        </div>
        <div className="space-y-2">
          {targetAudience.map((audience, index) => (
            <div key={index} className="flex gap-2">
              <Input
                value={audience}
                onChange={(e) =>
                  updateListItem(index, e.target.value, targetAudience, setTargetAudience)
                }
                placeholder="Целевая аудитория"
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => removeListItem(index, targetAudience, setTargetAudience)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      </div>

      {/* Modules */}
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
              <div className="flex items-start gap-2">
                <div className="flex-1 space-y-2">
                  <Label>Модуль {moduleIndex + 1}</Label>
                  <Input
                    value={module.title}
                    onChange={(e) => updateModule(moduleIndex, 'title', e.target.value)}
                    placeholder="Название модуля"
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

              {/* Lessons */}
              <div className="ml-4 space-y-2 border-l-2 border-border/50 pl-4">
                {module.lessons.map((lesson, lessonIndex) => (
                  <div
                    key={lesson.id}
                    className="grid gap-2 rounded-lg bg-muted/30 p-3 sm:grid-cols-3"
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
                    <div className="flex gap-2">
                      <Input
                        value={lesson.videoId}
                        onChange={(e) =>
                          updateLesson(moduleIndex, lessonIndex, 'videoId', e.target.value)
                        }
                        placeholder="YouTube Video ID"
                        className="flex-1"
                      />
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
