import React, { useCallback, useState } from 'react';
import { Rect, Text, Image as KonvaImage, Layer } from 'react-konva';
import { PlanoItemElement } from '../models/vistaplanoModels';
import { PuestosLayerProps } from '../models/canvasModels';
import DistanceLine from './distanceLine';

const PuestosLayer: React.FC<PuestosLayerProps> = ({
  puestos,
  setPuestos,
  isStatic,
  image,
  onPuestoClick,
  hoveredItem,
  setHoveredItem,
  isAltPressed,
  selectedItem
}) => {
  const [focusedPuesto, setFocusedPuesto] = useState<PlanoItemElement | null>(null);
  const scale = 100;

  const calculateDimensionsInMeters = useCallback((width: number, height: number) => ({
    metersWidth: width / scale,
    metersHeight: height / scale,
  }), [scale]);

  return (
    <Layer>
      {Array.from(puestos.values()).map((Puesto) => {
        const { metersWidth, metersHeight } = calculateDimensionsInMeters(Puesto.dimenciones.width, Puesto.dimenciones.height);

        return (
          <React.Fragment key={Puesto.id_elemento}>
            <KonvaImage
              image={image || new Image()} // Default fallback image if image is undefined
              x={Puesto.dimenciones.x}
              y={Puesto.dimenciones.y}
              width={Puesto.dimenciones.width}
              height={Puesto.dimenciones.height}
              rotation={Puesto.dimenciones.rotation}
              draggable={!isStatic}
              onMouseEnter={() => setHoveredItem(Puesto)}
              onMouseLeave={() => setHoveredItem(null)}
              onClick={() => {
                if (!isStatic) {
                  setFocusedPuesto(Puesto);
                  onPuestoClick(Puesto);
                }
              }}
              onDragStart={() => setFocusedPuesto(Puesto)}
              onDragMove={(e) => {
                if (!isStatic && focusedPuesto?.id_elemento === Puesto.id_elemento) {
                  const updatedPuesto = {
                    ...Puesto,
                    dimenciones: {
                      ...Puesto.dimenciones,
                      x: e.target.x(),
                      y: e.target.y()
                    }
                  };
                  setPuestos(prev => new Map(prev).set(Puesto.id_elemento!, updatedPuesto));
                  onPuestoClick(updatedPuesto);
                }
              }}
            />

            {isAltPressed && hoveredItem && selectedItem && <DistanceLine itemA={selectedItem} itemB={hoveredItem} />}

            <Text
              x={Puesto.dimenciones.x}
              y={Puesto.dimenciones.y - 20}
              text={`N${Puesto.nombre_elemento}`}
              fontSize={12}
              fill="black"
            />

            {!isStatic && (
              <Text
                x={Puesto.dimenciones.x}
                y={Puesto.dimenciones.y - 40}
                text={`${metersWidth.toFixed(1)}m x ${metersHeight.toFixed(1)}m`}
                fontSize={12}
                fill="black"
                visible={true}
              />
            )}
            {!isStatic && focusedPuesto?.id_elemento === Puesto.id_elemento && (
              <Rect
                x={Puesto.dimenciones.x + Puesto.dimenciones.width - 4}
                y={Puesto.dimenciones.y + Puesto.dimenciones.height - 4}
                width={8}
                height={8}
                fill="red"
                draggable={!Puesto.dimenciones.isStatic && !isStatic}
                dragBoundFunc={(pos) => {
                  const newWidth = Math.max(8, pos.x - Puesto.dimenciones.x);
                  const newHeight = Math.max(8, pos.y - Puesto.dimenciones.y);
                  const updatedPuesto = {
                    ...Puesto,
                    dimenciones: {
                      ...Puesto.dimenciones,
                      width: newWidth,
                      height: newHeight
                    }
                  };
                  setPuestos(prev => new Map(prev).set(Puesto.id_elemento!, updatedPuesto));
                  onPuestoClick(updatedPuesto);
                  return pos;
                }}
              />
            )}
          </React.Fragment>
        );
      })}
    </Layer>
  );
};

export default PuestosLayer;
