import { Link } from "react-router-dom";
import { FeriasProps } from "../../../../models/interfaces";
import { Card } from "../../../../components/card";
import { OpenTiket } from "../../services/open_tikek";
import { idService } from "../../rxjs_id_feria/sharing.id_feria";
import { useSelector } from "react-redux";
import  { AppStore } from "../../../../../redux/store";

// Define las props del componente, en este caso un array de objetos Feria
export const Card_feria_encargado = ({ ferias }: FeriasProps) => {

  const mail = useSelector(( store : AppStore )=> store.user.email)


    return (
        <Card
            items={ferias}
            renderFields={(feria) => [
                { label: "Nombre", value: feria.nombre_feria },
                { label: "Región", value: feria.region },
                { label: "Comuna", value: feria.comuna },
                {
                    label: "Horarios",
                    value: (
                        <ul>
                            {feria.horarios.map((horario) => (
                                <li key={horario.id_feria}>
                                    <strong>Día:</strong> {horario.dia}<br />
                                    <strong>Hora Inicio:</strong> {horario.hora_inicio}<br />
                                    <strong>Hora Término:</strong> {horario.hora_termino}<br />
                                    <strong>Día Armado:</strong> {horario.dia_armado.toString()}<br />
                                    <strong>Hora Inicio Armado:</strong> {horario.hora_inicio_armado}<br />
                                    <strong>Hora Término Armado:</strong> {horario.hora_termino_armado}<br />
                                </li>
                            ))}
                        </ul>
                    )
                },
            ]}
            actions={(feria) => (
              <ul>


       
                <li>
                    <Link to={`/feria/${feria.id_feria}`}>Ver Puestos Feria</Link>
                    </li>

<li> <Link to={`administracion/${feria.id_feria}`} >Administrar feria</Link></li>

<button onClick={() => OpenTiket(feria.id_feria, mail)}>
  Solicitar apertura de feria
</button>

<li>
<Link to={`/Plano/${feria.id_feria}`} onClick={() => idService.setId(feria.id_feria)} >Administrar plano</Link></li>
      
                </ul>



            )}
        />
    );
};






