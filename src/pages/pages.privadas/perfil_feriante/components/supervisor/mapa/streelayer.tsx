/* StreetsLayer.tsx */
import React, { useRef } from 'react';
import { Rect,  Layer } from 'react-konva';
import { StreetMapaProps } from './mapaModel';


const StreetsLayer: React.FC<StreetMapaProps> = ({
  calles,
  isStatic ,
}) => {
  const layerRef = useRef(null);


  return (
    <Layer ref={layerRef}>
      {calles.map((street) => {
        return (
          <React.Fragment key={street.id_elemento}>
            {/* Calle Rectangular */}
            <Rect
              x={street.dimenciones.x}
              y={street.dimenciones.y}
              width={street.dimenciones.width}
              height={street.dimenciones.height}
              fill="black"
              draggable={isStatic} // Solo se puede mover si no es estático
  
            />
    
          </React.Fragment>
        );
      })}
    </Layer>
  );
};

export default StreetsLayer;
