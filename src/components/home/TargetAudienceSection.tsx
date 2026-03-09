import { GraduationCap, RefreshCw, Briefcase } from 'lucide-react';

const audiences = [
  {
    number: '01',
    icon: GraduationCap,
    title: 'Студентов',
    description:
      'Хотите получить востребованную специальность ещё во время учёбы? BIM-проектирование откроет двери в строительную отрасль и поможет найти работу до получения диплома.',
  },
  {
    number: '02',
    icon: RefreshCw,
    title: 'Тех, кто меняет профессию',
    description:
      'Устали от текущей работы и хотите начать с чистого листа? Освоить Revit и BIM-технологии проще, чем кажется — мы проведём вас от нуля до уверенного специалиста.',
  },
  {
    number: '03',
    icon: Briefcase,
    title: 'Практикующих специалистов',
    description:
      'Хотите повысить квалификацию и зарабатывать больше? Освойте современные BIM-инструменты и станьте незаменимым специалистом в своей компании.',
  },
];

export function TargetAudienceSection() {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <h2 className="mb-12 text-center text-3xl font-bold md:text-4xl">
          Наши курсы подходят для:
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
