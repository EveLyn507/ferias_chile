/* eslint-disable @typescript-eslint/no-explicit-any */
// Ajustamos el tipo CardProps para que incluya renderFields y actions
interface CardProps<T> {
    items: T[]; // Lista de elementos que quieres renderizar
    renderFields: (item: T) => { label: string; value: any }[]; // Campos a renderizar por cada item
    actions?: (item: T, index: number) => JSX.Element; // Acciones opcionales
  }
  
  export const Card = <T,>({ items, renderFields, actions }: CardProps<T>) => {
    return (
      <div className="ferias">
        {items.map((item, index) => (
          <div className="card" key={index}>
            <ul>
              {renderFields(item).map((field, i) => (
                <li key={i}>
                  {field.label}: {field.value}
                </li>
              ))}
            </ul>
            {actions && <div>{actions(item, index)}</div>} {/* Acciones dinámicas */}
          </div>
        ))}
      </div>
    );
  };
  