import { useEffect, useMemo, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { CheckCircle2 } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';

const PaymentSuccess = () => {
  const { refreshMyCourses } = useAuth();
  const location = useLocation();
  const [storedCourseId] = useState(() => {
    const value = sessionStorage.getItem('pendingPurchaseCourseId');
    if (value) {
      sessionStorage.removeItem('pendingPurchaseCourseId');
    }
    return value;
  });

  const courseId = useMemo(() => {
    const params = new URLSearchParams(location.search);
    return params.get('course_id') || params.get('courseId') || storedCourseId || null;
  }, [location.search, storedCourseId]);

  useEffect(() => {
    refreshMyCourses().catch(() => null);
  }, [refreshMyCourses]);

  const primaryHref = courseId ? `/courses/${courseId}` : '/dashboard';
  const primaryLabel = courseId ? 'Перейти к курсу' : 'Открыть кабинет';

  return (
    <Layout>
      <div className="mx-auto flex min-h-[60vh] max-w-2xl flex-col items-center justify-center px-4 text-center">
        <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
          <CheckCircle2 className="h-8 w-8" />
        </div>
        <h1 className="mb-3 text-3xl font-semibold text-foreground">Оплата прошла</h1>
        <p className="mb-6 text-muted-foreground">
          Мы получили подтверждение оплаты. Доступ к курсу может появиться через пару минут, пока
          обработается уведомление.
        </p>
        <div className="flex flex-col items-center gap-3 sm:flex-row">
          <Button asChild>
            <Link to={primaryHref}>{primaryLabel}</Link>
          </Button>
          <Button asChild variant="outline">
            <Link to="/courses">Каталог курсов</Link>
          </Button>
        </div>
      </div>
    </Layout>
  );
};

export default PaymentSuccess;
