import React, { useState } from 'react';
import {
  validarNombre,
  validarMail,
  validarTelefono,
  validarContrasena,
  validarContrasenasCoinciden,
  validarRutCompleto
} from './validaciones';
import './css/registro.css';  // Importa el archivo CSS

export const Registro = () => {
  const [values, setValues] = useState({
    nombre: '',
    apellido: '',
    user_mail: '',
    telefono: '',
    contrasena: '',
    contrasena2: '',
    rut: '',
    rut_div: ''
  });

  const [errors, setErrors] = useState({
    nombre: '',
    apellido: '',
    user_mail: '',
    telefono: '',
    contrasena: '',
    contrasena2: '',
    rut: '',
    rut_div: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setValues((prevValues) => ({
      ...prevValues,
      [name]: value
    }));
    validateField(name, value);
  };

  const validateField = (name: string, value: string) => {
    let errorMessage = '';

    switch (name) {
      case 'nombre':
        errorMessage = validarNombre(value) || '';
        break;
      case 'apellido':
        errorMessage = validarNombre(value) || '';
        break;
      case 'user_mail':
        errorMessage = validarMail(value) || '';
        break;
      case 'telefono':
        errorMessage = validarTelefono(value) || '';
        break;
      case 'contrasena':
        errorMessage = validarContrasena(value) || '';
        break;
      case 'contrasena2':
        errorMessage = validarContrasenasCoinciden(values.contrasena, value) || '';
        break;
      case 'rut':
      case 'rut_div':
        errorMessage = validarRutCompleto(values.rut, values.rut_div) || '';
        break;
      default:
        break;
    }

    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: errorMessage
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    Object.keys(values).forEach((field) => {
      validateField(field, values[field]);
    });
    if (Object.values(errors).every((error) => error === '')) {
      console.log('Formulario enviado');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="form-container">
      <div className="form-row">
        <div>
          <label>Nombre</label>
          <input
            type="text"
            name="nombre"
            value={values.nombre}
            onChange={handleInputChange}
          />
          {errors.nombre && <p className="error">{errors.nombre}</p>}
        </div>

        <div>
          <label>Apellido</label>
          <input
            type="text"
            name="apellido"
            value={values.apellido}
            onChange={handleInputChange}
          />
          {errors.apellido && <p className="error">{errors.apellido}</p>}
        </div>
      </div>

      <div className="form-row">
        <div>
          <label>Correo Electrónico</label>
          <input
            type="email"
            name="user_mail"
            value={values.user_mail}
            onChange={handleInputChange}
          />
          {errors.user_mail && <p className="error">{errors.user_mail}</p>}
        </div>

        <div>
          <label>Teléfono</label>
          <input
            type="text"
            name="telefono"
            value={values.telefono}
            onChange={handleInputChange}
          />
          {errors.telefono && <p className="error">{errors.telefono}</p>}
        </div>
      </div>

      <div className="form-row">
        <div>
          <label>Contraseña</label>
          <input
            type="password"
            name="contrasena"
            value={values.contrasena}
            onChange={handleInputChange}
          />
          {errors.contrasena && <p className="error">{errors.contrasena}</p>}
        </div>

        <div>
          <label>Confirmar Contraseña</label>
          <input
            type="password"
            name="contrasena2"
            value={values.contrasena2}
            onChange={handleInputChange}
          />
          {errors.contrasena2 && <p className="error">{errors.contrasena2}</p>}
        </div>
      </div>

      <div className="form-row">
        <div>
          <label>RUT</label>
          <input
            type="text"
            name="rut"
            value={values.rut}
            onChange={handleInputChange}
          />
          {errors.rut && <p className="error">{errors.rut}</p>}
        </div>

        <div>
          <label>Dígito Verificador</label>
          <input
            type="text"
            name="rut_div"
            value={values.rut_div}
            onChange={handleInputChange}
          />
          {errors.rut_div && <p className="error">{errors.rut_div}</p>}
        </div>
      </div>

      <button type="submit">Registrar</button>
    </form>
  );
};
