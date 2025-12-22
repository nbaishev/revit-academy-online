import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { CourseCard } from '@/components/courses/CourseCard';
import { ArrowRight } from 'lucide-react';
import { api } from '@/lib/api';
import { ApiCourse } from '@/lib/types';

export function FeaturedCourses() {
  const { data: featuredCourses, isLoading } = useQuery<ApiCourse[]>({
    queryKey: ['courses', 'featured'],
    queryFn: async () => {
      const featured = await api.listCourses({ is_featured: true });
      if (featured.length > 0) return featured;
      // Fallback: показываем все курсы, если нет отмеченных как избранные
      return api.listCourses();
    },
  });

  return (
    <section className="bg-muted/30 py-20">
      <div className="container mx-auto px-4">
        <div className="mb-12 flex flex-col items-center justify-between gap-4 md:flex-row">
          <div>
            <h2 className="mb-2 text-3xl font-bold md:text-4xl">
              Популярные курсы
            </h2>
            <p className="text-lg text-muted-foreground">
              Начните обучение с наших лучших программ
            </p>
          </div>
          <Button asChild variant="outline-primary">
            <Link to="/courses">
              Все курсы
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>

        {isLoading && <p className="text-muted-foreground">Загрузка популярных курсов...</p>}

        {featuredCourses && (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {featuredCourses.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
