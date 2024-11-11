import { Link } from "react-router-dom";
import { FeriasProps } from "../../../../models/interfaces";
import { Card } from "../../../../components/card";

// Define las props del componente, en este caso un array de objetos Feria
export const CardFerias = ({ ferias }: FeriasProps) => {
    const semana = ['none', 'Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado', 'Domingo'];


    return (
        <Card
            items={ferias}
            renderFields={(feria) => [
                { label: "Nombre", value: feria.nombre_feria },
                { label: "Región", value: feria.region },
                { label: "Comuna", value: feria.comuna },
                {
                    label: "Horarios de la feria",
                    value: (
                        <ul>
                            {feria.horarios.map((horario , index) => (
                                <li key={index}>
                                    <strong>  {semana[horario.id_dia]}  De {horario.hora_inicio} A {horario.hora_termino}</strong>
                                    <br />
                               
                         
                                                           
                                </li>
                            ))}
                               <br />
                        </ul>
                        
                    )
                },
             
                {
                    
                    label: "siguientes ferias",
                    value: (
                        <ul>
                            {feria.actividades.map((actividad) => (
                                <li key={actividad.id_actividad_feria}>
                                    <strong> FECHA :  {new Date(actividad.fecha).toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' })} </strong>
                                    <br />
                                    <Link to={`/feria/${feria.id_feria}/${feria.nombre_feria}/${actividad.fecha}`}>Ver Puestos Feria </Link>
                                                           
                                </li>
                            ))}
                        </ul>
                    )
                },
            ]}
            actions={(feria) => (
                <li>
            
                </li>
                
            )}
        />
    );
};
