// DiasActivos.tsx
import React from 'react';
import { ProgramaFeria } from '../../../../models/interfaces';

interface DiasActivosProps {
    programa: ProgramaFeria; // Asegúrate de importar la interfaz ProgramaFeria
}

const DiasActivos: React.FC<DiasActivosProps> = ({ programa }) => {
    const diasActivos = [];

    // Verificar cada día y agregarlo a la lista si está activo
    if (programa.lunes === "1") diasActivos.push("Lunes");
    if (programa.martes === "1") diasActivos.push("Martes");
    if (programa.miercoles === "1") diasActivos.push("Miércoles");
    if (programa.jueves === "1") diasActivos.push("Jueves");
    if (programa.viernes === "1") diasActivos.push("Viernes");
    if (programa.sabado === "1") diasActivos.push("Sábado");
    if (programa.domingo === "1") diasActivos.push("Domingo");

    return (
        <div>
            {diasActivos.length > 0 
                ? `Días activos: ${diasActivos.join(", ")}`
                : "No hay días activos"
            }
        </div>
    );
};

export default DiasActivos;
