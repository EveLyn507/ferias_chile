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
              { label: "", value: <p><strong>Región:</strong> {feria.region}</p> },
              { label: "", value: <p><strong>Comuna:</strong> {feria.comuna}</p> },
              {
                label: "",
                value: (
                  <div className="card-section">
                    <strong>Horarios:</strong>
                    {feria.horarios?.length > 0 ? (
                      <ul>
                        {feria.horarios.map((horario, index) => (
                          <li key={index}>
                            {semana[horario.id_dia]}: {horario.hora_inicio} - {horario.hora_termino}
                        
                          </li>
                        ))}
                      </ul>
                      
                    ) : (
                      <p>No hay horarios disponibles</p>
                    )}
                        <br />
                            <br />
                     
                  </div>
                ),
              }
         
             
            ]}
            
            actions={() => (
              <div className="button-container">
            
                {feria.actividades?.map((actividad) => (
                  <Link
                    key={actividad.id_actividad_feria}
                    to={`/feria/${feria.id_feria}/${feria.nombre_feria}/${actividad.fecha}`}
                    className="circular-button"
                  >
                    {new Date(actividad.fecha).toLocaleDateString('es-ES', {
                      day: '2-digit',
                      month: 'short', // "short" muestra el nombre abreviado del mes (por ejemplo, "Nov" en lugar de "Noviembre")
                    })}
                  </Link>
                ))}
              </div>
            )}
          />
        </div>
      ))}
    </div>
  );
};
