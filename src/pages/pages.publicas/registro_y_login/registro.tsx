import axios from "axios";
import React, { useState } from "react"

export const Registro = () => {

  const [nombre,setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [rut, setRut] = useState('');
  const [rut_div, setRut_div] = useState('');
  const [user_mail, setmail] = useState('');
  const [telefono,setTelefono] = useState('');
  const [contrasena,Setcontrasena] = useState('');
  const [contrasena2,Setcontrasena2] = useState('');
  const [error2, setError2] = useState('');
  const [role, setRole] = useState('');

  const validarNombre = (nombre: string) => /^[a-zA-ZÀ-ÿ\s]{1,40}$/.test(nombre);
  const validarRut = (rut: string) => /^[0-9]{7,8}$/.test(rut); 
  const validarRut_div = (rut_div: string) => /^[0-9kK]$/.test(rut_div);  
  const validarMail = (user_mail: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(user_mail);
  const validarTelefono = (telefono: string) => /^[0-9]{7,15}$/.test(telefono);
  const validarContrasena = (contrasena: string) => /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/.test(contrasena);
  const validarContrasenasCoinciden = (contrasena: string, contrasena2: string) => contrasena === contrasena2;


  const clicRegistro =async  (e: React.FormEvent) => {
    e.preventDefault();

    if (!validarNombre(nombre)) {
      setError2('El nombre solo debe contener letras.');
      return;
    }

    if (!validarNombre(apellido)) {
      setError2('El apellido solo debe contener letras.');
      return;
    }

    if (!validarRut(rut)) {
      setError2('El RUT debe tener solo números (sin puntos ni guiones) y un máximo de 8 dígitos.');
      return;
    }

    if (!validarRut_div(rut_div)) {
      setError2('El dígito verificador debe ser un número o la letra k.');
      return;
    }

    if (!validarMail(user_mail)) {
      setError2('El correo no tiene un formato válido.');
      return;
    }

    if (!validarTelefono(telefono)) {
      setError2('El teléfono debe tener entre 7 y 15 dígitos.');
      return;
    }

    if (!validarContrasena(contrasena)) {
      setError2('La contraseña debe tener al menos 8 caracteres, incluyendo mayúsculas, minúsculas y un número.');
      return;
    }

    if (!validarContrasenasCoinciden(contrasena, contrasena2)) {
      setError2('Las contraseñas no coinciden.');
      return;
    }

    try {
      let response;
      
      if (role === '1') {
        response = await axios.post('http://localhost:5000/registro/encargado', {
          user_mail, rut: parseInt(rut), rut_div, nombre, apellido, telefono: parseInt(telefono), role, contrasena
        });
      } else if (role === '2') {
        response = await axios.post('http://localhost:5000/registro/feriante', {
          user_mail, rut: parseInt(rut), rut_div, nombre, apellido, telefono: parseInt(telefono), role, contrasena
        });
      } else if (role === '3') {
        response = await axios.post('http://localhost:5000/registro/municipal', {
          user_mail, rut: parseInt(rut), rut_div, nombre, apellido, telefono: parseInt(telefono), role, contrasena
        });
      }

      console.log('Registro exitoso:', response?.data);
    } catch (err) {
      setError2('Error al registrar usuario');
      console.error(err);
    }
  };

return (
<>


<h2>registro</h2>
<form onSubmit={clicRegistro}>
    <div>
      <div>
      <label htmlFor="">nombre</label>
        <input type="text" value={nombre} onChange={(e)=> setNombre(e.target.value)}required/>  
       
        </div>
      <div>
      <label htmlFor="">apellido</label>
        <input type="text" value={apellido} onChange={(e) => setApellido(e.target.value)}/>
        </div>

        <div>
      <label htmlFor="">rut</label>
        <input type="text" value={rut} onChange={(e) => setRut(e.target.value)}required />
        </div>

        <div>
      <label htmlFor="">digito verificador</label>
        <input type="text" value={rut_div} onChange={(e) => setRut_div(e.target.value)}required />
        </div>

      <div>
      <label htmlFor="">mail</label>
        <input type="email"  value={user_mail} onChange={(e) => setmail(e.target.value)} required/>
        </div>

      <div>
        <label htmlFor="">telefono</label>
        <input type="text" value={telefono} onChange={(e) => setTelefono(e.target.value)}/>
        </div>

        <div>
        <label htmlFor="">contrasena</label> 
        <input type="password" value={contrasena} onChange={(e) => Setcontrasena(e.target.value)} required/>
        </div>

        <div>
        <label htmlFor="">repetir</label>
        <input type="password" value={contrasena2} onChange={(e) => Setcontrasena2(e.target.value)} required/>
        </div>
    </div>


      <div>
      <select 
                id="role" 
                name="role"  
                value={role} 
                onChange={(e) => setRole(e.target.value)} 
                required
            >
                <option value="" disabled>Select a role</option>
                <option value={1}>Encargado</option>
                <option value={2}>Feriante</option> 
                <option value={3}>Administrador Muni</option>
            </select>
      </div>
    <button type="submit">registrarse</button>
    {error2 && <p>{error2}</p>}
</form>





  </>
)


}

