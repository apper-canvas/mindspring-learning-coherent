import { configureStore } from '@reduxjs/toolkit';
import offlineReducer from './offlineSlice';

const store = configureStore({
  reducer: {
    offline: offlineReducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({serializableCheck: false})
});

export default store;