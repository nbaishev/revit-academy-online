export interface Lesson {
  id: string;
  title: string;
  duration: string;
  videoId: string;
  completed?: boolean;
}

export interface Module {
  id: string;
  title: string;
  lessons: Lesson[];
}

export interface Course {
  id: string;
  title: string;
  shortDescription: string;
  description: string;
  level: 'Начинающий' | 'Средний' | 'Продвинутый';
  price: number | null; // null means free
  thumbnail: string;
  duration: string;
  lessonsCount: number;
  studentsCount: number;
  rating: number;
  instructor: string;
  outcomes: string[];
  targetAudience: string[];
  modules: Module[];
  isFeatured?: boolean;
}

export const courses: Course[] = [
  {
    id: 'revit-basics',
    title: 'Основы Autodesk Revit',
    shortDescription: 'Полное введение в BIM-проектирование для начинающих',
    description: 'Этот курс предназначен для тех, кто только начинает изучать Autodesk Revit. Вы научитесь создавать архитектурные модели, работать с семействами, настраивать виды и листы, а также освоите основные инструменты моделирования.',
    level: 'Начинающий',
    price: null,
    thumbnail: '/placeholder.svg',
    duration: '12 часов',
    lessonsCount: 24,
    studentsCount: 1542,
    rating: 4.8,
    instructor: 'Алексей Петров',
    outcomes: [
      'Создавать архитектурные модели с нуля',
      'Работать с базовыми инструментами моделирования',
      'Настраивать виды и оформлять чертежи',
      'Понимать принципы BIM-проектирования',
      'Использовать семейства и компоненты',
    ],
    targetAudience: [
      'Начинающие архитекторы и проектировщики',
      'Студенты строительных специальностей',
      'Инженеры, переходящие на BIM',
    ],
    modules: [
      {
        id: 'module-1',
        title: 'Введение в Revit',
        lessons: [
          { id: 'lesson-1-1', title: 'Интерфейс программы', duration: '15:00', videoId: 'dQw4w9WgXcQ' },
          { id: 'lesson-1-2', title: 'Настройка проекта', duration: '20:00', videoId: 'dQw4w9WgXcQ' },
          { id: 'lesson-1-3', title: 'Навигация по модели', duration: '18:00', videoId: 'dQw4w9WgXcQ' },
        ],
      },
      {
        id: 'module-2',
        title: 'Базовое моделирование',
        lessons: [
          { id: 'lesson-2-1', title: 'Стены и перегородки', duration: '25:00', videoId: 'dQw4w9WgXcQ' },
          { id: 'lesson-2-2', title: 'Двери и окна', duration: '22:00', videoId: 'dQw4w9WgXcQ' },
          { id: 'lesson-2-3', title: 'Перекрытия', duration: '20:00', videoId: 'dQw4w9WgXcQ' },
          { id: 'lesson-2-4', title: 'Крыши', duration: '30:00', videoId: 'dQw4w9WgXcQ' },
        ],
      },
      {
        id: 'module-3',
        title: 'Оформление документации',
        lessons: [
          { id: 'lesson-3-1', title: 'Создание видов', duration: '20:00', videoId: 'dQw4w9WgXcQ' },
          { id: 'lesson-3-2', title: 'Размеры и аннотации', duration: '25:00', videoId: 'dQw4w9WgXcQ' },
          { id: 'lesson-3-3', title: 'Листы и штампы', duration: '22:00', videoId: 'dQw4w9WgXcQ' },
        ],
      },
    ],
    isFeatured: true,
  },
  {
    id: 'revit-architecture',
    title: 'Архитектурное проектирование в Revit',
    shortDescription: 'Продвинутые техники архитектурного моделирования',
    description: 'Углублённый курс по архитектурному проектированию. Изучите сложные формы, адаптивные компоненты, работу с фасадами и создание детальной документации для строительства.',
    level: 'Средний',
    price: 4990,
    thumbnail: '/placeholder.svg',
    duration: '18 часов',
    lessonsCount: 32,
    studentsCount: 876,
    rating: 4.9,
    instructor: 'Мария Сидорова',
    outcomes: [
      'Создавать сложные архитектурные формы',
      'Работать с витражными системами',
      'Проектировать фасады',
      'Создавать адаптивные семейства',
      'Оформлять проектную документацию',
    ],
    targetAudience: [
      'Архитекторы с базовыми знаниями Revit',
      'Проектировщики фасадов',
      'BIM-специалисты',
    ],
    modules: [
      {
        id: 'module-1',
        title: 'Сложные формы',
        lessons: [
          { id: 'lesson-1-1', title: 'Концептуальное моделирование', duration: '30:00', videoId: 'dQw4w9WgXcQ' },
          { id: 'lesson-1-2', title: 'Формообразующие', duration: '35:00', videoId: 'dQw4w9WgXcQ' },
          { id: 'lesson-1-3', title: 'Адаптивные компоненты', duration: '40:00', videoId: 'dQw4w9WgXcQ' },
        ],
      },
      {
        id: 'module-2',
        title: 'Фасадные системы',
        lessons: [
          { id: 'lesson-2-1', title: 'Витражи и панели', duration: '35:00', videoId: 'dQw4w9WgXcQ' },
          { id: 'lesson-2-2', title: 'Навесные фасады', duration: '40:00', videoId: 'dQw4w9WgXcQ' },
        ],
      },
    ],
    isFeatured: true,
  },
  {
    id: 'revit-mep',
    title: 'Инженерные системы в Revit MEP',
    shortDescription: 'Проектирование ОВиК, ВК и электрики',
    description: 'Полный курс по проектированию инженерных систем в Revit MEP. Охватывает вентиляцию, кондиционирование, водоснабжение, канализацию и электрические системы.',
    level: 'Средний',
    price: 5990,
    thumbnail: '/placeholder.svg',
    duration: '24 часа',
    lessonsCount: 42,
    studentsCount: 654,
    rating: 4.7,
    instructor: 'Дмитрий Козлов',
    outcomes: [
      'Проектировать системы вентиляции',
      'Создавать схемы водоснабжения',
      'Работать с электрическими системами',
      'Выполнять расчёты инженерных систем',
    ],
    targetAudience: [
      'Инженеры ОВиК',
      'Инженеры ВК',
      'Проектировщики электрических систем',
    ],
    modules: [
      {
        id: 'module-1',
        title: 'ОВиК',
        lessons: [
          { id: 'lesson-1-1', title: 'Воздуховоды', duration: '30:00', videoId: 'dQw4w9WgXcQ' },
          { id: 'lesson-1-2', title: 'Оборудование', duration: '25:00', videoId: 'dQw4w9WgXcQ' },
        ],
      },
    ],
    isFeatured: true,
  },
  {
    id: 'revit-structure',
    title: 'Конструкции в Revit Structure',
    shortDescription: 'Проектирование несущих конструкций',
    description: 'Изучите проектирование железобетонных и металлических конструкций, армирование, создание рабочей документации для строительства.',
    level: 'Средний',
    price: 4490,
    thumbnail: '/placeholder.svg',
    duration: '16 часов',
    lessonsCount: 28,
    studentsCount: 432,
    rating: 4.6,
    instructor: 'Игорь Волков',
    outcomes: [
      'Моделировать ЖБ конструкции',
      'Создавать армирование',
      'Работать с металлоконструкциями',
    ],
    targetAudience: [
      'Конструкторы',
      'Инженеры-проектировщики',
    ],
    modules: [
      {
        id: 'module-1',
        title: 'Основы',
        lessons: [
          { id: 'lesson-1-1', title: 'Введение в Revit Structure', duration: '20:00', videoId: 'dQw4w9WgXcQ' },
        ],
      },
    ],
  },
  {
    id: 'revit-families',
    title: 'Создание семейств в Revit',
    shortDescription: 'Мастер-класс по созданию параметрических семейств',
    description: 'Научитесь создавать собственные параметрические семейства для любых задач. От простых элементов до сложных адаптивных компонентов.',
    level: 'Продвинутый',
    price: 6990,
    thumbnail: '/placeholder.svg',
    duration: '20 часов',
    lessonsCount: 35,
    studentsCount: 321,
    rating: 4.9,
    instructor: 'Анна Белова',
    outcomes: [
      'Создавать параметрические семейства',
      'Использовать вложенные семейства',
      'Работать с формулами и параметрами',
    ],
    targetAudience: [
      'BIM-менеджеры',
      'Опытные пользователи Revit',
    ],
    modules: [
      {
        id: 'module-1',
        title: 'Основы семейств',
        lessons: [
          { id: 'lesson-1-1', title: 'Типы семейств', duration: '25:00', videoId: 'dQw4w9WgXcQ' },
        ],
      },
    ],
  },
  {
    id: 'revit-dynamo',
    title: 'Dynamo для Revit',
    shortDescription: 'Визуальное программирование и автоматизация',
    description: 'Освойте Dynamo для автоматизации рутинных задач, генеративного дизайна и работы с данными в Revit проектах.',
    level: 'Продвинутый',
    price: 7490,
    thumbnail: '/placeholder.svg',
    duration: '22 часа',
    lessonsCount: 38,
    studentsCount: 287,
    rating: 4.8,
    instructor: 'Павел Морозов',
    outcomes: [
      'Автоматизировать рутинные задачи',
      'Создавать генеративные формы',
      'Работать с данными модели',
    ],
    targetAudience: [
      'BIM-специалисты',
      'Разработчики плагинов',
    ],
    modules: [
      {
        id: 'module-1',
        title: 'Введение в Dynamo',
        lessons: [
          { id: 'lesson-1-1', title: 'Интерфейс Dynamo', duration: '20:00', videoId: 'dQw4w9WgXcQ' },
        ],
      },
    ],
  },
];

export const getCourseById = (id: string): Course | undefined => {
  return courses.find(course => course.id === id);
};

export const getFeaturedCourses = (): Course[] => {
  return courses.filter(course => course.isFeatured);
};

export const getFreeCourses = (): Course[] => {
  return courses.filter(course => course.price === null);
};

export const getPaidCourses = (): Course[] => {
  return courses.filter(course => course.price !== null);
};
