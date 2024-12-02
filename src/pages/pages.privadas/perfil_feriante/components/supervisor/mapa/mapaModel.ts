// esto es practicamente una copia , solo para que no tenga que salir y entrar a tantas carpetas en los modelos de la he plano
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
    id_puesto: number | null,
    id_tipo_puesto : number
    id_estado_puesto : number
    precio : number
  }

// aplicacion de flexibilidad para los tipos , en dimeciones especificamente
  export type PlanoItemType = Rectangle | Street 
  

  export interface PlanoItemElement{
    id_feria : number| null
    id_elemento : number | null
    id_plano : number | null
    nombre_elemento : string
    id_tipo_elemento : number
    dimenciones : PlanoItemType 
    stile : string | null
    id_puesto: number | null
    dataPuesto: dataPuesto | null
  }




export interface PlanoData {
  plano : plano,
  elements:PlanoItemElement[]
}




export interface PuestosMapaProps {
    puestos: PlanoItemElement[];
    isStatic: false;
    image: HTMLImageElement | null;
    itemClick: (idP : number) => void

  }
  
  
  export interface StreetMapaProps {
    calles: PlanoItemElement[]; // Arreglo de calles
    isStatic?: boolean; // Indica si las calles son estáticas o no (opcional, valor por defecto es false)
  }
  

  export interface plano { 
    id_feria : number;
    id_plano : number | null
    width: number;
    height : number;
  }
  
  export interface MapaCanvas {
    puestos: PlanoItemElement[];
    calles: PlanoItemElement[];
    plano: plano 
    isStatic : true
    arriendos : arriendo[]
  }
  

  
export interface arriendo {

  id_feria :number,
  nombre_feria :string,
  id_actividad_feria :number,
  id_dia :number,
  fecha :string,
  id_puesto :number,
  hora_inicio : string,
  hora_termino : string,
  id_arriendo_puesto :number,
  id_estado_arriendo :number,
  numero :number,
  precio: number
}

export interface arriendosListProp {
  arriendos : arriendo[]
}

export interface todayArriendos {
  planoData : PlanoData,
  todayArriendos: arriendo[]
}

