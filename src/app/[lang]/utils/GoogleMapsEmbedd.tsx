'use client'
import React from 'react';

interface GoogleMapsEmbedProps {
  mapUrl: string;
  width?: string; // Optional width
  height?: string; // Optional height
}

const GoogleMapsEmbed: React.FC<GoogleMapsEmbedProps> = ({ mapUrl, width = '100%', height = '240px' }) => {
  return (
    <iframe
      src={mapUrl}
      width={width}
      height={height}
      style={{ border: 0 }}
      allowFullScreen
      loading="lazy" 
      referrerPolicy="no-referrer-when-downgrade"
    />
  );
};

export default GoogleMapsEmbed;
