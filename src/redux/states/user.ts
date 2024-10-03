import { createSlice } from "@reduxjs/toolkit"
import { UserInfo } from "../../models/user.model"
import { clearLocalStorage, persistLocalStorage } from "../../utilities/localStorage.utilities";

export const EmpyUserState : UserInfo = { 
    id: 0,
    name: "",
    mail: ""
}

export const UserKey = 'user';

export const UserSlice = createSlice ({

    name : 'user',
    initialState:localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user') as string) : EmpyUserState,
    reducers : {
        createUser : (_state,action) =>  {
            persistLocalStorage<UserInfo>(UserKey,action.payload);
            return action.payload;
        },
        udapteUser : (state,action) =>  {
         const result =  ({ ...state ,...action.payload });
         persistLocalStorage <UserInfo>(UserKey,result);
         return result;
        },    
        resetUser :() => {
            clearLocalStorage(UserKey);
            
            return EmpyUserState;

        }}
      
})


export const { createUser , udapteUser , resetUser } = UserSlice.actions;