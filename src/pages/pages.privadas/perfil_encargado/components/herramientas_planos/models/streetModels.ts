export interface Street {
    id: number;
    x: number;
    y: number;
    width: number;
    height: number;
    isStatic: boolean;  // Propiedad isStatic para controlar si es estático
  }
  
 export  interface StreetPageProps {
    calles: Street[];
    onRemoveStreet: (id: number) => void;
    onUpdateStreet: (id: number, updatedProps: Partial<Street>) => void;
    isStatic?: boolean;  // Propiedad isStatic adicional para controlar la edición
  }