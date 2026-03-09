const stats = [
  { value: '70+', label: 'Студентов' },
  { value: '6', label: 'Курсов' },
  { value: '310+', label: 'Видеоуроков' },
  { value: '4.8', label: 'Средний рейтинг' },
];

export function StatsSection() {
  return (
    <section className="border-y border-border bg-card py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="mb-2 text-3xl font-bold text-primary md:text-4xl">
                {stat.value}
              </div>
              <div className="text-sm text-muted-foreground md:text-base">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
