import { Roles } from "./rol"

export interface UserInfo {
    token: string;
    role: Roles;
    email: string;
    id_user : number;
    id_feria?: number;
    id_puesto?: number;
  }
  