import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getCurrentUser, loginAccount, logoutAccount, registerAccount } from './authApi';

const TOKEN_KEY = 'cineverse_token';

const saveSession = (payload) => {
  if (payload?.token) sessionStorage.setItem(TOKEN_KEY, payload.token);
  return payload?.user || null;
};

export const restoreSession = createAsyncThunk('auth/restoreSession', async (_, { rejectWithValue }) => {
  if (!sessionStorage.getItem(TOKEN_KEY)) return null;
  try {
    const response = await getCurrentUser();
    return response.data.data.user;
  } catch (error) {
    sessionStorage.removeItem(TOKEN_KEY);
    return rejectWithValue(error.response?.data?.message || 'Session expired.');
  }
});

export const login = createAsyncThunk('auth/login', async (credentials, { rejectWithValue }) => {
  try {
    const response = await loginAccount(credentials);
    return { user: saveSession(response.data.data), message: response.data.message };
  } catch (error) {
    return rejectWithValue(error.response?.data || { message: 'Unable to login.' });
  }
});

export const register = createAsyncThunk('auth/register', async (payload, { rejectWithValue }) => {
  try {
    const response = await registerAccount(payload);
    return { user: saveSession(response.data.data), message: response.data.message };
  } catch (error) {
    return rejectWithValue(error.response?.data || { message: 'Unable to create account.' });
  }
});

export const logout = createAsyncThunk('auth/logout', async () => {
  try { await logoutAccount(); } catch (_) { /* local logout still proceeds */ }
  sessionStorage.removeItem(TOKEN_KEY);
  return null;
});

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    loading: false,
    initialized: false,
    error: null,
  },
  reducers: {
    clearAuthError: (state) => { state.error = null; },
  },
  extraReducers: (builder) => {
    builder
      .addCase(restoreSession.pending, (state) => { state.loading = true; })
      .addCase(restoreSession.fulfilled, (state, action) => { state.loading = false; state.initialized = true; state.user = action.payload; })
      .addCase(restoreSession.rejected, (state, action) => { state.loading = false; state.initialized = true; state.user = null; state.error = action.payload; })
      .addCase(login.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(login.fulfilled, (state, action) => { state.loading = false; state.initialized = true; state.user = action.payload.user; })
      .addCase(login.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
      .addCase(register.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(register.fulfilled, (state, action) => { state.loading = false; state.initialized = true; state.user = action.payload.user; })
      .addCase(register.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
      .addCase(logout.fulfilled, (state) => { state.user = null; state.loading = false; state.initialized = true; state.error = null; });
  },
});

export const { clearAuthError } = authSlice.actions;
export default authSlice.reducer;
