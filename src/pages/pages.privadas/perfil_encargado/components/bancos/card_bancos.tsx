
import { useEffect, useState } from "react";
import { DatosBank } from "../../../../models/interfaces";
import { bancoService } from "../../rxjs/sharingbankslist";
import { deleteBank, updateDatosBank } from "../../services/admin_feria_fuctions";


export const CardDatosBank = () => {

  const [formDataList, setFormDataList] = useState<DatosBank[]>([]);
  const [editStates, setEditStates] = useState<boolean[]>([]);

  useEffect(() => {
    // Suscribirse a los cambios en la lista de bancos
    const subscription = bancoService.bancos$.subscribe((bancos) => {
      setFormDataList(bancos);
      setEditStates(bancos.map(() => false)); // Inicializa los estados de edición
    });



    // Cleanup: cancelar la suscripción cuando el componente se desmonte
    return () => subscription.unsubscribe();
  }, []); // Ejecuta el efecto nuevamente si cambia el mail


  //FIN USEFFECT
  const handleEdit = (index: number) => {
    setEditStates((prev) => prev.map((editState, i) => (i === index ? true : editState)));
  };


  const handleUpdate = (index: number) => {
    setEditStates((prev) => prev.map((editState, i) => (i === index ? false : editState)));
    updateDatosBank(formDataList[index]);
  };


  const handleChange = (index: number, field: keyof DatosBank, value: string) => {
    setFormDataList((prevDataList) =>
      prevDataList.map((formData, i) =>
        i === index ? { ...formData, [field]: value } : formData
      )
    );
  };




  const borrarBank = async (mail_banco: string) => {
    try {
      await deleteBank(mail_banco);
      bancoService.removeBanco(mail_banco); // Actualiza la lista usando RxJS
    } catch (error) {
      console.error("Error al eliminar el banco:", error);
    }
  };

  return (
    <div className="ferias">
      {formDataList.map((formData, index) => (
        <div className="card" key={formData.mail_banco}> {/* Usar mail_banco como key */}
          <ul>
            <li>
              <input
                type="text"
                value={formData.nombre_asociado}
                readOnly={!editStates[index]}
                onChange={(e) => handleChange(index, "nombre_asociado", e.target.value)}
              />
            </li>
            <li>
              <input
                type="text"
                value={formData.numero_cuenta}
                readOnly={!editStates[index]}
                onChange={(e) => handleChange(index, "numero_cuenta", e.target.value)}
              />
            </li>
            <li>
              <label>{formData.mail_banco}</label> {/* Mostrar como label */}
            </li>
          </ul>
          {!editStates[index] ? (
            <button onClick={() => handleEdit(index)}>Actualizar</button>
          ) : (
            <button onClick={() => handleUpdate(index)}>Guardar Cambios</button>
          )}
          <button onClick={() => borrarBank(formData.mail_banco)}>Borrar Banco</button>
        </div>
      ))}
    </div>
  );
};
