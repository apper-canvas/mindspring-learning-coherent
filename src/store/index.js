import { configureStore } from '@reduxjs/toolkit';
import offlineReducer from './offlineSlice';
import badgeReducer from './badgeSlice';
import leaderboardReducer from './leaderboardSlice';
import dashboardReducer from './dashboardSlice';
import userReducer from './userSlice';

const store = configureStore({
  reducer: {
    offline: offlineReducer,
    badges: badgeReducer,
    leaderboards: leaderboardReducer,
    dashboard: dashboardReducer,
    user: userReducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({serializableCheck: false})
});

export { store };
export default store;