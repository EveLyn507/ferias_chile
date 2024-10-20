/* eslint-disable @typescript-eslint/no-explicit-any */
 

  // SE USA EN -- FEED FERIAS -- ADMINISTRACION FERIAS

  export interface ProgramaFeria {
    lunes: string,   // '1' o '0'
    martes: string,  // '1' o '0'
    miercoles: string,  // '1' o '0'
    jueves: string,  // '1' o '0'
    viernes: string,  // '1' o '0'
    sabado: string,  // '1' o '0'
    domingo: string,  // '1' o '0'
}


//FEED  DE FERIAS 
export interface Feria {
    id_feria: number;
    nombre_feria: string;
    comuna : string;
    region: string;
    programa : ProgramaFeria[];
    
}





// SE USA EN -- CARD_FERIAS  -- CARD_FERIAS_ENCARGADO
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

// USADO EN 
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

