import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { CourseCard } from '@/components/courses/CourseCard';
import { getFeaturedCourses } from '@/data/courses';
import { ArrowRight } from 'lucide-react';

export function FeaturedCourses() {
  const featuredCourses = getFeaturedCourses();

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

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {featuredCourses.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      </div>
    </section>
  );
}
