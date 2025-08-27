import { createSlice } from '@reduxjs/toolkit';

const slice = createSlice({
  name: 'modal',
  initialState: false,
  reducers: {
    abrir: () => {
      return true;
    },
    fechar: () => {
      return false;
    },
  },
});
export default slice.reducer;
export const { abrir, fechar } = slice.actions;
