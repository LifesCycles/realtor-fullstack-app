import React, { useEffect, useState } from 'react';
import { Box, useTheme, useMediaQuery } from '@mui/material';
import { keyframes } from '@emotion/react';
import styled from '@emotion/styled';

interface House {
  id: number;
  left: number;
  delay: number;
  scale: number;
}

interface BouncingHousesProps {
  active: boolean;
  color: string;
  position: 'left' | 'right';
}

const bounceAndScale = keyframes`
  0% {
    transform: translateY(20px) scale(0.4);
    opacity: 0;
  }
  50% {
    transform: translateY(-10px) scale(1.1);
    opacity: 0.9;
  }
  75% {
    transform: translateY(5px) scale(0.95);
    opacity: 1;
  }
  100% {
    transform: translateY(0) scale(1);
    opacity: 1;
  }
`;

const pulseScale = keyframes`
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
  100% {
    transform: scale(1);
  }
`;

const HouseIcon = styled.div<{ 
  delay: number; 
  color: string; 
  isMobile: boolean;
  scale: number;
}>`
  position: absolute;
  bottom: 0;
  width: ${props => props.isMobile ? '20px' : '24px'};
  height: ${props => props.isMobile ? '20px' : '24px'};
  opacity: 0;
  animation: 
    ${bounceAndScale} 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) forwards,
    ${pulseScale} 1s ease-in-out infinite;
  animation-delay: ${props => props.delay}s, ${props => props.delay + 0.5}s;
  transform-origin: bottom center;

  &::before {
    content: '🏠';
    font-size: ${props => (props.isMobile ? 16 : 20) * props.scale}px;
    position: absolute;
    filter: drop-shadow(0 2px 2px rgba(0, 0, 0, 0.2));
    color: ${props => props.color};
    transform: scale(${props => props.scale}) translateY(${props => props.scale === 0.8 ? '6px' : '0'});
    transform-origin: bottom center;
  }
`;

const BouncingHouses: React.FC<BouncingHousesProps> = ({ active, color, position }) => {
  const [houses, setHouses] = useState<House[]>([]);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  useEffect(() => {
    if (active) {
      const spacing = 6; // Spacing between houses in percentage
      // Keep left at 30, move right position from 70 to 60
      const centerPosition = position === 'left' ? 30 : 60;
      
      // Create 3 houses with the middle one larger and centered
      const newHouses = [
        {
          id: 0,
          left: centerPosition - spacing - 2,
          delay: 0,
          scale: 0.8,
        },
        {
          id: 1,
          left: centerPosition,
          delay: 0.1,
          scale: 1.2,
        },
        {
          id: 2,
          left: centerPosition + spacing + 2,
          delay: 0.2,
          scale: 0.8,
        },
      ];
      setHouses(newHouses);
    } else {
      setHouses([]);
    }
  }, [active, isMobile, position]);

  return (
    <Box
      sx={{
        position: 'absolute',
        bottom: { xs: '-25px', sm: '-30px' }, 
        left: 0,
        width: '100%',
        height: { xs: '24px', sm: '28px' },
        pointerEvents: 'none',
        zIndex: 1,
      }}
    >
      {houses.map((house) => (
        <HouseIcon
          key={house.id}
          style={{
            left: `${house.left}%`,
          }}
          delay={house.delay}
          color={color}
          isMobile={isMobile}
          scale={house.scale}
        />
      ))}
    </Box>
  );
};

export default BouncingHouses;
