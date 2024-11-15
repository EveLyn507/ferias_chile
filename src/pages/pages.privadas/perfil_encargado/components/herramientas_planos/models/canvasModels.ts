
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