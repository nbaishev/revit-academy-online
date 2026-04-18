import { GraduationCap, RefreshCw, Briefcase } from 'lucide-react';

const audiences = [
  {
    number: '01',
    icon: GraduationCap,
    title: 'Проектным компаниям',
    description:
      'С 2026 года BIM обязателен в ряде стран ЦА. Без BIM — потеря тендеров и ошибки в проектах. Внедрим BIM за 30–60 дней.',
  },
  {
    number: '02',
    icon: RefreshCw,
    title: 'Инженерам и архитекторам',
    description:
      'Освойте BIM и начните работать в современных проектах. Повышение квалификации и дохода.',
  },
  {
    number: '03',
    icon: Briefcase,
    title: 'Командам и бюро',
    description:
      'Совместная работа в одной BIM-модели. Без хаоса в файлах, с контролем версий и доступом из любой точки',
  },
];

export function TargetAudienceSection() {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <h2 className="mb-12 text-center text-3xl font-bold md:text-4xl">
          Наши курсы подходят:
        </h2>

        <div className="grid gap-6 md:grid-cols-3">
          {audiences.map((item, index) => (
            <div
              key={index}
              className="group rounded-2xl border border-border bg-card p-6 transition-all duration-300 hover:border-primary/20 hover:shadow-card"
            >
              <div className="mb-4 flex items-center gap-3">
                <span className="text-sm font-bold text-primary">{item.number}</span>
                <h3 className="text-lg font-semibold">{item.title}</h3>
              </div>
              <p className="text-muted-foreground leading-relaxed">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
