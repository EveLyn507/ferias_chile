import React, { useState } from 'react';
import './Carrusel.css';
import image1 from '../../../../../assets/imagenes carrusel/image1.jpg';
import image2 from '../../../../../assets/imagenes carrusel/image2.jpg'; // Asegúrate de que estas imágenes existan
import image3 from '../../../../../assets/imagenes carrusel/image3.jpg';

const Carrusel: React.FC = () => {
  const images = [
    { id: 1, src: image1, alt: 'Imagen 1', text: 'Bienvenido a Ferias Chile' },
    { id: 2, src: image2, alt: 'Imagen 2', text: 'Bienvenido a Ferias Chile' },
    { id: 3, src: image3, alt: 'Imagen 3', text: 'Bienvenido a Ferias Chile' },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  const nextImage = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  return (
    <div className="carrusel-container">
      <div className="carrusel">
        <button className="arrow prev" onClick={prevImage}>
          &#10094;
        </button>
        <div className="image-container">
          <img
            src={images[currentIndex].src}
            alt={images[currentIndex].alt}
            className="carrusel-image"
          />
          <div className="text-overlay">
            <p>{images[currentIndex].text}</p>
          </div>
        </div>
        <button className="arrow next" onClick={nextImage}>
          &#10095;
        </button>
      </div>
    </div>
  );
};

export default Carrusel;
