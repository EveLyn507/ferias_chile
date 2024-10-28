// userSlice.ts
import { createSlice } from '@reduxjs/toolkit';
import { UserInfo } from '../../models';
import { Roles } from '../../models/rol';
import { clearLocalStorage, persistLocalStorage } from '../../utilities/localStorage.utilities';

export const EmptyUserState: UserInfo = {
  token: "",
  role: Roles.NOTLOG,
  email: '',
  id_feria: undefined, // Agregar id_feria aquí
};

export const UserKey = 'user';

export const userSlice = createSlice({
  name: 'user',
  initialState: localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user') as string) : EmptyUserState,
  reducers: {
    createUser: (_state, action) => {
      persistLocalStorage<UserInfo>(UserKey, action.payload);
      return action.payload;
    },
    updateUser: (state, action) => {
      const result = { ...state, ...action.payload };
      persistLocalStorage<UserInfo>(UserKey, result);
      return result;
    },
    resetUser: () => {
      clearLocalStorage(UserKey);
      return EmptyUserState;
    },
    setIdFeria: (state, action) => {
      const result = { ...state, id_feria: action.payload }; // Establecer el id_feria
      persistLocalStorage<UserInfo>(UserKey, result);
      return result;
    },
    setIdPuesto: (state, action) => {
      const result = { ...state, id_puesto: action.payload };
      persistLocalStorage<UserInfo>(UserKey, result);
      return result;
    },
  },
});

export const { createUser, updateUser, resetUser, setIdFeria, setIdPuesto } = userSlice.actions;

export default userSlice.reducer;
