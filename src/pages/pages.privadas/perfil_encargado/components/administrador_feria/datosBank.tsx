/* eslint-disable react-hooks/exhaustive-deps */
import { useSelector } from "react-redux";
import { AppStore } from "../../../../../redux/store";
import { useEffect, useState } from "react";
import { DatosBank } from "../../../../models/interfaces";
import { bancoService } from "../../rxjs/sharingbankslist";
import { asociarBankFeria, getFeriaBank } from "../../services/admin_feria_fuctions";
import { useParams } from "react-router-dom";

export const BancoFeria = () => {
  const id_user_enf = useSelector((store: AppStore) => store.user.id_user);
  const [bancos, setBancos] = useState<DatosBank[]>([]); // lista de todos los bancos
  const [feriaBanco, setFeriaBanco] = useState<string | null>(''); // el banco asociado a la feria
  const [validationErrors, setValidationErrors] = useState<string | null>(null);

  const { id_feria } = useParams<{ id_feria: string }>();
  const idFeria = id_feria ? parseInt(id_feria, 10) : 0;

  const cargaBankF = async () => {
    if (!idFeria || idFeria === 0) {
      setValidationErrors("El ID de la feria no es válido.");
      return;
    }

    try {
      const b = await getFeriaBank(idFeria);
      if (b === null) {
        setFeriaBanco('seleccione un banco');
      } else {
        setFeriaBanco(b);
      }
      setValidationErrors(null); // Limpiar errores si los datos se cargaron correctamente
    } catch (error) {
      console.error("Error al cargar los datos del banco:", error);
      setValidationErrors("Error al cargar los datos del banco.");
    }
  };

  const asociar = async (mail_banco: string | null, id_feria: number) => {
    if (!mail_banco || mail_banco === "ninguna") {
      setValidationErrors("Debe seleccionar un banco antes de guardar.");
      return;
    }

    try {
      await asociarBankFeria(mail_banco, id_feria);
      setValidationErrors(null); // Limpiar errores después de guardar exitosamente
      await cargaBankF(); // Recargar datos después de asociar
    } catch (error) {
      console.error("Error al asociar el banco:", error);
      setValidationErrors("Error al asociar el banco.");
    }
  };

  useEffect(() => {
    bancoService.loadInitialBancos(id_user_enf);

    const subscription = bancoService.bancos$.subscribe((bancos) => {
      setBancos(bancos);
    });

    cargaBankF();

    return () => subscription.unsubscribe();
  }, []);

  return (
    <div className="banco-feria">
      <div>
        {/* Otros elementos */}
      </div>
      {validationErrors && (
        <div className="banco-feria-error" style={{ color: "red", marginBottom: "10px" }}>
          {validationErrors}
        </div>
      )}
      {bancos.length > 0 ? (
        <>
          <select
            className="banco-feria-select"
            id="feriaBanco"
            value={feriaBanco || ''}
            onChange={(e) => setFeriaBanco(e.target.value || null)}
          >
            <option value="">Ninguna</option>
            <option value={feriaBanco || ''}>{feriaBanco}</option>
            {bancos.map((banco, index) => (
              <option key={index} value={banco.mail_banco}>
                {banco.mail_banco}
              </option>
            ))}
          </select>

          <button 
            className="banco-feria-save-btn" 
            onClick={() => asociar(feriaBanco, idFeria)}
          >
            Guardar banco
          </button>
        </>
      ) : (
        <ul className="banco-feria-empty-list">
          <li className="banco-feria-empty-item">No hay bancos disponibles</li>
        </ul>
      )}
</div>

  );
};
