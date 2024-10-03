import { configureStore } from "@reduxjs/toolkit";
import { UserInfo } from "../models/user.model";
import { UserSlice } from "./states/user";

export interface AppStore { 
     user: UserInfo;

}



export default configureStore <AppStore> ({
    reducer: {
        user: UserSlice.reducer
    }


}); 