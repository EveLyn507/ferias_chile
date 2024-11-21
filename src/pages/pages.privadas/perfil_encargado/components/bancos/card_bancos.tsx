import { useEffect, useState } from "react";
import { DatosBank } from "../../../../models/interfaces";
import { bancoService } from "../../rxjs/sharingbankslist";
import { deleteBank, updateDatosBank } from "../../services/admin_feria_fuctions";

export const CardDatosBank = () => {
  const [formDataList, setFormDataList] = useState<DatosBank[]>([]);
  const [editStates, setEditStates] = useState<boolean[]>([]);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  useEffect(() => {
    const subscription = bancoService.bancos$.subscribe((bancos) => {
      setFormDataList(bancos);
      setEditStates(bancos.map(() => false));
    });
    return () => subscription.unsubscribe();
  }, []);

  const handleEdit = (index: number) => {
    setEditStates((prev) =>
      prev.map((editState, i) => (i === index ? true : editState))
    );
    setValidationErrors([]);
  };

  const handleUpdate = (index: number) => {
    const currentData = formDataList[index];

    const errors: string[] = [];
    if (!currentData.nombre_asociado || currentData.nombre_asociado.trim() === "") {
      errors.push("El nombre del asociado no puede estar vacío.");
    }
    if (
      !/^\d+$/.test(currentData.numero_cuenta) ||
      currentData.numero_cuenta.length < 5
    ) {
      errors.push("El número de cuenta debe ser un número válido de al menos 5 dígitos.");
    }

    if (errors.length > 0) {
      setValidationErrors(errors);
      return;
    }

    setEditStates((prev) =>
      prev.map((editState, i) => (i === index ? false : editState))
    );
    updateDatosBank(currentData);
    setValidationErrors([]);
  };

  const handleChange = (index: number, field: keyof DatosBank, value: string) => {
    setFormDataList((prevDataList) =>
      prevDataList.map((formData, i) =>
        i === index ? { ...formData, [field]: value } : formData
      )
    );
  };

  const borrarBank = async (mail_banco: string) => {
    const confirmDelete = window.confirm(
      "¿Está seguro de que desea eliminar este banco?"
    );
    if (confirmDelete) {
      try {
        await deleteBank(mail_banco);
        bancoService.removeBanco(mail_banco);
      } catch (error) {
        console.error("Error al eliminar el banco:", error);
      }
    }
  };

  return (
    <div className="card-bancos">
      {formDataList.map((formData, index) => (
        <div className="banco-card" key={formData.mail_banco}>
          <ul className="banco-info">
            <li className="banco-info-item">
              <input
                type="text"
                value={formData.nombre_asociado}
                readOnly={!editStates[index]}
                onChange={(e) => handleChange(index, "nombre_asociado", e.target.value)}
              />
            </li>
            <li className="banco-info-item">
              <input
                type="text"
                value={formData.numero_cuenta}
                readOnly={!editStates[index]}
                onChange={(e) => handleChange(index, "numero_cuenta", e.target.value)}
              />
            </li>
            <li className="banco-info-item">
              <label>{formData.mail_banco}</label>
            </li>
          </ul>
          {!editStates[index] ? (
            <button className="banco-edit-btn" onClick={() => handleEdit(index)}>
              Actualizar
            </button>
          ) : (
            <button className="banco-save-btn" onClick={() => handleUpdate(index)}>
              Guardar Cambios
            </button>
          )}
          <button
            className="banco-delete-btn"
            onClick={() => borrarBank(formData.mail_banco)}
          >
            Borrar Banco
          </button>
        </div>
      ))}
      {validationErrors.length > 0 && (
        <div className="banco-errors">
          {validationErrors.map((error, index) => (
            <p key={index} className="banco-error-item">{error}</p>
          ))}
        </div>
      )}
    </div>
  );
};
