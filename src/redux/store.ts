import { configureStore } from '@reduxjs/toolkit';
import { UserInfo } from '../models';
import userSliceReducer from './states/user';

export interface AppStore {
  user: UserInfo;
}

// Configuración del store
export const store = configureStore({
  reducer: {
    user: userSliceReducer, // Reducer del usuario
  },
});

// Tipos inferidos para el estado global y el dispatch
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
