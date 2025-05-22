import { configureStore } from '@reduxjs/toolkit';
import offlineReducer from './offlineSlice';
import badgeReducer from './badgeSlice';
import leaderboardReducer from './leaderboardSlice';

const store = configureStore({
  reducer: {
    offline: offlineReducer,
    badges: badgeReducer,
    leaderboards: leaderboardReducer
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({serializableCheck: false})
});
export default store;
export default store;