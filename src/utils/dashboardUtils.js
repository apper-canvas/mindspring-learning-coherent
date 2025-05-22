import { format, parseISO, isToday, isYesterday, addDays } from 'date-fns';

/**
 * Format a date for display in the dashboard
 * @param {string} dateString - ISO date string
 * @param {boolean} includeTime - Whether to include the time
 * @returns {string} Formatted date string
 */
export const formatDashboardDate = (dateString, includeTime = false) => {
  const date = parseISO(dateString);
  
  if (isToday(date)) {
    return includeTime 
      ? `Today at ${format(date, 'h:mm a')}` 
      : 'Today';
  }
  
  if (isYesterday(date)) {
    return includeTime 
      ? `Yesterday at ${format(date, 'h:mm a')}` 
      : 'Yesterday';
  }
  
  return includeTime 
    ? format(date, 'MMM d, yyyy, h:mm a') 
    : format(date, 'MMM d, yyyy');
};

/**
 * Calculate the time remaining until a deadline
 * @param {string} deadlineString - ISO date string of the deadline
 * @returns {string} Formatted time remaining
 */
export const getTimeRemaining = (deadlineString) => {
  const now = new Date();
  const deadline = parseISO(deadlineString);
  const diffMs = deadline - now;
  
  if (diffMs < 0) {
    return 'Passed';
  }
  
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const diffHours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  
  if (diffDays > 0) {
    return `${diffDays} day${diffDays !== 1 ? 's' : ''} left`;
  }
  
  return `${diffHours} hour${diffHours !== 1 ? 's' : ''} left`;
};

/**
 * Get streak status description based on streak data
 * @param {number} currentStreak - Current streak count
 * @param {number} longestStreak - Longest streak count
 * @returns {string} Status description
 */
export const getStreakStatus = (currentStreak, longestStreak) => {
  if (currentStreak === 0) {
    return "Start learning today to build your streak!";
  }
  
  if (currentStreak === longestStreak && currentStreak > 7) {
    return "Amazing! You're on your longest streak ever!";
  }
  
  if (currentStreak > 3) {
    return "Great consistency! Keep up the good work!";
  }
  
  return "You're building momentum! Keep going!";
};

/**
 * Format minutes into hours and minutes
 * @param {number} minutes - Total minutes
 * @returns {string} Formatted time string
 */
export const formatLearningTime = (minutes) => {
  if (minutes < 60) {
    return `${minutes} minute${minutes !== 1 ? 's' : ''}`;
  }
  
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  
  if (remainingMinutes === 0) {
    return `${hours} hour${hours !== 1 ? 's' : ''}`;
  }
  
  return `${hours} hour${hours !== 1 ? 's' : ''} ${remainingMinutes} minute${remainingMinutes !== 1 ? 's' : ''}`;
};