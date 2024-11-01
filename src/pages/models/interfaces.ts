/* eslint-disable @typescript-eslint/no-explicit-any */
 

  // SE USA EN -- FEED FERIAS -- ADMINISTRACION FERIAS

  export interface ProgramaFeria {
    id_feria: number;
    dia: string;
    hora_inicio: string; // Cambiado a string para representar el tiempo
    hora_termino: string; // Cambiado a string para representar el tiempo
    id_dia_armado: number;
    hora_inicio_armado: string; // Cambiado a string para representar el tiempo
    hora_termino_armado: string; // Cambiado a string para representar el tiempo
    activo : boolean
}

export interface listHorario{
    horarios : ProgramaFeria[]
}



// USO EN -- admin feria -- feriante postulaciones

export interface horarioVacante {
    id_detalle_horario : number | null,
    id_vacante : number | null,
    id_dia: number ,
    hora_entrada: string,
    hora_salida: string

}


export interface vacante {
    id_vacante : number,
    feriante_mail : string | null,
    id_feria :number,
    id_rol : number,
    ingreso : string,
    termino : string,
    id_estado_vacante : number
    horarios: horarioVacante[]
  }


// MODULO DE POSTULACIONES

export interface postulacion {
    id_user_fte : number ,
    user_mail : string,
    id_vacante : number |null
}


//FEED  DE FERIAS 
export interface Feria {
    id_feria: number;
    nombre_feria: string;
    comuna : string;
    region: string;
    horarios : ProgramaFeria[];
    
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


// se usa en bancos_home
export interface DatosBank {
    mail_banco: string,
    nombre_asociado: string,
    numero_cuenta: string,
    encargado_mail: string
}


export interface listBanks {
    bancos : DatosBank[]

}
