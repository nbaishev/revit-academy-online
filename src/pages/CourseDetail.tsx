import { useParams, Link, Navigate } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { getCourseById } from '@/data/courses';
import {
  Clock,
  Users,
  Star,
  BookOpen,
  CheckCircle2,
  Play,
  Lock,
  ArrowLeft,
  Target,
  Award,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Progress } from '@/components/ui/progress';
import { useState } from 'react';

const CourseDetail = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const { user, login, hasAccessToCourse, markLessonComplete, getCourseProgress } = useAuth();
  const [selectedLesson, setSelectedLesson] = useState<string | null>(null);

  const course = courseId ? getCourseById(courseId) : undefined;

  if (!course) {
    return <Navigate to="/courses" replace />;
  }

  const hasAccess = hasAccessToCourse(course.id);
  const isFree = course.price === null;
  const progress = getCourseProgress(course.id);

  // Find selected lesson data
  const selectedLessonData = selectedLesson
    ? course.modules
        .flatMap((m) => m.lessons)
        .find((l) => l.id === selectedLesson)
    : null;

  // User with access - show learning interface
  if (user && hasAccess) {
    return (
      <Layout showFooter={false}>
        <div className="flex h-[calc(100vh-4rem)] flex-col lg:flex-row">
          {/* Video Area */}
          <div className="flex-1 bg-foreground/5">
            {selectedLessonData ? (
              <div className="flex h-full flex-col">
                {/* Video Player */}
                <div className="relative aspect-video w-full bg-foreground">
                  <iframe
                    src={`https://www.youtube.com/embed/${selectedLessonData.videoId}`}
                    title={selectedLessonData.title}
                    className="absolute inset-0 h-full w-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>

                {/* Lesson Info */}
                <div className="flex-1 overflow-auto p-6">
                  <h1 className="mb-2 text-2xl font-bold">{selectedLessonData.title}</h1>
                  <div className="mb-4 flex items-center gap-4 text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {selectedLessonData.duration}
                    </span>
                  </div>
                  <Button
                    onClick={() => markLessonComplete(course.id, selectedLessonData.id)}
                    variant="default"
                  >
                    <CheckCircle2 className="mr-2 h-4 w-4" />
                    Отметить как просмотренный
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex h-full items-center justify-center p-8">
                <div className="text-center">
                  <Play className="mx-auto mb-4 h-16 w-16 text-muted-foreground" />
                  <h2 className="mb-2 text-xl font-semibold">Выберите урок</h2>
                  <p className="text-muted-foreground">
                    Выберите урок из списка справа, чтобы начать обучение
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="w-full border-l border-border bg-card lg:w-96">
            <div className="border-b border-border p-4">
              <Link
                to="/courses"
                className="mb-4 flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
              >
                <ArrowLeft className="h-4 w-4" />
                Назад к курсам
              </Link>
              <h2 className="font-semibold">{course.title}</h2>
              <div className="mt-2">
                <div className="mb-1 flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Прогресс</span>
                  <span className="font-medium">{Math.round(progress)}%</span>
                </div>
                <Progress value={progress} className="h-2" />
              </div>
            </div>

            <div className="h-[calc(100%-140px)] overflow-auto">
              <Accordion type="multiple" className="w-full" defaultValue={course.modules.map(m => m.id)}>
                {course.modules.map((module) => (
                  <AccordionItem key={module.id} value={module.id}>
                    <AccordionTrigger className="px-4 py-3 text-sm font-medium hover:no-underline">
                      {module.title}
                    </AccordionTrigger>
                    <AccordionContent className="pb-0">
                      <ul>
                        {module.lessons.map((lesson) => {
                          const isCompleted = user?.progress[course.id]?.completedLessons.includes(lesson.id);
                          return (
                            <li key={lesson.id}>
                              <button
                                onClick={() => setSelectedLesson(lesson.id)}
                                className={`flex w-full items-center gap-3 px-4 py-3 text-left text-sm transition-colors hover:bg-muted ${
                                  selectedLesson === lesson.id ? 'bg-primary/10 text-primary' : ''
                                }`}
                              >
                                <div
                                  className={`flex h-6 w-6 items-center justify-center rounded-full ${
                                    isCompleted
                                      ? 'bg-green-500 text-white'
                                      : 'border border-border'
                                  }`}
                                >
                                  {isCompleted ? (
                                    <CheckCircle2 className="h-4 w-4" />
                                  ) : (
                                    <Play className="h-3 w-3" />
                                  )}
                                </div>
                                <div className="flex-1">
                                  <div className="line-clamp-1">{lesson.title}</div>
                                  <div className="text-xs text-muted-foreground">
                                    {lesson.duration}
                                  </div>
                                </div>
                              </button>
                            </li>
                          );
                        })}
                      </ul>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  // Guest or user without access - show landing page
  return (
    <Layout>
      {/* Hero */}
      <section className="gradient-hero py-12">
        <div className="container mx-auto px-4">
          <Link
            to="/courses"
            className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            Все курсы
          </Link>

          <div className="grid gap-8 lg:grid-cols-3">
            {/* Course Info */}
            <div className="lg:col-span-2">
              <div className="mb-4 flex flex-wrap gap-2">
                <Badge variant="secondary">{course.level}</Badge>
                {isFree && (
                  <Badge className="bg-green-500 text-white hover:bg-green-500">
                    Бесплатно
                  </Badge>
                )}
              </div>

              <h1 className="mb-4 text-3xl font-bold md:text-4xl">{course.title}</h1>
              <p className="mb-6 text-lg text-muted-foreground">{course.description}</p>

              {/* Stats */}
              <div className="mb-6 flex flex-wrap items-center gap-6 text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Star className="h-5 w-5 fill-accent text-accent" />
                  <span className="font-medium text-foreground">{course.rating}</span>
                  <span>({course.studentsCount} студентов)</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  <span>{course.duration}</span>
                </div>
                <div className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  <span>{course.lessonsCount} уроков</span>
                </div>
              </div>

              {/* Instructor */}
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-lg font-medium text-primary">
                  {course.instructor.charAt(0)}
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Преподаватель</div>
                  <div className="font-medium">{course.instructor}</div>
                </div>
              </div>
            </div>

            {/* CTA Card */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 rounded-2xl border border-border bg-card p-6 shadow-card">
                <div className="mb-6 aspect-video overflow-hidden rounded-xl bg-muted">
                  <div className="flex h-full items-center justify-center gradient-primary">
                    <Play className="h-16 w-16 text-primary-foreground" />
                  </div>
                </div>

                <div className="mb-6 text-center">
                  {isFree ? (
                    <div className="text-3xl font-bold text-green-500">Бесплатно</div>
                  ) : (
                    <div className="text-3xl font-bold">
                      {course.price?.toLocaleString('ru-RU')} ₽
                    </div>
                  )}
                </div>

                {user ? (
                  isFree ? (
                    <Button variant="hero" size="lg" className="w-full">
                      Начать обучение
                    </Button>
                  ) : (
                    <Button variant="hero" size="lg" className="w-full">
                      Купить курс
                    </Button>
                  )
                ) : (
                  <Button onClick={login} variant="hero" size="lg" className="w-full">
                    Войти, чтобы начать
                  </Button>
                )}

                <ul className="mt-6 space-y-3 text-sm">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                    <span>{course.lessonsCount} видеоуроков</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                    <span>Доступ навсегда</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                    <span>Сертификат по окончании</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Outcomes */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="grid gap-8 lg:grid-cols-2">
            {/* What you'll learn */}
            <div className="rounded-2xl border border-border bg-card p-6">
              <div className="mb-6 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <Target className="h-5 w-5 text-primary" />
                </div>
                <h2 className="text-xl font-semibold">Чему вы научитесь</h2>
              </div>
              <ul className="grid gap-3 md:grid-cols-2">
                {course.outcomes.map((outcome, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-green-500" />
                    <span>{outcome}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Target Audience */}
            <div className="rounded-2xl border border-border bg-card p-6">
              <div className="mb-6 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <Users className="h-5 w-5 text-primary" />
                </div>
                <h2 className="text-xl font-semibold">Для кого этот курс</h2>
              </div>
              <ul className="space-y-3">
                {course.targetAudience.map((audience, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                    <span>{audience}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Program */}
      <section className="bg-muted/30 py-12">
        <div className="container mx-auto px-4">
          <div className="mb-8 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <Award className="h-5 w-5 text-primary" />
            </div>
            <h2 className="text-2xl font-semibold">Программа курса</h2>
          </div>

          <Accordion type="multiple" className="space-y-4">
            {course.modules.map((module, moduleIndex) => (
              <AccordionItem
                key={module.id}
                value={module.id}
                className="overflow-hidden rounded-xl border border-border bg-card"
              >
                <AccordionTrigger className="px-6 py-4 hover:no-underline">
                  <div className="flex items-center gap-4">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-sm font-semibold text-primary">
                      {moduleIndex + 1}
                    </div>
                    <div className="text-left">
                      <div className="font-semibold">{module.title}</div>
                      <div className="text-sm text-muted-foreground">
                        {module.lessons.length} уроков
                      </div>
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="border-t border-border px-6 pb-4 pt-0">
                  <ul className="divide-y divide-border">
                    {module.lessons.map((lesson, lessonIndex) => (
                      <li
                        key={lesson.id}
                        className="flex items-center justify-between py-3"
                      >
                        <div className="flex items-center gap-3">
                          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-muted text-xs">
                            {lessonIndex + 1}
                          </div>
                          <span>{lesson.title}</span>
                        </div>
                        <div className="flex items-center gap-3 text-sm text-muted-foreground">
                          <span>{lesson.duration}</span>
                          {!hasAccess && <Lock className="h-4 w-4" />}
                        </div>
                      </li>
                    ))}
                  </ul>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>
    </Layout>
  );
};

export default CourseDetail;
