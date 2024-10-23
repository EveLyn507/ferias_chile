import { BehaviorSubject } from 'rxjs';

class IdService {
  private idSubject = new BehaviorSubject<number>(0); // Comienza con un número inicial de 0
  public id$ = this.idSubject.asObservable();

  // Función para enviar un nuevo id (tipo number)
  setId(id: number) {
    this.idSubject.next(id);
  }

  // Función para recibir el id actual (tipo number)
  getId(): number {
    return this.idSubject.getValue();
  }
}

export const idService = new IdService();
