import { configureStore } from '@reduxjs/toolkit';
import  authReducer  from './states/user'; // Reducer de autenticación

export const store = configureStore({
  reducer: {
    auth: authReducer, // Registramos el slice de autenticación
  },
});

// Tipos personalizados para usar el estado y dispatch en TypeScript
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
