// Mensajes de error centralizados
const errorMessages = {
    nombre: 'Solo letras.',
    mail: 'Correo inválido.',
    telefono: 'Teléfono inválido.',
    contrasena: 'Debe contener 8 caracteres mínimo, 1 mayúscula, 1 minúscula y 1 número.',
    contrasenaNoCoincide: 'Las contraseñas no coinciden.',
    rut: 'RUT inválido.',
    dv: 'DV inválido.',
    rutFalta: 'Falta el RUT.',
    rutLongitud: 'El RUT debe tener 7 u 8 dígitos.',
    faltaDv: 'Falta DV.',
  };
  
  // Función de validación genérica con expresión regular
  const validarConExpresion = (valor: string, regex: RegExp, errorMsg: string): string | null => {
    if (!regex.test(valor)) {
      return errorMsg;
    }
    return null;
  };
  
  // Validaciones por campo
  export const validarNombre = (nombre: string): string | null =>
    validarConExpresion(nombre, /^[a-zA-ZÀ-ÿ\s]{1,40}$/, errorMessages.nombre);
  
  export const validarMail = (mail: string): string | null =>
    validarConExpresion(mail, /^[^\s@]+@[^\s@]+\.[^\s@]+$/, errorMessages.mail);
  
  export const validarTelefono = (telefono: string): string | null =>
    validarConExpresion(telefono, /^[0-9]{7,15}$/, errorMessages.telefono);
  
  export const validarContrasena = (contrasena: string): string | null =>
    validarConExpresion(contrasena, /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/, errorMessages.contrasena);
  
  // Validar que las contraseñas coincidan
  export const validarContrasenasCoinciden = (contrasena: string, contrasena2: string): string | null =>
    contrasena !== contrasena2 ? errorMessages.contrasenaNoCoincide : null;
  
  // Validación del dígito verificador del RUT
  const validarGuion = (dv: string): string | null => {
    if (!dv) {
      return errorMessages.faltaDv;
    }
    if (!/^[0-9Kk]$/.test(dv)) {
      return errorMessages.dv;
    }
    return null;
  };
  
  // Validación del RUT completo
  export const validarRutCompleto = (rut: string, dv: string): string | null => {
    if (!rut) {
      return errorMessages.rutFalta;
    }
  
    // Normaliza el RUT eliminando puntos y guiones
    const rutLimpio = rut.replace(/\./g, '').replace('-', '');
  
    // Validar que el número RUT tenga entre 7 y 8 dígitos
    if (!/^\d{7,8}$/.test(rutLimpio)) {
      return errorMessages.rutLongitud;
    }
  
    // Validar el DV
    const errorDv = validarGuion(dv);
    if (errorDv) return errorDv;
  
    // Calcular el dígito verificador esperado
    let suma = 0;
    let multiplicador = 2;
    for (let i = rutLimpio.length - 1; i >= 0; i--) {
      suma += parseInt(rutLimpio.charAt(i), 10) * multiplicador;
      multiplicador = multiplicador < 7 ? multiplicador + 1 : 2;
    }
  
    const resto = suma % 11;
    const dvCalculado = 11 - resto;
    const dvEsperado = dvCalculado === 11 ? '0' : dvCalculado === 10 ? 'K' : dvCalculado.toString().toUpperCase();
  
    // Comparar el DV ingresado con el calculado
    if (dvEsperado !== dv.toUpperCase()) {
      return errorMessages.rut;
    }
  
    return null; // RUT válido
  };
  