/* eslint-disable react-hooks/exhaustive-deps */
import { useSelector } from "react-redux";
import { AppStore } from "../../../../../redux/store";
import { useEffect, useState } from "react";
import { DatosBank } from "../../../../models/interfaces";
import { bancoService } from "../../rxjs/sharingbankslist";
import { asociarBankFeria, getFeriaBank } from "../../services/admin_feria_fuctions";
import { Link, useParams } from "react-router-dom";


export const BancoFeria = () => {
  const id_user_enf = useSelector((store: AppStore) => store.user.id_user);
  const [bancos, setBancos] = useState<DatosBank[]>([]);// lista de todos los bancos
  const [feriaBanco, setFeriaBanco] = useState<string | null>(''); // el banco asociado a la feria
 
  const {id_feria} = useParams<{id_feria :string}>() 
  const idFeria = id_feria ? parseInt(id_feria, 10) : 0
  
  
  const cargaBankF= async() => {
    const b = await getFeriaBank(idFeria)
    if (b === null) {
      setFeriaBanco('seleccione un banco');
    } else {
      setFeriaBanco(b);
    }
        
  }

const asociar = async (mail_banco : string | null , id_feria : number) => {
  await asociarBankFeria(mail_banco,id_feria)
}


useEffect(() => {
  bancoService.loadInitialBancos(id_user_enf);

  const subscription = bancoService.bancos$.subscribe((bancos) => {
    setBancos(bancos);
  });

  cargaBankF()

  return () => subscription.unsubscribe();
},[])

return (
  <>
    <div>
      {/* Otros elementos */}
    </div>
    {bancos.length > 0 ? (
      <>
      <select
        name="feriaBanco"
        id="feriaBanco"
        value={feriaBanco || ''}
        onChange={(e) => setFeriaBanco(e.target.value || null)}
      >
        <option value="">ninguna</option>
        <option value={feriaBanco || ''}>{feriaBanco}</option>
        {bancos.map((banco, index) => (
          <option key={index} value={banco.mail_banco}>
            {banco.mail_banco}
          </option>
        ))}
      </select>

      <button onClick={() => asociar(feriaBanco , idFeria)}> guardar banco</button>
      </>
    ) : (
      <ul>
        <li>No hay bancos disponibles</li>
      </ul>
    )}
  <li><Link to='private/1/bancos'>Ingresa tus bancos</Link></li> 
  </>
);


};
