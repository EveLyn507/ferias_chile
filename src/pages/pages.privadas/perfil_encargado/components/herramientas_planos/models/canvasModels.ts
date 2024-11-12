/* eslint-disable @typescript-eslint/no-explicit-any */

import { Rectangle, Street } from "./vistaplanoModels";



export interface CanvasProps {
    puestos: Rectangle[];
    setPuestos: React.Dispatch<React.SetStateAction<Rectangle[]>>;
    planWidth: number;
    planHeight: number;
    setPlanWidth: (width: number) => void;
    setPlanHeight: (height: number) => void;
    calles: any[];
    onUpdateStreet: (id: number, updatedProps: any) => void;
    onRemoveStreet: (id: number) => void;
    onItemClick: (item:  Street | Rectangle) => void;
    isStatic?: boolean;

  }