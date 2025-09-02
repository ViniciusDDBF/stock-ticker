// store/configureStore.ts
import { configureStore } from '@reduxjs/toolkit';
import logger from './middleware/logger';
import counter from './slices/counter';
import modal from './slices/modal';
import ticker from './slices/ticker';

export const store = configureStore({
  reducer: {
    modal,
    counter,
    ticker,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(logger),
});

export default store;
