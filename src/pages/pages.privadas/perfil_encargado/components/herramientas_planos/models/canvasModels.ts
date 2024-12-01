
import {  plano, PlanoItemElement } from "./vistaplanoModels";



export interface CanvasProps {
    puestos: Map<number,PlanoItemElement>;
    setPuestos: React.Dispatch<React.SetStateAction<Map<number,PlanoItemElement>>>;
    calles: PlanoItemElement[];
    onItemClick: (item:  PlanoItemElement) => void;
    plano: plano 
    isStatic?: boolean;
    selectedItem : PlanoItemElement | null
    setSelectedItem : (item : PlanoItemElement | null) => void


  }


export interface PuestosLayerProps {
  puestos: Map<number,PlanoItemElement>;
  setPuestos: React.Dispatch<React.SetStateAction<Map<number,PlanoItemElement>>>;
  isStatic: boolean;
  image: HTMLImageElement | null;
  onPuestoClick: (item: PlanoItemElement) => void;
  hoveredItem: PlanoItemElement | null;
  setHoveredItem: (item: PlanoItemElement | null) => void
  isAltPressed: boolean
  selectedItem: PlanoItemElement | null

}


export interface StreetPageProps {
  calles: PlanoItemElement[]; // Arreglo de calles
  onStreetClick: (item: PlanoItemElement) => void; // Para detectar item click
  isStatic?: boolean; // Indica si las calles son estáticas o no (opcional, valor por defecto es false)
  hoveredItem: PlanoItemElement | null;
  setHoveredItem: (item: PlanoItemElement | null) => void
  isAltPressed : boolean;
  selectedItem: PlanoItemElement | null
  image?: HTMLImageElement | null; // Propiedad correctamente definida
  
}




export interface DeletedItem { 
  id_elemento : number;
  id_tipo_elemento : number;
  nombre_elemento : string;
  id_plano : number;
  id_puesto : number | null;
  id_feria : number;
}

export interface vistaProps {
  savePlanoItem : (selectedItem : PlanoItemElement) => void
  CreateNewItemElement: (newItem: PlanoItemElement) => Promise<PlanoItemElement>
  UpdatePlano : (newPlano : plano) => void
  DeleteItemPlano: (DeletedItem : DeletedItem) => void

}

