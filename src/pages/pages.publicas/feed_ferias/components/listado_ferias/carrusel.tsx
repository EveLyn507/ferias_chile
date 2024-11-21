import React, { useState, useEffect } from 'react';
import image1 from '../../../../../assets/imagenes carrusel/image1.jpg';
import image2 from '../../../../../assets/imagenes carrusel/image2.jpg';
import image3 from '../../../../../assets/imagenes carrusel/image3.jpg';

const Carrusel: React.FC = () => {
  const images = [
    { id: 1, src: image1 },
    { id: 2, src: image2 },
    { id: 3, src: image3 },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 5000);
    return () => clearInterval(interval); 
  }, []);

  return (
    <div className="carrusel-container">
      <div className="carrusel">
        <div className="image-container" style={{ opacity: currentIndex === 0 ? 1 : 0 }}>
          <img
            src={images[0].src}
            alt="Imagen 1"
            className="carrusel-image"
          />
        </div>
        <div className="image-container" style={{ opacity: currentIndex === 1 ? 1 : 0 }}>
          <img
            src={images[1].src}
            alt="Imagen 2"
            className="carrusel-image"
          />
        </div>
        <div className="image-container" style={{ opacity: currentIndex === 2 ? 1 : 0 }}>
          <img
            src={images[2].src}
            alt="Imagen 3"
            className="carrusel-image"
          />
        </div>
      </div>
    </div>
  );
};

export default Carrusel;
