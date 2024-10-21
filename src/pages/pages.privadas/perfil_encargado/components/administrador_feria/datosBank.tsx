/* eslint-disable react-hooks/exhaustive-deps */
import { useSelector } from "react-redux";
import { getDatosBank, saveDatosBank } from "../../services/admin_feria_fuctions";
import { AppStore } from "../../../../../redux/store";
import { useEffect, useState } from "react";
import { DatosBank } from "../../../../models/interfaces";


export const DatosBanco = () => {


  const mail = useSelector((store: AppStore) => store.user.email);

  const [encargadoBank, setEncargadoBank] = useState<DatosBank>({
    mail_banco: '',
    nombre_asociado: '',
    numero_cuenta: '',
    encargado_mail: mail,
  });

  // Cargar los datos del banco en el useEffect
  useEffect(() => {
    getDatosBank(mail)
      .then((res: DatosBank) => {
        setEncargadoBank(res);
      })
      .catch((error) => {
        console.error("Error al cargar los datos de los bancos del encargado:", error);
      });
  }, []);
  console.log(encargadoBank)
  return (
    <>

    <div>
        <label> Correo de la cuenta </label>
        <input
          type="text"
          value={encargadoBank.mail_banco}
          onChange={(e) => setEncargadoBank(prev => ({ ...prev, mail_banco: e.target.value }))}
        />
    </div>


      <div>
        <label> Número de cuenta </label>
        <input
          type="text"
          value={encargadoBank.numero_cuenta}
          onChange={(e) => setEncargadoBank(prev => ({ ...prev, numero_cuenta: e.target.value }))}
        />
      </div>

      <div>
        <label> Nombre asociado </label>
        <input
          type="text"
          value={encargadoBank.nombre_asociado}
          onChange={(e) => setEncargadoBank(prev => ({ ...prev, nombre_asociado: e.target.value }))}
        />
      </div>

      <button onClick={() => saveDatosBank(encargadoBank)}>
        Guardar datos
      </button>
    </>
  );
};
