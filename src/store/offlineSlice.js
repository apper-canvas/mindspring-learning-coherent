import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getOfflineCourses, saveOfflineCourse, saveCourseProgress,
         deleteOfflineCourse, getOfflineCoursesProgress, saveCompleteCourseData, saveResource } from '../utils/indexedDBUtils';

export const fetchOfflineCourses = createAsyncThunk(
  'offline/fetchOfflineCourses',
  async () => {
    const courses = await getOfflineCourses();
    return courses;
  }
);

export const downloadCourse = createAsyncThunk(
  'offline/downloadCourse',
  async (course, { dispatch }) => {
    // Update download status
    dispatch(setDownloadStatus({
      courseId: course.id,
      status: 'downloading',
      progress: 0
    }));

    // Simulate download progress
    let progress = 0;
    const interval = setInterval(() => {
      progress += 10;
      dispatch(updateDownloadProgress({
        courseId: course.id,
        progress: Math.min(progress, 100)
      }));
      
      // When complete, save the course
      if (progress >= 100) {
        clearInterval(interval);
        saveOfflineCourse(course).then(() => {
          dispatch(setDownloadStatus({
            courseId: course.id,
            status: 'completed',
            progress: 100
          }));
        });
      }
    }, 500);

    // Return initial course data
    return course;
  }
);

export const downloadModule = createAsyncThunk(
  'offline/downloadModule',
  async ({ courseId, module }, { dispatch, getState }) => {
    // Get current course if available
    const state = getState();
    const course = state.offline.courses.find(c => c.id === courseId);

    // Update download status for the module
    dispatch(setModuleDownloadStatus({
      courseId,
      moduleId: module.id,
      status: 'downloading',
      progress: 0
    }));

    // Simulate module download
    let progress = 0;
    const interval = setInterval(() => {
      progress += 20;
      dispatch(updateModuleDownloadProgress({
        courseId,
        moduleId: module.id,
        progress: Math.min(progress, 100)
      }));
      
      if (progress >= 100) {
        clearInterval(interval);
        
        // Update the course with the downloaded module
        if (course) {
          const updatedCourse = {
            ...course,
            modules: course.modules.map(m => 
              m.id === module.id ? {...m, isDownloaded: true} : m
            )
          };
          saveOfflineCourse(updatedCourse);
          
          dispatch(setModuleDownloadStatus({
            courseId,
            moduleId: module.id,
            status: 'completed',
            progress: 100
          }));
        }
      }
    }, 300);

    return { courseId, moduleId: module.id };
  }
);

export const downloadResource = createAsyncThunk(
  'offline/downloadResource',
  async ({ courseId, resource }, { dispatch }) => {
    // Update download status for the resource
    dispatch(setResourceDownloadStatus({
      courseId,
      resourceId: resource.id,
      status: 'downloading',
      progress: 0
    }));

    // Simulate resource download
    let progress = 0;
    const interval = setInterval(() => {
      progress += 15;
      dispatch(updateResourceDownloadProgress({
        courseId,
        resourceId: resource.id,
        progress: Math.min(progress, 100)
      }));
      
      if (progress >= 100) {
        clearInterval(interval);
        
        // Save the resource to IndexedDB
        saveResource({
          ...resource,
          id: resource.id,
          courseId: courseId
        });
      }
    }, 400);

    return { courseId, resourceId: resource.id };
  }
);

export const syncOfflineProgress = createAsyncThunk(
  'offline/syncProgress',
  async (_, { getState }) => {
    const offlineProgress = await getOfflineCoursesProgress();
    // In a real app, you would send this to the server
    console.log('Syncing offline progress:', offlineProgress);
    return offlineProgress;
  }
);

const offlineSlice = createSlice({
  name: 'offline',
  initialState: {
    isOnline: navigator.onLine,
    courses: [],
    downloads: {},
    moduleDownloads: {},
    resourceDownloads: {},
    isLoading: false,
    error: null
  },
  reducers: {
    checkNetworkStatus: (state, action) => {
      state.isOnline = action.payload;
    },
    setDownloadStatus: (state, action) => {
      const { courseId, status, progress } = action.payload;
      state.downloads[courseId] = { status, progress };
    },
    updateDownloadProgress: (state, action) => {
      const { courseId, progress } = action.payload;
      if (state.downloads[courseId]) {
        state.downloads[courseId].progress = progress;
      }
    },
    setModuleDownloadStatus: (state, action) => {
      const { courseId, moduleId, status, progress } = action.payload;
      if (!state.moduleDownloads[courseId]) {
        state.moduleDownloads[courseId] = {};
      }
      state.moduleDownloads[courseId][moduleId] = { status, progress };
    },
    updateModuleDownloadProgress: (state, action) => {
      const { courseId, moduleId, progress } = action.payload;
      if (state.moduleDownloads[courseId]?.[moduleId]) {
        state.moduleDownloads[courseId][moduleId].progress = progress;
      }
    },
    setResourceDownloadStatus: (state, action) => {
      const { courseId, resourceId, status, progress } = action.payload;
      if (!state.resourceDownloads[courseId]) {
        state.resourceDownloads[courseId] = {};
      }
      state.resourceDownloads[courseId][resourceId] = { status, progress };
    },
    updateResourceDownloadProgress: (state, action) => {
      const { courseId, resourceId, progress } = action.payload;
      if (state.resourceDownloads[courseId]?.[resourceId]) {
        state.resourceDownloads[courseId][resourceId].progress = progress;
      }
      return state;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchOfflineCourses.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchOfflineCourses.fulfilled, (state, action) => {
        state.courses = action.payload;
        state.isLoading = false;
      })
      .addCase(fetchOfflineCourses.rejected, (state, action) => {
        state.error = action.error.message;
        state.isLoading = false;
      });
  }
});

export const { 
  checkNetworkStatus, 
  setDownloadStatus, 
  updateDownloadProgress,
  setModuleDownloadStatus,
  updateModuleDownloadProgress,
  setResourceDownloadStatus,
  updateResourceDownloadProgress
} = offlineSlice.actions;

export default offlineSlice.reducer;