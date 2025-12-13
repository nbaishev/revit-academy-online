import { BookOpen, Video, Award, Users, Clock, Headphones } from 'lucide-react';

const features = [
  {
    icon: Video,
    title: 'Видеоуроки HD',
    description: 'Качественные видеоуроки с практическими примерами и пояснениями',
  },
  {
    icon: BookOpen,
    title: 'Структурированная программа',
    description: 'Последовательное обучение от простого к сложному',
  },
  {
    icon: Clock,
    title: 'Учитесь в своём темпе',
    description: 'Доступ к материалам 24/7, пересматривайте сколько угодно',
  },
  {
    icon: Award,
    title: 'Сертификат',
    description: 'Получите сертификат о прохождении курса',
  },
  {
    icon: Users,
    title: 'Сообщество',
    description: 'Общайтесь с другими студентами и делитесь опытом',
  },
  {
    icon: Headphones,
    title: 'Поддержка',
    description: 'Ответы на вопросы от экспертов и преподавателей',
  },
];

export function FeaturesSection() {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-3xl font-bold md:text-4xl">
            Почему выбирают <span className="inline-block rounded-lg bg-blue-600 px-3 py-1 font-bold text-white shadow-lg">UstaBIM</span>
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            Мы создали платформу, которая делает обучение Revit простым и эффективным
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group rounded-2xl border border-border bg-card p-6 transition-all duration-300 hover:border-primary/20 hover:shadow-card"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 transition-colors group-hover:bg-primary/20">
                <feature.icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="mb-2 text-lg font-semibold">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
