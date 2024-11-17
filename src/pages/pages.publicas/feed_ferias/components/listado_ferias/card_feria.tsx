import { Link } from "react-router-dom";
import { FeriasProps } from "../../../../models/interfaces";
import { Card } from "../../../../components/card";
import './cards_feed.css';

export const CardFerias = ({ ferias }: FeriasProps) => {
  const semana = ['none', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
  

  return (
    <div className="card-container">
      {ferias.map((feria) => (
        <div className="ag-courses_item" key={feria.id_feria}>
          <div className="ag-courses-item_bg"></div>
          <Card
            items={[feria]} // Pasamos el único objeto como array
            renderFields={() => [
              { label: "Nombre", value: <h2 className="card-title">{feria.nombre_feria}</h2> },
              { label: "Región", value: <p><strong>Región:</strong> {feria.region}</p> },
              { label: "Comuna", value: <p><strong>Comuna:</strong> {feria.comuna}</p> },
              {
                label: "Horarios de la feria",
                value: (
                  <div className="card-section">
                    <strong>Horarios:</strong>
                    <ul>
                      {feria.horarios.map((horario, index) => (
                        <li key={index}>
                          {semana[horario.id_dia]}: {horario.hora_inicio} - {horario.hora_termino}
                        </li>
                      ))}
                    </ul>
                  </div>
                ),
              },
              {
                label: "Siguientes ferias",
                value: (
                  <div className="card-section">
           
                    <ul>
                      {feria.actividades.map((actividad) => (
                        <li key={actividad.id_actividad_feria}>
                          Fecha: {new Date(actividad.fecha).toLocaleDateString('es-ES')}
                        </li>
                      ))}
                    </ul>
                  </div>
                ),
              },
            ]}
            actions={() => (
              <Link
                to={`/feria/${feria.id_feria}/${feria.nombre_feria}/${feria.actividades[0]?.fecha}`}
                className="circular-button"
              >
                Ver Puestos
              </Link>
            )}
          />
        </div>
      ))}
    </div>
  );
};
