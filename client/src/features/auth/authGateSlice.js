import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  open: false,
  title: 'Sign in to continue',
  message: 'Sign in or create an account to unlock CineVerse.',
};

const authGateSlice = createSlice({
  name: 'authGate',
  initialState,
  reducers: {
    openAuthGate: (state, action) => {
      state.open = true;
      state.title = action.payload?.title || initialState.title;
      state.message = action.payload?.message || initialState.message;
    },
    closeAuthGate: (state) => {
      state.open = false;
      state.title = initialState.title;
      state.message = initialState.message;
    },
  },
});

export const { openAuthGate, closeAuthGate } = authGateSlice.actions;
export default authGateSlice.reducer;
