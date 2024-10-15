import { Roles } from "./rol"

export interface UserInfo {
    token: string;
    role: Roles;
    email: string;
    id_feria?: number; // Asegúrate de que esta propiedad esté aquí
  }
  