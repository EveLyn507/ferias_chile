/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { postulacionService } from "../../rxjs/sharingPostulaciones";
import { ftePostulacion } from "../../../../models/interfaces";
import { useParams } from "react-router-dom";
import { aceptarPostulacion, rechazarPostulacion } from "../../services/admin_feria_fuctions";

export const PostulantesFeria = () => {
  const { id_feria } = useParams<{ id_feria: string }>();
  const idFeria = id_feria ? parseInt(id_feria, 10) : 0;

  const [postulaciones, setPostulacion] = useState<ftePostulacion[]>([]);
  const [validationErrors, setValidationErrors] = useState<string | null>(null);

  const cargaPostFilter = async (idFeria: number) => {
    if (!idFeria || idFeria === 0) {
      setValidationErrors("El ID de la feria no es válido.");
      return;
    }

    await postulacionService.postulacionesFeriaFilter(idFeria);

    const subscription = postulacionService.postulacion$.subscribe((postulaciones) => {
      console.log("Postulaciones recibidas:", postulaciones);
      setPostulacion(postulaciones);
      setValidationErrors(null); // Limpiar errores previos si los datos se cargaron correctamente
      return () => {
        subscription.unsubscribe();
      };
    });
  };

  useEffect(() => {
    cargaPostFilter(idFeria);
  }, []);

  const aceptar = async (id_postulacion: number, id_vacante: number, id_user_fte: number) => {
    if (!id_postulacion || !id_vacante || !id_user_fte) {
      setValidationErrors("Faltan datos para aceptar la postulación.");
      return;
    }

    const confirmAccept = window.confirm("¿Estás seguro de aceptar esta postulación?");
    if (confirmAccept) {
      try {
        await aceptarPostulacion(id_postulacion, id_vacante, id_user_fte);
        setValidationErrors(null);
        await cargaPostFilter(idFeria); // Recargar datos después de la acción
      } catch (error) {
        console.error("Error al aceptar la postulación:", error);
        setValidationErrors("Ocurrió un error al aceptar la postulación.");
      }
    }
  };

  const rechazar = async (id_postulacion: number, id_vacante: number, id_user_fte: number) => {
    if (!id_postulacion || !id_vacante || !id_user_fte) {
      setValidationErrors("Faltan datos para rechazar la postulación.");
      return;
    }

    const confirmReject = window.confirm("¿Estás seguro de rechazar esta postulación?");
    if (confirmReject) {
      try {
        await rechazarPostulacion(id_postulacion, id_vacante, id_user_fte);
        setValidationErrors(null);
        await cargaPostFilter(idFeria); // Recargar datos después de la acción
      } catch (error) {
        console.error("Error al rechazar la postulación:", error);
        setValidationErrors("Ocurrió un error al rechazar la postulación.");
      }
    }
  };

  return (
    <div className="postulantes-feria">
      {validationErrors && (
        <div className="postulantes-error" style={{ color: "red", marginBottom: "10px" }}>
          {validationErrors}
        </div>
      )}
      {postulaciones.length > 0 ? (
        postulaciones.map((postulacion) => (
          <div className="postulante-card" key={postulacion.id_postulacion}>
            <ul className="postulante-info">
              <li className="postulante-info-item">
                <span className="postulante-label">Nombre:</span> {postulacion.fte_nombre} {postulacion.fte_apellido}
              </li>
              <li className="postulante-info-item">
                <span className="postulante-label">Id Vacante:</span> {postulacion.id_vacante}
              </li>
              <li className="postulante-info-item">
                <span className="postulante-label">Id Feria:</span> {postulacion.id_feria}
              </li>
              <li className="postulante-info-item">
                <span className="postulante-label">Id Usuario:</span> {postulacion.id_user_fte}
              </li>
              <div className="postulante-actions">
                <button 
                  className="postulante-accept-btn" 
                  onClick={() => aceptar(postulacion.id_postulacion, postulacion.id_vacante, postulacion.id_user_fte)}
                >
                  Aceptar
                </button>
                <button 
                  className="postulante-reject-btn" 
                  onClick={() => rechazar(postulacion.id_postulacion, postulacion.id_vacante, postulacion.id_user_fte)}
                >
                  Rechazar
                </button>
              </div>
            </ul>
      </div>
    ))
  ) : (
    <p className="no-postulantes-message">Aún no hay postulantes</p>
  )}
</div>

  );
};
