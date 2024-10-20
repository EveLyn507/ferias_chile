import axios from "axios";
import { useEffect, useState } from "react";

interface Rectangle {
  id: number;
  x: number;
  y: number;
  width: number;
  height: number;
  fill: string;
  descripcion?: string;  
  tipoPuesto?: string;   
  estadoPuesto?: string; 
  numero?: number; 
  id_feria?: number; 
}

interface MenuDerechaProps {
  selectedPuesto: Rectangle | null;
  onSavePuesto: (updatedPuesto: Partial<Rectangle>) => void;
  onRemoveRectangle: (id: number) => void;
  onClose: () => void;
}

const MenuDerecha: React.FC<MenuDerechaProps> = ({
  selectedPuesto,
  onSavePuesto,
  onRemoveRectangle,
  onClose,
}) => {
  const [descripcion, setDescripcion] = useState(selectedPuesto?.descripcion || '');
  const [tipoPuesto, setTipoPuesto] = useState(selectedPuesto?.tipoPuesto || '');
  const [estadoPuesto, setEstadoPuesto] = useState(selectedPuesto?.estadoPuesto || '');

  useEffect(() => {
    if (selectedPuesto) {
      setDescripcion(selectedPuesto.descripcion || '');
      setTipoPuesto(selectedPuesto.tipoPuesto || '');
      setEstadoPuesto(selectedPuesto.estadoPuesto || '');
      console.log('Selected Puesto:', selectedPuesto); // Log del puesto seleccionado
    }
  }, [selectedPuesto]);

  const handleSave = async () => {
    const updatedPuesto = {
      numero: selectedPuesto?.numero || 1,
      id_tipo_puesto: tipoPuesto,
      id_feria: selectedPuesto?.id_feria || 1,  // Verifica si esto tiene valor
      descripcion: descripcion,
      id_estado_puesto: estadoPuesto,
    };
  
    console.log('Puesto a guardar:', updatedPuesto);
    
    // Verifica que selectedPuesto no sea undefined y tenga el id_feria
    console.log('Selected Puesto antes de guardar:', selectedPuesto); 
    console.log('ID Feria:', selectedPuesto?.id_feria);
  
    try {
      const response = await axios.post('/api/puestos', updatedPuesto);
      console.log('Puesto creado:', response.data);
      onSavePuesto(response.data);
    } catch (error) {
      console.error('Error al crear puesto:', error);
    }
  };
  

  if (!selectedPuesto) {
    return null;
  }

  return (
    <div style={{
      width: '200px',
      height: '100vh',
      position: 'fixed',
      right: 0,
      top: 0,
      backgroundColor: '#f0f0f0',
      padding: '10px',
    }}>
      <h3>Editar Puesto {selectedPuesto.id}</h3>
      <label>
        Descripción:
        <input
          type="text"
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
        />
      </label>
      <label>
        Tipo de Puesto:
        <input
          type="text"
          value={tipoPuesto}
          onChange={(e) => setTipoPuesto(e.target.value)}
        />
      </label>
      <label>
        Estado del Puesto:
        <input
          type="text"
          value={estadoPuesto}
          onChange={(e) => setEstadoPuesto(e.target.value)}
        />
      </label>
      <button onClick={handleSave}>Guardar</button>
      <button onClick={() => {
        console.log('Eliminando puesto con ID:', selectedPuesto.id); // Log del ID del puesto a eliminar
        onRemoveRectangle(selectedPuesto.id);
      }} style={{ marginBottom: '10px' }}>
        Eliminar Puesto
      </button>
      <button onClick={() => {
        console.log('Cerrando el menú'); // Log cuando se cierra el menú
        onClose();
      }}>
        Cerrar
      </button>
    </div>
  );
};

export default MenuDerecha;
