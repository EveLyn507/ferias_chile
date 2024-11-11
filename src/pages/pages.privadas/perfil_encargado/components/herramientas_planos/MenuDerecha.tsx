import axios from "axios";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { AppStore } from "../../../../../redux/store";
import { useParams } from "react-router-dom";

interface Horario {
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
  horario?: Horario;
  numero?: number;
}

const API_URL = "http://localhost:5000";

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

  const [descripcion, setDescripcion] = useState(selectedPuesto?.descripcion || "");
  const [tipoPuesto, setTipoPuesto] = useState(selectedPuesto?.tipoPuesto || "");
  const [estadoPuesto, setEstadoPuesto] = useState(selectedPuesto?.estadoPuesto || "");
  const [horaInicio, setHoraInicio] = useState("");
  const [horaTermino, setHoraTermino] = useState("");
  const [precio, setPrecio] = useState(0);
  const [numHorario, setNumHorario] = useState(0);
  

  useEffect(() => {
    if (selectedPuesto) {
      setDescripcion(selectedPuesto.descripcion || "");
      setTipoPuesto(selectedPuesto.tipoPuesto || "");
      setEstadoPuesto(selectedPuesto.estadoPuesto || "");
    }
  }, [selectedPuesto]);

  const handleSave = async () => {
    if (!selectedPuesto) {
      console.error("No hay puesto seleccionado.");
      return;
    }
    

    // Validación básica de datos
    if (!horaInicio || !horaTermino || !precio || !numHorario) {
      console.error("Todos los campos deben ser completados.");
      return;
    }

    const horarioData = {
      hora_inicio: horaInicio,
      hora_termino: horaTermino,
      precio,
      num_horario: numHorario,
      id_puesto: idPuesto,
    };

    const updatedPuesto = {
      numero: selectedPuesto.numero,
      id_tipo_puesto: Number(tipoPuesto),
      id_feria: selectedPuesto.id_feria || id_feria,
      descripcion,
      id_estado_puesto: Number(estadoPuesto),
      horarioData,
    };

    try {
      const response = await axios.post(`${API_URL}/api/puestos`, updatedPuesto);
      console.log("Puesto creado:", response.data);  
      onSavePuesto(response.data);
    } catch (error) {
      console.error("Error al crear puesto:", error);
    }

    if (onSaveFeria) {
      onSaveFeria();
    }
  };

  if (!selectedPuesto) {
    return null;
  }

  return (
    <div className="menu-container">
      <h3 className="menu-header">Editar Puesto {selectedPuesto.id}</h3>
      <div className="input-group">
        <label>Descripción:</label>
        <input
          type="text"
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
        />
      </div>
      <div className="input-group">
        <label>Tipo de Puesto:</label>
        <select
          value={tipoPuesto}
          onChange={(e) => setTipoPuesto(e.target.value)}
        >
          <option value="">Selecciona una opción</option>
          <option value="1">Día</option>
          <option value="2">Plazo</option>
          <option value="3">Contacto</option>
        </select>
      </div>
      <div className="input-group">
        <label>Estado del Puesto:</label>
        <select
          value={estadoPuesto}
          onChange={(e) => setEstadoPuesto(e.target.value)}
        >
          <option value="">Selecciona una opción</option>
          <option value="1">Disponible</option>
          <option value="2">Ocupado</option>
          <option value="3">Mantenimiento</option>
        </select>
      </div>
      <div className="input-group">
        <label>Hora de Inicio:</label>
        <input
          type="time"
          value={horaInicio}
          onChange={(e) => setHoraInicio(e.target.value)}
        />
      </div>
      <div className="input-group">
        <label>Hora de Término:</label>
        <input
          type="time"
          value={horaTermino}
          onChange={(e) => setHoraTermino(e.target.value)}
        />
      </div>
      <div className="input-group">
        <label>Precio:</label>
        <input
          type="number"
          value={precio}
          onChange={(e) => setPrecio(parseFloat(e.target.value))}
        />
      </div>
      <div className="input-group">
        <label>Número de Horario:</label>
        <input
          type="number"
          value={numHorario}
          onChange={(e) => setNumHorario(parseInt(e.target.value))}
        />
      </div>
      <button
        onClick={handleSave}
        disabled={isLoading}
        className="menu-button save-button"
      >
        {isLoading ? 'Guardando...' : 'Guardar'}
      </button>
      <button
        onClick={() => onRemoveRectangle(selectedPuesto.id)}
        className="menu-button delete-button"
      >
        Eliminar Puesto
      </button>
      <button onClick={onClose} className="menu-button close-button">
        Cerrar
      </button>
    </div>
  );
};

export default MenuDerecha;
