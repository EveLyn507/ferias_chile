import { Link } from "react-router-dom";
import { FeriasProps } from "../../../../models/interfaces";
import "../../css/cards_feed.css";

export const CardFerias = ({ ferias }: FeriasProps) => {
  const semana = [
    "none",
    "Lunes",
    "Martes",
    "Miércoles",
    "Jueves",
    "Viernes",
    "Sábado",
    "Domingo",
  ];

  return (
    <div className="feria-container">
      {/* Verificamos si no hay ferias */}
      {ferias.length === 0 ? (
        <div className="card no-ferias-card">
          <header className="card-header">
            <h2 className="card-title">Aún no hay ferias en esta seccion</h2>
          </header>
        </div>
      ) : (
        ferias.map((feria) => (
          <div className="card" key={feria.id_feria}>
            <header className="card-header">
              <h2 className="card-title">{feria.nombre_feria}</h2>
              <p className="card-location">
                {feria.region}, {feria.comuna}
              </p>
            </header>

            <section className="card-horarios">
              <h3>Horarios:</h3>
              <ul>
                {feria.horarios.map((horario, index) => (
                  <li key={index}>
                    {semana[horario.id_dia]}: {horario.hora_inicio} -{" "}
                    {horario.hora_termino}
                  </li>
                ))}
              </ul>
            </section>

            <section className="card-actividades"> 
              <h3>Nuetras Proximas Fechas</h3>
              <div className="botones-container">
                {feria.actividades?.map((actividad) => (
                  <Link
                    key={actividad.id_actividad_feria}
                    to={`/feria/${feria.id_feria}/${feria.nombre_feria}/${actividad.fecha}`}
                    className="circular-button"
                  >
                    {new Date(actividad.fecha).toLocaleDateString("es-ES", {
                      day: "2-digit",
                      month: "short",
                    })}
                  </Link>
                ))}
              </div>
            </section>
          </div>
        ))
      )}
    </div>
  );
};
