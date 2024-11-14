
import {  PlanoItemElement } from "./vistaplanoModels";



export interface CanvasProps {
    puestos: PlanoItemElement[];
    setPuestos: React.Dispatch<React.SetStateAction<PlanoItemElement[]>>;
    planWidth: number;
    planHeight: number;
    setPlanWidth: (width: number) => void;
    setPlanHeight: (height: number) => void;
    calles: PlanoItemElement[];
    onRemoveStreet: (id: number) => void;
    onItemClick: (item:  PlanoItemElement) => void;
    isStatic?: boolean;

  }