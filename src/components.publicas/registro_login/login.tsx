import { useDispatch } from "react-redux";
import { getMorty } from "../../services/auth.services"
import { createUser } from "../../redux/states/user";
import { useNavigate } from "react-router-dom";
import { PrivateRoutes } from "../../models/index";

export function Login () {
  const dispatch = useDispatch();
  const navigate = useNavigate();

   const login  =  async () => {
    try{
      const result = await getMorty();
    
      dispatch(createUser(result));
      navigate(`/${PrivateRoutes.PRIVATE}`, {replace : true});
    }catch (error) {}
   }

   return (
    <div>  <h2>hola  este es el login</h2>  
    <button onClick={login}>login</button> </div>
  )
}

