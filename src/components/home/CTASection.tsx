import { Quote, Star } from 'lucide-react';

const testimonials = [
  {
    name: 'Алина К.',
    role: 'Студент',
    course: 'Курс: Архитектурное проектирование в Revit',
    text: 'Курс помог перестать смотреть на Revit как на сложную программу. После практических заданий я уже вела учебный проект как реальный объект.',
  },
  {
    name: 'Нурсултан Т.',
    role: 'Конструктор',
    course: 'Курс: Конструктивные решения в Revit',
    text: 'Больше всего понравилась структура: короткие уроки, понятные задания и обратная связь без воды. Сразу начал применять подходы в работе.',
  },
  {
    name: 'Магомед С.',
    role: 'Инженер ОВиК',
    course: 'Курс: Отопление, вентиляция и кондицинирование в Revit',
    text: 'Благодарю вас за проведенное обучение. Отмечу высокий профессионализм и компетентность в подходе к образовательному процессу. Желаю вам дальнейших успехов.🤗',
  },
];

export function CTASection() {
  return (
    <section className="relative overflow-hidden bg-muted/30 py-20">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -left-16 top-10 h-56 w-56 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute -right-16 bottom-0 h-64 w-64 rounded-full bg-accent/10 blur-3xl" />
      </div>

      <div className="container relative mx-auto px-4">
        <div className="mb-12 max-w-2xl">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary">
            <Quote className="h-4 w-4" />
            Отзывы пользователей
          </div>
          <h2 className="mb-4 text-3xl font-bold md:text-4xl">
            Как обучение в <span className="inline-block rounded-lg bg-blue-600 px-3 py-1 font-bold text-white shadow-lg">UstaBIM</span> меняет практику
          </h2>
          <p className="text-lg text-muted-foreground">
            Реальные впечатления студентов, которые уже внедряют BIM-инструменты
            в учебе, стажировках и коммерческих проектах.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <article
              key={testimonial.name}
              className="flex h-full flex-col rounded-3xl border border-border bg-card p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-card"
              style={{ animationDelay: `${index * 120}ms` }}
            >
              <div className="mb-5 flex items-start justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl gradient-primary text-sm font-semibold text-primary-foreground">
                    {testimonial.name
                      .split(' ')
                      .map((part) => part[0])
                      .join('')}
                  </div>
                  <div>
                    <h3 className="font-semibold">{testimonial.name}</h3>
                    <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                  </div>
                </div>
                <Quote className="h-5 w-5 shrink-0 text-primary/40" />
              </div>

              <p className="mb-6 flex-1 text-base leading-7 text-foreground/90">
                {testimonial.text}
              </p>

              <div className="space-y-3 border-t border-border pt-4">
                <p className="text-sm text-muted-foreground">{testimonial.course}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
