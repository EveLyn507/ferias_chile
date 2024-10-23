/* eslint-disable react-hooks/exhaustive-deps */
import { useSelector } from "react-redux";
import { getDatosBank } from "../../services/admin_feria_fuctions";
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
   
   <h1>aca deberia haber dropdown</h1>
   
   </>
  );
};
