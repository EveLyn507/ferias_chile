/* eslint-disable @typescript-eslint/no-explicit-any */
import { Rectangle } from "./vistaplanoModels";



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
    onRectangleClick: (id: number) => void;
    isStatic?: boolean;
    onStreetClick?: (id: number) => void;
  }