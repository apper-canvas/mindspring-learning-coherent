import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { BADGE_TYPES, BADGE_LEVELS, BADGE_CATEGORIES, createBadge } from '../utils/badgeUtils';
import { createBadgeInstance, checkBadgeEligibility, BADGE_TYPES } from '../utils/badgeUtils';
import { toast } from 'react-toastify';
import { getUserBadges, awardBadgeToUser } from '../services/badgeService';

// Fetch all badges from IndexedDB
export const fetchBadges = createAsyncThunk(
  'badges/fetchBadges',
  async () => {
export const fetchUserBadges = createAsyncThunk(
    return badges;
  }
);

// Check and award badge if eligible
      const state = getState();
      const user = state.user.user;
      
      if (!user || !user.userId) {
        return mockBadges;
      }
      
      const badges = await getUserBadges(user.userId);
      return badges;
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
        return { success: false, message: 'Invalid badge type' };
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
          const badge = createBadge(BADGE_TYPES.FIRST_STEP, 'bronze', BADGE_CATEGORIES.ENGAGEMENT, courseTitle);
          return await awardBadgeToUser(getState().user.user?.userId, badge.id, courseId, courseTitle);
  }
);

// Mark badge as viewed (no longer new)
export const markBadgeAsViewed = createAsyncThunk(
  'badges/markBadgeAsViewed',
          const badge = createBadge(BADGE_TYPES.FIRST_LESSON, 'bronze', BADGE_CATEGORIES.COMPLETION, courseTitle);
          return await awardBadgeToUser(getState().user.user?.userId, badge.id, courseId, courseTitle);
    const badge = await getBadge(badgeId);
    if (badge) {
      const updatedBadge = { ...badge, isNew: false };
      await saveBadge(updatedBadge);
      return badgeId;
    }
          const badge = createBadge(BADGE_TYPES.OFFLINE_WARRIOR, 'silver', BADGE_CATEGORIES.SPECIAL, courseTitle);
          return await awardBadgeToUser(getState().user.user?.userId, badge.id, courseId, courseTitle);
  }
);

const badgeSlice = createSlice({
  name: 'badges',
  initialState: {
          const badge = createBadge(BADGE_TYPES.HALFWAY, 'silver', BADGE_CATEGORIES.ACHIEVEMENT, courseTitle);
          return await awardBadgeToUser(getState().user.user?.userId, badge.id, courseId, courseTitle);
    isLoading: false,
    error: null
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
          const badge = createBadge(BADGE_TYPES.COURSE_COMPLETE, 'gold', BADGE_CATEGORIES.COMPLETION, courseTitle);
          return await awardBadgeToUser(getState().user.user?.userId, badge.id, courseId, courseTitle);
        state.isLoading = true;
      })
      .addCase(fetchBadges.fulfilled, (state, action) => {
        state.badges = action.payload;
        state.isLoading = false;
      })
          const badge = createBadge(BADGE_TYPES.QUIZ_MASTER, 'gold', BADGE_CATEGORIES.ACHIEVEMENT, courseTitle);
          return await awardBadgeToUser(getState().user.user?.userId, badge.id, courseId, courseTitle);
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
      .addCase(fetchUserBadges.pending, (state) => {
      .addCase(fetchUserBadges.fulfilled, (state, action) => {
      .addCase(fetchUserBadges.rejected, (state, action) => {
        if (action.payload && action.payload.success) {
          // Fetch updated badges
          dispatch(fetchUserBadges());
          toast.success(`🏆 Badge Earned!`, {
export const { addBadge, fetchBadges } = badgeSlice.actions;