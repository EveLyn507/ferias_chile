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
import axios from 'axios';
import { useToast } from '@components/ToastService'; 

export const Registro = () => {
  const [values, setValues] = useState({
    nombre: '',
    apellido: '',
    user_mail: '',
    telefono: '',
    contrasena: '',
    contrasena2: '',
    rut: '',
    rut_div: '',
    role: '' 
  });

  const [errors, setErrors] = useState({
    nombre: '',
    apellido: '',
    user_mail: '',
    telefono: '',
    contrasena: '',
    contrasena2: '',
    rut: '',
    rut_div: '',
    role: '' 
  });

  const { addToast } = useToast(); // Hook para mostrar mensajes con ToastService

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
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
        errorMessage = validarRutCompleto(currentValues.rut, currentValues.rut_div) || '';
        break;
      case 'role': 
        errorMessage = value ? '' : 'Debe seleccionar un rol.';
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

  const handleSubmit = async (e: React.FormEvent) => {
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
      try {
        let response;
        const { role, user_mail, rut, rut_div, nombre, apellido, telefono, contrasena } = values;

        if (role === '1') {
          response = await axios.post('http://localhost:5000/registro/encargado', {
            user_mail,
            rut: parseInt(rut),
            rut_div,
            nombre,
            apellido,
            telefono: parseInt(telefono),
            role,
            contrasena
          });
        } else if (role === '2') {
          response = await axios.post('http://localhost:5000/registro/feriante', {
            user_mail,
            rut: parseInt(rut),
            rut_div,
            nombre,
            apellido,
            telefono: parseInt(telefono),
            role,
            contrasena
          });
        } else if (role === '3') {
          response = await axios.post('http://localhost:5000/registro/municipal', {
            user_mail,
            rut: parseInt(rut),
            rut_div,
            nombre,
            apellido,
            telefono: parseInt(telefono),
            role,
            contrasena
          });
        }

        addToast({ type: 'success', message: 'Registro exitoso.' }); // Mensaje de éxito
        console.log('Registro exitoso:', response?.data);

        // Limpia los campos después del registro exitoso
        setValues({
          nombre: '',
          apellido: '',
          user_mail: '',
          telefono: '',
          contrasena: '',
          contrasena2: '',
          rut: '',
          rut_div: '',
          role: ''
        });
        setErrors({});
      } catch (err) {
        addToast({ type: 'error', message: 'Error al registrar usuario. Inténtelo nuevamente.' }); // Mensaje de error
        console.error(err);
      }
    } else {
      addToast({ type: 'error', message: 'Existen errores en el formulario. Por favor corríjalos.' });
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

        <div>
          <label>Rol</label>
          <select
            name="role"
            value={values.role}
            onChange={handleInputChange}
            required
          >
            <option value="" disabled>
              Selecciona un rol
            </option>
            <option value="1">Encargado</option>
            <option value="2">Feriante</option>
            <option value="3">Administrador Municipal</option>
          </select>
          {errors.role && <span className="error">{errors.role}</span>}
        </div>

        <button type="submit">Registrar</button>
      </form>
    </div>
  );
};
