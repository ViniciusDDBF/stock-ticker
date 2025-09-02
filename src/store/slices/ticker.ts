import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

const slice = createSlice({
  name: 'ticker',
  initialState: [] as string[], // <- explicitly type the state
  reducers: {
    addTicker: (state, action: PayloadAction<string>) => {
      state.push(action.payload); // add new ticker
    },
    removeTicker: (state, action: PayloadAction<string>) => {
      return state.filter((ticker) => ticker !== action.payload); // remove by value
    },
    clearTicker: () => {
      return []; // clear all tickers
    },
  },
});

export default slice.reducer;
export const { addTicker, removeTicker, clearTicker } = slice.actions;
