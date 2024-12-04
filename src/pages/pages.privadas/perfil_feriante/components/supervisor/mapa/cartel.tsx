import { arriendo } from './mapaModel';
import Modal from 'react-modal';

interface modalProps {
  isOpen: boolean;
  onClose: () => void;
  arriendo: arriendo | null;
}

const estado = ['none', 'disponible', 'en proceso venta', 'arrendado'];

// Asegúrate de configurar el root del modal correctamente
Modal.setAppElement('#root');

export const ArriendoModal = ({ isOpen, onClose, arriendo }: modalProps) => {

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      style={{
        overlay: {
          backgroundColor: 'rgba(0, 0, 0, 0.5)', // Fondo oscuro
        },
        content: {
          top: '50%',
          left: '50%',
          right: 'auto',
          bottom: 'auto',
          marginRight: '-50%',
          transform: 'translate(-50%, -50%)',
          padding: '20px',
          borderRadius: '10px',
          width: '400px',
          maxHeight: '80vh',
          overflow: 'auto',
        },
      }}
    >
      <h2>Detalles del Puesto</h2>
      <p><strong>ID:</strong> {arriendo?.numero}</p>
      <p><strong>Precio:</strong> {arriendo?.precio}</p>
      <p><strong>Estado:</strong> {estado[arriendo?.id_estado_arriendo || 0]}</p>

      <button 
        onClick={onClose} 
        style={{ padding: '10px', backgroundColor: '#DC3545', color: 'white', border: 'none', borderRadius: '5px' }}
      >
        Cerrar
      </button>
    </Modal>
  );
};