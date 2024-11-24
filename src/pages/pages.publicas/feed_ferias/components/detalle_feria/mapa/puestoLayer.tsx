import React, { useCallback, useRef, useState } from 'react';
import { Text, Image as KonvaImage, Layer } from 'react-konva';
import { PlanoItemElement, PuestosMapaProps } from './mapaModel';

const PuestosLayer: React.FC<PuestosMapaProps> = ({
  puestos,
  isStatic,
  image,
  itemClick
}) => {
  const layerRef = useRef(null);
  const [showCartel, setShowCartel] = useState(false);
  const [selectedPuesto, setSelectedPuesto] = useState <PlanoItemElement | null>(null);

  // Función para mostrar el cartel y guardar el puesto seleccionado
  const handleMouseEnter = (Puesto : PlanoItemElement) => {
    setSelectedPuesto(Puesto); // Establece el puesto seleccionado
    setShowCartel(true); // Muestra el cartel
  };

  // Función para ocultar el cartel
  const handleMouseLeave = () => {
    setShowCartel(false); // Oculta el cartel
    setSelectedPuesto(null); // Limpiar el puesto seleccionado
  };


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
              onMouseEnter={() => handleMouseEnter(Puesto)} // Muestra el cartel con el puesto al pasar el ratón
              onMouseLeave={handleMouseLeave}  // Oculta el cartel cuando el ratón sale
              onClick={() =>  itemClick(Puesto.dataPuesto!.id_puesto!)  }
              
            />
            <Text
              x={Puesto.dimenciones.x}
              y={Puesto.dimenciones.y - 20}
              text={`N${Puesto.nombre_elemento} | ${metersWidth.toFixed(2)}m x ${metersHeight.toFixed(2)}m`}
              fontSize={12}
              fill="black"
            />

            {/* Renderizar el Cartel de Konva cuando showCartel es true */}
            {showCartel && selectedPuesto && selectedPuesto.id_elemento === Puesto.id_elemento && (
              <React.Fragment>
                <Text
                  x={Puesto.dimenciones.x - 5}
                  y={Puesto.dimenciones.y - 80} // Coloca el cartel justo arriba del puesto
                  text={`Puesto : ${Puesto.nombre_elemento}`}
                  fontSize={20}
                  fill="black"
                  background="rgba(0, 0, 0, 0.7)"
                  padding={5}
                  borderRadius={5}
                />
                <Text
                  x={Puesto.dimenciones.x}
                  y={Puesto.dimenciones.y - 50}
                  text={`Precio  : $${Puesto.dataPuesto?.precio}`}
                  fontSize={20}
                  fill="black"
                />
              
              </React.Fragment>
            )}
          </React.Fragment>
        );
      })}
    </Layer>
  );
};

export default PuestosLayer;
