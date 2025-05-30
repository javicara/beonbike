'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTimes, FaArrowLeft, FaArrowRight, FaExpand } from 'react-icons/fa';

interface GalleryImage {
  src: string;
  alt: string;
  width?: number;
  height?: number;
}

interface ImageGalleryProps {
  images: GalleryImage[];
  columns?: number;
  gap?: number;
}

const ImageGallery: React.FC<ImageGalleryProps> = ({
  images,
  columns = 3,
  gap = 4
}) => {
  const [selectedImage, setSelectedImage] = useState<number | null>(null);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  
  // Open lightbox with selected image
  const openLightbox = (index: number) => {
    setSelectedImage(index);
    setIsLightboxOpen(true);
    document.body.style.overflow = 'hidden'; // Prevent scrolling when lightbox is open
  };
  
  // Close lightbox
  const closeLightbox = () => {
    setIsLightboxOpen(false);
    document.body.style.overflow = 'auto'; // Re-enable scrolling
  };
  
  // Navigate to previous image
  const prevImage = () => {
    if (selectedImage === null) return;
    setSelectedImage(selectedImage === 0 ? images.length - 1 : selectedImage - 1);
  };
  
  // Navigate to next image
  const nextImage = () => {
    if (selectedImage === null) return;
    setSelectedImage(selectedImage === images.length - 1 ? 0 : selectedImage + 1);
  };
  
  // Handle keyboard navigation
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isLightboxOpen) return;
      
      switch (e.key) {
        case 'ArrowLeft':
          prevImage();
          break;
        case 'ArrowRight':
          nextImage();
          break;
        case 'Escape':
          closeLightbox();
          break;
        default:
          break;
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isLightboxOpen, selectedImage]);
  
  return (
    <div className="w-full">
      {/* Gallery Grid */}
      <div 
        className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-${columns} gap-${gap}`}
        style={{ 
          gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
          gap: `${gap * 0.25}rem` 
        }}
      >
        {images.map((image, index) => (
          <motion.div
            key={`gallery-image-${index}`}
            className="relative overflow-hidden rounded-lg aspect-square cursor-pointer"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => openLightbox(index)}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <Image
              src={image.src}
              alt={image.alt}
              fill
              className="object-cover transition-transform duration-300 hover:scale-110"
              sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
            />
            <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-20 transition-opacity duration-300 flex items-center justify-center opacity-0 hover:opacity-100">
              <FaExpand className="text-white text-2xl" />
            </div>
          </motion.div>
        ))}
      </div>
      
      {/* Lightbox */}
      <AnimatePresence>
        {isLightboxOpen && selectedImage !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-90"
            onClick={closeLightbox}
          >
            <div 
              className="relative w-full h-full flex items-center justify-center"
              onClick={(e) => e.stopPropagation()} // Prevent closing when clicking on the image container
            >
              {/* Close Button */}
              <button 
                className="absolute top-4 right-4 z-10 p-2 text-white bg-black bg-opacity-50 rounded-full hover:bg-opacity-70 transition-colors"
                onClick={closeLightbox}
              >
                <FaTimes className="text-xl" />
              </button>
              
              {/* Navigation Buttons */}
              <button 
                className="absolute left-4 z-10 p-3 text-white bg-black bg-opacity-50 rounded-full hover:bg-opacity-70 transition-colors"
                onClick={(e) => {
                  e.stopPropagation();
                  prevImage();
                }}
              >
                <FaArrowLeft className="text-xl" />
              </button>
              
              <button 
                className="absolute right-4 z-10 p-3 text-white bg-black bg-opacity-50 rounded-full hover:bg-opacity-70 transition-colors"
                onClick={(e) => {
                  e.stopPropagation();
                  nextImage();
                }}
              >
                <FaArrowRight className="text-xl" />
              </button>
              
              {/* Current Image */}
              <div className="relative w-full max-w-5xl h-full max-h-[80vh] flex items-center justify-center">
                <motion.div 
                  key={`lightbox-image-${selectedImage}`}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                  className="relative w-full h-full"
                >
                  <Image
                    src={images[selectedImage].src}
                    alt={images[selectedImage].alt}
                    fill
                    className="object-contain"
                    sizes="100vw"
                    priority
                  />
                </motion.div>
              </div>
              
              {/* Image Counter */}
              <div className="absolute bottom-4 left-0 right-0 text-center text-white">
                {selectedImage + 1} / {images.length}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ImageGallery; 