import { useEffect, useState } from "react";

export function useImageLoader(imageUrl: string): HTMLImageElement | null {
    const [image, setImage] = useState<HTMLImageElement | null>(null);
  
    useEffect(() => {
      const img = new window.Image();
      img.src = imageUrl;
      img.onload = () => setImage(img);
      img.onerror = () => console.error('Error loading the image');
      return () => {
        setImage(null); // Limpia la imagen cuando el componente se desmonta
      };
    }, [imageUrl]);
  
    return image;
  }
  