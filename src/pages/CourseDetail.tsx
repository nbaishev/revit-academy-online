import { useParams, Link, Navigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useState, useEffect } from 'react';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { LegalConsentText } from '@/components/legal/LegalConsentText';
import { useAuth } from '@/contexts/AuthContext';
import { Clock, CheckCircle2, Play, Lock, ArrowLeft, Award, Layers } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Progress } from '@/components/ui/progress';
import { api } from '@/lib/api';
import { ApiCourse } from '@/lib/types';
import { pluralizeRu } from '@/lib/utils';

type VideoSource = { type: 'iframe'; src: string } | { type: 'file'; src: string };

const normalizeVideoUrl = (value: string) => {
  if (value.startsWith('//')) return `https:${value}`;
  if (/^https?:\/\//i.test(value)) return value;
  if (value.includes('.')) return `https://${value}`;
  return value;
};

const resolveVideoSource = (rawVideoUrl?: string): VideoSource | null => {
  const raw = (rawVideoUrl ?? '').trim();
  if (!raw) return null;

  const normalized = normalizeVideoUrl(raw);
  if (!/^https?:\/\//i.test(normalized)) {
    return { type: 'iframe', src: `https://www.youtube.com/embed/${normalized}` };
  }

  try {
    const url = new URL(normalized);
    const hostname = url.hostname.replace(/^www\./i, '').toLowerCase();

    if (hostname === 'youtu.be') {
      const id = url.pathname.split('/').filter(Boolean)[0];
      if (id) return { type: 'iframe', src: `https://www.youtube.com/embed/${id}` };
    }

    if (
      hostname === 'youtube.com' ||
      hostname === 'm.youtube.com' ||
      hostname === 'youtube-nocookie.com'
    ) {
      if (url.pathname.startsWith('/embed/')) {
        return { type: 'iframe', src: normalized };
      }
      if (url.pathname.startsWith('/shorts/') || url.pathname.startsWith('/live/')) {
        const id = url.pathname.split('/').filter(Boolean)[1];
        if (id) return { type: 'iframe', src: `https://www.youtube.com/embed/${id}` };
      }
      if (url.pathname === '/watch') {
        const id = url.searchParams.get('v');
        if (id) return { type: 'iframe', src: `https://www.youtube.com/embed/${id}` };
      }
    }

    if (hostname === 'vimeo.com' || hostname === 'player.vimeo.com') {
      if (hostname === 'player.vimeo.com' && url.pathname.startsWith('/video/')) {
        return { type: 'iframe', src: normalized };
      }
      const vimeoId = url.pathname.split('/').filter(Boolean)[0];
      if (vimeoId) {
        return { type: 'iframe', src: `https://player.vimeo.com/video/${vimeoId}` };
      }
    }

    if (/\.(mp4|webm|ogg|mov|m3u8)$/i.test(url.pathname)) {
      return { type: 'file', src: normalized };
    }

    return { type: 'iframe', src: normalized };
  } catch {
    return { type: 'iframe', src: raw };
  }
};

const CourseDetail = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const {
    user,
    login,
    hasAccessToCourse,
    markLessonComplete,
    getCourseProgress,
    registerCourseLessonCount,
    progress,
    refreshMyCourses,
  } = useAuth();
  const [selectedLesson, setSelectedLesson] = useState<string | null>(null);

  const { data: course, isLoading, isError } = useQuery<ApiCourse | null>({
    queryKey: ['course', courseId],
    queryFn: () => (courseId ? api.getCourse(courseId) : Promise.resolve(null)),
    enabled: Boolean(courseId),
  });

  const { data: content } = useQuery<ApiCourse | null>({
    queryKey: ['course-content', courseId, user?.id],
    queryFn: () => (courseId ? api.getCourseContent(courseId) : Promise.resolve(null)),
    enabled: Boolean(
      courseId &&
        course &&
        (course.is_free || (user && hasAccessToCourse({ id: course.id, is_free: course.is_free })))
    ),
  });

  useEffect(() => {
    if (content) {
      const lessonsTotal =
        content.modules?.reduce((acc, module) => acc + (module.lessons?.length || 0), 0) ?? 0;
      registerCourseLessonCount(content.id, lessonsTotal);
    }
  }, [content, registerCourseLessonCount]);

  const selectedLessonData = selectedLesson
    ? content?.modules?.flatMap((m) => m.lessons).find((l) => l.id === selectedLesson)
    : null;
  const rawVideoUrl =
    selectedLessonData?.video_url ||
    (selectedLessonData as { videoId?: string } | null)?.videoId ||
    '';
  const videoSource = resolveVideoSource(rawVideoUrl);

  if (!courseId || isError) {
    return <Navigate to="/courses" replace />;
  }

  if (isLoading || !course) {
    return (
      <Layout>
        <div className="flex min-h-[60vh] items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        </div>
      </Layout>
    );
  }

  const hasAccess = hasAccessToCourse({ id: course.id, is_free: course.is_free });
  const isFree = course.is_free || course.price === null;
  const courseProgress = getCourseProgress(course.id);
  const lessonsCount = course.lessons_count ?? 0;
  const modulesCount = course.modules_count ?? 0;

  // User with access - show learning interface
  if (user && hasAccess && content) {
    return (
      <Layout showFooter={false}>
        <div className="flex h-[calc(100vh-4rem)] flex-col lg:flex-row">
          {/* Video Area */}
          <div className="flex-1 bg-foreground/5">
            {selectedLessonData ? (
              <div className="flex h-full flex-col">
                {/* Video Player */}
                <div className="relative aspect-video w-full bg-foreground">
                  {videoSource ? (
                    videoSource.type === 'file' ? (
                      <video
                        src={videoSource.src}
                        className="absolute inset-0 h-full w-full"
                        controls
                        playsInline
                      />
                    ) : (
                      <iframe
                        src={videoSource.src}
                        title={selectedLessonData.title}
                        className="absolute inset-0 h-full w-full"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    )
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-sm text-muted-foreground">
                      <div className="text-center">
                        <Play className="mx-auto mb-2 h-8 w-8" />
                        Видео недоступно
                      </div>
                    </div>
                  )}
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
                <Progress value={courseProgress} className="h-2" />
              </div>
            </div>

            <div className="h-[calc(100%-140px)] overflow-auto">
              <Accordion type="multiple" className="w-full" defaultValue={content.modules?.map(m => m.id)}>
                {content.modules?.map((module) => (
                  <AccordionItem key={module.id} value={module.id}>
                    <AccordionTrigger className="px-4 py-3 text-sm font-medium hover:no-underline">
                      {module.title}
                    </AccordionTrigger>
                    <AccordionContent className="pb-0">
                      <ul>
                        {module.lessons.map((lesson) => {
                          const isCompleted = progress.some(
                            (p) => p.course_id === course.id && p.lesson.id === lesson.id && p.is_completed
                          );
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
                                    isCompleted ? 'bg-green-500 text-white' : 'border border-border'
                                  }`}
                                >
                                  {isCompleted ? <CheckCircle2 className="h-4 w-4" /> : <Play className="h-3 w-3" />}
                                </div>
                                <div className="flex-1">
                                  <div className="line-clamp-1">{lesson.title}</div>
                                  <div className="text-xs text-muted-foreground">{lesson.duration}</div>
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

              <div className="mb-6 flex flex-wrap items-center gap-6 text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  <span>{lessonsCount} {pluralizeRu(lessonsCount, ['урок', 'урока', 'уроков'])}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Layers className="h-5 w-5" />
                  <span>{modulesCount} {pluralizeRu(modulesCount, ['модуль', 'модуля', 'модулей'])}</span>
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
                      {course.price?.toLocaleString('ru-RU')} сом
                    </div>
                  )}
                </div>

                {user ? (
                  hasAccess ? (
                    <Button variant="hero" size="lg" className="w-full">
                      Продолжить
                    </Button>
                  ) : isFree ? (
                    <Button variant="hero" size="lg" className="w-full">
                      Начать обучение
                    </Button>
                  ) : (
                    <Button
                      variant="hero"
                      size="lg"
                      className="w-full"
                      disabled
                    >
                      Купить курс
                    </Button>
                  )
                ) : (
                  <div className="flex flex-col gap-2">
                    <Button onClick={() => login()} variant="hero" size="lg" className="w-full">
                      Войти, чтобы начать
                    </Button>
                    <LegalConsentText className="text-center" />
                  </div>
                )}

                <ul className="mt-6 space-y-3 text-sm">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                    <span>{lessonsCount} {pluralizeRu(lessonsCount, ['видеоурок', 'видеоурока', 'видеоуроков'])}</span>
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
            {course.modules?.map((module, moduleIndex) => (
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
                        {module.lessons.length} {pluralizeRu(module.lessons.length, ['урок', 'урока', 'уроков'])}
                      </div>
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="border-t border-border px-6 pb-4 pt-0">
                  <ul className="divide-y divide-border">
                    {module.lessons.map((lesson, lessonIndex) => (
                      <li key={lesson.id} className="flex items-center justify-between py-3">
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
