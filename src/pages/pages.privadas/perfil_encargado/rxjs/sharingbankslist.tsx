// bancos.service.ts
import { BehaviorSubject } from 'rxjs';
import { DatosBank } from '../../../models/interfaces';
import { getDatosBank } from '../services/admin_feria_fuctions';

class BancoService {
  private bancosSubject = new BehaviorSubject<DatosBank[]>([]);
  public bancos$ = this.bancosSubject.asObservable();

  // Función para actualizar la lista de bancos
  setBancos(bancos: DatosBank[]) {
    this.bancosSubject.next(bancos);
  }

  // Función para agregar un nuevo banco
  addBanco(banco: DatosBank) {
    const currentBancos = this.bancosSubject.getValue();
    this.bancosSubject.next([...currentBancos, banco]);
  }

  // Función para eliminar un banco
  removeBanco(mail_banco: string) {
    const currentBancos = this.bancosSubject.getValue();
    const updatedBancos = currentBancos.filter(b => b.mail_banco !== mail_banco);
    this.bancosSubject.next(updatedBancos);
  }

  // Función para actualizar un banco existente
  updateBanco(updatedBanco: DatosBank) {
    const currentBancos = this.bancosSubject.getValue();
    const updatedBancos = currentBancos.map(b =>
      b.mail_banco === updatedBanco.mail_banco ? updatedBanco : b
    );
    this.bancosSubject.next(updatedBancos);
  }




  // Función para cargar los bancos desde la base de datos, recibiendo el mail como argumento
  loadInitialBancos(id_user_enf: number) {
    getDatosBank(id_user_enf).then(bancos => {
      this.setBancos(bancos); // Actualiza la lista con los datos obtenidos
    }).catch(error => {
      console.error("Error al cargar los bancos:", error);
    });
  }
}

export const bancoService = new BancoService();
