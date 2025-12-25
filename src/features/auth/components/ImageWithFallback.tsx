import React, { useState } from 'react';

interface ImageWithFallbackProps {
  src: string;
  alt: string;
  className?: string;
  style?: React.CSSProperties;
}

export function ImageWithFallback({ 
  src, 
  alt, 
  className = '', 
  style 
}: ImageWithFallbackProps) {
  const [imgSrc, setImgSrc] = useState(src);
  const [hasError, setHasError] = useState(false);

  const handleError = () => {
    if (!hasError) {
      setHasError(true);
      // Fallback to a placeholder or gradient
      setImgSrc('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgZmlsbD0iIzMzMzMzMyIvPjwvc3ZnPg==');
    }
  };

  return (
    <img
      src={imgSrc}
      alt={alt}
      className={className}
      style={style}
      onError={handleError}
    />
  );
}

