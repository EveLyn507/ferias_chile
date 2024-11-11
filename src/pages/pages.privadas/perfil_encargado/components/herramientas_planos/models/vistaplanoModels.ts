


export interface datosPuesto { 
  id_tipo_puesto : number,
  numero : number,
  descripcion : string,
  id_feria : number,
  id_estado_puesto : number
}





export  interface Rectangle {
    id: number;
    x: number;
    y: number;
    width: number;
    height: number;
    fill: string;
    descripcion?: string;
    tipoPuesto?: string;
    estadoPuesto?: string;
    numero?: number;
  }
  
  export interface Area {
    id: number;
    name: string;
    x: number;
    y: number;
    width: number;
    height: number;
  }
  
  export interface Street {
    id: number;
    points: number[];
    width: number;
    height: number;
    x: number;
    y: number;
  }
  
  export interface FeriaData {
    puestos: Rectangle[];
    calles: Street[];
    id_feria: number
    planWidth: number;
    planHeight: number;
  }
  