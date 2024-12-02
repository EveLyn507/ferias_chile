import { horarioVacante } from "../../../../../../models/interfaces";
import { useToast } from "@components/ToastService"; // Usando alias para importar ToastService

interface divProp {
  horarios: horarioVacante[];
}

const semana = ["none", "lunes", "martes", "miércoles", "jueves", "viernes", "sábado", "domingo"];

export const DivHorario = ({ horarios }: divProp) => {
  const { addToast } = useToast(); // Hook para mostrar mensajes con ToastService

  const handleHorarioInfo = (dia: string) => {
    const horario = horarios.find((h) => semana[h.id_dia] === dia);

    if (horario) {
      addToast({
        type: "info",
        message: `Día: ${dia} - Entrada: ${horario.hora_entrada} - Salida: ${horario.hora_salida}`,
      });
    } else {
      addToast({ type: "warning", message: `No hay horarios disponibles para ${dia}.` });
    }
  };

  return (
    <div className="horarios">
      <div className="circulos-container">
        {["lunes", "martes", "miércoles", "jueves", "viernes", "sábado", "domingo"].map(
          (dia, index) => {
            const horario = horarios.find((h) => semana[h.id_dia] === dia);
            return (
              <div
                key={index}
                className={`dia-circle ${horario ? "activo" : "inactivo"}`}
                onClick={() => handleHorarioInfo(dia)} // Muestra información del horario al hacer clic
              >
                {dia.charAt(0).toUpperCase()}
              </div>
            );
          }
        )}
      </div>

      {horarios.length > 0 && (
        <div className="hover-info">
          <strong>Horarios:</strong>
          <ul>
            {horarios.map((horario, index) => (
              <span key={index}>
                Día {semana[horario.id_dia]}:
                <li>Entrada: {horario.hora_entrada}</li>
                <li>Salida: {horario.hora_salida}</li>
                <br />
              </span>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
