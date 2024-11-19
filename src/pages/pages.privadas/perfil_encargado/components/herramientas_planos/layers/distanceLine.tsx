import { Line, Text } from 'react-konva';
import { PlanoItemElement } from '../models/vistaplanoModels';

// Detecta la orientación relativa entre los dos objetos

const getLineCoords = (itemA: PlanoItemElement, itemB: PlanoItemElement) => {
  const { x: xA, y: yA, width: wA, height: hA } = itemA.dimenciones;
  const { x: xB, y: yB, width: wB, height: hB } = itemB.dimenciones;

  // Líneas guía de B
  const verticalLinesB = [
    [xB, 0, xB, 1000], // Línea en el borde izquierdo de B
    [xB + wB, 0, xB + wB, 1000], // Línea en el borde derecho de B
  ];

  const horizontalLinesB = [
    [0, yB, 1000, yB], // Línea en el borde superior de B
    [0, yB + hB, 1000, yB + hB], // Línea en el borde inferior de B
  ];

  // Cálculo de distancia vertical
  let verticalDistance = 0;
  let verticalTextPos = { x: xA + wA / 2, y: 0 };
  if (yA + hA <= yB) {
    verticalDistance = yB - (yA + hA); // Borde superior de B
    verticalTextPos = { x: xA + wA / 2, y: (yA + hA + yB) / 2 };
  } else if (yB + hB <= yA) {
    verticalDistance = yA - (yB + hB); // Borde inferior de B
    verticalTextPos = { x: xA + wA / 2, y: (yB + hB + yA) / 2 };
  }

  // Cálculo de distancia horizontal
  let horizontalDistance = 0;
  let horizontalTextPos = { x: 0, y: yA + hA / 2 };
  if (xA + wA <= xB) {
    horizontalDistance = xB - (xA + wA); // Borde izquierdo de B
    horizontalTextPos = { x: (xA + wA + xB) / 2, y: yA + hA / 2 };
  } else if (xB + wB <= xA) {
    horizontalDistance = xA - (xB + wB); // Borde derecho de B
    horizontalTextPos = { x: (xB + wB + xA) / 2, y: yA + hA / 2 };
  }

  return {
    vertical: { lines: verticalLinesB, distance: verticalDistance, textPos: verticalTextPos },
    horizontal: { lines: horizontalLinesB, distance: horizontalDistance, textPos: horizontalTextPos },
  };
};


interface disProp {
  itemA: PlanoItemElement;
  itemB: PlanoItemElement;
}

const DistanceLine = ({ itemA, itemB }: disProp) => {
  const { vertical, horizontal } = getLineCoords(itemA, itemB);


  return (
    <>
      {/* Líneas guía de B */}
      {vertical.lines.map((line, index) => (
        <Line key={`v-${index}`} points={line} stroke="gray" strokeWidth={1} dash={[4, 4]} />
      ))}
      {horizontal.lines.map((line, index) => (
        <Line key={`h-${index}`} points={line} stroke="gray" strokeWidth={1} dash={[4, 4]} />
      ))}

      {/* Distancia vertical */}
  {/* Distancia vertical */}
<Line
  points={[
    itemA.dimenciones.x + itemA.dimenciones.width / 2,
    itemA.dimenciones.y + itemA.dimenciones.height,
    itemA.dimenciones.x + itemA.dimenciones.width / 2,
    itemB.dimenciones.y,
  ]}
  stroke="blue"
  strokeWidth={2}
/>
{vertical.distance > 0 && (
  <Text
    text={`${Math.floor(vertical.distance)} px`}
    x={vertical.textPos.x + 20}
    y={vertical.textPos.y + 20}
    fontSize={14}
    fill="blue"
  />
)}

{/* Distancia horizontal */}
<Line
  points={[
    itemA.dimenciones.x + itemA.dimenciones.width,
    itemA.dimenciones.y + itemA.dimenciones.height / 2,
    itemB.dimenciones.x,
    itemA.dimenciones.y + itemA.dimenciones.height / 2,
  ]}
  stroke="blue"
  strokeWidth={2}
/>
{horizontal.distance > 0 && (
  <Text
    text={`${Math.floor(horizontal.distance)} px`}
    x={horizontal.textPos.x}
    y={horizontal.textPos.y + 20}
    fontSize={14}
    fill="blue"
  />
)}

    </>
  );
};

export default DistanceLine;
