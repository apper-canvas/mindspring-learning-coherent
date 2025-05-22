/**
 * Checks if the browser supports service workers
 */
export const isServiceWorkerSupported = () => {
  return 'serviceWorker' in navigator;
};

/**
 * Checks if the browser supports IndexedDB
 */
export const isIndexedDBSupported = () => {
  return 'indexedDB' in window;
};

/**
 * Checks if offline learning is fully supported
 */
export const isOfflineSupported = () => {
  return isServiceWorkerSupported() && isIndexedDBSupported();
};

/**
 * Formats bytes to a human-readable string
 */
export const formatBytes = (bytes, decimals = 2) => {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
};

/**
 * Estimates course size based on content type
 */
export const estimateCourseSize = (course) => {
  // In a real app, this would be provided by the API
  return Math.round(10 + Math.random() * 90);
};