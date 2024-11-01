import { useEffect, useState } from "react";
import { vancanteService } from "../../../rxjs/sharingVacantes";
import { vacante } from "../../../../../models/interfaces";
import { deleteVacante,  updateVacanteFeria } from "../../../services/admin_feria_fuctions";
import { useParams } from "react-router-dom";

export const EmpleadosFeria = () => {
  const {id_feria} = useParams<{id_feria :string }>();
  const idFeria =  id_feria ? parseInt(id_feria, 10)  : 0; // se pasa hacia aca para que no quede como undefined o null

  

  const [vacantes, setVacantes] = useState<vacante[]>([]);

  const [editStates, setEditStates] = useState<boolean[]>([]);

  useEffect(() => {
    const subscription = vancanteService.vacante$.subscribe((vacantes) => {
      setVacantes(vacantes);
      setEditStates(vacantes.map(() => false));
    });
   

    // Limpieza de la suscripción
    return () => {
      subscription.unsubscribe();
    };
  }, []);
    
//FIN USEEFECT
  const handleEdit = (index: number) => {
    setEditStates((prev) => prev.map((editState, i) => (i === index ? true : editState)));
  };

  const actualizarVacante = (index: number) => {
    setEditStates((prev) => prev.map((editState, i) => (i === index ? false : editState)));
    updateVacanteFeria(vacantes[index],idFeria );

  };

  const handleChange = (index: number, field: keyof vacante, value: string) => {
    setVacantes((prevDataList) =>
      prevDataList.map((formData, i) =>
        i === index ? { ...formData, [field]: value } : formData
      )
    );
  };

  const borrarVacante = async (id_vacante: number) => {
    try {
      await deleteVacante(id_vacante);
    } catch (error) {
      console.error("Error al eliminar el vacante:", error);
    }
  };


  return (
    <div className="ferias">
      {vacantes.map((formData, index) => (
        <div className="card" key={formData.id_vacante}> {/* Usar mail_banco como key */}
          <ul>
            <li>
              <input
                type="number"
                value={formData.supervisa_id_feria}
                readOnly={!editStates[index]}
                onChange={(e) => handleChange(index, "supervisa_id_feria", e.target.value)}
              />
            </li>
            <li>
              <input
                type="text"
                value={formData.ingreso}
                readOnly={!editStates[index]}
                onChange={(e) => handleChange(index, "ingreso", e.target.value)}
              />
            </li>
            <li>
              <input
                type="text"
                value={formData.id_vacante}
                readOnly={!editStates[index]}
                onChange={(e) => handleChange(index, "id_vacante", e.target.value)}
              />
            </li>
            <li>
              <label>{formData.feriante_mail}</label> 
            </li>
          </ul>
          {!editStates[index] ? (
            <button onClick={() => handleEdit(index)}>Actualizar</button>
          ) : (
            <button onClick={() => actualizarVacante(index)}>Guardar Cambios</button>
          )}
          <button onClick={() => borrarVacante(formData.id_vacante)}>Eliminar Vacante</button>
        </div>
      ))}
    </div>
  );
}