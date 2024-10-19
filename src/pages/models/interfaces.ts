/* eslint-disable @typescript-eslint/no-explicit-any */
 export interface Feria {
    id_feria: number;
    nombre_feria: string;
    comuna : string;
    region: string;
    
}


export interface FeriasProps {
    ferias: Feria[];
}



export interface puesto {
    id_puesto :number,
    id_feria : number,
    estado_puesto : string,
    nombre_feria : string,
    num_puesto: number,
    num_horario: number,
    hora_inicio :string,
    hora_termino :string,
    precio :number
}

// Define las props del componente, en este caso un array de objetos Feria
export interface PuestosProp {
    puestos: puesto[];
}


export interface solicitud {
idSolicitud : number,
encargadoMail : string,
muniMail : string,
idFeria: number,
estado : string,
}


export interface soliProps {
solicitudes : solicitud[]

}


export interface contrato {
    id_contrato: string,
    fecha : string,
    id_puesto: number,
    mail_feriante : string,
    id_tipo_pago : number,
    estado_contrato : number,
    precio : number,

}




// INTERFACES HERRAMIENTA DE PLANOS



 export interface PuestoData {
    x: number;
    y: number;
    id: string;
    fill: string;
    width: number;
    height: number;
  }
  
export interface FeriaData {
    areas: any[]; 
    calles: any[]; 
    puestos: PuestoData[];
  }