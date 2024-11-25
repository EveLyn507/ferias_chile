import { useState, useEffect } from "react";
import { homeProps, ProgramaFeria } from "../../../../models/interfaces";
import { getProgramaFeria, GuardarProgramacionFeria } from "../../services/admin_feria_fuctions";
import EditProgramaModal from "./programaModal";  // Importa el modal

const BooleanDaysSelector = ({ idFeria, nombreF }: homeProps) => {
  const semana = ['none', 'Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado', 'Domingo'];

  const [programaF, setActual] = useState<ProgramaFeria[]>([]); // Lista de programas actual
  const [UpdatedPrograma, setUpdatedPro] = useState<ProgramaFeria[]>([]);  // lista modificada que se enviara al backend al guardarla
  const [isModified, setIsModified] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPrograma, setSelectedPrograma] = useState<ProgramaFeria | null>(null);

  useEffect(() => {
    getProgramaFeria(idFeria)
      .then((res: ProgramaFeria[]) => {
        setActual(res); 
        setUpdatedPro([...res]); 
      })
      .catch((error) => {
        console.error("Error al cargar la programación:", error);
      });
  }, [idFeria]);

  useEffect(() => {
    setIsModified(JSON.stringify(programaF) !== JSON.stringify(UpdatedPrograma));
  }, [programaF, UpdatedPrograma]);


  const handleEditClick = (programa: ProgramaFeria) => {
    setSelectedPrograma(programa);
    setIsModalOpen(true);
  };

  const handleSaveVacante = (updatedPrograma: ProgramaFeria) => {
    setUpdatedPro((prevState) =>
      prevState.map((programa) =>
        programa.id_dia === updatedPrograma.id_dia ? updatedPrograma : programa
      )
    );
  };

  const sendData = async () => {
    if (nombreF !== "") {
      try {
        const result = await GuardarProgramacionFeria(UpdatedPrograma, idFeria);
        console.log("Datos enviados correctamente:", result.message);
        setActual(UpdatedPrograma); // Actualiza el estado actual con los datos nuevos
      } catch (error) {
        console.error("Error al guardar la programación:", error);
      }
    } else {
      console.log("Error: id_feria es null o undefined", idFeria);
    }
  };

  return (
    <div className="programa-container">
      <table className="data-table">
        <thead>
          <tr>
            <th>Dia</th>
            <th>Hora_inicio</th>
            <th>Hora_termino</th>
            <th>Id_dia_armado</th>
            <th>Hora_inicio_armado</th>
            <th>Hora_termino_armado</th>
            <th>activo?</th>
            <th>Acciones</th>
          </tr>
        </thead>
          {programaF.map((programa) => (
            <tbody key={programa.id_dia} >
              <td>{semana[programa.id_dia]}</td>
              <td>{programa.hora_inicio}</td>
              <td>{programa.hora_termino}</td>
              <td>{programa.id_dia_armado}</td>
              <td>{programa.hora_inicio_armado}</td>
              <td>{programa.hora_termino_armado}</td>
              <td>{programa.activo}</td>
              <td>
          
              <button onClick={() => handleEditClick(programa)}>Editar</button>
             
              </td>
              </tbody>
          ))}
     
      </table>

      {/* Modal para editar la vacante */}
      {selectedPrograma && (
        <EditProgramaModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          programa={selectedPrograma}
          onSave={handleSaveVacante} // Pasa la función onSave al modal
        />
      )}

      <button onClick={sendData} disabled={!isModified}>Guardar Cambios</button>
    </div>
    
  );
};

export default BooleanDaysSelector;
