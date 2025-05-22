import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { coursesData } from '../utils/coursesData';

// Mock user data with enrolled courses
const mockEnrolledCourses = [
  {
    ...coursesData[0], // JavaScript Fundamentals
    progress: 65,
    lastAccessed: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    nextLesson: {
      title: "Advanced Functions",
      date: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString(),
      durationMinutes: 45
    }
  },
  {
    ...coursesData[3], // Conversational Spanish
    progress: 42,
    lastAccessed: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    nextLesson: {
      title: "Past Tense Verbs",
      date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
      durationMinutes: 30
    }
  },
  {
    ...coursesData[9], // Piano for Beginners
    progress: 28,
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
    title: "JavaScript Basics",
    description: "Completed the JavaScript fundamentals module",
    dateEarned: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
    icon: "code"
  },
  {
    id: 2,
    title: "7-Day Streak",
    description: "Learned for 7 consecutive days",
    dateEarned: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    icon: "flame"
  },
  {
    id: 3,
    title: "Conversation Ready",
    description: "Completed basic Spanish conversation skills",
    dateEarned: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    icon: "message-circle"
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
      });
  }
});

export default dashboardSlice.reducer;