import React, { useEffect, useState } from 'react';
import axios from 'axios';
import RegistroCobrosFisicos from './RegistroCobrosFisicos';

interface Feriante {
  id_user_fte: number;
  nombre_feriante: string;
  id_puesto: number
  numero: string;
  precio: number;
  estado_pago: string
  id_estado_contrato : number
  tipo_pago : string

}

interface VerificarDatosProps {
  id_feria: number;
  fechaSeleccionada: string; // Nueva prop
}

const VerificarDatos: React.FC<VerificarDatosProps> = ({ id_feria, fechaSeleccionada }) => {
  const [feriantes, setFeriantes] = useState<Feriante[]>([]);
  const [menuActivo, setMenuActivo] = useState<number | null>(null);
  const [loadingFeriantes, setLoadingFeriantes] = useState<boolean>(false);
  const [errorFeriantes, setErrorFeriantes] = useState<string | null>(null);

  useEffect(() => {
    const fetchFeriantes = async () => {
      try {
        setLoadingFeriantes(true);
        const response = await axios.post(
          `http://localhost:5000/api/supervisor/feriantes-activos/${id_feria}/${fechaSeleccionada}`,
          { params: { fecha_pago: fechaSeleccionada } }
        );
        setFeriantes(response.data);
        setErrorFeriantes(null);
      } catch (err: any) {
        const message = err.response?.data?.message || 'Error al obtener la lista de feriantes.';
        setErrorFeriantes(message);
      } finally {
        setLoadingFeriantes(false);
      }
    };

    if (fechaSeleccionada) {
      fetchFeriantes();
    }
  }, [fechaSeleccionada, id_feria]);

  const toggleMenu = (id: number) => {
    setMenuActivo(menuActivo === id ? null : id);
  };


  const registrarPago = async (id_user_fte: number) => {
    try {
      await axios.put(`http://localhost:5000/api/supervisor/feriantes/${id_user_fte}/pago`);
      setFeriantes((prev) =>
        prev.map((feriante) =>
          feriante.id_user_fte === id_user_fte ? { ...feriante, id_estado_contrato: 5 } : feriante
        )
      );
    } catch (error) {
      console.error('Error al registrar el pago físico:', error);
    }
  };



  return (
    <div>
      <h2>Puestos ocupados</h2>
      <div>
        <h3>Feriantes Activos</h3>
        {loadingFeriantes ? (
          <p>Cargando feriantes...</p>
        ) : errorFeriantes ? (
          <p style={{ color: 'red' }}>{errorFeriantes}</p>
        ) : (
          <ul>
            {feriantes.map((feriante) => (
              <li key={feriante.id_user_fte}>
                <span
                  style={{ cursor: 'pointer', color: 'blue' }}
                  onClick={() => toggleMenu(feriante.id_user_fte)}
                >
                  puesto {feriante.numero} - {feriante.nombre_feriante}
                </span>
                {menuActivo === feriante.id_user_fte && (
                  <div style={{ border: '1px solid #ddd', padding: '10px', marginTop: '5px' }}>
                    <p>puesto: {feriante.numero}</p>
                    <p>Estado: {feriante.estado_pago}</p>
                    <p>Precio: {feriante.precio}</p>
                    <RegistroCobrosFisicos id_feria={id_feria} feriante={feriante} registrarPago={registrarPago}/>
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default VerificarDatos;
