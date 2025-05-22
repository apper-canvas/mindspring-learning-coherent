import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { saveBadge, getBadges } from '../utils/indexedDBUtils';
import { createBadgeInstance, checkBadgeEligibility, BADGE_TYPES } from '../utils/badgeUtils';
import { toast } from 'react-toastify';

// Fetch all badges from IndexedDB
export const fetchBadges = createAsyncThunk(
  'badges/fetchBadges',
  async () => {
    const badges = await getBadges();
    return badges;
  }
);

// Check and award badge if eligible
export const checkAndAwardBadge = createAsyncThunk(
  'badges/checkAndAwardBadge',
  async ({ badgeType, userState, courseId, courseTitle }, { getState, dispatch }) => {
    // Get current badges
    const state = getState();
    const existingBadges = state.badges.badges;
    
    // Check if already has this badge for this course
    const hasBadge = existingBadges.some(
      badge => badge.badgeTypeId === BADGE_TYPES[badgeType].id && badge.courseId === courseId
    );
    
    // If already has badge or not eligible, return null
    if (hasBadge || !checkBadgeEligibility(BADGE_TYPES[badgeType].id, userState)) {
      return null;
    }
    
    // Create and save badge
    const badgeInstance = createBadgeInstance(badgeType, courseId, courseTitle);
    if (badgeInstance) {
      await saveBadge(badgeInstance);
      
      // Show toast notification
      toast.success(`🏆 New badge earned: ${badgeInstance.name}!`, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      
      return badgeInstance;
    }
    return null;
  }
);

// Mark badge as viewed (no longer new)
export const markBadgeAsViewed = createAsyncThunk(
  'badges/markBadgeAsViewed',
  async (badgeId) => {
    const badge = await getBadge(badgeId);
    if (badge) {
      const updatedBadge = { ...badge, isNew: false };
      await saveBadge(updatedBadge);
      return badgeId;
    }
    return null;
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
      .addCase(fetchBadges.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchBadges.fulfilled, (state, action) => {
        state.badges = action.payload;
        state.isLoading = false;
      })
      .addCase(fetchBadges.rejected, (state, action) => {
        state.error = action.error.message;
        state.isLoading = false;
      })
      .addCase(checkAndAwardBadge.fulfilled, (state, action) => {
        if (action.payload) {
          state.badges.push(action.payload);
        }
      });
  }
});

export default badgeSlice.reducer;