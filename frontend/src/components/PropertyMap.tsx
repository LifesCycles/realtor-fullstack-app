/**
 * PropertyMap Component
 * 
 * Displays an interactive map with property markers using Leaflet.
 * Supports clustering, property selection, and responsive design.
 * 
 * @module PropertyMap
 */

import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { Icon } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Box, Paper, Typography, useTheme, useMediaQuery, Modal, IconButton, Chip, Grid } from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CloseIcon from '@mui/icons-material/Close';
import MapIcon from '@mui/icons-material/Map';
import TerrainIcon from '@mui/icons-material/Terrain';
import WaterIcon from '@mui/icons-material/Water';
import LandscapeIcon from '@mui/icons-material/Landscape';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import ForestIcon from '@mui/icons-material/Forest';
import BedIcon from '@mui/icons-material/Bed';
import BathtubIcon from '@mui/icons-material/Bathtub';
import SquareFootIcon from '@mui/icons-material/SquareFoot';
import HomeIcon from '@mui/icons-material/Home';
import ViewCarouselIcon from '@mui/icons-material/ViewCarousel';
import ViewListIcon from '@mui/icons-material/ViewList';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

/**
 * Interface for a Property
 * @interface Property
 */
interface Property {
  id: string;
  title: string;
  price: string;
  pricePerSqFt?: string;
  latitude: number;
  longitude: number;
  address: string;
  thumbnail?: string;
  images?: string[];
  beds?: number;
  baths?: number;
  sqft?: number;
  type?: string;
  status?: string;
  showCarousel?: boolean;
}

/**
 * Props for the PropertyMap component
 * @interface PropertyMapProps
 */
interface PropertyMapProps {
  /** Array of properties to display on the map */
  properties: Property[];
  /** Currently selected property */
  selectedProperty?: string;
  /** Callback when a property is selected */
  onPropertySelect?: (propertyId: string) => void;
  /** Center coordinates [lat, lng] */
  center?: [number, number];
  /** Map zoom level */
  zoom?: number;
  /** Whether the map modal is open */
  isOpen: boolean;
  /** Callback to close the map modal */
  onClose: () => void;
}

const mapStyles = {
  alidadeSmoothDark: {
    name: 'Dark',
    url: 'https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png',
    attribution: '&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>, &copy; <a href="https://openmaptiles.org/">OpenMapTiles</a> &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors',
    icon: <DarkModeIcon sx={{ fontSize: 20 }} />
  },
  alidadeSmooth: {
    name: 'Light',
    url: 'https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}{r}.png',
    attribution: '&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>, &copy; <a href="https://openmaptiles.org/">OpenMapTiles</a> &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors',
    icon: <LightModeIcon sx={{ fontSize: 20 }} />
  },
  stamenTerrain: {
    name: 'Terrain',
    url: 'https://tiles.stadiamaps.com/tiles/stamen_terrain/{z}/{x}/{y}{r}.png',
    attribution: '&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>, &copy; <a href="https://openmaptiles.org/">OpenMapTiles</a> &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors',
    icon: <TerrainIcon sx={{ fontSize: 20 }} />
  },
  stamenWatercolor: {
    name: 'Watercolor',
    url: 'https://tiles.stadiamaps.com/tiles/stamen_watercolor/{z}/{x}/{y}.jpg',
    attribution: '&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>, &copy; <a href="https://openmaptiles.org/">OpenMapTiles</a> &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors',
    icon: <WaterIcon sx={{ fontSize: 20 }} />
  },
  outdoors: {
    name: 'Outdoors',
    url: 'https://tiles.stadiamaps.com/tiles/outdoors/{z}/{x}/{y}{r}.png',
    attribution: '&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>, &copy; <a href="https://openmaptiles.org/">OpenMapTiles</a> &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors',
    icon: <ForestIcon sx={{ fontSize: 20 }} />
  },
  osmBright: {
    name: 'OSM',
    url: 'https://tiles.stadiamaps.com/tiles/osm_bright/{z}/{x}/{y}{r}.png',
    attribution: '&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>, &copy; <a href="https://openmaptiles.org/">OpenMapTiles</a> &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors',
    icon: <MapIcon sx={{ fontSize: 20 }} />
  }
};

/**
 * MapStyleSwitcher component
 * 
 * @component
 * @param {Object} props - Component props
 * @param {function} props.onStyleChange - Callback to change map style
 * @param {Object} props.currentStyle - Current map style
 * @returns {React.ReactElement} Rendered component
 */
const MapStyleSwitcher = ({ onStyleChange, currentStyle }) => {
  const [open, setOpen] = useState(false);

  return (
    <Box
      sx={{
        position: 'absolute',
        top: 12,
        left: 12,
        zIndex: 1000,
        display: 'flex',
        flexDirection: 'column',
        gap: 1,
        '& .map-style-button': {
          width: 32,
          height: 32,
          minWidth: 32,
          padding: 0,
          borderRadius: '50%',
          backgroundColor: 'rgba(0, 0, 0, 0.6)',
          backdropFilter: 'blur(8px)',
          color: 'white',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          transition: 'all 0.2s ease-in-out',
          opacity: open ? 1 : 0,
          transform: open ? 'scale(1)' : 'scale(0.8)',
          pointerEvents: open ? 'auto' : 'none',
          '&:hover': {
            backgroundColor: 'rgba(99, 102, 241, 0.8)',
          }
        }
      }}
    >
      <IconButton
        onClick={() => setOpen(!open)}
        sx={{
          width: 32,
          height: 32,
          backgroundColor: 'rgba(0, 0, 0, 0.6)',
          backdropFilter: 'blur(8px)',
          color: 'white',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          '&:hover': {
            backgroundColor: 'rgba(99, 102, 241, 0.8)',
          }
        }}
      >
        {currentStyle.icon}
      </IconButton>
      {Object.entries(mapStyles)
        .filter(([styleKey, style]) => style.name !== currentStyle.name)
        .map(([styleKey, style], index) => (
        <IconButton
          key={styleKey}
          className="map-style-button"
          onClick={() => {
            onStyleChange(mapStyles[styleKey]);
            setOpen(false);
          }}
          sx={{
            transitionDelay: `${index * 50}ms`
          }}
          title={style.name}
        >
          {style.icon}
        </IconButton>
      ))}
    </Box>
  );
};

/**
 * CarouselView component
 * 
 * @component
 * @param {Object} props - Component props
 * @param {string[]} props.images - Array of images to display
 * @param {string} props.title - Title of the carousel
 * @returns {React.ReactElement} Rendered component
 */
const CarouselView = ({ images, title }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handlePrevious = (e) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNext = (e) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  return (
    <Box sx={{
      position: 'relative',
      width: '100%',
      height: 110,
      overflow: 'hidden',
    }}>
      <Box sx={{
        position: 'relative',
        width: '100%',
        height: '100%',
        display: 'flex',
        transition: 'transform 0.3s ease-in-out',
      }}>
        <img 
          src={images[currentIndex]} 
          alt={`${title} - Image ${currentIndex + 1}`}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
          }}
        />
      </Box>

      {/* Navigation Controls */}
      <Box sx={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '0 4px',
        opacity: 0,
        transition: 'opacity 0.2s',
        '&:hover': {
          opacity: 1,
          bgcolor: 'rgba(0, 0, 0, 0.2)',
        }
      }}>
        <IconButton
          onClick={handlePrevious}
          size="small"
          sx={{
            color: 'white',
            bgcolor: 'rgba(0, 0, 0, 0.5)',
            '&:hover': {
              bgcolor: 'rgba(0, 0, 0, 0.7)',
            },
            padding: '4px',
          }}
        >
          <ChevronLeftIcon sx={{ fontSize: '1rem' }} />
        </IconButton>

        <IconButton
          onClick={handleNext}
          size="small"
          sx={{
            color: 'white',
            bgcolor: 'rgba(0, 0, 0, 0.5)',
            '&:hover': {
              bgcolor: 'rgba(0, 0, 0, 0.7)',
            },
            padding: '4px',
          }}
        >
          <ChevronRightIcon sx={{ fontSize: '1rem' }} />
        </IconButton>
      </Box>

      {/* Image Counter */}
      <Box sx={{
        position: 'absolute',
        bottom: 4,
        right: 4,
        bgcolor: 'rgba(0, 0, 0, 0.6)',
        color: 'white',
        fontSize: '0.65rem',
        padding: '2px 6px',
        borderRadius: '4px',
        fontWeight: 500,
      }}>
        {currentIndex + 1}/{images.length}
      </Box>
    </Box>
  );
};

/**
 * PropertyMap component
 * 
 * @component
 * @param {PropertyMapProps} props - Component props
 * @returns {React.ReactElement} Rendered component
 */
const PropertyMap: React.FC<PropertyMapProps> = ({
  properties,
  selectedProperty,
  onPropertySelect,
  center = [parseFloat(import.meta.env.VITE_DEFAULT_LAT || '25.7747'), 
           parseFloat(import.meta.env.VITE_DEFAULT_LNG || '-80.1342')], // Default to Miami Beach if not configured
  zoom = parseInt(import.meta.env.VITE_DEFAULT_ZOOM || '14'),
  isOpen,
  onClose
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [currentMapStyle, setCurrentMapStyle] = useState(mapStyles.alidadeSmoothDark);
  const [showCarousel, setShowCarousel] = useState(false);

  // Fix for default marker icons in React-Leaflet
  const markerIcon = new Icon({
    iconUrl: 'data:image/svg+xml;base64,' + btoa(`
      <svg width="24" height="32" viewBox="0 0 24 32" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceAlpha" stdDeviation="1.5"/>
            <feOffset dx="0" dy="1"/>
            <feComponentTransfer>
              <feFuncA type="linear" slope="0.4"/>
            </feComponentTransfer>
            <feMerge>
              <feMergeNode/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
          <linearGradient id="neon" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:#818cf8;stop-opacity:1" />
            <stop offset="100%" style="stop-color:#6366F1;stop-opacity:1" />
          </linearGradient>
        </defs>
        <g filter="url(#glow)">
          <path d="M12 0C5.4 0 0 5.4 0 12C0 21 12 32 12 32C12 32 24 21 24 12C24 5.4 18.6 0 12 0Z" fill="url(#neon)"/>
          <circle cx="12" cy="12" r="4" fill="white" fill-opacity="0.9"/>
        </g>
      </svg>
    `),
    iconSize: [24, 32],
    iconAnchor: [12, 32],
    popupAnchor: [0, -28],
    className: 'property-marker'
  });

  // Filter out properties without valid coordinates
  const validProperties = properties.filter(
    prop => typeof prop.latitude === 'number' && 
            typeof prop.longitude === 'number' && 
            !isNaN(prop.latitude) && 
            !isNaN(prop.longitude)
  );

  return (
    <Modal
      open={isOpen}
      onClose={onClose}
      aria-labelledby="map-modal"
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: isMobile ? 2 : 3,
      }}
    >
      <Box sx={{ 
        position: 'relative',
        width: isMobile ? '90%' : '80%',
        height: isMobile ? '70vh' : '80%',
        maxWidth: '1200px',
        maxHeight: '800px',
        bgcolor: '#1a1a1a',
        borderRadius: isMobile ? 2 : 2,
        boxShadow: 24,
        overflow: 'hidden',
        m: isMobile ? 2 : 'auto',
        '& .leaflet-container': {
          height: '100%',
          width: '100%',
          zIndex: 1,
          background: '#242424'
        },
        '& .property-popup': {
          minWidth: '220px'
        },
        '& .leaflet-popup-content-wrapper': {
          backgroundColor: 'rgba(30, 30, 30, 0.95)',
          backdropFilter: 'blur(8px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '12px',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
        },
        '& .leaflet-popup-content': {
          margin: '0',
          color: '#fff'
        },
        '& .leaflet-popup-tip': {
          backgroundColor: 'rgba(30, 30, 30, 0.95)',
          borderTop: '1px solid rgba(255, 255, 255, 0.1)',
        },
        '& .leaflet-control-attribution': {
          display: 'none'
        }
      }}>
        <IconButton
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: 'white',
            bgcolor: 'rgba(0, 0, 0, 0.5)',
            zIndex: 2,
            '&:hover': {
              bgcolor: 'rgba(0, 0, 0, 0.7)',
            }
          }}
        >
          <CloseIcon />
        </IconButton>

        <MapContainer
          center={center}
          zoom={zoom}
          scrollWheelZoom={true}
          style={{ height: '100%', width: '100%' }}
          zoomControl={!isMobile}
        >
          <MapStyleSwitcher onStyleChange={setCurrentMapStyle} currentStyle={currentMapStyle} />
          
          {/* Carousel Toggle Button */}
          <Box sx={{
            position: 'absolute',
            bottom: 16,
            left: 16,
            zIndex: 1000,
            bgcolor: 'rgba(17, 17, 17, 0.85)',
            borderRadius: '8px',
            backdropFilter: 'blur(8px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
          }}>
            <IconButton
              onClick={() => setShowCarousel(!showCarousel)}
              sx={{
                color: 'white',
                '&:hover': {
                  bgcolor: 'rgba(255, 255, 255, 0.1)',
                }
              }}
            >
              {showCarousel ? <ViewListIcon /> : <ViewCarouselIcon />}
            </IconButton>
          </Box>

          <TileLayer
            url={currentMapStyle.url}
            attribution={currentMapStyle.attribution}
            maxZoom={20}
            tileSize={256}
          />
          {validProperties.map((property) => (
            <Marker
              key={property.id}
              position={[property.latitude, property.longitude]}
              icon={markerIcon}
              eventHandlers={{
                click: () => onPropertySelect?.(property.id),
              }}
            >
              <Popup className="property-popup" closeButton={false}>
                <Box sx={{
                  width: 220,
                  bgcolor: 'rgba(17, 17, 17, 0.95)',
                  backdropFilter: 'blur(12px)',
                  borderRadius: 2,
                  overflow: 'hidden',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                }}>
                  <Box sx={{ position: 'relative' }}>
                    {property.images && property.images.length > 0 ? (
                      showCarousel ? (
                        <CarouselView images={property.images} title={property.title} />
                      ) : (
                        <Box sx={{
                          position: 'relative',
                          width: '100%',
                          height: 110,
                          overflow: 'hidden',
                          '& img': {
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                            transition: 'transform 0.3s ease-in-out'
                          }
                        }}>
                          <img src={property.images[0]} alt={property.title} />
                        </Box>
                      )
                    ) : property.thumbnail && (
                      <Box sx={{
                        position: 'relative',
                        width: '100%',
                        height: 110,
                        overflow: 'hidden',
                        '& img': {
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                          transition: 'transform 0.3s ease-in-out'
                        }
                      }}>
                        <img src={property.thumbnail} alt={property.title} />
                      </Box>
                    )}
                    <Box sx={{
                      position: 'absolute',
                      top: 8,
                      left: 8,
                      display: 'flex',
                      gap: 0.5,
                      zIndex: 1
                    }}>
                      {property.status && (
                        <Chip
                          label={property.status}
                          size="small"
                          sx={{
                            bgcolor: 'rgba(17, 17, 17, 0.85)',
                            backdropFilter: 'blur(4px)',
                            color: '#fff',
                            fontSize: '0.65rem',
                            height: 18,
                            px: 0.5
                          }}
                        />
                      )}
                      {property.type && (
                        <Chip
                          icon={<HomeIcon sx={{ fontSize: '0.8rem', color: '#fff' }} />}
                          label={property.type}
                          size="small"
                          sx={{
                            bgcolor: 'rgba(17, 17, 17, 0.85)',
                            backdropFilter: 'blur(4px)',
                            color: '#fff',
                            fontSize: '0.65rem',
                            height: 18,
                            px: 0.5,
                            '& .MuiChip-icon': {
                              color: '#fff',
                              fontSize: '0.8rem',
                              ml: '2px'
                            }
                          }}
                        />
                      )}
                    </Box>
                  </Box>
                  <Box sx={{ p: 1.25 }}>
                    <Typography sx={{
                      color: '#fff',
                      fontWeight: 600,
                      fontSize: '0.85rem',
                      mb: 0.5,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                      letterSpacing: '0.2px'
                    }}>
                      {property.title}
                    </Typography>
                    <Typography sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 0.5,
                      color: 'rgba(255, 255, 255, 0.7)',
                      fontSize: '0.75rem',
                      mb: 0.75,
                      letterSpacing: '0.1px'
                    }}>
                      <LocationOnIcon sx={{ fontSize: '0.85rem' }} />
                      <Box 
                        component="span" 
                        sx={{
                          background: 'linear-gradient(90deg, #3498db, #2ecc71, #3498db)',
                          WebkitBackgroundClip: 'text',
                          WebkitTextFillColor: 'transparent',
                          backgroundSize: '200% 100%',
                          animation: `gradient ${15 + Math.random() * 10}s linear infinite`,
                          '@keyframes gradient': {
                            '0%': {
                              backgroundPosition: '0% 50%'
                            },
                            '100%': {
                              backgroundPosition: '200% 50%'
                            }
                          }
                        }}
                      >
                        {property.address}
                      </Box>
                    </Typography>
                    <Typography sx={{
                      color: '#6366F1',
                      fontWeight: 700,
                      fontSize: '0.95rem',
                      mb: 0.25,
                      letterSpacing: '0.3px'
                    }}>
                      {property.price}
                    </Typography>
                    {property.pricePerSqFt && (
                      <Typography sx={{
                        color: 'rgba(255, 255, 255, 0.5)',
                        fontSize: '0.7rem',
                        mb: 0.75,
                        letterSpacing: '0.2px'
                      }}>
                        {property.pricePerSqFt}/sq ft
                      </Typography>
                    )}
                    <Grid container spacing={1} sx={{ mt: 0.5 }}>
                      {property.beds && (
                        <Grid item xs={4}>
                          <Box sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 0.3,
                            color: 'rgba(255, 255, 255, 0.9)'
                          }}>
                            <BedIcon sx={{ fontSize: '0.85rem' }} />
                            <Typography sx={{ 
                              fontSize: '0.75rem',
                              fontWeight: 500,
                              letterSpacing: '0.2px'
                            }}>
                              {property.beds}
                            </Typography>
                          </Box>
                        </Grid>
                      )}
                      {property.baths && (
                        <Grid item xs={4}>
                          <Box sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 0.3,
                            color: 'rgba(255, 255, 255, 0.9)'
                          }}>
                            <BathtubIcon sx={{ fontSize: '0.85rem' }} />
                            <Typography sx={{ 
                              fontSize: '0.75rem',
                              fontWeight: 500,
                              letterSpacing: '0.2px'
                            }}>
                              {property.baths}
                            </Typography>
                          </Box>
                        </Grid>
                      )}
                      {property.sqft && (
                        <Grid item xs={4}>
                          <Box sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 0.3,
                            color: 'rgba(255, 255, 255, 0.9)'
                          }}>
                            <SquareFootIcon sx={{ fontSize: '0.85rem' }} />
                            <Typography sx={{ 
                              fontSize: '0.75rem',
                              fontWeight: 500,
                              letterSpacing: '0.2px'
                            }}>
                              {property.sqft}
                            </Typography>
                          </Box>
                        </Grid>
                      )}
                    </Grid>
                  </Box>
                </Box>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </Box>
    </Modal>
  );
};

export default PropertyMap;
