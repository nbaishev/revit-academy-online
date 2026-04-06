import { useParams, Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useState, useEffect, useMemo, useRef } from 'react';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { Clock, CheckCircle2, Play, Lock, ArrowLeft, Award, Layers, MessageCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Progress } from '@/components/ui/progress';
import { api } from '@/lib/api';
import { formatLessonMaterialLink, parseLessonMaterials } from '@/lib/lessonMaterials';
import { ApiCourse, FreeCourseBenefitStatus } from '@/lib/types';
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

    if (hostname === 'kinescope.io' || hostname === 'player.kinescope.io') {
      if (url.pathname.startsWith('/embed/')) {
        return { type: 'iframe', src: normalized };
      }
      const segments = url.pathname.split('/').filter(Boolean);
      const kinescopeId =
        segments[0] === 'video' || segments[0] === 'embed' ? segments[1] : segments[0];
      if (kinescopeId) {
        return {
          type: 'iframe',
          src: `https://kinescope.io/embed/${kinescopeId}${url.search}`,
        };
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

const normalizeTelegramUsername = (value?: string | null) => {
  const raw = (value ?? '').trim();
  if (!raw) return '';
  return raw
    .replace(/^https?:\/\/t\.me\//i, '')
    .replace(/^t\.me\//i, '')
    .replace(/^@+/, '')
    .replace(/\/+$/, '');
};

const buildTelegramBookingUrl = ({
  username,
  courseTitle,
  userName,
  userEmail,
}: {
  username?: string | null;
  courseTitle: string;
  userName?: string | null;
  userEmail?: string | null;
}) => {
  const normalizedUsername = normalizeTelegramUsername(username);
  if (!normalizedUsername) return '';
  const draftText = `Здравствуйте! Я купил(а) курс "${courseTitle}". Хочу записаться на встречу с ментором. Меня зовут ${userName || 'не указано'}, email: ${userEmail || 'не указан'}.`;
  const params = new URLSearchParams({ text: draftText });
  return `https://t.me/${normalizedUsername}?${params.toString()}`;
};

const CourseDetail = () => {
  const { courseId, lessonId } = useParams<{ courseId: string; lessonId?: string }>();
  const {
    user,
    isLoading: authLoading,
    hasAccessToCourse,
    markLessonComplete,
    markLessonViewed,
    getCourseProgress,
    registerCourseLessonCount,
    refreshMyCourses,
    progress,
  } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedLesson, setSelectedLesson] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isPurchasing, setIsPurchasing] = useState(false);
  const [purchaseError, setPurchaseError] = useState<string | null>(null);
  const hasUserSelected = useRef(false);
  const lastViewedSent = useRef<string | null>(null);
  const handleLoginClick = () => {
    const from = `${location.pathname}${location.search}${location.hash}`;
    navigate('/login', { state: { from } });
  };

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

  const { data: freeCourseBenefitStatus } = useQuery<FreeCourseBenefitStatus | null>({
    queryKey: ['free-course-benefit-status', courseId, user?.id],
    queryFn: () => (courseId ? api.getFreeCourseBenefitStatus(courseId) : Promise.resolve(null)),
    enabled: Boolean(
      courseId &&
        course &&
        user &&
        course.is_free &&
        hasAccessToCourse({ id: course.id, is_free: course.is_free })
    ),
    retry: false,
  });

  const completedLessonIds = useMemo(() => {
    if (!course?.id) return new Set<string>();
    const ids = new Set<string>();
    progress.forEach((entry) => {
      if (entry.course_id !== course.id) return;
      if (entry.is_completed || entry.completed_at) {
        ids.add(String(entry.lesson.id));
      }
    });
    return ids;
  }, [course?.id, progress]);

  const lessons = useMemo(
    () => content?.modules?.flatMap((module) => module.lessons) ?? [],
    [content]
  );
  const contentId = content?.id ?? null;
  const lessonsTotal = useMemo(
    () => content?.modules?.reduce((acc, module) => acc + (module.lessons?.length || 0), 0) ?? 0,
    [content]
  );

  useEffect(() => {
    if (!contentId) return;
    registerCourseLessonCount(contentId, lessonsTotal);
  }, [contentId, lessonsTotal, registerCourseLessonCount]);

  useEffect(() => {
    if (!content || !course?.id || authLoading) return;
    if (lessons.length === 0) return;

    if (lessonId) {
      const lessonExists = lessons.some((lesson) => String(lesson.id) === lessonId);
      if (lessonExists) {
        if (selectedLesson !== lessonId) {
          hasUserSelected.current = true;
          setSelectedLesson(lessonId);
        }
        return;
      }

      if (courseId) {
        navigate(`/courses/${courseId}`, { replace: true });
      }
      return;
    }

    if (hasUserSelected.current) return;

    const lastViewed = progress
      .filter((entry) => entry.course_id === course.id)
      .map((entry) => ({
        lessonId: String(entry.lesson.id),
        viewedAt: entry.last_viewed_at ?? entry.completed_at,
      }))
      .filter((entry) => Boolean(entry.viewedAt))
      .sort(
        (a, b) => new Date(b.viewedAt as string).getTime() - new Date(a.viewedAt as string).getTime()
      )
      .find((entry) => lessons.some((lesson) => lesson.id === entry.lessonId));

    const initialLessonId = lastViewed?.lessonId ?? (lessons[0]?.id ? String(lessons[0].id) : null);
    if (initialLessonId && initialLessonId !== selectedLesson) {
      setSelectedLesson(initialLessonId);
      if (courseId) {
        navigate(`/courses/${courseId}/lessons/${initialLessonId}`, { replace: true });
      }
    }
  }, [content, course?.id, progress, authLoading, selectedLesson, lessons, lessonId, courseId, navigate]);

  useEffect(() => {
    if (!course?.id || !user || !selectedLesson) return;
    if (lastViewedSent.current === selectedLesson) return;
    const hasAccess = hasAccessToCourse({ id: course.id, is_free: course.is_free });
    if (!hasAccess) return;
    lastViewedSent.current = selectedLesson;
    void markLessonViewed(course.id, selectedLesson);
  }, [course?.id, course?.is_free, user, selectedLesson, hasAccessToCourse, markLessonViewed]);

  const selectedLessonData = selectedLesson
    ? content?.modules?.flatMap((m) => m.lessons).find((l) => String(l.id) === selectedLesson)
    : null;
  const selectedLessonIndex = useMemo(
    () => lessons.findIndex((lesson) => String(lesson.id) === selectedLesson),
    [lessons, selectedLesson]
  );
  const previousLesson = selectedLessonIndex > 0 ? lessons[selectedLessonIndex - 1] : null;
  const nextLesson =
    selectedLessonIndex >= 0 && selectedLessonIndex < lessons.length - 1
      ? lessons[selectedLessonIndex + 1]
      : null;
  const lessonMaterials = useMemo(() => {
    if (!selectedLessonData) return [];
    return parseLessonMaterials(
      selectedLessonData.additional_materials ??
        selectedLessonData.additional_materials_url ??
        selectedLessonData.materials_url ??
        ''
    );
  }, [selectedLessonData]);
  const rawVideoUrl =
    selectedLessonData?.video_url ||
    (selectedLessonData as { videoId?: string } | null)?.videoId ||
    '';
  const videoSource = resolveVideoSource(rawVideoUrl);

  const handleLessonSelect = (lessonId: string) => {
    hasUserSelected.current = true;
    setSelectedLesson(lessonId);
    if (courseId) {
      navigate(`/courses/${courseId}/lessons/${lessonId}`);
    }
  };

  const handlePurchase = async () => {
    if (!courseId || course?.published === false) return;
    setIsPurchasing(true);
    setPurchaseError(null);
    try {
      const purchase = await api.purchaseCourse(courseId);
      if (purchase.payment_url) {
        sessionStorage.setItem('pendingPurchaseCourseId', courseId);
        window.location.assign(purchase.payment_url);
        return;
      }
      if (purchase.status === 'paid') {
        await refreshMyCourses();
        navigate(`/courses/${courseId}`, { replace: true });
        return;
      }
      setPurchaseError('Не удалось получить ссылку на оплату.');
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Ошибка при создании платежа.';
      setPurchaseError(message);
    } finally {
      setIsPurchasing(false);
    }
  };

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
  const isFree = course.is_free || course.price === null || course.price === undefined;
  const isOffline = course.delivery_mode === 'offline';
  const isPublished = course.published ?? true;
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
  const currentPriceLabel = currentPriceValue !== null ? currentPriceValue.toLocaleString('ru-RU') : '';
  const effectivePriceLabel = currentPriceLabel || priceLabel;
  const courseProgress = getCourseProgress(course.id);
  const freeCourseBenefitConfigured = Boolean(
    freeCourseBenefitStatus?.is_configured && freeCourseBenefitStatus?.is_active
  );
  const canOpenFreeCourseBenefit = Boolean(
    course.is_free && courseProgress >= 100 && freeCourseBenefitConfigured
  );
  const lessonsCount = course.lessons_count ?? 0;
  const modulesCount = course.modules_count ?? 0;
  const isSelectedCompleted = Boolean(selectedLesson && completedLessonIds.has(selectedLesson));
  const mentorTelegramUsername = normalizeTelegramUsername(course.mentor_telegram_username);
  const telegramBookingUrl = buildTelegramBookingUrl({
    username: mentorTelegramUsername,
    courseTitle: course.title,
    userName: user?.name,
    userEmail: user?.email,
  });

  if (user && hasAccess && content && isOffline) {
    return (
      <Layout>
        <section className="gradient-hero py-12">
          <div className="container mx-auto px-4">
            <Link
              to="/courses"
              className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="h-4 w-4" />
              Все курсы
            </Link>

            <div className="mx-auto max-w-4xl space-y-6">
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary">{course.level}</Badge>
                <Badge className="bg-sky-500 text-white hover:bg-sky-500">Оффлайн</Badge>
              </div>

              <div className="rounded-3xl border border-border bg-card p-6 shadow-card sm:p-8">
                <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-sky-500/10 text-sky-700">
                  <MessageCircle className="h-8 w-8" />
                </div>

                <h1 className="mb-3 text-3xl font-bold md:text-4xl">{course.title}</h1>
                <p className="text-lg text-muted-foreground">{course.description}</p>

                {course.full_description && (
                  <div className="mt-6 rounded-2xl bg-muted/40 p-5 text-sm leading-7 text-foreground/90">
                    {course.full_description}
                  </div>
                )}

                <div className="mt-6 rounded-2xl border border-sky-500/20 bg-sky-500/5 p-5">
                  <h2 className="mb-3 text-lg font-semibold">Как проходит запись</h2>
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <p>После нажатия кнопки откроется Telegram-чат с ментором.</p>
                    <p>Сообщение уже будет заполнено названием курса и вашими контактами.</p>
                    <p>Дальше вы согласуете дату и формат встречи напрямую с ментором.</p>
                  </div>
                </div>

                <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                  {telegramBookingUrl ? (
                    <Button asChild variant="hero" size="lg">
                      <a href={telegramBookingUrl} target="_blank" rel="noreferrer">
                        <MessageCircle className="mr-2 h-4 w-4" />
                        Записаться на встречу
                      </a>
                    </Button>
                  ) : (
                    <Button variant="hero" size="lg" disabled>
                      Записаться на встречу
                    </Button>
                  )}
                  <Button asChild variant="outline" size="lg">
                    <Link to="/dashboard">Вернуться в кабинет</Link>
                  </Button>
                </div>

                {!telegramBookingUrl && (
                  <div className="mt-4 rounded-lg border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-700">
                    Контакт ментора еще не настроен. Обратитесь к администратору.
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      </Layout>
    );
  }

  // User with access - show learning interface
  if (user && hasAccess && content) {
    return (
      <Layout>
        <div className="flex h-full min-h-0 flex-col lg:flex-row">
          {/* Video Area */}
          <div className="flex-1 min-h-0 bg-foreground/5">
            <div className="flex h-full min-h-0 flex-col">
              <div className="flex items-center justify-end border-b border-border bg-card px-4 py-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsSidebarOpen((prev) => !prev)}
                >
                  {isSidebarOpen ? 'Скрыть список' : 'Показать список'}
                </Button>
              </div>
              <div className="flex-1">
                {selectedLessonData ? (
                  <div className="flex h-full flex-col">
                    {/* Video Player */}
                    <div className="px-4 pt-4 sm:px-6 lg:px-10 xl:px-16">
                      <div className="relative mx-auto aspect-video w-full max-w-6xl bg-foreground">
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
                              allow="accelerometer; autoplay; clipboard-write; encrypted-media; fullscreen; gyroscope; picture-in-picture"
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
                        variant={isSelectedCompleted ? 'secondary' : 'default'}
                        disabled={isSelectedCompleted}
                      >
                        <CheckCircle2 className="mr-2 h-4 w-4" />
                        {isSelectedCompleted ? 'Просмотрено' : 'Отметить как просмотренный'}
                      </Button>
                      <div className="mt-6 flex flex-col gap-4">
                        <div className="flex flex-wrap gap-2">
                          <Button
                            type="button"
                            size="sm"
                            variant="outline"
                            disabled={!previousLesson}
                            onClick={() =>
                              previousLesson && handleLessonSelect(String(previousLesson.id))
                            }
                          >
                            Предыдущий урок
                          </Button>
                          <Button
                            type="button"
                            size="sm"
                            variant="outline"
                            disabled={!nextLesson}
                            onClick={() => nextLesson && handleLessonSelect(String(nextLesson.id))}
                          >
                            Следующий урок
                          </Button>
                        </div>
                        <div className="rounded-lg border border-border bg-card p-4">
                          <div className="mb-2 text-sm font-medium">
                            Дополнительные материалы
                          </div>
                          <div className="space-y-3">
                            {lessonMaterials.length ? (
                              lessonMaterials.map((material, index) => (
                                <div
                                  key={`${material.href || material.description}-${index}`}
                                  className="rounded-md border border-border/60 bg-muted/30 p-3"
                                >
                                  <p className="text-sm text-foreground">
                                    {material.description || 'Ссылка на материал'}
                                  </p>
                                  {material.href ? (
                                    <a
                                      href={material.href}
                                      target="_blank"
                                      rel="noreferrer"
                                      title={material.href}
                                      className="mt-1 inline-block max-w-full break-words text-sm font-medium text-primary underline underline-offset-4 hover:text-primary/80"
                                    >
                                      {formatLessonMaterialLink(material.href)}
                                    </a>
                                  ) : (
                                    <p className="mt-1 text-sm text-muted-foreground">
                                      Ссылка не указана
                                    </p>
                                  )}
                                </div>
                              ))
                            ) : (
                              <span className="text-sm text-muted-foreground">
                                Материалы недоступны
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
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
            </div>
          </div>

          {/* Sidebar */}
          {isSidebarOpen && (
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
                    <span className="font-medium">{Math.round(courseProgress)}%</span>
                  </div>
                  <Progress value={courseProgress} className="h-2" />
                </div>
                {canOpenFreeCourseBenefit && (
                  <div className="mt-4 rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-3">
                    <p className="text-sm text-emerald-700">
                      Курс завершен на 100%. Выберите платный курс и получите скидку 10%.
                    </p>
                    <Button asChild size="sm" className="mt-3 w-full">
                      <Link to={`/courses/${course.id}/free-course-benefit`}>
                        Выбрать курс для скидки
                      </Link>
                    </Button>
                    {freeCourseBenefitStatus?.already_claimed && freeCourseBenefitStatus.claimed_target_course && (
                      <p className="mt-2 text-xs text-emerald-700">
                        Скидка уже применена к: {freeCourseBenefitStatus.claimed_target_course.title}
                      </p>
                    )}
                  </div>
                )}
              </div>

              <div className="h-[calc(100%-140px)] overflow-auto">
                <Accordion
                  type="multiple"
                  className="w-full"
                  defaultValue={content.modules?.map((m) => m.id)}
                >
                  {content.modules?.map((module) => (
                    <AccordionItem key={module.id} value={module.id}>
                      <AccordionTrigger className="px-4 py-3 text-sm font-medium hover:no-underline">
                        {module.title}
                      </AccordionTrigger>
                      <AccordionContent className="pb-0">
                        <ul>
                          {module.lessons.map((lesson) => {
                            const lessonId = String(lesson.id);
                            const isCompleted = completedLessonIds.has(lessonId);
                            return (
                              <li key={lesson.id}>
                                <button
                                  onClick={() => handleLessonSelect(lessonId)}
                                  className={`flex w-full items-center gap-3 px-4 py-3 text-left text-sm transition-colors hover:bg-muted ${
                                    selectedLesson === lessonId ? 'bg-primary/10 text-primary' : ''
                                  }`}
                                >
                                  <div
                                    className={`flex h-6 w-6 items-center justify-center rounded-full ${
                                      isCompleted ? 'bg-green-500 text-white' : 'border border-border'
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
          )}
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
                {isOffline && (
                  <Badge className="bg-sky-500 text-white hover:bg-sky-500">
                    Оффлайн
                  </Badge>
                )}
                {isFree && (
                  <Badge className="bg-green-500 text-white hover:bg-green-500">
                    Бесплатно
                  </Badge>
                )}
              </div>

              <h1 className="mb-4 text-3xl font-bold md:text-4xl">{course.title}</h1>
              <p className="mb-6 text-lg text-muted-foreground">{course.description}</p>

              <div className="mb-6 flex flex-wrap items-center gap-6 text-muted-foreground">
                {isOffline ? (
                  <div className="flex items-center gap-2">
                    <MessageCircle className="h-5 w-5" />
                    <span>Оффлайн-встреча с ментором по записи</span>
                  </div>
                ) : (
                  <>
                    <div className="flex items-center gap-2">
                      <Clock className="h-5 w-5" />
                      <span>{lessonsCount} {pluralizeRu(lessonsCount, ['урок', 'урока', 'уроков'])}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Layers className="h-5 w-5" />
                      <span>{modulesCount} {pluralizeRu(modulesCount, ['модуль', 'модуля', 'модулей'])}</span>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* CTA Card */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 rounded-2xl border border-border bg-card p-6 shadow-card">
                <div className="mb-6 aspect-video overflow-hidden rounded-xl bg-muted">
                  <div className="flex h-full items-center justify-center gradient-primary">
                    {isOffline ? (
                      <MessageCircle className="h-16 w-16 text-primary-foreground" />
                    ) : (
                      <Play className="h-16 w-16 text-primary-foreground" />
                    )}
                  </div>
                </div>

                <div className="mb-6 text-center">
                  {isFree ? (
                    <div className="text-3xl font-bold text-green-500">Бесплатно</div>
                  ) : hasDiscount ? (
                    <div className="flex items-baseline justify-center gap-3">
                      <span className="text-lg line-through text-muted-foreground">
                        {priceLabel} сом
                      </span>
                      <span className="text-3xl font-bold">{currentPriceLabel} сом</span>
                    </div>
                  ) : (
                    <div className="text-3xl font-bold">
                      {effectivePriceLabel} сом
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
                      onClick={handlePurchase}
                      disabled={isPurchasing || !isPublished}
                    >
                      {isPublished
                        ? isPurchasing
                          ? 'Создаём платеж...'
                          : isOffline
                            ? 'Купить и записаться'
                            : 'Купить курс'
                        : 'Скоро'}
                    </Button>
                  )
                ) : (
                  <div className="flex flex-col gap-2">
                    <Button onClick={handleLoginClick} variant="hero" size="lg" className="w-full">
                      Войти, чтобы начать
                    </Button>
                  </div>
                )}

                <ul className="mt-6 space-y-3 text-sm">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                    <span>
                      {isOffline
                        ? 'Оффлайн-встреча с ментором'
                        : `${lessonsCount} ${pluralizeRu(lessonsCount, ['видеоурок', 'видеоурока', 'видеоуроков'])}`}
                    </span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                    <span>{isOffline ? 'Запись через Telegram после оплаты' : 'Реальный проект'}</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                    <span>{isOffline ? 'Персональная консультация' : 'Сертификат по окончании'}</span>
                  </li>
                </ul>
                {purchaseError && (
                  <div className="mt-4 rounded-lg border border-destructive/20 bg-destructive/10 px-3 py-2 text-sm text-destructive">
                    {purchaseError}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {isOffline ? (
        course.full_description ? (
          <section className="bg-muted/30 py-12">
            <div className="container mx-auto px-4">
              <div className="mx-auto max-w-4xl rounded-2xl border border-border bg-card p-6 shadow-card">
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <Award className="h-5 w-5 text-primary" />
                  </div>
                  <h2 className="text-2xl font-semibold">О курсе</h2>
                </div>
                <p className="whitespace-pre-line text-muted-foreground">{course.full_description}</p>
              </div>
            </div>
          </section>
        ) : null
      ) : (
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
      )}
    </Layout>
  );
};

export default CourseDetail;
