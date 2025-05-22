import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { generateLeaderboardData, LEADERBOARD_PERIODS } from '../utils/leaderboardUtils';
import { saveLeaderboardData, getLeaderboardData } from '../utils/indexedDBUtils';
import { toast } from 'react-toastify';

export const fetchLeaderboard = createAsyncThunk(
  'leaderboards/fetchLeaderboard',
  async ({ courseId, period = LEADERBOARD_PERIODS.WEEKLY }, { rejectWithValue }) => {
    try {
      // First try to get from IndexedDB
      let leaderboardData = await getLeaderboardData(courseId, period);
      
      // If not in IndexedDB or data is outdated (you can check timestamp), fetch new data
      if (!leaderboardData) {
        // In a real app, this would be an API call
        // For demo, we'll generate fake data
        leaderboardData = generateLeaderboardData(courseId, period);
        
        // Save to IndexedDB for offline access
        await saveLeaderboardData(leaderboardData);
      }
      
      return leaderboardData;
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
      return rejectWithValue('Failed to load leaderboard data');
    }
  }
);

export const refreshLeaderboard = createAsyncThunk(
  'leaderboards/refreshLeaderboard',
  async ({ courseId, period = LEADERBOARD_PERIODS.WEEKLY }, { dispatch }) => {
    try {
      // Generate fresh data
      const leaderboardData = generateLeaderboardData(courseId, period);
      
      // Save to IndexedDB
      await saveLeaderboardData(leaderboardData);
      
      toast.success('Leaderboard updated successfully');
      return leaderboardData;
    } catch (error) {
      console.error('Error refreshing leaderboard:', error);
      toast.error('Failed to refresh leaderboard');
      throw error;
    }
  }
);

const leaderboardSlice = createSlice({
  name: 'leaderboards',
  initialState: {
    currentLeaderboard: null,
    activePeriod: LEADERBOARD_PERIODS.WEEKLY,
    isLoading: false,
    error: null
  },
  reducers: {
    setActivePeriod: (state, action) => {
      state.activePeriod = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch leaderboard
      .addCase(fetchLeaderboard.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchLeaderboard.fulfilled, (state, action) => {
        state.currentLeaderboard = action.payload;
        state.isLoading = false;
      })
      .addCase(fetchLeaderboard.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Failed to load leaderboard';
      })
      
      // Refresh leaderboard
      .addCase(refreshLeaderboard.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(refreshLeaderboard.fulfilled, (state, action) => {
        state.currentLeaderboard = action.payload;
        state.isLoading = false;
      })
      .addCase(refreshLeaderboard.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Failed to refresh leaderboard';
      });
  }
});

export const { setActivePeriod } = leaderboardSlice.actions;

export const selectCurrentLeaderboard = state => state.leaderboards.currentLeaderboard;
export const selectLeaderboardLoading = state => state.leaderboards.isLoading;

export default leaderboardSlice.reducer;