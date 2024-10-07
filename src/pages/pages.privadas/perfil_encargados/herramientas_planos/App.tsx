import { useState } from 'react';
import Canvas from './Canvas';
import Toolbar from './Toolbar';
import './App.css';

interface Rectangle {
  id: number;
  x: number;
  y: number;
  width: number;
  height: number;
  fill: string;
}

function App() {
  const [rectangles, setRectangles] = useState<Rectangle[]>([]);
  const [planWidth, setPlanWidth] = useState<number>(600);
  const [planHeight, setPlanHeight] = useState<number>(400);

  const id = Date.now();

const handleAddRectangle = () => {
    const newRectangle: Rectangle = {
      x: 60,
      y: 60,
      width: 100,
      height: 100,
      fill: 'green',
      id: id,
    };
    setRectangles([...rectangles, newRectangle]);
  };

  const handleRemoveRectangle = (id: number) => {
    setRectangles(rectangles.filter(rect => rect.id !== id));
  };

  const downloadJson = () => {
    const data = JSON.stringify(rectangles, null, 2); // Convierte los rectángulos a JSON
    const blob = new Blob([data], { type: 'application/json' }); // Crea un Blob con los datos
    const url = URL.createObjectURL(blob); // Crea una URL para el Blob
    const link = document.createElement('a'); // Crea un enlace temporal
    link.href = url;
    link.download = 'puestos.json'; // Nombre del archivo que se descargará
    document.body.appendChild(link);
    link.click(); // Simula un clic para descargar el archivo
    document.body.removeChild(link); // Elimina el enlace temporal
  };

  return (
    <div className="App">
      <header className="header">
        <h1>Ferias Chile</h1>
      </header>

      <div className="main-content">
        <Toolbar onAddRectangle={handleAddRectangle} />

        <Canvas 
          rectangles={rectangles} 
          onRemoveRectangle={handleRemoveRectangle} 
          planWidth={planWidth} 
          planHeight={planHeight}
          setPlanWidth={setPlanWidth} 
          setPlanHeight={setPlanHeight}
          setRectangles={setRectangles}
        />

        {/* Botón para descargar el archivo JSON */}
        <button onClick={downloadJson}>Descargar JSON</button>
      </div>
    </div>
  );
}

export default App;
