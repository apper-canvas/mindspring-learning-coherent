 import { v4 as uuidv4 } from 'uuid';
 import { getIcon } from './iconUtils';
 
// Badge Types & Levels
export const BADGE_TYPES = {
  FIRST_STEP: 'FIRST_STEP',
  FIRST_LESSON: 'FIRST_LESSON',
  OFFLINE_WARRIOR: 'OFFLINE_WARRIOR',
  HALFWAY: 'HALFWAY',
  COURSE_COMPLETE: 'COURSE_COMPLETE',
  QUIZ_MASTER: 'QUIZ_MASTER',
  COURSE_STARTER: 'COURSE_STARTER'
};

export const BADGE_LEVELS = {
  BRONZE: 'bronze',
  SILVER: 'silver',
  GOLD: 'gold',
  PLATINUM: 'platinum'
};

export const BADGE_CATEGORIES = {
  COMPLETION: 'completion',
  ENGAGEMENT: 'engagement',
  ACHIEVEMENT: 'achievement',
  SPECIAL: 'special'
};

// Helper functions to create badge objects
export const createBadge = (badgeType, level, category, courseTitle) => {
  switch (badgeType) {
    case 'FIRST_STEP':
      return createFirstStepBadge(courseTitle);
    case 'FIRST_LESSON':
      return createFirstLessonBadge(courseTitle);
    case 'OFFLINE_WARRIOR':
      return createOfflineWarriorBadge(courseTitle);
    case 'HALFWAY':
      return createHalfwayBadge(courseTitle);
    case 'COURSE_COMPLETE':
      return createCourseCompleteBadge(courseTitle);
    case 'QUIZ_MASTER':
      return createQuizMasterBadge(courseTitle);
     default:
      return createDefaultBadge(level, category, courseTitle);
  }
};

// Helper functions to create specific badge objects
const createFirstStepBadge = (courseTitle) => ({
  id: uuidv4(),
  title: "First Steps",
  description: `Started learning ${courseTitle}`,
  icon: "play", 
  type: BADGE_TYPES.FIRST_STEP,
  level: BADGE_LEVELS.BRONZE,
  category: BADGE_CATEGORIES.ENGAGEMENT,
  points: 10
});

const createFirstLessonBadge = (courseTitle) => ({
  id: uuidv4(),
  title: "Fast Learner",
  description: `Completed your first lesson in ${courseTitle}`, 
  icon: "check-circle",
  type: BADGE_TYPES.FIRST_LESSON,
  level: BADGE_LEVELS.BRONZE,
  category: BADGE_CATEGORIES.COMPLETION,
  points: 20
});

const createOfflineWarriorBadge = (courseTitle) => ({
  title: "Offline Warrior", 
  title: "Offline Warrior",
  type: BADGE_TYPES.OFFLINE_WARRIOR,
  description: `Completed a lesson in ${courseTitle} while offline`,
  icon: "wifi-off",
  level: BADGE_LEVELS.SILVER,
  category: BADGE_CATEGORIES.SPECIAL,
  points: 30
});

const createHalfwayBadge = (courseTitle) => ({
  id: uuidv4(),
  title: "Halfway There",
  description: `Completed 50% of ${courseTitle}`, 
  icon: "flag",
  type: BADGE_TYPES.HALFWAY,
  level: BADGE_LEVELS.SILVER,
  category: BADGE_CATEGORIES.ACHIEVEMENT,
  points: 50
});

const createCourseCompleteBadge = (courseTitle) => ({
  id: uuidv4(),
  title: "Course Mastery",
  description: `Completed the entire ${courseTitle} course`, 
  type: BADGE_TYPES.COURSE_COMPLETE,
  icon: "award",
  level: BADGE_LEVELS.GOLD,
  category: BADGE_CATEGORIES.COMPLETION,
  points: 100
});

const createQuizMasterBadge = (courseTitle) => ({
  id: uuidv4(),
  title: "Quiz Master",
  description: `Achieved a perfect score in a ${courseTitle} quiz`, 
  icon: "star",
  type: BADGE_TYPES.QUIZ_MASTER,
  level: BADGE_LEVELS.GOLD,
  category: BADGE_CATEGORIES.ACHIEVEMENT,
  points: 75
});

const createDefaultBadge = (level, category, courseTitle) => ({
  id: uuidv4(),
  title: "Achievement Unlocked",
  description: `Earned a badge in ${courseTitle}`, 
  icon: "award",
  type: BADGE_TYPES.COURSE_STARTER,
  level: level || BADGE_LEVELS.BRONZE,
  category: category || BADGE_CATEGORIES.ACHIEVEMENT,
  points: 25
});