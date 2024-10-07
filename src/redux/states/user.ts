import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// Estado inicial de autenticación
interface AuthState {
  token: string | null;
  role: string | null;
  isAuthenticated: boolean;
}

const initialState: AuthState = {
  token: null,
  role: null,
  isAuthenticated: false,
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginSuccess: (state, action: PayloadAction<{ token: string; role: string }>) => {
      state.token = action.payload.token;
      state.role = action.payload.role;
      state.isAuthenticated = true;
      // También podrías guardar el token en localStorage aquí
      localStorage.setItem('token', action.payload.token);
      localStorage.setItem('role', action.payload.role);
    },
    logout: (state) => {
      state.token = null;
      state.role = null;
      state.isAuthenticated = false;
      // Limpiar localStorage
      localStorage.removeItem('token');
      localStorage.removeItem('role');
    },
  },
});

export const { loginSuccess, logout } = authSlice.actions;

export default authSlice.reducer;
