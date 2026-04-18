import { CheckCircle2 } from 'lucide-react';

const outcomes = [
  'Стать востребованным BIM-специалистом и работать в лучших проектных бюро.',
  'Получить работу с высокой зарплатой и перспективами карьерного роста.',
  'Начать работать на себя как фрилансер или открыть собственное дело.',
  'Обрести уверенность в завтрашнем дне благодаря актуальным навыкам.',
];

export function OutcomesSection() {
  return (
    <section className="py-20 bg-accent/5">
      <div className="container mx-auto px-4">
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-3xl font-bold md:text-4xl">
            Cделайте шаг навстречу успеху
          </h2>
          <p className="text-xl font-semibold italic text-primary">
            Для студентов и молодых специалистов шанс:
          </p>
        </div>

        <div className="mx-auto grid max-w-4xl gap-4 md:grid-cols-2">
          {outcomes.map((item, index) => (
            <div
              key={index}
              className="flex items-start gap-3 rounded-xl border border-border bg-card p-5 transition-all duration-300 hover:border-primary/20 hover:shadow-card"
            >
              <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
              <p className="text-muted-foreground">{item}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
