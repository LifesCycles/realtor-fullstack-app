import React, { useState } from 'react';
import { IconButton, Tooltip } from '@mui/material';
import MapIcon from '@mui/icons-material/Map';
import PropertyMap from './PropertyMap';
import { mockProperties } from '../mock/properties';

// Transform mock data to map properties
const mapProperties = mockProperties.map(property => ({
  id: property.id.toString(),
  title: property.title,
  price: `$${property.price.toLocaleString()}`,
  latitude: property.latitude,
  longitude: property.longitude,
  address: `${property.address}, ${property.city}, ${property.state}`,
  thumbnail: property.images[0]
}));

interface MapButtonProps {
  color?: string;
  size?: 'small' | 'medium' | 'large';
}

const MapButton: React.FC<MapButtonProps> = ({ 
  color = '#6366F1',
  size = 'medium'
}) => {
  const [isMapOpen, setIsMapOpen] = useState(false);

  const handleOpenMap = (event: React.MouseEvent<HTMLElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setIsMapOpen(true);
  };

  const handleCloseMap = () => {
    setIsMapOpen(false);
  };

  return (
    <>
      <Tooltip title="View on Map">
        <IconButton
          onClick={handleOpenMap}
          sx={{
            color: color,
            '&:hover': {
              bgcolor: 'rgba(99, 102, 241, 0.08)',
            },
          }}
          size={size}
        >
          <MapIcon />
        </IconButton>
      </Tooltip>

      <PropertyMap
        properties={mapProperties}
        isOpen={isMapOpen}
        onClose={handleCloseMap}
      />
    </>
  );
};

export default MapButton;
