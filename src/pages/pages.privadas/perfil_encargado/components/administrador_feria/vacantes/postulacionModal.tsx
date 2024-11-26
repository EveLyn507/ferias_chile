import { useEffect } from "react";
import { aceptarPostulacion, rechazarPostulacion } from "../../../services/admin_feria_fuctions";
import Modal from "react-modal";
import { ftePostulacion } from "../../../../../models/interfaces";

interface ModalProps {
    isOpen : boolean
    onClose: () => void
    isCarga: boolean
    postulaciones: ftePostulacion[] | null
  }

  Modal.setAppElement("#root");

export const PostulacionModal = ({ isOpen , onClose ,postulaciones} : ModalProps) => {

    const aceptar = async (id_postulacion: number, id_vacante: number, id_user_fte: number) => {
        try {
          await aceptarPostulacion(id_postulacion, id_vacante, id_user_fte);
        } catch (error) {
          console.error("Error al aceptar la postulación:", error);
   
        }
      };
    
      const rechazar = async (id_postulacion: number, id_vacante: number, id_user_fte: number) => {
        try {
          await rechazarPostulacion(id_postulacion, id_vacante, id_user_fte);

        } catch (error) {
          console.error("Error al rechazar la postulación:", error);

        }
      };





useEffect(() => {

},[])



return (
    <>


        <> 
      <Modal
        isOpen={isOpen}
        onRequestClose={onClose}
        contentLabel="Postulaciones Modal"
        style={{
          content: {
            maxWidth: "600px",
            margin: "auto",
            padding: "20px",
            borderRadius: "10px",
            overflow: "auto",
          },
          overlay: {
            backgroundColor: "rgba(0, 0, 0, 0.5)",
          },
        }}
      >
        <div className="ferias">
          <h2>Postulaciones</h2>
          <button
            onClick={onClose}
            style={{
              float: "right",
              padding: "5px 10px",
              backgroundColor: "#6c757d",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            Cerrar
          </button>

          {postulaciones && postulaciones.length > 0 ? (
            postulaciones.map((postulacion) => (
              <div className="card" key={postulacion.id_postulacion}>
                <ul>
                  <li>
                    Nombre: {postulacion.nombre_postulante}
                  </li>
                  <li>Id Vacante a la que aplica: {postulacion.id_vacante}</li>
                  <li>Id Feria: {postulacion.id_feria}</li>
                  <li>Id Usuario: {postulacion.id_user_fte}</li>
                  <button
                    onClick={() =>
                      aceptar(
                        postulacion.id_postulacion,
                        postulacion.id_vacante,
                        postulacion.id_user_fte
                      )
                    }
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
                    onClick={() =>
                      rechazar(
                        postulacion.id_postulacion,
                        postulacion.id_vacante,
                        postulacion.id_user_fte
                      )
                    }
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
      </Modal> 
        </>
    
    </>
  );
};


 




