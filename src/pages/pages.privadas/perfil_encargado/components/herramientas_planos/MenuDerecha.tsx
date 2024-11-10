import axios from "axios";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { AppStore } from "../../../../../redux/store";
import { useParams } from "react-router-dom";

interface horario {
  hora_inicio: string;
  hora_termino: string;
  precio: number;
  num_horario: number;
  id_puesto: number;
}

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
  id_feria?: number;
  horario?: horario;
  numero?: number; 
}

const API_URL = 'http://localhost:5000';

interface MenuDerechaProps {
  selectedPuesto: Rectangle | null;
  onSavePuesto: (updatedPuesto: Partial<Rectangle>) => void;
  onRemoveRectangle: (id: number) => void;
  onClose: () => void;
  onSaveFeria: () => void;
  isLoading: boolean;
}

const MenuDerecha: React.FC<MenuDerechaProps> = ({
  selectedPuesto,
  onSavePuesto,
  onRemoveRectangle,
  onClose,
  onSaveFeria,
  isLoading,
}) => {
  const idPuesto = useSelector((store: AppStore) => store.user.id_puesto);
  const { id_feria } = useParams<{ id_feria: string }>();

  const [descripcion, setDescripcion] = useState(selectedPuesto?.descripcion || '');
  const [tipoPuesto, setTipoPuesto] = useState(selectedPuesto?.tipoPuesto || '');
  const [estadoPuesto, setEstadoPuesto] = useState(selectedPuesto?.estadoPuesto || '');
  const [horaInicio, setHoraInicio] = useState('');
  const [horaTermino, setHoraTermino] = useState('');
  const [precio, setPrecio] = useState(0);
  const [num_horario, setNumHorario] = useState(0);


  useEffect(() => {
    if (selectedPuesto) {
      setDescripcion(selectedPuesto.descripcion || '');
      setTipoPuesto(selectedPuesto.tipoPuesto || '');
      setEstadoPuesto(selectedPuesto.estadoPuesto || '');
    }
  }, [selectedPuesto]);

  const handleSave = async () => {
    if (!selectedPuesto) {
      console.error('No hay puesto seleccionado.');
      return;
    }

    const horarioData = {
      hora_inicio: horaInicio,
      hora_termino: horaTermino,
      precio,
      num_horario,
      id_puesto: idPuesto,
    };

    const updatedPuesto = {
      numero: selectedPuesto.numero, // Asignamos el nuevo número al puesto
      id_tipo_puesto: Number(tipoPuesto),
      id_feria: selectedPuesto.id_feria || id_feria,
      descripcion,
      id_estado_puesto: Number(estadoPuesto),
      horarioData,
    };

    try {
      const response = await axios.post(`${API_URL}/api/puestos`, updatedPuesto);
      console.log('Puesto creado:', response.data);

      onSavePuesto(response.data);
    } catch (error) {
      console.error('Error al crear puesto:', error);
    }

    if (onSaveFeria) {
      onSaveFeria();
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
        <label style={{ display: 'block', marginBottom: '5px' }}>Descripción:</label>
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
        <label style={{ display: 'block', marginBottom: '5px' }}>Tipo de Puesto:</label>
        <select
          value={tipoPuesto}
          onChange={(e) => setTipoPuesto(e.target.value)}
          style={{
            width: '100%',
            padding: '8px',
            borderRadius: '4px',
            border: '1px solid #ccc',
            boxSizing: 'border-box',
          }}
        >
          <option value="">Selecciona una opción</option>
          <option value="1">Día</option>
          <option value="2">Plazo</option>
          <option value="3">Contacto</option>
        </select>
      </div>
      <div style={{ marginBottom: '15px' }}>
        <label style={{ display: 'block', marginBottom: '5px' }}>Estado del Puesto:</label>
        <select
          value={estadoPuesto}
          onChange={(e) => setEstadoPuesto(e.target.value)}
          style={{
            width: '100%',
            padding: '8px',
            borderRadius: '4px',
            border: '1px solid #ccc',
            boxSizing: 'border-box',
          }}
        >
          <option value="">Selecciona una opción</option>
          <option value="1">Disponible</option>
          <option value="2">Ocupado</option>
          <option value="3">Mantenimiento</option>
        </select>
      </div>
      <div style={{ marginBottom: '15px' }}>
        <label style={{ display: 'block', marginBottom: '5px' }}>Hora de Inicio:</label>
        <input
          type="time"
          value={horaInicio}
          onChange={(e) => setHoraInicio(e.target.value)}
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
        <label style={{ display: 'block', marginBottom: '5px' }}>Hora de Término:</label>
        <input
          type="time"
          value={horaTermino}
          onChange={(e) => setHoraTermino(e.target.value)}
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
        <label style={{ display: 'block', marginBottom: '5px' }}>Precio:</label>
        <input
          type="number"
          value={precio}
          onChange={(e) => setPrecio(parseFloat(e.target.value))}
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
        <label style={{ display: 'block', marginBottom: '5px' }}>Número de Horario:</label>
        <input
          type="number"
          value={num_horario}
          onChange={(e) => setNumHorario(parseInt(e.target.value))}
          style={{
            width: '100%',
            padding: '8px',
            borderRadius: '4px',
            border: '1px solid #ccc',
            boxSizing: 'border-box',
          }}
        />
      </div>
      <button
        onClick={handleSave}
        disabled={isLoading}
        style={{
          width: '100%',
          padding: '10px',
          backgroundColor: '#4CAF50',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          marginBottom: '10px',
        }}
      >
        {isLoading ? 'Guardando...' : 'Guardar'}
      </button>
      <button onClick={() => onRemoveRectangle(selectedPuesto.id)} style={{
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
      <button onClick={onClose} style={{
        width: '100%',
        padding: '10px',
        backgroundColor: '#9e9e9e',
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
