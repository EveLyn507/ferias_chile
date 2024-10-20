import { Link } from "react-router-dom";
import { OpenTiket } from "../../services/open_tikek";
import { useSelector } from "react-redux";
import { AppStore } from "../../../../../redux/store";
import { FeriasProps } from "../../../../models/interfaces";

export const Card_feria_encargado = ({ ferias }: FeriasProps) => {
  const mail = useSelector((state: AppStore) => state.user.email);

  return (
    <>
      <div className="ferias">
        {ferias.map((feria) => (
          <div className="card" key={feria.id_feria}>
            <ul>
              <li>feria: {feria.nombre_feria}</li>
              <li>Comuna: {feria.comuna}</li>
              <li>Región: {feria.region}</li>
              
              {/* Enlace a administración de feria, pasando el programa como estado */}
              <li>
                <Link
                  to={{
                    pathname: `administracion/${feria.id_feria}`,}}state={{ programa: feria.programa }}>Administrar feria</Link>
              </li>

              <button onClick={() => OpenTiket(feria.id_feria, mail)}>
                Solicitar apertura de feria
              </button>

              <li>
                <Link to={`/Plano/${feria.id_feria}`}>Administrar plano</Link>
              </li>
            </ul>
          </div>
        ))}
      </div>
    </>
  );
};
