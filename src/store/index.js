import { configureStore } from '@reduxjs/toolkit';
import offlineReducer from './offlineSlice';
import badgeReducer from './badgeSlice';

const store = configureStore({
  reducer: {
    offline: offlineReducer,
    badges: badgeReducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({serializableCheck: false})
});
export default store;
export default store;