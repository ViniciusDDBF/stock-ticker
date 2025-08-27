// store/configureStore.ts
import { configureStore } from '@reduxjs/toolkit';
import logger from './middleware/logger';
import counter from './slices/counter';
import modal from './slices/modal';

export const store = configureStore({
  reducer: {
    modal,
    counter,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(logger),
});

export default store;