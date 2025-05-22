import { getIcon } from './iconUtils';

// Icons for badges
export const BadgeIcons = {
  firstStep: getIcon('play-circle'),
  firstLesson: getIcon('check-circle'),
  courseProgress: getIcon('bar-chart-2'),
  courseComplete: getIcon('award'),
  quizMaster: getIcon('brain'),
  offlineLearner: getIcon('wifi-off'),
  streak: getIcon('zap'),
  perfectQuiz: getIcon('trophy'),
  explorer: getIcon('compass'),
  nightOwl: getIcon('moon')
};

// Define badge types with their metadata
export const BADGE_TYPES = {
  FIRST_STEP: {
    id: 'first-step',
    name: 'First Steps',
    description: 'Started your learning journey',
    icon: 'firstStep',
    level: 'beginner',
    points: 5
  },
  FIRST_LESSON: {
    id: 'first-lesson',
    name: 'First Lesson',
    description: 'Completed your first lesson',
    icon: 'firstLesson',
    level: 'beginner',
    points: 10
  },
  HALFWAY: {
    id: 'halfway',
    name: 'Halfway There',
    description: 'Completed 50% of a course',
    icon: 'courseProgress',
    level: 'intermediate',
    points: 25
  },
  COURSE_COMPLETE: {
    id: 'course-complete',
    name: 'Course Mastery',
    description: 'Completed an entire course',
    icon: 'courseComplete',
    level: 'advanced',
    points: 50
  },
  QUIZ_MASTER: {
    id: 'quiz-master',
    name: 'Quiz Master',
    description: 'Achieved a perfect score on a quiz',
    icon: 'perfectQuiz',
    level: 'intermediate',
    points: 30
  },
  OFFLINE_LEARNER: {
    id: 'offline-learner',
    name: 'Offline Learner',
    description: 'Completed a lesson while offline',
    icon: 'offlineLearner',
    level: 'intermediate',
    points: 20
  }
};

// Check if a badge should be awarded based on conditions
export const checkBadgeEligibility = (badgeType, userState) => {
  switch (badgeType) {
    case BADGE_TYPES.FIRST_STEP.id:
      return userState.lessonProgress > 0;
    
    case BADGE_TYPES.FIRST_LESSON.id:
      return userState.completedLessons > 0;
    
    case BADGE_TYPES.HALFWAY.id:
      return userState.courseProgress >= 50;
    
    case BADGE_TYPES.COURSE_COMPLETE.id:
      return userState.courseProgress === 100;
    
    case BADGE_TYPES.QUIZ_MASTER.id:
      return userState.quizScore === userState.quizTotal && userState.quizTotal > 0;
    
    case BADGE_TYPES.OFFLINE_LEARNER.id:
      return userState.completedLessonsOffline > 0;
    
    default:
      return false;
  }
};

// Create a badge instance with metadata, earned timestamp, and course context
export const createBadgeInstance = (badgeType, courseId, courseTitle) => {
  const badge = BADGE_TYPES[badgeType];
  if (!badge) return null;
  
  return {
    id: `${badge.id}-${courseId}-${Date.now()}`,
    badgeTypeId: badge.id,
    name: badge.name,
    description: badge.description,
    icon: badge.icon,
    level: badge.level,
    points: badge.points,
    courseId,
    courseTitle,
    earnedAt: new Date().toISOString(),
    isNew: true
  };
};

// Helper function to get badge icon by type
export const getBadgeIcon = (iconName) => {
  return BadgeIcons[iconName] || BadgeIcons.firstStep;
};

// Get color class based on badge level
export const getBadgeLevelClass = (level) => {
  switch (level) {
    case 'beginner':
      return 'badge-beginner';
    case 'intermediate':
      return 'badge-intermediate';
    default:
      return 'badge-beginner';
  }
};