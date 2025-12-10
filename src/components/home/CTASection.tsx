import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, Sparkles } from 'lucide-react';

export function CTASection() {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="relative overflow-hidden rounded-3xl gradient-primary p-8 md:p-16">
          {/* Background decorations */}
          <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
          <div className="absolute -bottom-10 -left-10 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
          
          <div className="relative z-10 mx-auto max-w-2xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-medium text-primary-foreground">
              <Sparkles className="h-4 w-4" />
              Начните бесплатно
            </div>
            
            <h2 className="mb-6 text-3xl font-bold text-primary-foreground md:text-4xl lg:text-5xl">
              Готовы стать профессионалом в Revit?
            </h2>
            
            <p className="mb-8 text-lg text-primary-foreground/80">
              Присоединяйтесь к тысячам специалистов, которые уже освоили 
              BIM-проектирование с нашими курсами
            </p>
            
            <div className="flex flex-wrap justify-center gap-4">
              <Button asChild size="xl" className="bg-white text-primary hover:bg-white/90">
                <Link to="/courses">
                  Начать обучение
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="xl"
                className="border-white/30 bg-transparent text-primary-foreground hover:bg-white/10"
              >
                <Link to="/courses/revit-basics">Бесплатный курс</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
