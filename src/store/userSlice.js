import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getUserProfile, updateUserProfile } from '../services/userService';

const initialState = {
  user: null,
  isAuthenticated: false,
  loading: false,
  error: null,
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action) => {
      // CRITICAL: Always use deep cloning to avoid reference issues
      state.user = JSON.parse(JSON.stringify(action.payload));
      state.isAuthenticated = !!action.payload;
      state.loading = false;
      state.error = null;
    },
    clearUser: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.loading = false;
      state.error = null;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
    updateUserData: (state, action) => {
      if (state.user && action.payload) {
        state.user = { ...state.user, ...action.payload };
        // Create a deep clone to avoid reference issues
        state.user = JSON.parse(JSON.stringify(state.user));
      }
      state.loading = false;
    }
  },
});

// Async thunk for fetching current user profile
export const fetchUserProfile = createAsyncThunk(
  'user/fetchProfile',
  async (_, { dispatch, getState }) => {
    try {
      dispatch(setLoading(true));
      const response = await getUserProfile();
      if (response) {
        dispatch(updateUserData(response));
      }
      return response;
    } catch (error) {
      dispatch(setError(error.message || "Failed to fetch user profile"));
      throw error;
    } finally {
      dispatch(setLoading(false));
    }
  }
);

// Async thunk for updating user profile
export const updateProfile = createAsyncThunk(
  'user/updateProfile',
  async (userData, { dispatch, getState }) => {
    try {
      dispatch(setLoading(true));
      const state = getState();
      const userId = state.user?.user?.Id;
      
      if (!userId) {
        throw new Error("User not authenticated");
      }

      const updatedData = { ...userData, Id: userId };
      const response = await updateUserProfile(updatedData);
      
      if (response && response.success) {
        dispatch(updateUserData(userData));
        return userData;
      }
      throw new Error("Failed to update profile");
    } catch (error) {
      dispatch(setError(error.message || "Failed to update profile"));
      throw error;
    }
  }
);

export const { setUser, clearUser, setLoading, setError, updateUserData } = userSlice.actions;

export default userSlice.reducer;