import { PuestosProp } from "../../../interfaces";


export const Item_list_puestos = ({ puestos }: PuestosProp) => {
  
    console.log(puestos)
    return (
        <>
            <div className="ferias" >
                {puestos.map((puesto, index) => (
                       <div className="card" key={`${puesto.id_puesto}-${index}`}>
                        <ul>
                            <li> numero puesto :  {puesto.num_puesto} </li>
                            <li> horario   : {puesto.num_horario} </li>
                            <li> hora inicio : {puesto.hora_inicio} </li>
                            <li> hora termino : {puesto.hora_termino} </li>
                            <li> precio : {puesto.precio} </li>
                            <li>  <a href="">  contratar</a></li>  
                                        
                        </ul>
                    </div>
                ))}
            </div>
        </>
    );
};

