import { faker } from '@faker-js/faker';
import { format, subDays, subWeeks, subMonths } from 'date-fns';

// Generate consistent fake users to ensure stable leaderboard
faker.seed(123);

// Constants for time periods
export const LEADERBOARD_PERIODS = {
  WEEKLY: 'weekly',
  MONTHLY: 'monthly',
  ALL_TIME: 'all-time'
};

// Generate a consistent set of users for the leaderboard
const generateUsers = (count) => {
  const users = [];
  for (let i = 0; i < count; i++) {
    users.push({
      id: i + 1,
      name: faker.person.fullName(),
      avatar: faker.image.avatar(),
      isCurrentUser: i === 3, // Make the 4th user the current user
    });
  }
  return users;
};

// Cache the generated users
const leaderboardUsers = generateUsers(30);

// Generate leaderboard entries based on time period
export const generateLeaderboardData = (courseId, period = LEADERBOARD_PERIODS.WEEKLY) => {
  // Get date ranges based on period
  const now = new Date();
  let startDate;
  
  switch (period) {
    case LEADERBOARD_PERIODS.WEEKLY:
      startDate = subWeeks(now, 1);
      break;
    case LEADERBOARD_PERIODS.MONTHLY:
      startDate = subMonths(now, 1);
      break;
    case LEADERBOARD_PERIODS.ALL_TIME:
      startDate = subMonths(now, 12); // Use 12 months as "all time" for demo
      break;
    default:
      startDate = subWeeks(now, 1);
  }

  // Format for display
  const formattedStartDate = format(startDate, 'MMM d, yyyy');
  const formattedEndDate = format(now, 'MMM d, yyyy');

  // Generate entries for the leaderboard
  const entries = leaderboardUsers.map(user => {
    // Make progress data vary based on period and user
    // Current user should always be in top 5 for engagement
    const baseProgress = user.isCurrentUser ? 75 : (Math.random() * 60) + 20;
    const progressFactor = period === LEADERBOARD_PERIODS.WEEKLY ? 0.8 : 
                          period === LEADERBOARD_PERIODS.MONTHLY ? 0.9 : 1;
    
    // Generate varied stats for different periods
    const completionPercentage = Math.min(100, Math.round(baseProgress * progressFactor));
    const quizScore = Math.round((baseProgress / 100) * 100);
    const lessonCount = Math.round((baseProgress / 100) * 24); // Assuming max 24 lessons
    const badgesEarned = Math.round((baseProgress / 100) * 10); // Max 10 badges
    const points = calculatePoints(completionPercentage, quizScore, lessonCount, badgesEarned);
    
    // Add last active date
    const daysAgo = Math.floor(Math.random() * 7);
    const lastActive = subDays(now, user.isCurrentUser ? 0 : daysAgo);
    
    return {
      ...user,
      completionPercentage,
      quizScore,
      lessonCount,
      badgesEarned,
      points,
      lastActive: format(lastActive, 'MMM d, yyyy')
    };
  });

  // Sort by points (descending)
  entries.sort((a, b) => b.points - a.points);
  
  // Add rank
  const rankedEntries = entries.map((entry, index) => ({
    ...entry,
    rank: index + 1
  }));

  return {
    courseId,
    period,
    dateRange: {
      start: formattedStartDate,
      end: formattedEndDate
    },
    entries: rankedEntries
  };
};

// Calculate leaderboard points based on various factors
const calculatePoints = (completionPercentage, quizScore, lessonCount, badgesEarned) => {
  // Weight factors
  const completionWeight = 1;
  const quizWeight = 2;
  const lessonWeight = 0.5;
  const badgeWeight = 5;
  
  // Calculate total points
  const points = Math.round(
    (completionPercentage * completionWeight) +
    (quizScore * quizWeight) +
    (lessonCount * lessonWeight) +
    (badgesEarned * badgeWeight)
  );
  
  return points;
};

// Get the current user's position in the leaderboard
export const getCurrentUserPosition = (leaderboardData) => {
  if (!leaderboardData || !leaderboardData.entries) return null;
  
  const currentUser = leaderboardData.entries.find(entry => entry.isCurrentUser);
  if (!currentUser) return null;
  
  return {
    rank: currentUser.rank,
    totalUsers: leaderboardData.entries.length,
    percentile: Math.round((1 - (currentUser.rank / leaderboardData.entries.length)) * 100)
  };
};

// Format large numbers with k/m suffix (e.g., 1.2k, 3.4m)
export const formatNumber = (num) => {
  if (num < 1000) return num.toString();
  if (num < 1000000) return `${(num / 1000).toFixed(1)}k`;
  return `${(num / 1000000).toFixed(1)}m`;
};