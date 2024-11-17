import { PlanoItemElement, PlanoItemType } from "../models/vistaplanoModels"


const verti_or_hori = (dmA: PlanoItemType, dmB: PlanoItemType): 'vertical' | 'horizontal' | 'overlap' => {
    // Verifica si son horizontales
    if (dmA.y + dmA.height <= dmB.y || dmB.y + dmB.height <= dmA.y) {
      return 'horizontal';
    }
  
    // Verifica si son verticales
    if (dmA.x + dmA.width <= dmB.x || dmB.x + dmB.width <= dmA.x) {
      return 'vertical';
    }
  
    // Si no se cumple ninguno, se solapan
    return 'overlap';
  };
  
  const calculatedDistance = (itemA: PlanoItemElement, itemB: PlanoItemElement) => {
    const dmA = itemA.dimenciones;
    const dmB = itemB.dimenciones;
  
    const cardinalidad = verti_or_hori(dmA, dmB);
  
    let distance = 0;
  
    switch (cardinalidad) {
      case 'vertical':
        distance = Math.max(
          0,
          Math.max(dmB.y - (dmA.y + dmA.height), dmA.y - (dmB.y + dmB.height))
        );
        break;
  
      case 'horizontal':
        distance = Math.max(
          0,
          Math.max(dmB.x - (dmA.x + dmA.width), dmA.x - (dmB.x + dmB.width))
        );
        break;
  
      case 'overlap':
        distance = 0; // Si se solapan, la distancia es 0.
        break;
    }
  
    return {
      cardinalidad,
      distance,
    };
  };
  




