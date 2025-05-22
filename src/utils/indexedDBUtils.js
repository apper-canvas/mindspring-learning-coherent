import { openDB } from 'idb';

const DB_NAME = 'mindspring-offline';
const DB_VERSION = 1;
const COURSES_STORE = 'courses';
const PROGRESS_STORE = 'progress';

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