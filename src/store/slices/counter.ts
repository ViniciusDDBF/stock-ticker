import { createSlice } from '@reduxjs/toolkit';

const slice = createSlice({
  name: 'counter',
  initialState: 0,
  reducers: {
    incrementar: (state) => {
      return state + 1;
    },
    reduzir: (state) => {
      return state - 1;
    },
  },
});
export default slice.reducer;
export const { incrementar, reduzir } = slice.actions;
