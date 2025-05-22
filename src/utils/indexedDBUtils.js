import { openDB } from 'idb';

const DB_NAME = 'mindspring-offline';
const DB_VERSION = 5;
const COURSES_STORE = 'courses';
const PROGRESS_STORE = 'progress';
const BADGES_STORE = 'badges';
const MODULE_PROGRESS_STORE = 'moduleProgress';
const LEADERBOARD_STORE = 'leaderboards';
const RESOURCES_STORE = 'resources';

const initDB = async () => {
  return openDB(DB_NAME, DB_VERSION, {
    upgrade(db) {
      // Create a store of objects
      if (!db.objectStoreNames.contains(COURSES_STORE)) {
        db.createObjectStore(COURSES_STORE, { keyPath: 'id' });
      }
      
      if (!db.objectStoreNames.contains(PROGRESS_STORE)) {
        db.createObjectStore(PROGRESS_STORE, { keyPath: 'id' });
      }
      
      if (!db.objectStoreNames.contains(BADGES_STORE)) {
        db.createObjectStore(BADGES_STORE, { keyPath: 'id' });
      }

      if (!db.objectStoreNames.contains(MODULE_PROGRESS_STORE)) {
        db.createObjectStore(MODULE_PROGRESS_STORE, { keyPath: 'id' });
      }
      
      if (!db.objectStoreNames.contains(LEADERBOARD_STORE)) {
        db.createObjectStore(LEADERBOARD_STORE, { keyPath: 'id' });
      }
      
      if (!db.objectStoreNames.contains(RESOURCES_STORE)) {
        db.createObjectStore(RESOURCES_STORE, { keyPath: 'id' });
      }
    },
  });
};

export const saveOfflineCourse = async (course) => {
  try {
    const db = await initDB();
    await db.put(COURSES_STORE, course);
    return true;
  } catch (error) {
    console.error('Error saving offline course:', error);
    return false;
  }
};

export const getOfflineCourses = async () => {
  try {
    const db = await initDB();
    return await db.getAll(COURSES_STORE);
  } catch (error) {
    console.error('Error fetching offline courses:', error);
    return [];
  }
};

export const getOfflineCourse = async (courseId) => {
  try {
    const db = await initDB();
    return await db.get(COURSES_STORE, courseId);
  } catch (error) {
    console.error(`Error fetching offline course ${courseId}:`, error);
    return null;
  }
};

export const deleteOfflineCourse = async (courseId) => {
  try {
    const db = await initDB();
    await db.delete(COURSES_STORE, courseId);
    return true;
  } catch (error) {
    console.error(`Error deleting offline course ${courseId}:`, error);
    return false;
  }
};

export const saveCourseProgress = async (progress) => {
  try {
    const db = await initDB();
    await db.put(PROGRESS_STORE, progress);
    return true;
  } catch (error) {
    console.error('Error saving course progress:', error);
    return false;
  }
};

export const getOfflineCoursesProgress = async () => {
  try {
    const db = await initDB();
    return await db.getAll(PROGRESS_STORE);
  } catch (error) {
    console.error('Error fetching offline progress:', error);
    return [];
  }
};

// Save detailed course progress with module information
export const saveDetailedCourseProgress = async (courseId, modules) => {
  try {
    const db = await initDB();
    await db.put(MODULE_PROGRESS_STORE, {
      id: courseId,
      modules,
      updatedAt: new Date().toISOString()
    });
    return true;
  } catch (error) {
    console.error('Error saving detailed course progress:', error);
    return false;
  }
};

// Get detailed progress for a specific course
export const getDetailedCourseProgress = async (courseId) => {
  try {
    const db = await initDB();
    return await db.get(MODULE_PROGRESS_STORE, courseId);
  } catch (error) {
    console.error(`Error fetching detailed progress for course ${courseId}:`, error);
    return null;
  }
};

// Get all detailed course progress
export const getAllDetailedProgress = async () => {
  try {
    const db = await initDB();
    return await db.getAll(MODULE_PROGRESS_STORE);
  } catch (error) {
    console.error('Error fetching all detailed progress:', error);
    return [];
  }
};

// Save complete course data with progress information
export const saveCompleteCourseData = async (course) => {
  try {
    const db = await initDB();
    
    // Save overall course progress
    await db.put(PROGRESS_STORE, {
      id: course.id,
      progress: course.progress,
      lastUpdated: new Date().toISOString()
    });
    
    // Save detailed module progress
    await saveDetailedCourseProgress(course.id, course.modules);
    
    // Update course info
    await db.put(COURSES_STORE, course);
    return true;
  } catch (error) {
    console.error('Error saving course progress:', error);
    return false;
  }
};

// Badge-related operations
export const saveBadge = async (badge) => {
  try {
    const db = await initDB();
    await db.put(BADGES_STORE, badge);
    return true;
  } catch (error) {
    console.error('Error saving badge:', error);
    return false;
  }
};

export const getBadges = async () => {
  try {
    const db = await initDB();
    return await db.getAll(BADGES_STORE);
  } catch (error) {
    console.error('Error fetching badges:', error);
    return [];
  }
};

export const getBadge = async (badgeId) => {
  try {
    const db = await initDB();
    return await db.get(BADGES_STORE, badgeId);
  } catch (error) {
    console.error(`Error fetching badge ${badgeId}:`, error);
    return null;
  }
};

export const deleteBadge = async (badgeId) => {
  try {
    const db = await initDB();
    await db.delete(BADGES_STORE, badgeId);
    return true;
  } catch (error) {
    console.error(`Error deleting badge ${badgeId}:`, error);
    return false;
  }
};

// Leaderboard-related operations
export const saveLeaderboardData = async (leaderboardData) => {
  try {
    const db = await initDB();
    const id = `${leaderboardData.courseId}-${leaderboardData.period}`;
    await db.put(LEADERBOARD_STORE, {
      id,
      ...leaderboardData,
      timestamp: new Date().toISOString()
    });
    return true;
  } catch (error) {
    console.error('Error saving leaderboard data:', error);
    return false;
  }
};

export const getLeaderboardData = async (courseId, period) => {
  try {
    const db = await initDB();
    const id = `${courseId}-${period}`;
    return await db.get(LEADERBOARD_STORE, id);
  } catch (error) {
    console.error('Error fetching leaderboard data:', error);
    return null;
  }
};

export const getAllLeaderboards = async () => {
  try {
    const db = await initDB();
    return await db.getAll(LEADERBOARD_STORE);
  } catch (error) {
    console.error('Error fetching all leaderboards:', error);
    return [];
  }

}
// Resource-related operations

export const saveResource = async (resource) => {
  try {
    const db = await initDB();
    await db.put(RESOURCES_STORE, {
      ...resource,
      downloadedAt: new Date().toISOString()
    });
    return true;
  } catch (error) {
    console.error('Error saving resource:', error);
    return false;
  }
};

export const getResource = async (resourceId) => {
  try {
    const db = await initDB();
    return await db.get(RESOURCES_STORE, resourceId);
  } catch (error) {
    console.error(`Error fetching resource ${resourceId}:`, error);
    return null;
  }
};

export const getCourseResources = async (courseId) => {
  try {
    const db = await initDB();
    return await db.getAll(RESOURCES_STORE).then(resources => resources.filter(r => r.courseId === courseId));
  } catch (error) {
    console.error(`Error fetching resources for course ${courseId}:`, error);
    return [];
  }
};