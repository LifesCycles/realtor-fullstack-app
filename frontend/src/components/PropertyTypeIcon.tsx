import React from 'react';
import {
  Home,
  Apartment,
  Villa,
  Business,
  House,
  HomeWork,
  Weekend
} from '@mui/icons-material';
import { SvgIconProps } from '@mui/material';

type PropertyType = 'Villa' | 'Penthouse' | 'Condo' | 'Townhouse' | 'House' | 'Apartment' | 'Studio';

interface PropertyTypeIconProps extends SvgIconProps {
  propertyType: PropertyType;
}

const PropertyTypeIcon: React.FC<PropertyTypeIconProps> = ({ propertyType, ...props }) => {
  const iconMap: Record<PropertyType, React.ReactElement> = {
    Villa: <Villa {...props} />,
    Penthouse: <Business {...props} />,
    Condo: <Apartment {...props} />,
    Townhouse: <HomeWork {...props} />,
    House: <House {...props} />,
    Apartment: <Home {...props} />,
    Studio: <Weekend {...props} />
  };

  return iconMap[propertyType] || <Home {...props} />;
};

export default PropertyTypeIcon;
