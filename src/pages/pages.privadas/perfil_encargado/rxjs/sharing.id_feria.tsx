import { BehaviorSubject } from 'rxjs';

class IdFeriaService {
  private idSubject = new BehaviorSubject<number | null>(this.getIdFromLocalStorage());

  public id$ = this.idSubject.asObservable();

  // Función para establecer el ID y guardarlo en Local Storage
  setId(id: number) {
    this.idSubject.next(id);
    localStorage.setItem('id_feria', JSON.stringify(id)); // Guarda el id_feria en Local Storage
  }

  // Función para obtener el ID desde Local Storage cuando la aplicación se carga
  private getIdFromLocalStorage(): number | null {
    const storedId = localStorage.getItem('id_feria');
    return storedId ? JSON.parse(storedId) : null;
  }
  
  // Limpia el ID de Local Storage y reinicia el Subject
  clearId() {
    localStorage.removeItem('id_feria');
    this.idSubject.next(null);
  }
}

export const idFeriaService = new IdFeriaService();
