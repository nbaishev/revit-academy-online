import { BadgeCheck } from 'lucide-react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';

const clients = [
  {
    name: 'BIM Standard',
    logoSrc: '/clients/bimstandard.jpg',
    logoAlt: 'Логотип BIM Standard',
  },
  {
    name: 'BPS',
    logoSrc: '/clients/bps.jpg',
    logoAlt: 'Логотип BPS',
  },
  {
    name: 'Casale',
    logoSrc: '/clients/casale.jpg',
    logoAlt: 'Логотип Casale',
  },
  {
    name: 'City Imp',
    logoSrc: '/clients/city_imp.jpg',
    logoAlt: 'Логотип City Imp',
  },
  {
    name: 'DNY',
    logoSrc: '/clients/dny.jpg',
    logoAlt: 'Логотип DNY',
  },
  {
    name: 'Domodedovo',
    logoSrc: '/clients/domodedovo.jpg',
    logoAlt: 'Логотип Domodedovo',
  },
  {
    name: 'Good Wood',
    logoSrc: '/clients/good_woodjpg.jpg',
    logoAlt: 'Логотип Good Wood',
  },
  {
    name: 'Limak Marash',
    logoSrc: '/clients/limak_marash.jpg',
    logoAlt: 'Логотип Limak Marash',
  },
  {
    name: 'New Urengoi',
    logoSrc: '/clients/new_urengoi.jpg',
    logoAlt: 'Логотип New Urengoi',
  },
  {
    name: 'SK',
    logoSrc: '/clients/sk.jpg',
    logoAlt: 'Логотип SK',
  },
  {
    name: 'STI',
    logoSrc: '/clients/sti.jpg',
    logoAlt: 'Логотип STI',
  },
] as const;

export function ClientsSection() {
  return (
    <section className="relative overflow-hidden py-20">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute left-0 top-8 h-48 w-48 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-56 w-56 rounded-full bg-accent/10 blur-3xl" />
      </div>

      <div className="container relative mx-auto px-4">
        <div className="mx-auto mb-12 max-w-3xl text-center">

          <h2 className="mb-4 text-3xl font-bold md:text-4xl">
            Нам доверяют
          </h2>
          <p className="text-lg text-muted-foreground">
            Компании, которые уже внедряют BIM-процессы, обучают команды и
            развивают проекты вместе с нами.
          </p>
        </div>

        <Carousel
          opts={{ align: 'start', loop: true }}
          className="mx-auto w-full max-w-6xl px-10 md:px-14"
        >
          <CarouselContent className="-ml-4">
            {clients.map((client) => (
              <CarouselItem
                key={client.name}
                className="pl-4 basis-[78%] sm:basis-[46%] md:basis-1/3 lg:basis-1/4"
              >
                <article className="group rounded-3xl border border-border bg-card/90 p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/20 hover:shadow-card">
                  <div className="flex h-28 items-center justify-center rounded-2xl border border-border/60 bg-white px-4 py-4 sm:h-32">
                    <img
                      src={client.logoSrc}
                      alt={client.logoAlt}
                      className="max-h-14 w-auto max-w-full object-contain transition-transform duration-300 group-hover:scale-105 sm:max-h-16"
                    />
                  </div>
                </article>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious
            variant="outline-primary"
            className="left-0 hidden h-11 w-11 border-primary/30 bg-background/95 md:inline-flex"
          />
          <CarouselNext
            variant="outline-primary"
            className="right-0 hidden h-11 w-11 border-primary/30 bg-background/95 md:inline-flex"
          />
        </Carousel>
      </div>
    </section>
  );
}
