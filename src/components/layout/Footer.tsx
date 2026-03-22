import { Link } from 'react-router-dom';
import { BookOpen, Instagram, Youtube } from 'lucide-react';
import { LEGAL_DOCS } from '@/lib/legalDocs';

export function Footer() {
  return (
    <footer className="border-t border-border bg-muted/30">
      <div className="container mx-auto px-4 py-12">
        <div className="grid gap-8 md:grid-cols-4">
          {/* Brand */}
          <div className="md:col-span-1">
            <Link to="/" className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg gradient-primary">
                <BookOpen className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold">
                Usta<span className="text-primary">BIM</span>
              </span>
            </Link>
            <p className="mt-4 text-sm text-muted-foreground">
              Образовательная платформа для изучения индустрии BIM-проектирования
            </p>
          </div>

          {/* Courses */}
          <div>
            <h3 className="mb-4 font-semibold">Курсы</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link to="/courses" className="transition-colors hover:text-primary">
                  Все курсы
                </Link>
              </li>
              <li>
                <Link to="/courses?level=Начинающий" className="transition-colors hover:text-primary">
                  Для начинающих
                </Link>
              </li>
              <li>
                <Link to="/courses?level=Продвинутый" className="transition-colors hover:text-primary">
                  Продвинутые
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="mb-4 font-semibold">Поддержка</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <a href="https://t.me/+JKVWYQV6MDkwZWIy" className="transition-colors hover:text-primary">
                  Помощь
                </a>
              </li>
              <li>
                <a href="https://www.instagram.com/ustabim.online/" className="transition-colors hover:text-primary">
                  Instagram
                </a>
              </li>
              <li>
                <a href="https://t.me/ustaBIM_Kg" className="transition-colors hover:text-primary">
                  Кыргызстан
                </a>
              </li>
              <li>
                <a href="https://t.me/ustaBIM_Ru" className="transition-colors hover:text-primary">
                  Россия
                </a>
              </li>
              <li>
                <a href="https://t.me/ustaBIM_Kz" className="transition-colors hover:text-primary">
                  Казахстан
                </a>
              </li>
              <li>
                <a href="https://t.me/ustaBIM_Uz" className="transition-colors hover:text-primary">
                  Узбекистан
                </a>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="mb-4 font-semibold">Информация</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <a
                  href={LEGAL_DOCS.agreement}
                  className="transition-colors hover:text-primary"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Договор оферты
                </a>
              </li>
              <li>
                <a
                  href={LEGAL_DOCS.privacy}
                  className="transition-colors hover:text-primary"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Политика конфиденциальности
                </a>
              </li>
              <li>
                <a
                  href={LEGAL_DOCS.cooperation}
                  className="transition-colors hover:text-primary"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Условия сотрудничества
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-border pt-8">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <p className="text-sm text-muted-foreground">
              © 2026 UstaBIM. Все права защищены.
            </p>
            <div className="flex items-center gap-3 self-end">
              <a
                href="https://www.instagram.com/ustabim.online/"
                className="text-muted-foreground transition-colors hover:text-primary"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram UstaBIM"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href="https://youtube.com/@usta_international"
                className="text-muted-foreground transition-colors hover:text-primary"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="YouTube UstaBIM"
              >
                <Youtube className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
