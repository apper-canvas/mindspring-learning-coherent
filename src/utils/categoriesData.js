// This file contains sample data for the explore page categories

export const categories = [
  {
    id: 'programming',
    title: 'Programming Languages',
    description: 'Learn the fundamentals and advanced concepts of popular programming languages.',
    icon: 'code',
    color: 'primary',
    type: 'learning',
    count: 12,
    path: '/courses?category=programming'
  },
  {
    id: 'data-science',
    title: 'Data Science & Analytics',
    description: 'Master the tools and techniques for data analysis, visualization, and machine learning.',
    icon: 'bar-chart',
    color: 'accent',
    type: 'learning',
    count: 8,
    path: '/courses?category=data-science'
  },
  {
    id: 'web-development',
    title: 'Web Development',
    description: 'Build modern, responsive websites and web applications with the latest technologies.',
    icon: 'globe',
    color: 'secondary',
    type: 'learning',
    count: 15,
    path: '/courses?category=web-development'
  },
  {
    id: 'mobile-development',
    title: 'Mobile App Development',
    description: 'Create native and cross-platform mobile applications for iOS and Android.',
    icon: 'smartphone',
    color: 'primary',
    type: 'learning',
    count: 7,
    path: '/courses?category=mobile-development'
  },
  {
    id: 'languages',
    title: 'Language Learning',
    description: 'Learn new languages with interactive lessons, exercises, and speech recognition.',
    icon: 'message-circle',
    color: 'secondary',
    type: 'learning',
    count: 10,
    path: '/courses?category=languages'
  },
  {
    id: 'study-groups',
    title: 'Study Groups',
    description: 'Join or create study groups to collaborate with other learners on specific topics.',
    icon: 'users',
    color: 'accent',
    type: 'community',
    count: 24,
    path: '/community/study-groups'
  },
  {
    id: 'forums',
    title: 'Discussion Forums',
    description: 'Engage in discussions, ask questions, and share knowledge with the community.',
    icon: 'message-square',
    color: 'primary',
    type: 'community',
    count: 18,
    path: '/community/forums'
  },
  {
    id: 'mentorship',
    title: 'Mentorship Programs',
    description: 'Connect with experienced mentors who can guide you through your learning journey.',
    icon: 'user-check',
    color: 'secondary',
    type: 'community',
    count: 5,
    path: '/community/mentorship'
  },
  {
    id: 'challenges',
    title: 'Coding Challenges',
    description: 'Test your skills and learn by solving practical programming problems and puzzles.',
    icon: 'zap',
    color: 'accent',
    type: 'practice',
    count: 30,
    path: '/practice/challenges'
  },
  {
    id: 'projects',
    title: 'Practice Projects',
    description: 'Apply your knowledge by building real-world projects with step-by-step guidance.',
    icon: 'folder',
    color: 'primary',
    type: 'practice',
    count: 22,
    path: '/practice/projects'
  },
  {
    id: 'quizzes',
    title: 'Interactive Quizzes',
    description: 'Reinforce your learning with interactive quizzes and immediate feedback.',
    icon: 'help-circle',
    color: 'secondary',
    type: 'practice',
    count: 45,
    path: '/practice/quizzes'
  },
  {
    id: 'resources',
    title: 'Learning Resources',
    description: 'Discover books, articles, videos, and other resources to supplement your learning.',
    icon: 'book',
    color: 'accent',
    type: 'resources',
    count: 60,
    path: '/resources/library'
  }
];

export default categories;