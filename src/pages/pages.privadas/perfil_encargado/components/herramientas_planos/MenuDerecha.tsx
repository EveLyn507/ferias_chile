import axios from "axios";
import { useEffect, useState } from "react";
import { idFeriaService } from "../../rxjs/sharing.id_feria";



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

const API_URL = 'http://localhost:5000';

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
  const id_feria = idFeriaService.id$;

  const [descripcion, setDescripcion] = useState(selectedPuesto?.descripcion || '');
  const [tipoPuesto, setTipoPuesto] = useState(selectedPuesto?.tipoPuesto || '');
  const [estadoPuesto, setEstadoPuesto] = useState(selectedPuesto?.estadoPuesto || '');
  const [numero, setNumero] = useState(selectedPuesto?.numero || 1); 

  useEffect(() => {
    if (selectedPuesto) {
      setDescripcion(selectedPuesto.descripcion || '');
      setTipoPuesto(selectedPuesto.tipoPuesto || '');
      setEstadoPuesto(selectedPuesto.estadoPuesto || '');
      setNumero(selectedPuesto.numero || 1); 
      console.log('Selected Puesto:', selectedPuesto); 
    }
  }, [selectedPuesto]);

  const handleSave = async () => {
    if (!selectedPuesto) {
      console.error('No hay puesto seleccionado.');
      return;
    }

    console.log('ID Feria:', selectedPuesto.id_feria); 
    const updatedPuesto = {
      numero: numero, 
      id_tipo_puesto: tipoPuesto,
      id_feria: selectedPuesto.id_feria || id_feria, // Use id_feria from useParams
      descripcion: descripcion,
      id_estado_puesto: estadoPuesto,
    };

    try {
      const response = await axios.post(`${API_URL}/api/puestos`, updatedPuesto);
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
      width: '250px',
      height: '100vh',
      position: 'fixed',
      right: 0,
      top: 0,
      backgroundColor: '#f0f0f0',
      padding: '20px',
      boxShadow: '-2px 0 5px rgba(0, 0, 0, 0.1)',
      overflowY: 'auto',
    }}>
      <h3 style={{ marginBottom: '20px' }}>Editar Puesto {selectedPuesto.id}</h3>
      <div style={{ marginBottom: '15px' }}>
        <label style={{ display: 'block', marginBottom: '5px' }}>
          Descripción:
        </label>
        <input
          type="text"
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
          style={{
            width: '100%',
            padding: '8px',
            borderRadius: '4px',
            border: '1px solid #ccc',
            boxSizing: 'border-box',
          }}
        />
      </div>
      <div style={{ marginBottom: '15px' }}>
        <label style={{ display: 'block', marginBottom: '5px' }}>
          Tipo de Puesto:
        </label>
        <input
          type="text"
          value={tipoPuesto}
          onChange={(e) => setTipoPuesto(e.target.value)}
          style={{
            width: '100%',
            padding: '8px',
            borderRadius: '4px',
            border: '1px solid #ccc',
            boxSizing: 'border-box',
          }}
        />
      </div>
      <div style={{ marginBottom: '15px' }}>
        <label style={{ display: 'block', marginBottom: '5px' }}>
          Número:
        </label>
        <input
          type="number"
          value={numero}
          onChange={(e) => setNumero(parseInt(e.target.value))}
          style={{
            width: '100%',
            padding: '8px',
            borderRadius: '4px',
            border: '1px solid #ccc',
            boxSizing: 'border-box',
          }}
        />
      </div>
      <div style={{ marginBottom: '20px' }}>
        <label style={{ display: 'block', marginBottom: '5px' }}>
          Estado del Puesto:
        </label>
        <input
          type="text"
          value={estadoPuesto}
          onChange={(e) => setEstadoPuesto(e.target.value)}
          style={{
            width: '100%',
            padding: '8px',
            borderRadius: '4px',
            border: '1px solid #ccc',
            boxSizing: 'border-box',
          }}
        />
      </div>
      <button onClick={handleSave} style={{
        width: '100%',
        padding: '10px',
        backgroundColor: '#4CAF50',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        marginBottom: '10px',
      }}>
        Guardar
      </button>
      <button onClick={() => {
        console.log('Eliminando puesto con ID:', selectedPuesto.id);
        onRemoveRectangle(selectedPuesto.id);
      }} style={{
        width: '100%',
        padding: '10px',
        backgroundColor: '#f44336',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        marginBottom: '10px',
      }}>
        Eliminar Puesto
      </button>
      <button onClick={() => {
        console.log('Cerrando el menú');
        onClose();
      }} style={{
        width: '100%',
        padding: '10px',
        backgroundColor: '#2196F3',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
      }}>
        Cerrar
      </button>
    </div>
  );
};

export default MenuDerecha;
