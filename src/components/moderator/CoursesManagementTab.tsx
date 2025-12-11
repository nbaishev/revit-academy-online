import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { courses as initialCourses, Course } from '@/data/courses';
import { Plus, Search, Edit, Trash2, Eye } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { CourseForm } from './CourseForm';
import { toast } from 'sonner';

export function CoursesManagementTab() {
  const [courses, setCourses] = useState<Course[]>(initialCourses);
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);

  const filteredCourses = courses.filter(
    (course) =>
      course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddCourse = (courseData: Partial<Course>) => {
    const newCourse: Course = {
      id: `course-${Date.now()}`,
      title: courseData.title || '',
      shortDescription: courseData.shortDescription || '',
      description: courseData.description || '',
      thumbnail: '/placeholder.svg',
      price: courseData.price ?? null,
      duration: courseData.duration || '0 часов',
      lessonsCount: courseData.lessonsCount || 0,
      level: courseData.level || 'Начинающий',
      modules: courseData.modules || [],
      outcomes: courseData.outcomes || [],
      targetAudience: courseData.targetAudience || [],
      studentsCount: 0,
      rating: 0,
      instructor: 'Новый инструктор',
    };
    setCourses([...courses, newCourse]);
    setIsAddDialogOpen(false);
    toast.success('Курс успешно добавлен');
  };

  const handleEditCourse = (courseData: Partial<Course>) => {
    if (!editingCourse) return;
    
    setCourses(
      courses.map((c) =>
        c.id === editingCourse.id ? { ...c, ...courseData } : c
      )
    );
    setEditingCourse(null);
    toast.success('Курс успешно обновлён');
  };

  const handleDeleteCourse = (courseId: string) => {
    setCourses(courses.filter((c) => c.id !== courseId));
    toast.success('Курс удалён');
  };

  return (
    <div className="space-y-6">
      {/* Header with search and add button */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Поиск курсов..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gradient-primary text-primary-foreground">
              <Plus className="mr-2 h-4 w-4" />
              Добавить курс
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Создать новый курс</DialogTitle>
              <DialogDescription>
                Заполните информацию о новом курсе
              </DialogDescription>
            </DialogHeader>
            <CourseForm onSubmit={handleAddCourse} onCancel={() => setIsAddDialogOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>

      {/* Courses list */}
      <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle>Все курсы ({filteredCourses.length})</CardTitle>
          <CardDescription>Управление курсами платформы</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredCourses.map((course) => (
              <div
                key={course.id}
                className="flex flex-col gap-4 rounded-lg border border-border/50 bg-background/50 p-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="flex items-start gap-4">
                  <img
                    src={course.thumbnail}
                    alt={course.title}
                    className="h-16 w-24 rounded-lg object-cover"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="font-medium">{course.title}</h4>
                      {course.price === null ? (
                        <Badge variant="secondary" className="bg-green-500/10 text-green-600">
                          Бесплатно
                        </Badge>
                      ) : (
                        <Badge variant="secondary">{course.price.toLocaleString()} ₽</Badge>
                      )}
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground line-clamp-1">
                      {course.shortDescription}
                    </p>
                    <div className="mt-2 flex items-center gap-4 text-xs text-muted-foreground">
                      <span>{course.level}</span>
                      <span>•</span>
                      <span>{course.duration}</span>
                      <span>•</span>
                      <span>{course.lessonsCount} уроков</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="icon" asChild>
                    <Link to={`/courses/${course.id}`}>
                      <Eye className="h-4 w-4" />
                    </Link>
                  </Button>
                  <Dialog
                    open={editingCourse?.id === course.id}
                    onOpenChange={(open) => !open && setEditingCourse(null)}
                  >
                    <DialogTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setEditingCourse(course)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>Редактировать курс</DialogTitle>
                        <DialogDescription>
                          Измените информацию о курсе
                        </DialogDescription>
                      </DialogHeader>
                      <CourseForm
                        course={course}
                        onSubmit={handleEditCourse}
                        onCancel={() => setEditingCourse(null)}
                      />
                    </DialogContent>
                  </Dialog>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-destructive hover:text-destructive"
                    onClick={() => handleDeleteCourse(course.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}

            {filteredCourses.length === 0 && (
              <div className="py-12 text-center text-muted-foreground">
                Курсы не найдены
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
