import { Line, Text } from 'react-konva';
import { PlanoItemElement, PlanoItemType } from '../models/vistaplanoModels';
const verti_or_hori = (dmA: PlanoItemType, dmB: PlanoItemType): 'vertical' | 'horizontal' | 'overlap' => {
    if (dmA.y + dmA.height <= dmB.y || dmB.y + dmB.height <= dmA.y) {
      return 'horizontal'; // Los objetos están en una línea horizontal
    }
    if (dmA.x + dmA.width <= dmB.x || dmB.x + dmB.width <= dmA.x) {
      return 'vertical'; // Los objetos están en una línea vertical
    }
    return 'overlap'; // Los objetos se solapan
  };
  
  // Calcula las coordenadas para las líneas y el texto con la distancia
  const getLineCoords = (itemA: PlanoItemElement, itemB: PlanoItemElement, planoWidth: number = 700) => {
    const { x: xA, y: yA, width: wA, height: hA } = itemA.dimenciones;  // Usamos las propiedades directamente
    const { x: xB, y: yB, width: wB, height: hB } = itemB.dimenciones;  // Usamos las propiedades directamente
  
    const midA = { x: xA + wA / 2, y: yA + hA / 2 }; // Centro de A
    const midB = { x: xB + wB / 2, y: yB + hB / 2 }; // Centro de B
  
    // Distancia entre los bordes más cercanos
    let verticalDistance = Math.abs((yA + hA) - yB); // Distancia entre el borde inferior de A y el borde superior de B
    let horizontalDistance = Math.abs((xA + wA) - xB); // Distancia entre el borde derecho de A y el borde izquierdo de B
  
    // Si la línea es vertical y no se solapan, ajustamos al borde más cercano
    if (verti_or_hori(itemA.dimenciones, itemB.dimenciones) === 'vertical') {
      if (yA + hA <= yB) {
        verticalDistance = yB - (yA + hA); // Desde el borde inferior de A al borde superior de B
      } else if (yB + hB <= yA) {
        verticalDistance = yA - (yB + hB); // Desde el borde inferior de B al borde superior de A
      }
    }
  
    // Si la línea es horizontal y no se solapan, ajustamos al borde más cercano
    if (verti_or_hori(itemA.dimenciones, itemB.dimenciones) === 'horizontal') {
      if (xA + wA <= xB) {
        horizontalDistance = xB - (xA + wA); // Desde el borde derecho de A hasta el borde izquierdo de B
      } else if (xB + wB <= xA) {
        horizontalDistance = xA - (xB + wB); // Desde el borde derecho de B hasta el borde izquierdo de A
      }
    }
  
    // Aseguramos que la distancia no sea negativa
    verticalDistance = Math.max(verticalDistance, 0);
    horizontalDistance = Math.max(horizontalDistance, 0);
  
    return {
      vertical: {
        points: [midA.x, yA + hA, midA.x, yB], // Línea vertical desde el borde inferior de A hasta la parte superior de B
        distance: verticalDistance, // Distancia vertical
      },
      horizontal: {
        points: [xA + wA, midA.y, xB, midA.y], // Línea horizontal desde el borde derecho de A hasta el borde izquierdo de B
        distance: horizontalDistance, // Distancia horizontal
      }
    };
  };
  
  
  interface disProp {
    itemA: PlanoItemElement;
    itemB: PlanoItemElement;
    planoWidth?: number; // Tamaño del plano para líneas predeterminadas
  }
  
  const DistanceLine = ({ itemA, itemB, planoWidth = 700 }: disProp) => {
    const lineCoords = getLineCoords(itemA, itemB, planoWidth);
  
    if (!lineCoords) return null;
  
    return (
      <>
        {/* Línea vertical */}
        <Line
          points={lineCoords.vertical.points}
          stroke={'blue'}
          strokeWidth={2}
          dash={[5, 5]} // Línea punteada
        />
        {/* Texto con la distancia vertical */}
        <Text
          text={`${lineCoords.vertical.distance} px`} // Muestra la distancia vertical en píxeles
          x={lineCoords.vertical.points[0]} // Usa la coordenada X de la línea vertical
          y={lineCoords.vertical.points[1]} // Usa la coordenada Y de la línea vertical
          fontSize={14}
          fill={'blue'}
        />
  
        {/* Línea horizontal */}
        <Line
          points={lineCoords.horizontal.points}
          stroke={'blue'}
          strokeWidth={2}
          dash={[5, 5]} // Línea punteada
        />
        {/* Texto con la distancia horizontal */}
        <Text
          text={`${lineCoords.horizontal.distance} px`} // Muestra la distancia horizontal en píxeles
          x={lineCoords.horizontal.points[0]} // Usa la coordenada X de la línea horizontal
          y={lineCoords.horizontal.points[1]} // Usa la coordenada Y de la línea horizontal
          fontSize={14}
          fill={'blue'}
        />
      </>
    );
  };
  
  export default DistanceLine;
  