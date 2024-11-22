// validations.ts

export const validarNombre = (nombre: string): string | null => {
    if (!/^[a-zA-ZÀ-ÿ\s]{1,40}$/.test(nombre)) {
      return 'El nombre solo debe contener letras.';
    }
    return null;
  };
  
  export const validarMail = (user_mail: string): string | null => {
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(user_mail)) {
      return 'El correo no tiene un formato válido.';
    }
    return null;
  };
  
  export const validarTelefono = (telefono: string): string | null => {
    if (!/^[0-9]{7,15}$/.test(telefono)) {
      return 'El teléfono debe tener entre 7 y 15 dígitos.';
    }
    return null;
  };
  
  export const validarContrasena = (contrasena: string): string | null => {
    if (!/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/.test(contrasena)) {
      return 'La contraseña debe tener al menos 8 caracteres, incluyendo mayúsculas, minúsculas y un número.';
    }
    return null;
  };
  
  export const validarContrasenasCoinciden = (contrasena: string, contrasena2: string): string | null => {
    if (contrasena !== contrasena2) {
      return 'Las contraseñas no coinciden.';
    }
    return null;
  };
  
  export const validarRutCompleto = (rut: string, rut_div: string): string | null => {
    rut = rut.replace(/\./g, '').replace('-', '');
    rut_div = rut_div.toUpperCase();
    if (!/^[0-9]{7,8}$/.test(rut) || !/^[0-9K]$/.test(rut_div)) {
      return 'El RUT ingresado no es válido.';
    }
    let suma = 0;
    let multiplo = 2;
    for (let i = rut.length - 1; i >= 0; i--) {
      suma += parseInt(rut.charAt(i), 10) * multiplo;
      multiplo = (multiplo < 7) ? multiplo + 1 : 2;
    }
    const dvCalculado = 11 - (suma % 11);
    const dv = dvCalculado === 11 ? '0' : dvCalculado === 10 ? 'K' : dvCalculado.toString();
    if (dv !== rut_div) {
      return 'El RUT ingresado no es válido.';
    }
    return null;
  };
  