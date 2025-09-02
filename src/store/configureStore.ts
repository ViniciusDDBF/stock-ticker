import { configureStore } from '@reduxjs/toolkit';
import ticker from './slices/ticker';

export const store = configureStore({
  reducer: {
    ticker,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware(),
});

export default store;
