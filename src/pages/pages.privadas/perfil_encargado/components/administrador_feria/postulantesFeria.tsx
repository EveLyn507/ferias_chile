/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { postulacionService } from "../../rxjs/sharingPostulaciones";
import { ftePostulacion, homeProps } from "../../../../models/interfaces";
import { aceptarPostulacion, rechazarPostulacion } from "../../services/admin_feria_fuctions";

export const PostulantesFeria = ({ idFeria }: homeProps) => {
  const [postulaciones, setPostulacion] = useState<ftePostulacion[]>([]);
  const [error, setError] = useState<string | null>(null); // Para errores
  const [successMessage, setSuccessMessage] = useState<string | null>(null); // Para mensajes de éxito

  useEffect(() => {
    const subscription = postulacionService.postulacion$.subscribe((postulacionesf) => {
      console.log("Postulaciones recibidas:", postulacionesf);
      setPostulacion(postulacionesf);
    });

    console.log("id", idFeria);

    return () => subscription.unsubscribe();
  }, []);

  const aceptar = async (id_postulacion: number, id_vacante: number, id_user_fte: number) => {
    try {
      await aceptarPostulacion(id_postulacion, id_vacante, id_user_fte);
      setError(null);
      setSuccessMessage("Postulación aceptada exitosamente.");
    } catch (error) {
      console.error("Error al aceptar la postulación:", error);
      setError("Error al aceptar la postulación. Intente nuevamente.");
      setSuccessMessage(null);
    }
  };

  const rechazar = async (id_postulacion: number, id_vacante: number, id_user_fte: number) => {
    try {
      await rechazarPostulacion(id_postulacion, id_vacante, id_user_fte);
      setError(null);
      setSuccessMessage("Postulación rechazada exitosamente.");
    } catch (error) {
      console.error("Error al rechazar la postulación:", error);
      setError("Error al rechazar la postulación. Intente nuevamente.");
      setSuccessMessage(null);
    }
  };

  return (
    <div className="ferias">
      {error && (
        <div style={{ color: "red", marginBottom: "10px" }}>
          <p>{error}</p>
        </div>
      )}
      {successMessage && (
        <div style={{ color: "green", marginBottom: "10px" }}>
          <p>{successMessage}</p>
        </div>
      )}
      {postulaciones.length > 0 ? (
        postulaciones.map((postulacion) => (
          <div className="card" key={postulacion.id_postulacion}>
            <ul>
              <li>Nombre: {postulacion.fte_nombre} {postulacion.fte_apellido}</li>
              <li>Id Vacante a la que aplica: {postulacion.id_vacante}</li>
              <li>Id Feria: {postulacion.id_feria}</li>
              <li>Id Usuario: {postulacion.id_user_fte}</li>
              <button
                onClick={() => aceptar(postulacion.id_postulacion, postulacion.id_vacante, postulacion.id_user_fte)}
                style={{
                  padding: "8px 12px",
                  marginRight: "10px",
                  backgroundColor: "#28a745",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                }}
              >
                Aceptar
              </button>
              <button
                onClick={() => rechazar(postulacion.id_postulacion, postulacion.id_vacante, postulacion.id_user_fte)}
                style={{
                  padding: "8px 12px",
                  backgroundColor: "#dc3545",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                }}
              >
                Rechazar
              </button>
            </ul>
          </div>
        ))
      ) : (
        <p>Aún no hay postulantes</p>
      )}
    </div>
  );
};
