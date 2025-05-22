import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { BADGE_TYPES, BADGE_CATEGORIES, createBadge, createBadgeInstance, checkBadgeEligibility } from '../utils/badgeUtils';
import { toast } from 'react-toastify';
import { getUserBadges, awardBadgeToUser, updateBadge } from '../services/badgeService';

// Fetch user badges from backend
export const fetchUserBadges = createAsyncThunk(
  'badges/fetchUserBadges',
  async (_, { getState }) => {
      const state = getState();
      const user = state.user.user;
      
      if (!user || !user.userId) {
        return [];
      }
      
      const badges = await getUserBadges(user.userId);
      return badges;
  }
);

// Check and award badge if eligible
export const checkAndAwardBadge = createAsyncThunk(
  'badges/checkAndAwardBadge',
  async ({ badgeTypeKey, courseId, courseTitle }, { getState, dispatch }) => {
    // Get current badges
    const state = getState();
    const existingBadges = state.badges.badges;
    const userState = state.user.user;
    
    if (!BADGE_TYPES[badgeTypeKey]) {
        return { success: false, message: 'Invalid badge type' };
    }

    // Check if already has this badge for this course
    const hasBadge = existingBadges.some(
      badge => badge.badgeTypeId === BADGE_TYPES[badgeTypeKey] && badge.courseId === courseId
    );
    
    // If already has badge or not eligible, return null
    if (hasBadge || !checkBadgeEligibility(BADGE_TYPES[badgeTypeKey], userState)) {
        return { success: false, message: 'Not eligible for badge' };
    }
    
    // Create and save badge
    const badgeInstance = createBadgeInstance(badgeTypeKey, courseId, courseTitle);
    if (badgeInstance) {
      const result = await awardBadgeToUser(state.user.user?.userId, badgeInstance);
      
      // Show toast notification
      toast.success(`🏆 New badge earned: ${result.name || 'Badge'}!`, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      
      return result;
    }
    return { success: false, message: 'Failed to create badge' };
  }
);

// Mark badge as viewed (no longer new)
export const markBadgeAsViewed = createAsyncThunk(
  'badges/markBadgeAsViewed',
  async (badgeId, { getState }) => {
    try {
      const userId = getState().user.user?.userId;
      if (!userId) return null;
      
      const result = await updateBadge(userId, badgeId, { isNew: false });
      return result.success ? badgeId : null;
    } catch (error) {
      console.error('Error marking badge as viewed:', error);
      return null;
    }
  }
);

const badgeSlice = createSlice({
  name: 'badges',
  initialState: {
    badges: [],
    isLoading: false,
    error: null
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserBadges.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchUserBadges.fulfilled, (state, action) => {
        state.badges = action.payload;
        state.isLoading = false;
      })
      .addCase(fetchUserBadges.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      })
      .addCase(checkAndAwardBadge.pending, (state) => {
        // Optional: Could set a specific loading state for badge awarding
        state.error = null;
      })
      .addCase(checkAndAwardBadge.fulfilled, (state, action) => {
        if (action.payload && action.payload.success !== false) {
          state.badges.push(action.payload);
        }
      })
      .addCase(checkAndAwardBadge.rejected, (state, action) => {
        // Handle errors if needed
        state.error = action.error.message;
      })
      .addCase(markBadgeAsViewed.fulfilled, (state, action) => {
        if (action.payload) {
          const badgeIndex = state.badges.findIndex(badge => badge.id === action.payload);
          if (badgeIndex !== -1) {
            state.badges[badgeIndex].isNew = false;
          }
        }
      });
  }
});

export default badgeSlice.reducer;

// Export alias for backward compatibility
export const fetchBadges = fetchUserBadges;