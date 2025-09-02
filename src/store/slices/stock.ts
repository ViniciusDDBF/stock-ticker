import { createSlice } from '@reduxjs/toolkit';

const slice = createSlice({
  name: 'counter',
  initialState: {
    loading: false,
    data: null,
    error: null,
  },
  reducers: {
    fetchStarted(state) {
      state.loading = true;
    },
    fetchSuccess(state, action) {
      state.loading = false;
      state.data = action.payload;
      state.error = null;
    },
    fetchError(state, action) {
      state.loading = false;
      state.data = null;
      state.error = action.payload;
    },
  },
});
const { fetchStarted, fetchSuccess, fetchError } = slice.actions;
export default slice.reducer;

export const stockTicker =
  (tickers: Array<string>) => async (dispatch: any) => {
    try {
      dispatch(fetchStarted());
      const response = await fetch(
        'https://dogsapi.origamid.dev/json/jwt-auth/v1/token',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(tickers),
        }
      );
      const data = await response.json();
      return dispatch(fetchSuccess(data));
    } catch (error: any) {
      return dispatch(fetchError(error.message));
    }
  };
