
import {  plano, PlanoItemElement } from "./vistaplanoModels";



export interface CanvasProps {
    puestos: PlanoItemElement[];
    setPuestos: React.Dispatch<React.SetStateAction<PlanoItemElement[]>>;
    calles: PlanoItemElement[];
    onItemClick: (item:  PlanoItemElement) => void;
    plano: plano 
    onChangePlano: (newPlano : plano) => void;
    isStatic?: boolean;

  }


export interface PuestosLayerProps {
  puestos: PlanoItemElement[];
  setPuestos: React.Dispatch<React.SetStateAction<PlanoItemElement[]>>;
  isStatic: boolean;
  image: HTMLImageElement | null;
  onPuestoClick: (item: PlanoItemElement) => void;
  hoveredRect: PlanoItemElement | null;
  setHoveredRect: React.Dispatch<React.SetStateAction<PlanoItemElement | null>>;
}


export interface StreetPageProps {
  calles: PlanoItemElement[]; // Arreglo de calles
  onStreetClick: (item: PlanoItemElement) => void; // Para detectar item click
  isStatic?: boolean; // Indica si las calles son estáticas o no (opcional, valor por defecto es false)
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

