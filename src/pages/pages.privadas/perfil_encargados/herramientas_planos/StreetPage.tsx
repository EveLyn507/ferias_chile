import React from 'react';
import { useState } from 'react';
import { Line, Circle } from 'react-konva';

interface Street {
  id: number;
  points: number[];
  width: number;
}

interface StreetPageProps {
  streets: Street[];
  onRemoveStreet: (id: number) => void;
  onUpdateStreet: (id: number, updatedProps: Partial<Street>) => void;
}

const StreetPage: React.FC<StreetPageProps> = ({ streets, onRemoveStreet, onUpdateStreet }) => {
  const [selectedStreetId, setSelectedStreetId] = useState<number | null>(null);
  const [controlPointIndex, setControlPointIndex] = useState<number | null>(null);
  
  const handleDragControlPoint = (e: any, streetId: number, index: number) => {
    const newPoints = [...streets.find((street) => street.id === streetId)?.points!];
    newPoints[index * 2] = e.target.x();
    newPoints[index * 2 + 1] = e.target.y();
    onUpdateStreet(streetId, { points: newPoints });
  };

  const handleDragStreet = (e: any, streetId: number) => {
    const newPoints = streets.find((street) => street.id === streetId)?.points!;
    const dx = e.target.x() - newPoints[0];
    const dy = e.target.y() - newPoints[1];
    
    const updatedPoints = newPoints.map((point, index) => {
      if (index % 2 === 0) return point + dx; 
      return point + dy; 
    });

    onUpdateStreet(streetId, { points: updatedPoints });
  };

  return (
    <>
      {streets.map((street) => (
        <React.Fragment key={street.id}>
          <Line
            points={street.points}
            stroke="black"
            strokeWidth={street.width}
            draggable
            onDragMove={(e) => handleDragStreet(e, street.id)}
            onDblClick={() => onRemoveStreet(street.id)}
            onClick={() => setSelectedStreetId(selectedStreetId === street.id ? null : street.id)}
          />
          {selectedStreetId === street.id && street.points.map((point, index) => {
            if (index % 2 === 0) { 
              return (
                <Circle
                  key={`control-${index}`}
                  x={point}
                  y={street.points[index + 1]}
                  radius={8}
                  fill="red"
                  draggable
                  onDragMove={(e) => handleDragControlPoint(e, street.id, index / 2)}
                  onDragEnd={() => setControlPointIndex(null)}
                  onClick={() => setControlPointIndex(index / 2)}
                />
              );
            }
            return null;
          })}
        </React.Fragment>
      ))}
    </>
  );
};

export default StreetPage;
