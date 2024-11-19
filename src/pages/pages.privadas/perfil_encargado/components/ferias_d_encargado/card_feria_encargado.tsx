import { Link } from "react-router-dom";
import { Card } from "../../../../components/card";
import { idFeriaService } from "../../rxjs/sharing.id_feria";
import { useEffect, useState } from "react";
import { Feria } from "../../../../models/interfaces";
import { feriasService } from "../../rxjs/sharingFeriasEn";
import './card-feria-encargado.css'

// Define las props del componente, en este caso un array de objetos Feria
export const Card_feria_encargado = () => {
    const [ferias, setFerias] = useState<Feria[]>([]);

useEffect(() => {
    const subscribe = feriasService.ferias$.subscribe((feriasEn) => {
        setFerias(feriasEn)
    } )
    return () => subscribe.unsubscribe()
})

    return (
        <div>
            {ferias.length === 0 ? ( // Verifica que feriasEn sea un array y esté vacío
                <p>Aún no has creado tu primera feria.</p>
            ) : (
                <div className="custom-card-feria-wrapper">
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
                            {feria.horarios.filter((horario) => horario.activo).map((horario) => (
                            <li key={horario.id_feria}>
                                <strong>Día:</strong> {horario.id_dia}<br />
                                <strong>Día Armado:</strong> {horario.id_dia_armado}<br />
                            </li>
                            ))}
                        </ul>
                        ),
                    },
                    ]}
                    actions={(feria) => (
                    <ul>
                        <li><Link to={`/feria/${feria.id_feria}`}>Ver Puestos Feria</Link></li>
                        <li><Link to={`administracion/${feria.id_feria}/${feria.nombre_feria}`}>Administrar feria</Link></li>
                        <li><Link to={`/Plano/${feria.id_feria}`} onClick={() => idFeriaService.setId(feria.id_feria)}>Administrar plano</Link></li>
                    </ul>
                    )}
                />
                </div>
            )}
        </div>
    );
};
