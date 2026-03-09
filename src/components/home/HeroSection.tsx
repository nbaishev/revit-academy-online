import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Play, ArrowRight, CheckCircle2 } from 'lucide-react';

export function HeroSection() {
  const benefits = [
    'Структурированные видеоуроки',
    'От основ до продвинутого уровня',
    'Практические проекты',
  ];

  return (
    <section className="relative overflow-hidden gradient-hero">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -right-20 -top-20 h-96 w-96 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute -bottom-20 -left-20 h-96 w-96 rounded-full bg-accent/5 blur-3xl" />
      </div>

      <div className="container relative mx-auto px-4 py-20 md:py-32">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          {/* Content */}
          <div className="animate-slide-up">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex h-2 w-2 rounded-full bg-primary"></span>
              </span>
              Более 70 студентов уже обучаются
            </div>

            <h1 className="mb-6 text-4xl font-bold leading-tight md:text-5xl lg:text-6xl">
              Онлайн{' '}
              <span className="inline-block rounded-lg bg-blue-600 px-3 py-1 font-bold text-white shadow-lg">
                BIM платформа
              </span>
              <br />
              нового поколения
            </h1>

            <p className="mb-8 max-w-lg text-lg text-muted-foreground md:text-xl">
              Профессиональные курсы по BIM-проектированию. 
              Учитесь в удобном темпе с практическими заданиями и поддержкой экспертов.
            </p>

            {/* Benefits */}
            <ul className="mb-8 space-y-3">
              {benefits.map((benefit, index) => (
                <li key={index} className="flex items-center gap-3 text-muted-foreground">
                  <CheckCircle2 className="h-5 w-5 text-primary" />
                  <span>{benefit}</span>
                </li>
              ))}
            </ul>

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-4">
              <Button asChild variant="hero" size="xl">
                <Link to="/courses">
                  Начать обучение
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <div className="flex flex-wrap gap-3">
                <Button asChild variant="outline-primary" size="xl">
                  <Link to="/courses/2">
                    <Play className="mr-2 h-5 w-5" />
                    Бесплатный курс
                  </Link>
                </Button>
                <Button
                  asChild
                  variant="default"
                  size="xl"
                  className="shadow-lg shadow-primary/25 ring-2 ring-primary/20"
                >
                  <Link to="/entrance-test">
                    Пройти тест
                  </Link>
                </Button>
              </div>
            </div>
          </div>

          {/* Visual */}
          <div className="relative hidden lg:block">
            <div className="relative animate-float">
              {/* Main Card */}
              <div className="relative z-10 rounded-2xl bg-card p-6 shadow-card-hover">
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl gradient-primary">
                    <svg className="h-6 w-6 text-primary-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                  </div>
                  <div>
                    <div className="font-semibold">BIM-проектирование</div>
                    <div className="text-sm text-muted-foreground">Autodesk Revit 2024</div>
                  </div>
                </div>
                
                {/* Progress */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Прогресс курса</span>
                    <span className="font-medium">65%</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-muted">
                    <div className="h-full w-[65%] rounded-full gradient-primary" />
                  </div>
                </div>

                {/* Lesson Preview */}
                <div className="mt-4 rounded-lg bg-muted/50 p-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                      <Play className="h-4 w-4 text-primary" />
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-medium">Урок 12: Стены и перегородки</div>
                      <div className="text-xs text-muted-foreground">25:00</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating Elements */}
              <div className="absolute -right-4 -top-4 rounded-xl bg-accent p-3 text-accent-foreground shadow-lg">
                <div className="text-2xl font-bold">4.8</div>
                <div className="flex text-xs">
                  {'★★★★★'.split('').map((star, i) => (
                    <span key={i}>★</span>
                  ))}
                </div>
              </div>

              <div className="absolute -bottom-4 -left-4 rounded-xl bg-card p-4 shadow-lg">
                <div className="flex items-center gap-2">
                  <div className="flex -space-x-2">
                    {[1, 2, 3].map((i) => (
                      <div
                        key={i}
                        className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-card gradient-primary text-xs text-primary-foreground"
                      >
                        {String.fromCharCode(64 + i)}
                      </div>
                    ))}
                  </div>
                  <span className="text-sm text-muted-foreground">+1.5K студентов</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
