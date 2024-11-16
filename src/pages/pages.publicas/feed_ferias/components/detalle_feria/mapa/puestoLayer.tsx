import React, { useCallback, useRef } from 'react';
import {  Text, Image as KonvaImage, Layer } from 'react-konva';
import { PuestosMapaProps } from './mapaModel';



const PuestosLayer: React.FC<PuestosMapaProps> = ({
  puestos,
  isStatic,
  image,

}) => {
  const layerRef = useRef(null);

  // Actualizar el puesto anterior al cambiar `focusedPuesto`

  const calculateDimensionsInMeters = useCallback((width: number, height: number) => {
    const metersWidth = (width / 50) * 2; // Convertimos basado en tamaño base de 2 metros
    const metersHeight = (height / 50) * 2;
    return { metersWidth, metersHeight };
  }, []);

  return (
    <Layer ref={layerRef}>
      {puestos.map((Puesto) => {
        const { metersWidth, metersHeight } = calculateDimensionsInMeters(Puesto.dimenciones.width, Puesto.dimenciones.height);

        return (
          <React.Fragment key={Puesto.id_elemento}>
            <KonvaImage
              image={image || undefined}
              x={Puesto.dimenciones.x}
              y={Puesto.dimenciones.y}
              width={Puesto.dimenciones.width}
              height={Puesto.dimenciones.height}
              draggable={isStatic}
 
            />
            <Text
              x={Puesto.dimenciones.x}
              y={Puesto.dimenciones.y - 20}
              text={`N${Puesto.nombre_elemento} | ${metersWidth.toFixed(2)}m x ${metersHeight.toFixed(2)}m`}
              fontSize={12}
              fill="black"
            />
           
          </React.Fragment>
        );
      })}
    </Layer>
  );
};

export default PuestosLayer;
