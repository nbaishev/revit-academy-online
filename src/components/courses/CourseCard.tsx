import { Link } from 'react-router-dom';
import { ApiCourse } from '@/lib/types';
import { BookOpen, Coins, Layers, MessageCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn, pluralizeRu } from '@/lib/utils';

interface CourseCardProps {
  course: ApiCourse;
  className?: string;
}

export function CourseCard({ course, className = '' }: CourseCardProps) {
  const isFree = course.is_free || course.price === null || course.price === undefined;
  const isOffline = course.delivery_mode === 'offline';
  const lessonsCount = course.lessons_count ?? 0;
  const modulesCount = course.modules_count ?? 0;
  const priceValue = typeof course.price === 'number' ? course.price : null;
  const discountValue = typeof course.discount_price === 'number' ? course.discount_price : null;
  const currentPriceValue =
    typeof course.current_price === 'number'
      ? course.current_price
      : !isFree &&
          priceValue !== null &&
          discountValue !== null &&
          discountValue > 0 &&
          discountValue < priceValue
        ? discountValue
        : priceValue;
  const hasDiscount =
    !isFree &&
    priceValue !== null &&
    currentPriceValue !== null &&
    currentPriceValue < priceValue;
  const priceLabel = priceValue !== null ? priceValue.toLocaleString('ru-RU') : '';
  const currentPriceLabel =
    currentPriceValue !== null ? currentPriceValue.toLocaleString('ru-RU') : '';
  const effectivePriceLabel = currentPriceLabel || priceLabel;
  const isPublished = course.published ?? true;

  return (
    <Link
      to={`/courses/${course.id}`}
      className={cn(
        'group flex flex-col overflow-hidden rounded-2xl bg-card shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-card-hover',
        className,
      )}
    >
      <div className="relative aspect-video overflow-hidden rounded-t-2xl bg-muted">
        {course.preview_image ? (
          <img
            src={course.preview_image}
            alt={course.title}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center gradient-primary opacity-80">
            <BookOpen className="h-16 w-16 text-primary-foreground/50" />
          </div>
        )}

        <div className="absolute right-3 top-3">
          <Badge
            variant={isFree ? 'default' : 'secondary'}
            className={`px-3 py-1 text-sm font-semibold ${
              isFree ? 'bg-green-500 text-white hover:bg-green-500' : 'bg-background/90 text-foreground backdrop-blur-sm'
            }`}
          >
            {isFree ? (
              'Бесплатно'
            ) : hasDiscount ? (
              <span className="flex items-baseline gap-2">
                <span className="text-xs line-through opacity-70">{priceLabel}</span>
                <span className="font-semibold">{currentPriceLabel} сом</span>
              </span>
            ) : (
              `${effectivePriceLabel} сом`
            )}
          </Badge>
        </div>

        <div className="absolute left-3 top-3 flex flex-col gap-2">
          <Badge variant="secondary" className="bg-background/90 backdrop-blur-sm">
            {course.level}
          </Badge>
          {isOffline && (
            <Badge className="bg-sky-500 text-white hover:bg-sky-500">
              Оффлайн
            </Badge>
          )}
          {!isPublished && (
            <Badge className="bg-amber-500 text-white hover:bg-amber-500">
              Скоро
            </Badge>
          )}
        </div>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <h3 className="mb-2 text-lg font-semibold leading-tight transition-colors group-hover:text-primary">
          {course.title}
        </h3>
        <p className="mb-4 flex-1 text-sm text-muted-foreground line-clamp-2">
          {course.description}
        </p>

        <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
          {isOffline ? (
            <div className="flex items-center gap-1">
              <MessageCircle className="h-4 w-4" />
              <span>Запись к ментору через Telegram</span>
            </div>
          ) : (
            <>
              <div className="flex items-center gap-1">
                <BookOpen className="h-4 w-4" />
                <span>
                  {lessonsCount} {pluralizeRu(lessonsCount, ['урок', 'урока', 'уроков'])}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <Layers className="h-4 w-4" />
                <span>
                  {modulesCount} {pluralizeRu(modulesCount, ['модуль', 'модуля', 'модулей'])}
                </span>
              </div>
            </>
          )}
          {!isFree && (
            <div className="flex items-center gap-1">
              <Coins className="h-4 w-4" />
              {hasDiscount ? (
                <span className="flex items-baseline gap-2">
                  <span className="line-through text-muted-foreground">{priceLabel}</span>
                  <span className="font-medium text-foreground">{currentPriceLabel}</span>
                </span>
              ) : (
                <span>{effectivePriceLabel}</span>
              )}
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
