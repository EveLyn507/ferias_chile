import React, { useEffect, useState } from 'react';

interface FotoPerfilProps {
  userMail: string;
  setFotoPerfil: (url: string) => void;
  fotoPerfil: string;  
}

const FotoPerfil: React.FC<FotoPerfilProps> = ({ userMail, setFotoPerfil, fotoPerfil }) => {
  const [preview, setPreview] = useState<string | null>(fotoPerfil); 

  useEffect(() => {
    const obtenerFotoPerfil = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/foto/${userMail}`);
        if (response.ok) {
          const data = await response.blob();  
          const imageUrl = URL.createObjectURL(data);
          setPreview(imageUrl); 
          setFotoPerfil(imageUrl); 
        } else {
          console.error('Error al obtener la foto de perfil:', response.statusText);
        }
      } catch (error) {
        console.error('Error al obtener la foto de perfil:', error);
      }
    };

    if (!fotoPerfil) {  
      obtenerFotoPerfil();
    }
  }, [userMail, fotoPerfil, setFotoPerfil]);

  const handleFotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const fileSizeLimit = 2 * 1024 * 1024; 
      const fileType = file.type;

      if ((fileType === 'image/jpeg' || fileType === 'image/png') && file.size <= fileSizeLimit) {
        const reader = new FileReader();
        reader.onloadend = () => {
          const result = reader.result as string;
          setPreview(result); 
        };
        reader.readAsDataURL(file);
      } else {
        alert('Por favor selecciona una imagen en formato JPEG o PNG que no exceda los 2 MB.');
      }
    }
  };

  const handleSavePhoto = async () => {
    if (preview) {
      try {
        const response = await fetch('http://localhost:5000/api/foto', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            foto: preview,
            userMail,
          }),
        });

        if (response.ok) {
          const result = await response.json();
          setFotoPerfil(result.url_foto); 
          alert('Foto de perfil actualizada con éxito.');
        } else {
          alert('Error al guardar la foto.');
        }
      } catch (error) {
        console.error('Error al conectar con el servidor:', error);
        alert('Error al conectar con el servidor.');
      }
    }
  };

  const handleRemovePhoto = () => {
    setFotoPerfil('');  
    setPreview(null);
    alert('Foto de perfil eliminada con éxito.');
  };

  return (
    <div>
      <h2>Foto de Perfil</h2>
      {preview ? (
        <div>
          <img src={preview} alt="Previsualización" style={{ width: '150px', height: '150px', objectFit: 'cover' }} />
          <button onClick={handleRemovePhoto}>Eliminar Foto</button>
        </div>
      ) : (
        <p>No hay foto de perfil seleccionada</p>
      )}
      <input type="file" accept="image/jpeg, image/png" onChange={handleFotoChange} />
      <button onClick={handleSavePhoto} disabled={!preview}>Guardar Foto</button>
    </div>
  );
};

export default FotoPerfil;
