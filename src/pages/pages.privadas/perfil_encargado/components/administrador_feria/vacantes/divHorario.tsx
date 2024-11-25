import { horarioVacante } from "../../../../../models/interfaces";

interface divProp {
  horarios: horarioVacante[];
}
const semana = ['none', 'lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado', 'domingo'];

export const DivHorario = ({ horarios }: divProp) => {
  const isValidHorario = (horario: horarioVacante): boolean => {
    // Validar que la hora de entrada sea menor que la de salida
    return horario.hora_entrada < horario.hora_salida;
  };

  const invalidHorarios = horarios.filter((horario) => !isValidHorario(horario)); // Filtrar horarios inválidos

  return (
    <div className="horarios">
      {invalidHorarios.length > 0 && (
        <div style={{ color: "red", marginBottom: "10px" }}>
          <strong>Advertencias:</strong>
          <ul>
            {invalidHorarios.map((horario, index) => (
              <li key={index}>
                El horario del día {semana[horario.id_dia]} tiene un error: la hora de entrada debe ser menor que la de salida.
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="circulos-container">
        {['L', 'M', 'W', 'J', 'V', 'S', 'D'].map((dia, index) => {
          const horario = horarios.find((h) => h.id_dia === index + 1);
          return (
            <div
              key={index}
              className={`dia-circle ${horario ? 'activo' : 'inactivo'}`}
            >
              {dia}
            </div>
          );
        })}
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
