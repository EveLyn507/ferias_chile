


export interface datosPuesto { 
  id_tipo_puesto : number,
  numero : number,
  descripcion : string,
  id_feria : number,
  id_estado_puesto : number
}





export  interface Rectangle {
    x: number;
    y: number;
    width: number;
    height: number;
    fill: string; 
    isStatic: boolean; 
  }

  
  export interface Street {
    points: number[];
    width: number;
    height: number;
    x: number;
    y: number;
    isStatic: boolean; 
  }
  
  export interface dataPuesto {
    descripcion : string,
    numero : number | null,
    id_feria : number,
    id_tipo_puesto : number
    id_estado_puesto : number
    precio : number
  }

// aplicacion de flexibilidad para los tipos , en dimeciones especificamente
  export type PlanoItemType = Rectangle | Street 
  

  export interface PlanoItemElement{
    id_elemento : number | null
    id_plano : number | null
    nombre_elemento : string
    id_tipo_elemento : number
    dimenciones : PlanoItemType 
    stile : string | null
    id_puesto: number | null
    dataPuesto: dataPuesto | null
  }
  


  export interface FeriaData {
    puestos: Rectangle[];
    calles: Street[];
    id_feria: number
    planWidth: number;
    planHeight: number;
  }
  