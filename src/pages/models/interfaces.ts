/* eslint-disable @typescript-eslint/no-explicit-any */
 

  // SE USA EN -- FEED FERIAS -- ADMINISTRACION FERIAS

  export interface ProgramaFeria {
    id_feria: number;
    id_dia: number;
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
    id_user_fte : number | null,
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


export interface Mispostulacion {
    id_postulacion : number,
    estado : string,
    nombre_feria : string,
    rol : string ,
    fecha_ingreso : string,
    fecha_termino : string
}


export interface actividadFeria {
    id_feria :number,
    id_actividad_feria :number,
    id_horario_feria :number,
    fecha :string ,
	armado_hecho: boolean,
	feria_hecha :boolean
}


export interface Feria {
    id_feria: number;
    nombre_feria: string;
    comuna : string;
    region: string;
    estado : string
    horarios : ProgramaFeria[];
    actividades : actividadFeria[];
    
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


export interface ActividadPuesto {
    id_feria : number,
    nombre_feria :string,
    id_actividad_feria :number,
    id_dia : number,
    fecha : string,
    id_puesto: number,
    id_arriendo_puesto: number,
    disponible: boolean,
    numero: number,
    precio: number,
    id_horario: number,
    hora_inicio: string,
    hora_termino:string,
    num_horario: number
}


export interface acPuestoProps{
    puestos : ActividadPuesto[]
}


// USADO EN 
export interface PuestosProp {
    puestos: puesto[];
}






export interface solicitud {
    id_solicitud : number,
    id_estado : number,
    estado : string,
    id_feria : number,
    nombre_feria: string,
    id_user_adm : number,
    nombre_solicitante : string,
    enf_mail : string,
    enf_fono : number
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
    id_user_enf: number | null
}


export interface listBanks {
    bancos : DatosBank[]

}


// admin feria --> postulaciones feria  

export interface ftePostulacion{
    id_feria : number,
    f_nombre : string,
    id_vacante : number,
    id_postulacion : number,
    id_user_fte : number,
    fte_nombre : string,
    fte_apellido : string
}
