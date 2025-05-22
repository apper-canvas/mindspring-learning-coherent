 import { v4 as uuidv4 } from 'uuid';
 
import { v4 as uuidv4 } from 'uuid';
 import { getIcon } from './iconUtils';
 
 // Badge Types & Levels
   COURSE_STARTER: {
     id: 'course_starter',
 
// Helper functions to create badge objects
export const createBadge = (badgeType, level, category, courseTitle) => {
  switch (badgeType) {
    case BADGE_TYPES.FIRST_STEP:
      return createFirstStepBadge(courseTitle);
    case BADGE_TYPES.FIRST_LESSON:
      return createFirstLessonBadge(courseTitle);
    case BADGE_TYPES.OFFLINE_WARRIOR:
      return createOfflineWarriorBadge(courseTitle);
    case BADGE_TYPES.HALFWAY:
      return createHalfwayBadge(courseTitle);
    case BADGE_TYPES.COURSE_COMPLETE:
      return createCourseCompleteBadge(courseTitle);
    case BADGE_TYPES.QUIZ_MASTER:
      return createQuizMasterBadge(courseTitle);
    default:
      return createDefaultBadge(level, category, courseTitle);
  }
};

// Helper functions to create badge objects
const createFirstStepBadge = (courseTitle) => ({
  id: uuidv4(),
  type: BADGE_TYPES.FIRST_STEP,
  title: "First Steps",
  description: `Started learning ${courseTitle}`,
  icon: "play",
  level: BADGE_LEVELS.BRONZE,
  category: BADGE_CATEGORIES.ENGAGEMENT,
  points: 10
});

const createFirstLessonBadge = (courseTitle) => ({
  id: uuidv4(),
  type: BADGE_TYPES.FIRST_LESSON,
  title: "Fast Learner",
  description: `Completed your first lesson in ${courseTitle}`,
  icon: "check-circle",
  level: BADGE_LEVELS.BRONZE,
  category: BADGE_CATEGORIES.COMPLETION,
  points: 20
});

const createOfflineWarriorBadge = (courseTitle) => ({
  id: uuidv4(),
  type: BADGE_TYPES.OFFLINE_WARRIOR,
  title: "Offline Warrior",
  description: `Completed a lesson in ${courseTitle} while offline`,
  icon: "wifi-off",
  level: BADGE_LEVELS.SILVER,
  category: BADGE_CATEGORIES.SPECIAL,
  points: 30
});

const createHalfwayBadge = (courseTitle) => ({
  id: uuidv4(),
  type: BADGE_TYPES.HALFWAY,
  title: "Halfway There",
  description: `Completed 50% of ${courseTitle}`,
  icon: "flag",
  level: BADGE_LEVELS.SILVER,
  category: BADGE_CATEGORIES.ACHIEVEMENT,
  points: 50
});

const createCourseCompleteBadge = (courseTitle) => ({
  id: uuidv4(),
  type: BADGE_TYPES.COURSE_COMPLETE,
  title: "Course Mastery",
  description: `Completed the entire ${courseTitle} course`,
  icon: "award",
  level: BADGE_LEVELS.GOLD,
  category: BADGE_CATEGORIES.COMPLETION,
  points: 100
});

const createQuizMasterBadge = (courseTitle) => ({
  id: uuidv4(),
  type: BADGE_TYPES.QUIZ_MASTER,
  title: "Quiz Master",
  description: `Achieved a perfect score in a ${courseTitle} quiz`,
  icon: "star",
  level: BADGE_LEVELS.GOLD,
  category: BADGE_CATEGORIES.ACHIEVEMENT,
  points: 75
});

const createDefaultBadge = (level, category, courseTitle) => ({
  id: uuidv4(),
  title: "Achievement Unlocked",
  description: `Earned a badge in ${courseTitle}`,
  icon: "award",
  level: level || BADGE_LEVELS.BRONZE,
  category: category || BADGE_CATEGORIES.ACHIEVEMENT,
  points: 25
});
     name: 'Course Starter',
     description: 'Started your first course',
     icon: 'play',
       return 'bg-gradient-to-r from-gray-500 to-gray-400';
   }
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
  level: BADGE_LEVELS.BRONZE,
  category: BADGE_CATEGORIES.ENGAGEMENT,
  points: 10
});

const createFirstLessonBadge = (courseTitle) => ({
  id: uuidv4(),
  title: "Fast Learner",
  description: `Completed your first lesson in ${courseTitle}`,
  icon: "check-circle",
  level: BADGE_LEVELS.BRONZE,
  category: BADGE_CATEGORIES.COMPLETION,
  points: 20
});

const createOfflineWarriorBadge = (courseTitle) => ({
  id: uuidv4(),
  title: "Offline Warrior",
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
  level: BADGE_LEVELS.SILVER,
  category: BADGE_CATEGORIES.ACHIEVEMENT,
  points: 50
});

const createCourseCompleteBadge = (courseTitle) => ({
  id: uuidv4(),
  title: "Course Mastery",
  description: `Completed the entire ${courseTitle} course`,
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
  level: BADGE_LEVELS.GOLD,
  category: BADGE_CATEGORIES.ACHIEVEMENT,
  points: 75
});

const createDefaultBadge = (level, category, courseTitle) => ({
  id: uuidv4(),
  title: "Achievement Unlocked",
  description: `Earned a badge in ${courseTitle}`,
  icon: "award",
  level: level || BADGE_LEVELS.BRONZE,
  category: category || BADGE_CATEGORIES.ACHIEVEMENT,
  points: 25
});