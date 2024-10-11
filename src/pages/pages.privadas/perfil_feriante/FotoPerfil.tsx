import React, { useState } from 'react';

interface FotoPerfilProps {
  fotoPerfil: string;
  setFotoPerfil: (url: string) => void;
}

const FotoPerfil: React.FC<FotoPerfilProps> = ({ fotoPerfil, setFotoPerfil }) => {
  const [preview, setPreview] = useState<string | null>(fotoPerfil); // Previsualización de la foto

  const handleFotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const fileSizeLimit = 2 * 1024 * 1024; // 2 MB
      const fileType = file.type;

      // Validar formato y tamaño del archivo
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

  const handleSavePhoto = () => {
    if (preview) {
      setFotoPerfil(preview);
      alert('Foto de perfil actualizada con éxito.');
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
