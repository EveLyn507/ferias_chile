import { useState, useEffect } from "react";
import { homeProps, ProgramaFeria } from "../../../../../models/interfaces";
import { getProgramaFeria, GuardarProgramacionFeria } from "../../../services/admin_feria_fuctions";
import EditProgramaModal from "./programaModal"; // Importa el modal
import { useToast } from "../../../../../../components/ToastService";

const BooleanDaysSelector = ({ id_feria }: homeProps) => {
  const semana = ["none", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"];

  const [programaF, setPrograma] = useState<ProgramaFeria[]>([]); // Lista de programas actual
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPrograma, setSelectedPrograma] = useState<ProgramaFeria | null>(null);
  const { addToast } = useToast(); // Hook para mostrar mensajes con ToastService

  useEffect(() => {
    getProgramaFeria(id_feria)
      .then((res: ProgramaFeria[]) => {
        setPrograma(res);
      })
      .catch((error) => {
        console.error("Error al cargar la programación:", error);
        addToast({ type: "error", message: "Error al cargar la programación de la feria." });
      });
  }, [addToast, id_feria]);


  const handleEditClick = (programa: ProgramaFeria) => {
    setSelectedPrograma(programa);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setSelectedPrograma(null)
    setIsModalOpen(false);
  };

  const handleSavePrograma = async (updatedDiaPrograma: ProgramaFeria) => {
    const result = await GuardarProgramacionFeria(updatedDiaPrograma , id_feria)
    if(result === 200){
 setPrograma((prevPrograma) =>
      prevPrograma.map((item) =>
        item.id_programa === updatedDiaPrograma.id_programa
          ? updatedDiaPrograma
          : item 
      )
    );
    
    addToast({ type: "success", message: "Programa modificado" });
  }
  else {
    addToast({ type: "error", message: "error al modificar programa" });
  }


    }
   
    


  return (
    <div className="programa-container">
      <table className="programa-table">
        <thead>
          <tr>
            <th>Día</th>
            <th>Hora inicio</th>
            <th>Hora término</th>
            <th>Día de Armado</th>
            <th>Hora inicio armado</th>
            <th>Hora término armado</th>
            <th>Activado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        {programaF.map((programa) => (
          <tbody key={programa.id_programa}>
            <tr>
              <td>{semana[programa.id_dia]}</td>
              <td>{programa.hora_inicio}</td>
              <td>{programa.hora_termino}</td>
              <td>{programa.id_dia_armado}</td>
              <td>{programa.hora_inicio_armado}</td>
              <td>{programa.hora_termino_armado}</td>
              {programa.activo ? <td className="si">SI</td> : <td className="no">NO</td>}
              <td>
                <button onClick={() => handleEditClick(programa)}>Editar</button>
              </td>
            </tr>
          </tbody>
        ))}
      </table>

      {/* Modal para editar la programación */}
      {selectedPrograma && (
        <EditProgramaModal
          isOpen={isModalOpen}
          onClose={handleModalClose}
          programa={selectedPrograma}
          onSave={handleSavePrograma}
        />
      )}

 
    </div>
  );
};

export default BooleanDaysSelector;
