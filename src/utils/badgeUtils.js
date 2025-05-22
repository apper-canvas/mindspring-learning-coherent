import { v4 as uuidv4 } from 'uuid';
import { getIcon } from './iconUtils';

// Badge Types & Levels
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

// Badge type definitions
export const BADGE_TYPES = {
  COURSE_STARTER: {
    id: 'course_starter',
    name: 'Course Starter',
    description: 'Started your first course',
    icon: 'play',
    level: BADGE_LEVELS.BRONZE,
    category: BADGE_CATEGORIES.ENGAGEMENT,
    points: 10
  },
  COURSE_COMPLETION: {
    id: 'course_completion',
    name: 'Course Completer',
    description: 'Completed a full course',
    icon: 'check-circle',
    level: BADGE_LEVELS.SILVER,
    category: BADGE_CATEGORIES.COMPLETION,
    points: 50
  },
  PERFECT_QUIZ: {
    id: 'perfect_quiz',
    name: 'Perfect Score',
    description: 'Achieved 100% on a quiz',
    icon: 'target',
    level: BADGE_LEVELS.GOLD,
    category: BADGE_CATEGORIES.ACHIEVEMENT,
    points: 100
  },
  FAST_LEARNER: {
    id: 'fast_learner',
    name: 'Fast Learner',
    description: 'Completed a course in record time',
    icon: 'zap',
    level: BADGE_LEVELS.SILVER,
    category: BADGE_CATEGORIES.ACHIEVEMENT,
    points: 75
  },
  STREAK_MASTER: {
    id: 'streak_master',
    name: 'Streak Master',
    description: 'Learned for 7 days in a row',
    icon: 'flame',
    level: BADGE_LEVELS.GOLD,
    category: BADGE_CATEGORIES.ENGAGEMENT,
    points: 150
  },
  SOCIAL_BUTTERFLY: {
    id: 'social_butterfly',
    name: 'Social Butterfly',
    description: 'Made 5 comments in the community',
    icon: 'message-circle',
    level: BADGE_LEVELS.BRONZE,
    category: BADGE_CATEGORIES.ENGAGEMENT,
    points: 25
  },
  NIGHT_OWL: {
    id: 'night_owl',
    name: 'Night Owl',
    description: 'Studied after midnight',
    icon: 'moon',
    level: BADGE_LEVELS.BRONZE,
    category: BADGE_CATEGORIES.SPECIAL,
    points: 15
  },
  KNOWLEDGE_EXPLORER: {
    id: 'knowledge_explorer',
    name: 'Knowledge Explorer',
    description: 'Explored 10 different categories',
    icon: 'compass',
    level: BADGE_LEVELS.PLATINUM,
    category: BADGE_CATEGORIES.ACHIEVEMENT,
    points: 200
  }
};

// Create a badge instance for a user
export const createBadgeInstance = (badgeType, courseId = null, courseTitle = null) => {
  if (!BADGE_TYPES[badgeType]) {
    console.error(`Badge type ${badgeType} does not exist`);
    return null;
  }
  
  const badgeTemplate = BADGE_TYPES[badgeType];
  return {
    id: uuidv4(),
    badgeTypeId: badgeTemplate.id,
    name: badgeTemplate.name,
    description: badgeTemplate.description,
    icon: badgeTemplate.icon,
    level: badgeTemplate.level,
    category: badgeTemplate.category,
    points: badgeTemplate.points,
    courseId: courseId,
    courseTitle: courseTitle,
    earnedAt: new Date().toISOString(),
    isNew: true
  };
};

// Check if user is eligible for a badge
export const checkBadgeEligibility = (badgeTypeId, userState) => {
  // Implement eligibility logic based on the badge type and user state
  switch (badgeTypeId) {
    case 'course_starter':
      return userState.startedCourses && userState.startedCourses.length > 0;
    
    case 'course_completion':
      return userState.completedCourses && userState.completedCourses.length > 0;
    
    case 'perfect_quiz':
      return userState.quizScores && userState.quizScores.some(score => score.percentage === 100);
    
    case 'fast_learner':
      return userState.completedCourses && userState.completedCourses.some(
        course => course.timeSpent && course.timeSpent < course.averageTimeToComplete * 0.7
      );
    
    case 'streak_master':
      return userState.streak && userState.streak >= 7;
    
    case 'social_butterfly':
      return userState.comments && userState.comments.length >= 5;
    
    case 'night_owl':
      const now = new Date();
      return now.getHours() >= 0 && now.getHours() < 5 && userState.activeToday;
    
    case 'knowledge_explorer':
      return userState.exploredCategories && userState.exploredCategories.length >= 10;
    
    default:
      return false;
  }
};

// Helper functions for badge display
export const getBadgeIcon = (iconName) => getIcon(iconName);

export const getBadgeLevelClass = (level) => {
  switch (level) {
    case BADGE_LEVELS.BRONZE:
      return 'bg-gradient-to-r from-badge-beginner to-badge-beginner/80';
    case BADGE_LEVELS.SILVER:
      return 'bg-gradient-to-r from-gray-400 to-gray-300';
    case BADGE_LEVELS.GOLD:
      return 'bg-gradient-to-r from-badge-intermediate to-badge-intermediate/80';
    case BADGE_LEVELS.PLATINUM:
      return 'bg-gradient-to-r from-indigo-600 to-purple-600';
    default:
      return 'bg-gradient-to-r from-gray-500 to-gray-400';
  }
};