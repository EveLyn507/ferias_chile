import { horarioVacante } from "../../../../../models/interfaces";

interface divProp {
  horarios: horarioVacante[];
}
const semana = ['none', 'lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado', 'domingo'];

export const DivHorario = ({ horarios }: divProp) => {

  return (
    <div className="horarios">
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
