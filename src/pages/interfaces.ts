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