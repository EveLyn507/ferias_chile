import { BehaviorSubject } from 'rxjs';

class IdFeriaService {
  // Creamos el BehaviorSubject con un valor inicial de `null`
  private idSubject = new BehaviorSubject<number >(0);

  // Exponemos un Observable de solo lectura para el ID
  public id$ = this.idSubject.asObservable();

  // Método para establecer el nuevo ID
  setId(id: number) {
    this.idSubject.next(id);
  }

  // Método para obtener el valor actual del ID
  getId(): number  {
    return this.idSubject.getValue();
  }
}

// Exportamos una instancia única del servicio
export const idFeriaService = new IdFeriaService();
