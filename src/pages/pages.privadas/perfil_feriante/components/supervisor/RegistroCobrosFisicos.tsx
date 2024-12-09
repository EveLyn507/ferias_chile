import React, {  } from 'react';

interface Feriante {
  id_user_fte: number;
  nombre_feriante: string;
  id_puesto: number
  numero: string;
  precio: number;
  estado_pago: string
  id_estado_contrato : number
  tipo_pago : string

}

interface RegistroCobrosFisicosProps {
  id_feria: number;
  feriante: Feriante
  registrarPago : (id_user : number) => void
}

const RegistroCobrosFisicos: React.FC<RegistroCobrosFisicosProps> = ({  feriante , registrarPago}) => {

  return (
    <div>
      <h4>Estado del pago</h4>
      {feriante.id_estado_contrato === 2 ? 
      (<span> {feriante.estado_pago}</span>) : 
      (<span>{feriante.estado_pago} - <button onClick={() => registrarPago(feriante.id_user_fte)}>Pagar</button></span>) } 
    </div>
  );
};

export default RegistroCobrosFisicos;
