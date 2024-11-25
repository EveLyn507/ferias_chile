import React, { useState } from 'react';
import {
  validarNombre,
  validarMail,
  validarTelefono,
  validarContrasena,
  validarContrasenasCoinciden,
  validarRutCompleto
} from './validaciones';
import './css/registro.css';

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

    validateField(name, value, { ...values, [name]: value });
  };

  const validateField = (name: string, value: string, currentValues: typeof values): string => {
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
        errorMessage = validarContrasenasCoinciden(currentValues.contrasena, value) || '';
        break;
      case 'rut':
      case 'rut_div':
        errorMessage = validarRutCompleto(currentValues.rut,currentValues.rut_div) || '';
        break;
      default:
        break;
    }

    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: errorMessage
    }));

    return errorMessage;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors: typeof errors = {};
    let hasErrors = false;

    Object.keys(values).forEach((field) => {
      const errorMessage = validateField(field, values[field], values);
      newErrors[field] = errorMessage;
      if (errorMessage) hasErrors = true;
    });

    setErrors(newErrors);

    if (!hasErrors) {
      console.log('Formulario enviado:', values);
    }
  };

  return (
    <div className="container-form">
      <form onSubmit={handleSubmit} className="form-container">
        <div className="col-datos-per">
          <div className="form-row">
            <div>
              <label>Nombre</label>
              <input
                type="text"
                name="nombre"
                value={values.nombre}
                onChange={handleInputChange}
              />
              {errors.nombre && <span className="error">{errors.nombre}</span>}
            </div>

            <div>
              <label>Apellido</label>
              <input
                type="text"
                name="apellido"
                value={values.apellido}
                onChange={handleInputChange}
              />
              {errors.apellido && <span className="error">{errors.apellido}</span>}
            </div>
          </div>

          <div className="form-row">
            <div>
              <label>RUT</label>
              <input
                type="number"
                name="rut"
                value={values.rut}
                onChange={handleInputChange}
              />
              {errors.rut && <span className="error">{errors.rut}</span>}
            </div>

            <div>
              <label>DV</label>
              <input
                type="text"
                name="rut_div"
                value={values.rut_div}
                onChange={handleInputChange}
              />

            </div>
          </div>
        </div>

        <div className="col-contacto">
          <div>
            <label>Correo Electrónico</label>
            <input
              type="email"
              name="user_mail"
              value={values.user_mail}
              onChange={handleInputChange}
            />
            {errors.user_mail && <span className="error">{errors.user_mail}</span>}
          </div>

          <div>
            <label>Teléfono</label>
            <input
              type="text"
              name="telefono"
              value={values.telefono}
              onChange={handleInputChange}
            />
            {errors.telefono && <span className="error">{errors.telefono}</span>}
          </div>
        </div>

        <div className="col-password">
          <div>
            <label>Contraseña</label>
            <input
              type="password"
              name="contrasena"
              value={values.contrasena}
              onChange={handleInputChange}
            />
            {errors.contrasena && <span className="error">{errors.contrasena}</span>}
          </div>
        </div>

        <div className="col-password">
          <div>
            <label>Confirmar Contraseña</label>
            <input
              type="password"
              name="contrasena2"
              value={values.contrasena2}
              onChange={handleInputChange}
            />
            {errors.contrasena2 && <span className="error">{errors.contrasena2}</span>}
          </div>
        </div>

        <button type="submit">Registrar</button>
      </form>
    </div>
  );
};
