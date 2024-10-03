
// Define la interfaz para los objetos de feria
interface Feria {
    id: number;
    nombre: string;
}

// Define las props del componente, en este caso un array de objetos Feria
interface ItemListProps {
    ferias: Feria[];
}

export const Item_list: React.FC<ItemListProps> = ({ ferias }) => {
    console.log(ferias); // Para depurar el estado de ferias

    return (
        <div className="ferias">
            {ferias.map((feria) => (
                <div className="card" key={feria.id}>
                    {feria.nombre}
                </div>
            ))}
        </div>
    );
};

