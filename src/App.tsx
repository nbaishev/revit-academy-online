import { useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import Index from "./pages/Index";
import Courses from "./pages/Courses";
import CourseDetail from "./pages/CourseDetail";
import Dashboard from "./pages/Dashboard";
import ModeratorPanel from "./pages/ModeratorPanel";
import LoginConsent from "./pages/LoginConsent";
import PaymentSuccess from "./pages/PaymentSuccess";
import EntranceTest from "./pages/EntranceTest";
import FreeCourseBenefit from "./pages/FreeCourseBenefit";
import Collaboration from "./pages/Collaboration";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const ScrollToTop = () => {
  const { pathname, search } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [pathname, search]);

  return null;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <ScrollToTop />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/courses" element={<Courses />} />
            <Route path="/courses/:courseId/lessons/:lessonId" element={<CourseDetail />} />
            <Route path="/courses/:courseId" element={<CourseDetail />} />
            <Route path="/entrance-test" element={<EntranceTest />} />
            <Route path="/courses/:courseId/free-course-benefit" element={<FreeCourseBenefit />} />
            <Route path="/collaboration" element={<Collaboration />} />
            <Route path="/login" element={<LoginConsent />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/moderator" element={<ModeratorPanel />} />
            <Route path="/payment/success" element={<PaymentSuccess />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
