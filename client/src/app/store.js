import { configureStore } from '@reduxjs/toolkit';
import movieReducer from './movieSlice';
import authReducer from '../features/auth/authSlice';
import authGateReducer from '../features/auth/authGateSlice';

export const store = configureStore({
  reducer: {
    movieData: movieReducer,
    auth: authReducer,
    authGate: authGateReducer,
  },
});

export default store;
