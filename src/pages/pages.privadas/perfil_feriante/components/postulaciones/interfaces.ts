export interface feriaVacante {
    id_feria: number
    nombre: string
    id_comuna : number
    comuna: string
    id_region: number
    region : string
    conteo_vacantes : string
    }
    
export interface feriasTableProps {
        ferias : feriaVacante[] | null
    }



   export  interface horarioEmpleado {
        id_detalle_horario : number
        id_vacante : number, 
        id_dia : number,
        hora_entrada : string,
        hora_salida : string
    }
    
    export interface vacantePostular {
        id_vacante : number
        id_rol : number
        rol : string
        ingreso : string
        termino : string
        id_estado_vacante :string
        horarios : horarioEmpleado[]
    }
    