import { Link } from 'react-router-dom';
import { Course } from '@/data/courses';
import { Clock, Users, Star, BookOpen } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface CourseCardProps {
  course: Course;
  className?: string;
}

export function CourseCard({ course, className = '' }: CourseCardProps) {
  const isFree = course.price === null;

  return (
    <Link
      to={`/courses/${course.id}`}
      className={`group flex flex-col overflow-hidden rounded-2xl bg-card shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-card-hover ${className}`}
    >
      {/* Thumbnail */}
      <div className="relative aspect-video overflow-hidden bg-muted">
        <div className="absolute inset-0 flex items-center justify-center gradient-primary opacity-80">
          <BookOpen className="h-16 w-16 text-primary-foreground/50" />
        </div>
        
        {/* Price Badge */}
        <div className="absolute right-3 top-3">
          <Badge
            variant={isFree ? 'default' : 'secondary'}
            className={`px-3 py-1 text-sm font-semibold ${
              isFree 
                ? 'bg-green-500 text-white hover:bg-green-500' 
                : 'bg-background/90 text-foreground backdrop-blur-sm'
            }`}
          >
            {isFree ? 'Бесплатно' : `${course.price?.toLocaleString('ru-RU')} ₽`}
          </Badge>
        </div>

        {/* Level Badge */}
        <div className="absolute left-3 top-3">
          <Badge variant="secondary" className="bg-background/90 backdrop-blur-sm">
            {course.level}
          </Badge>
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col p-5">
        <h3 className="mb-2 text-lg font-semibold leading-tight transition-colors group-hover:text-primary">
          {course.title}
        </h3>
        <p className="mb-4 flex-1 text-sm text-muted-foreground line-clamp-2">
          {course.shortDescription}
        </p>

        {/* Stats */}
        <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            <span>{course.duration}</span>
          </div>
          <div className="flex items-center gap-1">
            <BookOpen className="h-4 w-4" />
            <span>{course.lessonsCount} уроков</span>
          </div>
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4 fill-accent text-accent" />
            <span>{course.rating}</span>
          </div>
        </div>

        {/* Instructor */}
        <div className="mt-4 flex items-center gap-2 border-t border-border pt-4">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-sm font-medium text-primary">
            {course.instructor.charAt(0)}
          </div>
          <span className="text-sm text-muted-foreground">{course.instructor}</span>
        </div>
      </div>
    </Link>
  );
}
