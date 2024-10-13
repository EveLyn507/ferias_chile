/* eslint-disable @typescript-eslint/no-unused-vars */
import data from './data.json'; // Si estás usando módulos de JSON, asegúrate de que TypeScript lo soporte (opción "resolveJsonModule" en tsconfig)

// Define la interfaz Feria (si no está definida ya en otro lugar)
export interface Feria {
    id: number;
    nombre: string;
}

// Tipar la función para que devuelva una promesa de un array de Feria
export const pedirDatos = (): Promise<Feria[]> => {
    return new Promise((resolve, _reject) => {
        setTimeout(() => {
            resolve(data as Feria[]); // Asegúrate de que los datos cumplen con la interfaz Feria
        }, 500);
    });
};
