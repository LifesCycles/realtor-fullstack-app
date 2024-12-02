import React, { useState } from 'react';
import { Box, Container, Paper, Typography, IconButton, Drawer, useTheme, useMediaQuery } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import PropertyMap from '../components/PropertyMap';
import 'leaflet/dist/leaflet.css';
import { mockProperties } from '../mock/properties';
import LocationOnIcon from '@mui/icons-material/LocationOn';

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

const MapView: React.FC = () => {
  const [selectedProperty, setSelectedProperty] = useState<string | undefined>();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const handlePropertySelect = (propertyId: string) => {
    setSelectedProperty(propertyId);
    if (isMobile) {
      setDrawerOpen(true);
    }
  };

  const drawerWidth = isMobile ? '100%' : '400px';

  return (
    <Box sx={{ 
      height: '100vh', 
      display: 'flex',
      bgcolor: '#1a1a1a'
    }}>
      {/* Map Container */}
      <Box sx={{ 
        flex: 1,
        position: 'relative',
        height: '100%'
      }}>
        <PropertyMap
          properties={mapProperties}
          selectedProperty={selectedProperty}
          onPropertySelect={handlePropertySelect}
          center={[25.7747, -80.1342]} // Miami Beach coordinates
          zoom={14}
        />
        
        {/* Mobile Menu Button */}
        {isMobile && (
          <IconButton
            sx={{
              position: 'absolute',
              top: 16,
              left: 16,
              bgcolor: 'rgba(30, 30, 30, 0.9)',
              backdropFilter: 'blur(8px)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              color: 'white',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
              '&:hover': { 
                bgcolor: 'rgba(40, 40, 40, 0.9)',
              },
              zIndex: 1000
            }}
            onClick={() => setDrawerOpen(true)}
          >
            <MenuIcon />
          </IconButton>
        )}
      </Box>

      {/* Property List Drawer */}
      <Drawer
        variant={isMobile ? 'temporary' : 'permanent'}
        anchor={isMobile ? 'bottom' : 'right'}
        open={isMobile ? drawerOpen : true}
        onClose={() => setDrawerOpen(false)}
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
            bgcolor: 'rgba(30, 30, 30, 0.98)',
            backdropFilter: 'blur(16px)',
            borderLeft: '1px solid rgba(255, 255, 255, 0.1)',
            color: 'white',
            ...(isMobile && {
              height: '75vh',
              borderTopLeftRadius: 16,
              borderTopRightRadius: 16,
              borderTop: '1px solid rgba(255, 255, 255, 0.1)',
            })
          },
        }}
      >
        <Box sx={{ 
          p: 3,
          height: '100%',
          overflow: 'auto'
        }}>
          <Typography variant="h5" sx={{ 
            mb: 3, 
            fontWeight: 600,
            background: 'linear-gradient(135deg, #6366F1 0%, #818CF8 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            Available Properties
          </Typography>
          
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {mapProperties.map(property => (
              <Paper
                key={property.id}
                elevation={0}
                sx={{
                  p: 2.5,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  borderRadius: 2,
                  bgcolor: selectedProperty === property.id 
                    ? 'rgba(99, 102, 241, 0.1)'
                    : 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid',
                  borderColor: selectedProperty === property.id 
                    ? 'rgba(99, 102, 241, 0.5)'
                    : 'rgba(255, 255, 255, 0.05)',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    bgcolor: 'rgba(99, 102, 241, 0.08)',
                    borderColor: 'rgba(99, 102, 241, 0.3)',
                  }
                }}
                onClick={() => handlePropertySelect(property.id)}
              >
                <Typography variant="h6" sx={{ 
                  color: '#6366F1',
                  fontWeight: selectedProperty === property.id ? 600 : 500,
                  mb: 1
                }}>
                  {property.price}
                </Typography>
                <Typography variant="body1" sx={{ 
                  color: 'rgba(255, 255, 255, 0.9)',
                  mb: 1 
                }}>
                  {property.title}
                </Typography>
                <Typography variant="body2" sx={{ 
                  color: 'rgba(255, 255, 255, 0.6)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 0.5
                }}>
                  <LocationOnIcon sx={{ fontSize: '1rem', color: '#6366F1' }} />
                  {property.address}
                </Typography>
              </Paper>
            ))}
          </Box>
        </Box>
      </Drawer>
    </Box>
  );
};

export default MapView;
