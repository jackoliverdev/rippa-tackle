'use client';

import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, ZoomIn, X } from 'lucide-react';

interface ProductImage {
  id?: string;
  url: string;
  alt?: string;
  isPrimary?: boolean;
  position?: number;
}

interface ProductImageGalleryProps {
  images: ProductImage[];
  productName: string;
}

const ProductImageGallery: React.FC<ProductImageGalleryProps> = ({ images, productName }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 });
  const [zoomFactor, setZoomFactor] = useState(1.5);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  
  const imageContainerRef = useRef<HTMLDivElement>(null);
  const zoomedImageRef = useRef<HTMLDivElement>(null);

  // Find primary image or default to first image
  useEffect(() => {
    const primaryImageIndex = images.findIndex(img => img.isPrimary || img.position === 1);
    if (primaryImageIndex !== -1) {
      setCurrentIndex(primaryImageIndex);
    }
  }, [images]);

  const nextImage = () => {
    setCurrentIndex(prevIndex => (prevIndex + 1) % images.length);
    setIsZoomed(false);
  };

  const prevImage = () => {
    setCurrentIndex(prevIndex => (prevIndex - 1 + images.length) % images.length);
    setIsZoomed(false);
  };

  const handleThumbnailClick = (index: number) => {
    setCurrentIndex(index);
    setIsZoomed(false);
  };

  const handleZoomToggle = () => {
    setIsZoomed(!isZoomed);
    
    // Reset zoom position when toggling zoom
    if (!isZoomed && imageContainerRef.current) {
      setZoomPosition({
        x: 50,
        y: 50
      });
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isZoomed || !imageContainerRef.current) return;
    
    const { left, top, width, height } = imageContainerRef.current.getBoundingClientRect();
    
    // Calculate position as percentage of container
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    
    // Keep within bounds
    const boundedX = Math.max(0, Math.min(100, x));
    const boundedY = Math.max(0, Math.min(100, y));
    
    setZoomPosition({ x: boundedX, y: boundedY });
  };

  // Handle touch events for swipe navigation
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;
    
    if (isLeftSwipe) {
      nextImage();
    }
    
    if (isRightSwipe) {
      prevImage();
    }
    
    setTouchStart(0);
    setTouchEnd(0);
  };

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowLeft':
          prevImage();
          break;
        case 'ArrowRight':
          nextImage();
          break;
        case 'Escape':
          setIsZoomed(false);
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  if (!images || images.length === 0) {
    return (
      <div className="w-full aspect-square bg-slate-100 rounded-lg flex items-center justify-center">
        <p className="text-slate-400">No images available</p>
      </div>
    );
  }

  return (
    <div className="product-gallery">
      {/* Main image container */}
      <div 
        ref={imageContainerRef}
        className={`relative aspect-square overflow-hidden rounded-lg bg-white mb-4 cursor-${isZoomed ? 'zoom-out' : 'zoom-in'}`}
        onClick={handleZoomToggle}
        onMouseMove={handleMouseMove}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Regular Image */}
        <div className={`relative w-full h-full transition-opacity duration-300 ${isZoomed ? 'opacity-0' : 'opacity-100'}`}>
          <Image 
            src={images[currentIndex].url}
            alt={images[currentIndex].alt || productName}
            fill
            priority
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-contain"
          />
        </div>
        
        {/* Zoomed image overlay */}
        {isZoomed && (
          <div 
            ref={zoomedImageRef}
            className="absolute inset-0 overflow-hidden"
          >
            <div
              style={{
                position: 'absolute',
                width: `${100 * zoomFactor}%`,
                height: `${100 * zoomFactor}%`,
                top: 0,
                left: 0,
                transform: `translate(${-zoomPosition.x * (zoomFactor - 1)}%, ${-zoomPosition.y * (zoomFactor - 1)}%)`,
                backgroundImage: `url(${images[currentIndex].url})`,
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                backgroundSize: 'contain'
              }}
            />
          </div>
        )}
        
        {/* Zoom button */}
        <button 
          onClick={(e) => {
            e.stopPropagation();
            handleZoomToggle();
          }}
          className="absolute top-4 right-4 p-2 bg-white/70 hover:bg-white rounded-full shadow-md z-10 focus:outline-none"
          aria-label={isZoomed ? "Exit zoom" : "Zoom image"}
        >
          {isZoomed ? <X size={20} /> : <ZoomIn size={20} />}
        </button>
        
        {/* Navigation arrows (only visible when not zoomed) */}
        {images.length > 1 && !isZoomed && (
          <>
            <button 
              onClick={(e) => {
                e.stopPropagation();
                prevImage();
              }}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 p-2 bg-white/70 hover:bg-white rounded-full shadow-md z-10 focus:outline-none"
              aria-label="Previous image"
            >
              <ChevronLeft size={20} />
            </button>
            <button 
              onClick={(e) => {
                e.stopPropagation();
                nextImage();
              }}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 p-2 bg-white/70 hover:bg-white rounded-full shadow-md z-10 focus:outline-none"
              aria-label="Next image"
            >
              <ChevronRight size={20} />
            </button>
          </>
        )}
        
        {/* Image counter badge */}
        {images.length > 1 && (
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 px-3 py-1 bg-black/60 text-white text-xs rounded-full z-10">
            {currentIndex + 1} / {images.length}
          </div>
        )}
      </div>
      
      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="grid grid-flow-col auto-cols-max gap-3 overflow-x-auto pb-4 pt-2 px-1 hide-scrollbar">
          {images.map((image, index) => (
            <div 
              key={image.id || image.url} 
              className={`relative w-20 h-20 rounded-md overflow-hidden cursor-pointer transition-all p-0.5 ${
                currentIndex === index 
                  ? 'ring-2 ring-blue-500 border border-white'
                  : 'border border-slate-200 opacity-70 hover:opacity-100'
              }`}
              onClick={() => handleThumbnailClick(index)}
            >
              <Image 
                src={image.url}
                alt={image.alt || `${productName} - thumbnail ${index + 1}`}
                fill
                sizes="80px"
                className="object-cover rounded-sm"
              />
            </div>
          ))}
        </div>
      )}
      
      {/* Custom scrollbar styling */}
      <style jsx global>{`
        .hide-scrollbar::-webkit-scrollbar {
          height: 5px;
        }
        .hide-scrollbar::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 5px;
        }
        .hide-scrollbar::-webkit-scrollbar-thumb {
          background: #ddd;
          border-radius: 5px;
        }
        .hide-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #bbb;
        }
      `}</style>
    </div>
  );
};

export default ProductImageGallery; 