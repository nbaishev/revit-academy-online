import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Layout } from '@/components/layout/Layout';
import { CourseCard } from '@/components/courses/CourseCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Filter } from 'lucide-react';
import { api } from '@/lib/api';
import { ApiCourse } from '@/lib/types';

type LevelFilter = 'all' | 'Начинающий' | 'Средний' | 'Продвинутый';
type PriceFilter = 'all' | 'free' | 'paid';

const Courses = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [levelFilter, setLevelFilter] = useState<LevelFilter>('all');
  const [priceFilter, setPriceFilter] = useState<PriceFilter>('all');

  const { data: courses, isLoading, isError } = useQuery<ApiCourse[]>({
    queryKey: ['courses', searchQuery, levelFilter, priceFilter],
    queryFn: () =>
      api.listCourses({
        search: searchQuery || undefined,
        level: levelFilter === 'all' ? undefined : levelFilter,
        price: priceFilter === 'all' ? undefined : priceFilter,
      }),
  });

  const levelOptions: { value: LevelFilter; label: string }[] = [
    { value: 'all', label: 'Все уровни' },
    { value: 'Начинающий', label: 'Начинающий' },
    { value: 'Средний', label: 'Средний' },
    { value: 'Продвинутый', label: 'Продвинутый' },
  ];

  const priceOptions: { value: PriceFilter; label: string }[] = [
    { value: 'all', label: 'Все курсы' },
    { value: 'free', label: 'Бесплатные' },
    { value: 'paid', label: 'Платные' },
  ];

  return (
    <Layout>
      {/* Hero */}
      <section className="gradient-hero py-16">
        <div className="container mx-auto px-4">
          <h1 className="mb-4 text-center text-4xl font-bold md:text-5xl">
            Каталог курсов
          </h1>
          <p className="mx-auto mb-8 max-w-2xl text-center text-lg text-muted-foreground">
            Выберите подходящий курс и начните своё путешествие в мир BIM-проектирования
          </p>

          {/* Search */}
          <div className="mx-auto max-w-xl">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Поиск курсов..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-12 pl-12 pr-4 text-base"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Filters & Content */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          {/* Filters */}
          <div className="mb-8 flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Filter className="h-4 w-4" />
              <span className="text-sm font-medium">Фильтры:</span>
            </div>

            {/* Level Filter */}
            <div className="flex flex-wrap gap-2">
              {levelOptions.map((option) => (
                <Button
                  key={option.value}
                  variant={levelFilter === option.value ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setLevelFilter(option.value)}
                >
                  {option.label}
                </Button>
              ))}
            </div>

            <div className="h-6 w-px bg-border" />

            {/* Price Filter */}
            <div className="flex flex-wrap gap-2">
              {priceOptions.map((option) => (
                <Button
                  key={option.value}
                  variant={priceFilter === option.value ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setPriceFilter(option.value)}
                >
                  {option.label}
                </Button>
              ))}
            </div>
          </div>

          {isLoading && <p className="text-muted-foreground">Загрузка курсов...</p>}

          {isError && (
            <div className="rounded-2xl border border-destructive/30 bg-destructive/10 p-4 text-destructive">
              Не удалось загрузить курсы. Проверьте соединение или API.
            </div>
          )}

          {courses && (
            <>
              <p className="mb-6 text-muted-foreground">
                Найдено курсов: <span className="font-medium text-foreground">{courses.length}</span>
              </p>

              {courses.length > 0 ? (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {courses.map((course) => (
                    <CourseCard key={course.id} course={course} />
                  ))}
                </div>
              ) : (
                <div className="rounded-2xl border border-border bg-card p-12 text-center">
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
                    <Search className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <h3 className="mb-2 text-xl font-semibold">Курсы не найдены</h3>
                  <p className="text-muted-foreground">
                    Попробуйте изменить параметры поиска или фильтры
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default Courses;
