import { useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Server,
  Shield,
  Zap,
  HardDrive,
  Users,
  Cloud,
  Clock,
  Wrench,
  CheckCircle2,
  MessageCircle,
  Monitor,
  ArrowRight,
  Quote,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

const TELEGRAM_LINK = 'https://t.me/FreedomBIM';

const revitPlans = [
  {
    name: 'BIM 1',
    subtitle: 'Для команды из 2–4 человек',
    price: '100',
    specs: [
      { label: 'CPU', value: '4' },
      { label: 'RAM', value: '4 Гб' },
      { label: 'NVMe', value: '10 Гб' },
      { label: 'Канал', value: '100 Мбит/с' },
      { label: 'Бэкап', value: 'глубина — 4 дня' },
    ],
  },
  {
    name: 'BIM 2',
    subtitle: 'Для команды из 5–8 человек',
    price: '130',
    popular: true,
    specs: [
      { label: 'CPU', value: '6' },
      { label: 'RAM', value: '12 Гб' },
      { label: 'NVMe', value: '20 Гб' },
      { label: 'Канал', value: '200 Мбит/с' },
      { label: 'Бэкап', value: 'глубина — 4 дня' },
    ],
  },
  {
    name: 'BIM 3',
    subtitle: 'Для команды из 9–15 человек',
    price: '170',
    specs: [
      { label: 'CPU', value: '8' },
      { label: 'RAM', value: '16 Гб' },
      { label: 'NVMe', value: 'от 30 Гб' },
      { label: 'Канал', value: '300 Мбит/с' },
      { label: 'Бэкап', value: 'глубина — 4 дня' },
    ],
  },
  {
    name: 'BIM 4',
    subtitle: 'Для команды от 15 человек',
    price: 'от 200',
    specs: [
      { label: 'CPU', value: '12' },
      { label: 'RAM', value: '24 Гб' },
      { label: 'NVMe', value: 'от 50 Гб' },
      { label: 'Канал', value: '500 бит/с' },
      { label: 'Бэкап', value: 'глубина — 4 дня' },
    ],
  },
];

const archicadPlans = [
  {
    name: 'Team S',
    subtitle: 'Для команды из 2–4 человек',
    price: 'от 1 000',
    specs: [

    ],
  },
  {
    name: 'Team M',
    subtitle: 'Для команды из 5–15 человек',
    price: 'от 2 000',
    popular: true,
    specs: [

    ],
  },
  {
    name: 'Team L',
    subtitle: 'Для команды от 15 человек',
    price: 'от 3 500',
    specs: [

    ],
  },
];

const advantages = [
  {
    icon: Shield,
    title: 'Единая BIM-модель',
    description:
      'Все участники проекта работают с актуальной BIM-моделью в одной цифровой среде. Изменения синхронизируются и доступны всей команде.',
  },
  {
    icon: Wrench,
    title: 'BIM-координация дисциплин',
    description:
      'Архитектура, конструкции и инженерные разделы ведутся в единой BIM-логике. Совместимо с рабочими процессами на базе Autodesk и Graphisoft.',
  },
  {
    icon: Zap,
    title: 'Контроль BIM-данных',
    description:
      'Управление версиями, доступами и историей изменений проекта. Все BIM-данные структурированы, защищены и доступны в нужный момент.',
  },
];

const features = [
  {
    icon: Cloud,
    title: 'Уменьшение ошибок',
    description: 'Работа в единой среде позволяет выявлять коллизии на раннем этапе.',
  },
  {
    icon: HardDrive,
    title: 'Повышение эффективности команды',
    description:
      'Комментарии прямо в модели, нет бесконечных PDF/WhatsApp правок.',
  },
  {
    icon: Server,
    title: 'Контроль данных',
    description:
      'История изменений и контроль версий, видно кто и когда изменил.',
  },
  {
    icon: Clock,
    title: 'Ускорение работы',
    description:
      'Меньше ошибок - меньше переделок.',
  },
];

const testimonials = [
  {
    author: 'Джаманкулов Эдил',
    company: 'Arlan Company',
    meta: 'Сертифицированный Главный Архитектор, Бишкек, Кыргызстан',
    review: [
      'Установили сервер с ArchiCAD Teamwork и Revit Server — это полностью изменило работу. Теперь архитекторы и инженеры всех направлений работают в едином пространстве: обмениваются файлами без задержек, всё синхронизируется в реальном времени, ничего не теряется и не дублируется.',
      'ArchiCAD Teamwork дал удобную параллельную работу над моделями, а Revit Server стал настоящим спасением для инженеров. Рекомендую.',
    ],
  },
  {
    author: 'Кривенков Павел Дмитриевич',
    company: 'ООО "ОЛЛИНБИМ"',
    meta: 'Генеральный директор, Москва, РФ',
    review: [
      'Наша компания занимается крупными объектами, где BIM — не роскошь, а необходимость. Команда у нас большая, до 20 человек, и все работают удалённо: кто в Москве, кто в регионах, у всех разное качество интернета. Когда встал вопрос о стабильной совместной работе в Revit, долго искали решение, которое не подведёт в самый ответственный момент.',
      'Остановились на Revit Server. И ни разу не пожалели.',
      'Система работает как часы. При нашей географии и разной скорости интернета доступ к моделям всегда стабильный, без зависаний и потери данных. 20 человек спокойно ведут большие объекты параллельно — никто никого не ждёт, никаких «залоченных» файлов и копий с приставкой `final_3`. Всё централизовано, всё под контролем.',
      'Но главное, что хочется отметить — это техподдержка. В Москве привыкли к сервису, но здесь ребята превзошли ожидания. Реагируют быстро, вопросы решают по делу, без воды. С такими партнёрами чувствуешь себя спокойно.',
      'Если ваша команда работает в Revit, особенно если вы распределены географически, — рекомендую. Это решение, которое реально вывозит большие проекты без головной боли.',
    ],
  },
  {
    author: 'Ажыгулов Эркин Асылбекович',
    company: 'ООО "2Н Групп"',
    meta: 'Генеральный директор',
    review: [
      'Работаем с Revit Server на крупных объектах. Один из последних проектов — сложный объект с плотным графиком стройки. Исполнительная документация шла параллельно с монтажом, правки вносились круглосуточно: день и ночь на объекте кипела работа, смежники постоянно запрашивали актуальные данные, вносили корректировки.',
      'Именно здесь Revit Server показал себя на все сто. Вся команда — и проектировщики в офисе, и инженеры на площадке, и субподрядчики в разных городах — работали в единой среде. Всегда была актуальная версия, никто не боялся, что "слетят" данные или кто-то случайно всё перезапишет. Каждый смежник был уверен в надежности системы: знал, что модель актуальна, а исполнительная документация формируется на основе свежих решений.',
      'Стабильный доступ, никаких сбоев даже при ночных подключениях. Техподдержка всегда на связи. Для нас это не просто инструмент, а уверенность в том, что стройка не остановится из-за проблем с документацией. Рекомендую.',
    ],
  },
];

interface PlanCardProps {
  plan: {
    name: string;
    subtitle: string;
    price: string;
    popular?: boolean;
    specs: { label: string; value: string }[];
  };
  priceSuffix?: string;
  priceNote?: string;
  showTrialButton?: boolean;
}

function PlanCard({
  plan,
  priceSuffix = '$/мес.',
  priceNote,
  showTrialButton = true,
}: PlanCardProps) {
  return (
    <Card
      className={`relative overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${
        plan.popular ? 'border-primary ring-2 ring-primary/20' : ''
      }`}
    >
      {plan.popular && (
        <div className="absolute right-4 top-4 rounded-full bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground">
          Популярный
        </div>
      )}
      <CardContent className="p-6">
        <h3 className="text-xl font-bold">{plan.name}</h3>
        <p className="mt-1 text-sm text-muted-foreground">{plan.subtitle}</p>
        <div className="mt-4 flex items-baseline gap-1">
          <span className="text-3xl font-bold text-primary">{plan.price}</span>
          <span className="text-sm text-muted-foreground">{priceSuffix}</span>
        </div>
        {priceNote && <p className="mt-1 text-sm text-muted-foreground">{priceNote}</p>}
        <div className="mt-6 space-y-3">
          {plan.specs.map((spec) => (
            <div key={spec.label} className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">{spec.label}</span>
              <span className="font-medium">{spec.value}</span>
            </div>
          ))}
        </div>
        {showTrialButton && (
          <Button asChild className="mt-6 w-full" variant="outline-primary">
            <a href={TELEGRAM_LINK} target="_blank" rel="noreferrer">
              Попробовать бесплатно
            </a>
          </Button>
        )}
      </CardContent>
    </Card>
  );
}

export default function Collaboration() {
  const [expandedTestimonials, setExpandedTestimonials] = useState<Record<string, boolean>>({});

  const toggleTestimonial = (author: string) => {
    setExpandedTestimonials((current) => ({
      ...current,
      [author]: !current[author],
    }));
  };

  return (
    <Layout>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-background to-accent/5 pb-20 pt-10 lg:pb-28 lg:pt-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,hsl(var(--primary)/0.08),transparent_60%)]" />
        <div className="container relative mx-auto px-4">
          <div className="mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,520px)] lg:gap-16">
            <div className="text-center lg:text-left">
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-2 text-sm font-medium text-primary">
                <Server className="h-4 w-4" />
                Совместная работа для BIM-команд
              </div>
              <h1 className="text-4xl font-bold leading-tight md:text-5xl lg:text-6xl">
                Совместная BIM работа{' '}
                <span className="text-primary">над проектами</span>
              </h1>
              <p className="mt-6 text-lg text-muted-foreground md:text-xl">
                Единая BIM-среда, совместимая с решениями Autodesk и Graphisoft,
                где команда работает с одной моделью и актуальными данными.
              </p>
              <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center lg:items-start lg:justify-start">
                <Button asChild size="xl" variant="hero">
                  <a href={TELEGRAM_LINK} target="_blank" rel="noreferrer">
                    <Monitor className="mr-2 h-5 w-5" />
                    Попробовать бесплатно
                  </a>
                </Button>
                <Button asChild size="lg" variant="outline-primary">
                  <a href="#pricing">
                    Тарифные планы
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </a>
                </Button>
              </div>
              <p className="mt-4 text-sm text-muted-foreground">
                Бесплатный доступ — оцените результат до оплаты
              </p>
            </div>

            <div className="mx-auto w-full max-w-2xl lg:max-w-[520px]">
              <div className="overflow-hidden rounded-[2rem] border border-border/60 bg-background/85 p-3 shadow-2xl shadow-primary/10 backdrop-blur sm:p-4">
                <img
                  src="/teamwork.png"
                  alt="Схема совместной работы офисов через центральный сервер"
                  className="w-full rounded-[1.5rem] object-cover"
                  loading="eager"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Advantages */}
      <section className="py-16 lg:py-20">
        <div className="container mx-auto px-4">
          <div className="grid gap-6 md:grid-cols-3">
            {advantages.map((adv) => (
              <Card key={adv.title} className="border-0 bg-muted/30 transition-colors hover:bg-muted/50">
                <CardContent className="flex items-start gap-4 p-6">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                    <adv.icon className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{adv.title}</h3>
                    <p className="mt-2 text-sm text-muted-foreground">{adv.description}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* What is it */}
      <section className="border-y border-border bg-muted/20 py-16 lg:py-20">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl">
            <Tabs defaultValue="revit" className="space-y-8">
              <div className="text-center">
                <h2 className="text-3xl font-bold md:text-4xl">Что мы предлагаем?</h2>
                <p className="mt-4 text-muted-foreground">
                  Полностью настроенные серверы для совместной работы в BIM-среде
                </p>
                <TabsList className="mt-6">
                  <TabsTrigger value="revit" className="gap-2">
                    <Server className="h-4 w-4" />
                    Облачная версия
                  </TabsTrigger>
                  <TabsTrigger value="archicad" className="gap-2">
                    <Users className="h-4 w-4" />
                    Коробочная версия
                  </TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value="revit" className="space-y-6">
                <Card>
                  <CardContent className="p-6 md:p-8">
                    <h3 className="text-xl font-bold">Облачный сервер</h3>
                    <p className="mt-3 text-muted-foreground leading-relaxed">
                      Вам не нужно закупать оборудование, настраивать
                      IP-адреса, межсетевые экраны и VPN — мы запустим сервер за сутки.
                    </p>
                    <ul className="mt-6 space-y-3">
                      {[
                        'Совместная работа над моделью в реальном времени',
                        'Центральные модели на удалённом сервере',
                        'Доступ из разных локаций',
                        'Быстрое подключение',
                        'Не нужны IT-инфраструктура и специалисты',
                      ].map((item) => (
                        <li key={item} className="flex items-start gap-3 text-sm">
                          <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="archicad" className="space-y-6">
                <Card>
                  <CardContent className="p-6 md:p-8">
                    <h3 className="text-xl font-bold">Физический сервер</h3>
                    <p className="mt-3 text-muted-foreground leading-relaxed">
                      Мы предоставляем полностью настроенный физический сервер
                      который будет находиться у вас офисе.

                    </p>
                    <ul className="mt-6 space-y-3">
                      {[
                        'Совместная работа',
                        'Полный контроль над данными',
                        'Файловый сервер',
                        'Независимость от интернета',
                        'Удаленное подключение через VPN',
                        'Гибкая настройка инфраструктуры',
                      ].map((item) => (
                        <li key={item} className="flex items-start gap-3 text-sm">
                          <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-16 lg:py-20">
        <div className="container mx-auto px-4">
          <h2 className="mb-10 text-center text-3xl font-bold md:text-4xl">Почему выбирают нас</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((f) => (
              <Card key={f.title} className="text-center transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                <CardContent className="p-6">
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10">
                    <f.icon className="h-7 w-7 text-primary" />
                  </div>
                  <h3 className="mt-4 font-semibold">{f.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{f.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 lg:py-20">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center">
            <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary">
              <Quote className="h-4 w-4" />
              Отзывы клиентов
            </div>
            <h2 className="mt-6 text-3xl font-bold md:text-4xl">
              Как совместная BIM-работа меняет проекты
            </h2>
            <p className="mt-4 text-muted-foreground">
              Опыт компаний, которые уже перевели команды на Revit Server и ArchiCAD Teamwork.
            </p>
          </div>

          <div className="mt-10 grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
            {testimonials.map((testimonial) => {
              const isExpanded = Boolean(expandedTestimonials[testimonial.author]);

              return (
                <Card
                  key={testimonial.author}
                  className="h-full border-primary/10 bg-gradient-to-br from-background via-background to-primary/5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                >
                  <CardContent className="flex h-full flex-col p-6">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="text-lg font-semibold">{testimonial.author}</h3>
                        <p className="mt-1 font-medium text-primary">{testimonial.company}</p>
                        <p className="mt-2 text-sm text-muted-foreground">{testimonial.meta}</p>
                      </div>
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-primary/10">
                        <Quote className="h-5 w-5 text-primary" />
                      </div>
                    </div>

                    <div className={`relative mt-6 flex-1 space-y-4 overflow-hidden ${isExpanded ? '' : 'max-h-52'}`}>
                      {testimonial.review.map((paragraph, index) => (
                        <p key={`${testimonial.author}-${index}`} className="text-sm leading-7 text-foreground/90">
                          {paragraph}
                        </p>
                      ))}
                      {!isExpanded && (
                        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-background via-background/95 to-transparent" />
                      )}
                    </div>

                    <Button
                      type="button"
                      variant="ghost"
                      className="mt-4 h-auto self-start px-0 text-primary hover:bg-transparent hover:text-primary/80"
                      onClick={() => toggleTestimonial(testimonial.author)}
                    >
                      {isExpanded ? 'Свернуть' : 'Читать полностью'}
                      {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="border-y border-border bg-muted/20 py-16 lg:py-20">
        <div className="container mx-auto px-4">
          <div className="mb-10 text-center">
            <h2 className="text-3xl font-bold md:text-4xl">Тарифные планы</h2>
            <p className="mt-4 text-muted-foreground">
              Выберите конфигурацию под размер вашей команды
            </p>
          </div>

          <Tabs defaultValue="revit" className="space-y-8">
            <div className="flex justify-center">
              <TabsList>
                <TabsTrigger value="revit" className="gap-2">
                  <Server className="h-4 w-4" />
                  Облачная версия
                </TabsTrigger>
                <TabsTrigger value="archicad" className="gap-2">
                  <Users className="h-4 w-4" />
                  Коробочная версия
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="revit">
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {revitPlans.map((plan) => (
                  <PlanCard key={plan.name} plan={plan} />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="archicad">
              <div className="mx-auto grid max-w-4xl gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {archicadPlans.map((plan) => (
                  <PlanCard
                    key={plan.name}
                    plan={plan}
                    priceSuffix="$"
                    priceNote="Разовая оплата"
                    showTrialButton={false}
                  />
                ))}
              </div>
            </TabsContent>
          </Tabs>

          <p className="mt-8 text-center text-sm text-muted-foreground">
            Все параметры можно настроить индивидуально. Напишите нам для подбора конфигурации.
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 lg:py-20">
        <div className="container mx-auto px-4">
          <Card className="overflow-hidden border-0 gradient-primary">
            <CardContent className="flex flex-col items-center gap-6 p-10 text-center md:p-16">
              <h2 className="text-3xl font-bold text-primary-foreground md:text-4xl">
                Попробуйте бесплатно
              </h2>
              <p className="max-w-xl text-primary-foreground/80">
                Предоставляем бесплатный доступ к серверу, чтобы вы могли оценить скорость и удобство
                совместной работы перед оплатой.
              </p>
              <div className="flex flex-col gap-4 sm:flex-row">
                <Button asChild size="lg" className="bg-background text-foreground hover:bg-background/90">
                  <a href={TELEGRAM_LINK} target="_blank" rel="noreferrer">
                    <MessageCircle className="mr-2 h-5 w-5" />
                    Написать в Telegram
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </Layout>
  );
}
