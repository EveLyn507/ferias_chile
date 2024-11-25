import { useEffect, useState } from "react";
import { solicitud } from "../../../models/interfaces";
import userWebSocketService from "../../../models/webSoket";
import { useSelector } from "react-redux";
import { AppStore } from "../../../../redux/store"; // Cambia la ruta según tu estructura


export const Card_soli_muni = () => {
  const WebSocketService = userWebSocketService.getInstance();
  const [solicitudes, setSolicitudes] = useState<solicitud[]>([]);
  const id_user_adm = useSelector((state: AppStore) => state.user.id_user); // Obtén el estado global del usuario

  useEffect(() => {
    WebSocketService.connect();
    console.log('Enviando solicitud para obtener solicitudes:', id_user_adm);
    WebSocketService.sendMessage("obtener_solicitudes", { id_user_adm });
  
    WebSocketService.RecibeData("solicitud_response", (data) => {
      console.log("Datos recibidos en el frontend:", data);
      if (data?.length > 0) {
        setSolicitudes(data);
      } else {
        console.error("No se recibieron solicitudes o el formato es incorrecto:", data);
      }
    });

    // Escuchar la actualización de la solicitud una sola vez
    WebSocketService.RecibeData("obtener_solicitudes", (data) => {
      console.log("Solicitud actualizada:", data);
      setSolicitudes((prev) =>
        prev.map((sol) =>
          sol.id_solicitud === data.id_solicitud
            ? { ...sol, ...data } // Actualizar la solicitud correspondiente
            : sol
        )
      );
    });
  
    return () => {
      WebSocketService.disconnect();
    };
  }, [WebSocketService, id_user_adm]);

  const aceptarSolicitud = (id_solicitud: number, id_feria: number) => {
    console.log("Aceptando solicitud", id_solicitud, id_feria);
    WebSocketService.sendMessage("confirmar_solicitud", { id_solicitud, id_feria });
  };
  
  const rechazarSolicitud = (id_solicitud: number, id_feria: number) => {
    console.log("Rechazando solicitud", id_solicitud, id_feria);
    WebSocketService.sendMessage("rechazar_solicitud", { id_solicitud, id_feria });
  };
  
  return (
    <div className="ferias">
      {solicitudes.length > 0 ? (
        solicitudes.map((solicitud) => (
          <div className="card" key={solicitud.id_solicitud}>
            <ul>
              <li>Solicitante: {solicitud.nombre_solicitante}</li>
              <li>Correo: {solicitud.enf_mail}</li>
              <li>Teléfono: {solicitud.enf_fono}</li>
              <li>Feria: {solicitud.nombre_feria}</li>
              <li>Estado: {solicitud.estado}</li>
            </ul>
            <button
              onClick={() => aceptarSolicitud(solicitud.id_solicitud, solicitud.id_feria)}
            >
              Aceptar
            </button>
            <button
              onClick={() => rechazarSolicitud(solicitud.id_solicitud, solicitud.id_feria)}
            >
              Rechazar
            </button>
          </div>
        ))
      ) : (
        <p>No hay solicitudes disponibles.</p>
      )}
    </div>
  );
};
