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
} from 'lucide-react';

const revitPlans = [
  {
    name: 'LOD 100',
    subtitle: 'Для команды из 2–4 человек',
    price: '8 900',
    specs: [
      { label: 'CPU', value: '3 × 3.3 ГГц' },
      { label: 'RAM', value: '10 Гб' },
      { label: 'NVMe', value: '50 Гб' },
      { label: 'Канал', value: '500 Мбит/с' },
      { label: 'Бэкап', value: 'глубина — 4 дня' },
    ],
  },
  {
    name: 'LOD 200',
    subtitle: 'Для команды из 5–8 человек',
    price: '11 200',
    popular: true,
    specs: [
      { label: 'CPU', value: '4 × 3.3 ГГц' },
      { label: 'RAM', value: '12 Гб' },
      { label: 'NVMe', value: '70 Гб' },
      { label: 'Канал', value: '500 Мбит/с' },
      { label: 'Бэкап', value: 'глубина — 4 дня' },
    ],
  },
  {
    name: 'LOD 300',
    subtitle: 'Для команды из 9–15 человек',
    price: '14 600',
    specs: [
      { label: 'CPU', value: '6 × 4.2 ГГц' },
      { label: 'RAM', value: '16 Гб' },
      { label: 'NVMe', value: 'от 120 Гб' },
      { label: 'Канал', value: '1 Гбит/с' },
      { label: 'Бэкап', value: 'глубина — 4 дня' },
    ],
  },
  {
    name: 'LOD 400',
    subtitle: 'Для команды от 15 человек',
    price: 'от 17 500',
    specs: [
      { label: 'CPU', value: '8 × 4.5 ГГц' },
      { label: 'RAM', value: '24 Гб' },
      { label: 'NVMe', value: 'от 200 Гб' },
      { label: 'Канал', value: '1 Гбит/с' },
      { label: 'Бэкап', value: 'глубина — 4 дня' },
    ],
  },
];

const archicadPlans = [
  {
    name: 'Team S',
    subtitle: 'Для команды из 2–4 человек',
    price: '9 500',
    specs: [
      { label: 'CPU', value: '4 × 3.3 ГГц' },
      { label: 'RAM', value: '12 Гб' },
      { label: 'NVMe', value: '60 Гб' },
      { label: 'Канал', value: '500 Мбит/с' },
      { label: 'Бэкап', value: 'глубина — 4 дня' },
    ],
  },
  {
    name: 'Team M',
    subtitle: 'Для команды из 5–10 человек',
    price: '13 000',
    popular: true,
    specs: [
      { label: 'CPU', value: '6 × 3.8 ГГц' },
      { label: 'RAM', value: '16 Гб' },
      { label: 'NVMe', value: '100 Гб' },
      { label: 'Канал', value: '1 Гбит/с' },
      { label: 'Бэкап', value: 'глубина — 4 дня' },
    ],
  },
  {
    name: 'Team L',
    subtitle: 'Для команды от 10 человек',
    price: 'от 16 500',
    specs: [
      { label: 'CPU', value: '8 × 4.2 ГГц' },
      { label: 'RAM', value: '24 Гб' },
      { label: 'NVMe', value: 'от 150 Гб' },
      { label: 'Канал', value: '1 Гбит/с' },
      { label: 'Бэкап', value: 'глубина — 4 дня' },
    ],
  },
];

const advantages = [
  {
    icon: Shield,
    title: 'Независимы от вендоров',
    description:
      'Наши серверы не связаны с облачными службами Autodesk или Graphisoft и не могут быть внезапно заблокированы или отключены.',
  },
  {
    icon: Wrench,
    title: 'Берём рутину на себя',
    description:
      'Полностью управляем сервером: резервное копирование, обновления, мониторинг дисков и производительности.',
  },
  {
    icon: Zap,
    title: 'Скорость и поддержка',
    description:
      'Сервер готов к работе за несколько часов. Поможем с настройкой станций: RSN, VPN, сетевой диск.',
  },
];

const features = [
  {
    icon: Cloud,
    title: 'Масштабируемость',
    description: 'Увеличивайте ресурсы (память, диск, CPU) под требования проекта без простоев.',
  },
  {
    icon: HardDrive,
    title: 'Общий сетевой диск',
    description:
      'Высокоскоростной сетевой диск на том же сервере для любых файлов — уже включён в стоимость.',
  },
  {
    icon: Server,
    title: 'Надёжные дата-центры',
    description:
      'Серверы в крупнейших дата-центрах с высочайшими стандартами безопасности и резервирования.',
  },
  {
    icon: Clock,
    title: 'Ежедневные бэкапы',
    description:
      'Автоматическое резервное копирование. Расписание и глубину хранения настроим под ваш запрос.',
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
}

function PlanCard({ plan }: PlanCardProps) {
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
          <span className="text-sm text-muted-foreground">руб./мес.</span>
        </div>
        <div className="mt-6 space-y-3">
          {plan.specs.map((spec) => (
            <div key={spec.label} className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">{spec.label}</span>
              <span className="font-medium">{spec.value}</span>
            </div>
          ))}
        </div>
        <Button className="mt-6 w-full" variant="outline-primary">
          Попробовать бесплатно
        </Button>
      </CardContent>
    </Card>
  );
}

export default function Collaboration() {
  return (
    <Layout>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-background to-accent/5 py-20 lg:py-28">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,hsl(var(--primary)/0.08),transparent_60%)]" />
        <div className="container relative mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-2 text-sm font-medium text-primary">
              <Server className="h-4 w-4" />
              Аренда серверов для BIM-команд
            </div>
            <h1 className="text-4xl font-bold leading-tight md:text-5xl lg:text-6xl">
              Совместная работа в{' '}
              <span className="text-primary">Revit</span> и{' '}
              <span className="text-primary">ArchiCAD</span>
            </h1>
            <p className="mt-6 text-lg text-muted-foreground md:text-xl">
              Арендуйте готовый сервер для вашей команды. Revit Server и ArchiCAD BIM Server —
              настроены, защищены и готовы к работе за несколько часов.
            </p>
            <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              <Button size="xl" variant="hero">
                <Monitor className="mr-2 h-5 w-5" />
                Бесплатный тест-драйв
              </Button>
              <Button size="lg" variant="outline-primary">
                Тарифные планы
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
            <p className="mt-4 text-sm text-muted-foreground">
              5 дней бесплатного доступа — оцените результат до оплаты
            </p>
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
                    Revit Server
                  </TabsTrigger>
                  <TabsTrigger value="archicad" className="gap-2">
                    <Users className="h-4 w-4" />
                    ArchiCAD Teamwork
                  </TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value="revit" className="space-y-6">
                <Card>
                  <CardContent className="p-6 md:p-8">
                    <h3 className="text-xl font-bold">Revit Server</h3>
                    <p className="mt-3 text-muted-foreground leading-relaxed">
                      Серверный компонент от Autodesk для организации совместной работы над проектами
                      в Revit. Мы размещаем и управляем серверами для архитектурных и инженерных
                      компаний по всей России и СНГ. Вам не нужно закупать оборудование, настраивать
                      IP-адреса, межсетевые экраны и VPN — мы запустим сервер за пару часов.
                    </p>
                    <ul className="mt-6 space-y-3">
                      {[
                        'Совместная работа над моделью в реальном времени',
                        'Центральные модели на удалённом сервере',
                        'Поддержка Revit 2019–2026',
                        'Безопасное VPN-подключение',
                        'Сетевой диск для обмена файлами',
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
                    <h3 className="text-xl font-bold">ArchiCAD BIM Server (Teamwork)</h3>
                    <p className="mt-3 text-muted-foreground leading-relaxed">
                      BIM Server от Graphisoft позволяет командам архитекторов работать над одним
                      проектом одновременно в ArchiCAD. Мы предоставляем полностью настроенный сервер
                      с поддержкой Teamwork — без необходимости покупать собственное серверное
                      оборудование.
                    </p>
                    <ul className="mt-6 space-y-3">
                      {[
                        'Совместная работа над проектом в ArchiCAD Teamwork',
                        'Резервирование и управление ролями пользователей',
                        'Поддержка ArchiCAD 24–28',
                        'Быстрое подключение через Delta-синхронизацию',
                        'Сетевой диск и бэкапы включены',
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
                  Revit Server
                </TabsTrigger>
                <TabsTrigger value="archicad" className="gap-2">
                  <Users className="h-4 w-4" />
                  ArchiCAD Teamwork
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
                  <PlanCard key={plan.name} plan={plan} />
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
                Попробуйте бесплатно 5 дней
              </h2>
              <p className="max-w-xl text-primary-foreground/80">
                Предоставляем бесплатный доступ к серверу, чтобы вы могли оценить скорость и удобство
                совместной работы перед оплатой.
              </p>
              <div className="flex flex-col gap-4 sm:flex-row">
                <Button
                  size="lg"
                  className="bg-background text-foreground hover:bg-background/90"
                  onClick={() =>
                    window.open('https://t.me/+JKVWYQV6MDkwZWIy', '_blank')
                  }
                >
                  <MessageCircle className="mr-2 h-5 w-5" />
                  Написать в Telegram
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </Layout>
  );
}
