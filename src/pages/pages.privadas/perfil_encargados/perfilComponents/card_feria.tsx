import { Link } from "react-router-dom";
import {  FeriasProps } from "../../../interfaces";
import { OpenTiket } from "./open_tikek";
import { useSelector } from "react-redux";
import { AppStore } from "../../../../redux/store";

export const Card_feria_encargado = ({ferias} : FeriasProps) => {

const mail = useSelector((state : AppStore) => state.user.email) 
  return (
    <>
        <div className="ferias">
            {ferias.map((feria) => (
                <div className="card" key={feria.id_feria}>
                    <ul>
                        <li> feria :  {feria.nombre_feria} </li>
                        <li> Comuna  : {feria.comuna} </li>
                        <li> region : {feria.region} </li>
                        <li>< Link to={`administracion/${feria.id_feria}`}> Administrar feria</Link></li>  
                        <button onClick={() => OpenTiket(feria.id_feria , mail)}> Solicitar apertura de feria </button>
                        <li>< Link to={`administrxdacion/${feria.id_feria}`}> Administrar feria</Link></li>  
                                
                    </ul>
                </div>
            ))}
        </div>
    </>
);


  return (
    <div>C</div>
  )
}