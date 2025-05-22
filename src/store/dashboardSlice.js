import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { coursesData } from '../utils/coursesData';
import { saveCourseProgress, getDetailedCourseProgress } from '../utils/indexedDBUtils';

// Mock user data with enrolled courses
const mockEnrolledCourses = [
  {
    ...coursesData[0], // JavaScript Fundamentals
    progress: 65,
    modules: [
      {
        id: 'js-mod-1',
        title: 'Introduction to JavaScript',
        description: 'Learn the basics of JavaScript programming',
        duration: '45 minutes',
        completed: true
      },
      {
        id: 'js-mod-2',
        title: 'Variables and Data Types',
        description: 'Understanding JavaScript variables and data types',
        duration: '60 minutes',
        completed: true
      },
      {
        id: 'js-mod-3',
        title: 'Control Flow',
        description: 'Conditional statements and loops in JavaScript',
        duration: '75 minutes',
        completed: true
      },
      {
        id: 'js-mod-4',
        title: 'Functions',
        description: 'Creating and using functions in JavaScript',
        duration: '90 minutes',
        completed: false
      },
      {
        id: 'js-mod-5',
        title: 'Objects and Arrays',
        description: 'Working with complex data structures',
        duration: '120 minutes',
        completed: false
      }
    ],
    lastAccessed: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    nextLesson: {
      moduleId: 'js-mod-4',
      title: "Advanced Functions",
      date: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString(),
      durationMinutes: 45
    }
  },
  {
    ...coursesData[3], // Conversational Spanish
    progress: 42,
    modules: [
      {
        id: 'sp-mod-1',
        title: 'Greetings and Introductions',
        description: 'Learn basic Spanish greetings and introductions',
        duration: '30 minutes',
        completed: true
      },
      {
        id: 'sp-mod-2',
        title: 'Common Phrases',
        description: 'Essential phrases for everyday conversations',
        duration: '45 minutes',
        completed: true
      },
      {
        id: 'sp-mod-3',
        title: 'Present Tense Verbs',
        description: 'Conjugating verbs in the present tense',
        duration: '60 minutes',
        completed: false
      }
    ],
    lastAccessed: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    nextLesson: {
      moduleId: 'sp-mod-3',
      title: "Present Tense Verbs",
      date: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString(),
      durationMinutes: 45
    }
  },
  {
    ...coursesData[9], // Piano for Beginners
    progress: 28,
    modules: [
      {
        id: 'piano-mod-1',
        title: 'Introduction to the Piano',
        description: 'Getting familiar with the piano keyboard',
        duration: '45 minutes',
        completed: true
      }
    lastAccessed: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    nextLesson: {
      title: "Reading Sheet Music",
      date: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toISOString(),
      durationMinutes: 60
    }
  },
];

// Mock learning streak data (last 30 days)
const generateMockStreakData = () => {
  const today = new Date();
  const data = [];
  
  for (let i = 29; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    
    // Generate random minutes between 0-120, with higher chance for recent days
    // and weekends, and some days with 0 (missed days)
    let minutes = 0;
    const dayOfWeek = date.getDay();
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
    const isRecent = i < 7;
    
    // 20% chance of missing a day completely
    if (Math.random() > 0.2) {
      // Base minutes: 20-60
      minutes = Math.floor(Math.random() * 40) + 20;
      
      // Boost for weekends: additional 0-30 minutes
      if (isWeekend) {
        minutes += Math.floor(Math.random() * 30);
      }
      
      // Boost for recent days: additional 0-20 minutes
      if (isRecent) {
        minutes += Math.floor(Math.random() * 20);
      }
    }
    
    data.push({
      date: date.toISOString().split('T')[0],
      minutes: minutes
    });
  }
  
  return data;
};

// Mock achievements data
const mockAchievements = [
  {
    id: 1,
    type: "achievement",
    title: "JavaScript Fundamentals",
    description: "Completed the JavaScript Fundamentals course with 90% score",
    dateEarned: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(),
    icon: "code",
    category: "course"
  },
  {
    id: 2,
    type: "certification",
    title: "JavaScript Developer Certificate",
    description: "Professional certification for JavaScript development skills",
    dateEarned: new Date(Date.now() - 40 * 24 * 60 * 60 * 1000).toISOString(),
    icon: "award",
    category: "certification",
    issuer: "MindSpring Academy",
    certificateURL: "https://example.com/cert/js-dev",
    credentialID: "MSJS-2023-78954"
  },
  {
    id: 3,
    title: "7-Day Streak",
    type: "achievement",
    description: "Learned for 7 consecutive days",
    dateEarned: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    icon: "flame",
    category: "streak"
  },
  {
    id: 4,
    type: "achievement",
    title: "Spanish Beginner Level",
    description: "Completed the Spanish beginner course modules",
    dateEarned: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
    icon: "message-circle",
    category: "course"
  },
  {
    id: 5,
    type: "certification",
    title: "Spanish A1 Certificate",
    description: "Certified Spanish language proficiency at A1 level",
    dateEarned: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
    icon: "file-text",
    category: "certificate",
    issuer: "MindSpring Language Institute",
    certificateURL: "https://example.com/cert/spanish-a1",
    credentialID: "MSL-SP-A1-2023-12345"
  },
  {
    id: 6,
    type: "certification",
    title: "Front-End Web Development",
    description: "Comprehensive certification in modern front-end development techniques",
    dateEarned: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    icon: "layout",
    category: "specialization",
    issuer: "MindSpring Tech Academy",
    certificateURL: "https://example.com/cert/frontend-dev",
    credentialID: "MSWD-FE-2023-56789"
  },
  {
    id: 7,
    type: "achievement",
    title: "30-Day Streak",
    description: "Maintained a learning streak for 30 consecutive days",
    dateEarned: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    icon: "zap",
    category: "streak"
  }
];

// Fetch user dashboard data
export const fetchDashboardData = createAsyncThunk(
  'dashboard/fetchData',
  async (_, { rejectWithValue }) => {
    try {
      // Simulating API call with timeout
      await new Promise(resolve => setTimeout(resolve, 800));
      return {
        enrolledCourses: mockEnrolledCourses,
        streakData: generateMockStreakData(),
        achievements: mockAchievements
      };
    } catch (error) {
      return rejectWithValue('Failed to fetch dashboard data');
    }
  }
);

// Update course progress
export const updateCourseProgress = createAsyncThunk(
  'dashboard/updateProgress',
  async ({ courseId, moduleId, isComplete }, { getState, rejectWithValue }) => {
    try {
      const { dashboard } = getState();
      const courseIndex = dashboard.enrolledCourses.findIndex(course => course.id === courseId);
      
      if (courseIndex === -1) {
        return rejectWithValue('Course not found');
      }
      
      const course = dashboard.enrolledCourses[courseIndex];
      const moduleIndex = course.modules.findIndex(module => module.id === moduleId);
      
      if (moduleIndex === -1) {
        return rejectWithValue('Module not found');
      }
      
      // Create updated course with the module's completion status changed
      const updatedCourse = {
        ...course,
        modules: course.modules.map((module, idx) => 
          idx === moduleIndex ? { ...module, completed: isComplete } : module
        )
      };
      
      // Calculate new progress percentage
      const completedModules = updatedCourse.modules.filter(module => module.completed).length;
      const totalModules = updatedCourse.modules.length;
      updatedCourse.progress = Math.round((completedModules / totalModules) * 100);
      
      // Save progress to IndexedDB for offline support
      await saveCourseProgress(updatedCourse);
      
      return { courseIndex, updatedCourse };
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to update course progress');
    }
  }
);

const initialState = {
  enrolledCourses: [],
  streakData: [],
  achievements: [],
  currentStreak: 0,
  longestStreak: 0,
  totalLearningTime: 0,
  loading: false,
  error: null
};

const calculateCurrentStreak = (streakData) => {
  let streak = 0;
  const today = new Date().toISOString().split('T')[0];
  
  // Start from today and go backwards
  for (let i = streakData.length - 1; i >= 0; i--) {
    const entry = streakData[i];
    
    // If no minutes logged for this day, break the streak
    if (entry.minutes === 0) {
      break;
    }
    
    streak++;
  }
  
  return streak;
};

const calculateLongestStreak = (streakData) => {
  let currentStreak = 0;
  let longestStreak = 0;
  
  for (let i = 0; i < streakData.length; i++) {
    if (streakData[i].minutes > 0) {
      currentStreak++;
      longestStreak = Math.max(longestStreak, currentStreak);
    } else {
      currentStreak = 0;
    }
  }
  
  return longestStreak;
};

const calculateTotalLearningTime = (streakData) => {
  return streakData.reduce((total, day) => total + day.minutes, 0);
};

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDashboardData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDashboardData.fulfilled, (state, action) => {
        state.loading = false;
        state.enrolledCourses = action.payload.enrolledCourses;
        state.streakData = action.payload.streakData;
        state.achievements = action.payload.achievements;
        state.currentStreak = calculateCurrentStreak(action.payload.streakData);
        state.longestStreak = calculateLongestStreak(action.payload.streakData);
        state.totalLearningTime = calculateTotalLearningTime(action.payload.streakData);
      })
      .addCase(fetchDashboardData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch dashboard data';
      })
      .addCase(updateCourseProgress.fulfilled, (state, action) => {
        const { courseIndex, updatedCourse } = action.payload;
        state.enrolledCourses[courseIndex] = updatedCourse;
      })
      .addCase(updateCourseProgress.rejected, (state, action) => {
        // Handle error state if needed
        state.error = action.payload || 'Failed to update course progress';
      });
  }
});

export default dashboardSlice.reducer;