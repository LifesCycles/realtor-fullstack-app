import { useState } from 'react';
import { Card, CardContent, Typography, Box, Chip, Grid } from '@mui/material';
import { Link } from 'react-router-dom';
import { Property } from '../types/property';
import ImageCarousel from './ImageCarousel';
import PropertyMap from './PropertyMap';
import PropertyTypeIcon from './PropertyTypeIcon';
import { LocationOn, Bed, Bathtub, SquareFoot } from '@mui/icons-material';

interface PropertyCardProps {
  property: Property;
}

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0
  }).format(price);
};

const PropertyCard = ({ property }: PropertyCardProps) => {
  const pricePerSqFt = Math.round(property.price / property.square_feet);
  const [isMapOpen, setIsMapOpen] = useState(false);

  const handleOpenMap = (event: React.MouseEvent<HTMLElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setIsMapOpen(true);
  };

  return (
    <>
      <Card 
        component={Link} 
        to={`/property/${property.id}`}
        sx={{
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          width: '100%',
          textDecoration: 'none',
          borderRadius: { xs: 2, sm: 3 },
          overflow: 'hidden',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            transform: { xs: 'none', sm: 'translateY(-8px)' },
            boxShadow: (theme) => 
              theme.palette.mode === 'dark' 
                ? '0 20px 40px rgba(0,0,0,0.4)' 
                : '0 20px 40px rgba(0,0,0,0.1)',
          },
          bgcolor: 'background.paper',
          position: 'relative',
          boxShadow: (theme) => 
            theme.palette.mode === 'dark'
              ? '0 4px 12px rgba(0,0,0,0.3)'
              : '0 4px 12px rgba(0,0,0,0.05)',
        }}
      >
        <Box 
          sx={{ 
            position: 'relative',
            height: { xs: 180, sm: 220 }
          }}
        >
          <ImageCarousel 
            images={property.images}
            alt={property.title}
            height="100%"
          />
          <Box
            sx={{
              position: 'absolute',
              top: 8,
              left: 8,
              display: 'flex',
              gap: 1,
              flexWrap: 'wrap',
              zIndex: 2
            }}
          >
            <Chip
              label={property.listing_type}
              sx={{
                bgcolor: 'primary.main',
                color: 'white',
                fontWeight: 'bold',
                textTransform: 'uppercase',
                fontSize: { xs: '0.625rem', sm: '0.75rem' },
                height: { xs: 24, sm: 28 },
                '& .MuiChip-label': {
                  px: { xs: 1, sm: 1.5 }
                },
                boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
              }}
            />
            <Chip
              icon={<PropertyTypeIcon propertyType={property.property_type as any} sx={{ fontSize: { xs: 14, sm: 16 } }} />}
              label={property.property_type}
              sx={{
                bgcolor: 'rgba(255, 255, 255, 0.9)',
                fontWeight: 'medium',
                fontSize: { xs: '0.625rem', sm: '0.75rem' },
                height: { xs: 24, sm: 28 },
                '& .MuiChip-label': {
                  px: { xs: 1, sm: 1.5 }
                },
                boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
              }}
            />
          </Box>
        </Box>

        <CardContent 
          sx={{ 
            flexGrow: 1,
            p: { xs: 1.5, sm: 2.5 },
            '&:last-child': {
              pb: { xs: 1.5, sm: 2.5 }
            }
          }}
        >
          <Box sx={{ mb: 1 }}>
            <Typography 
              variant="h6" 
              component="h2"
              sx={{ 
                fontSize: { xs: '1rem', sm: '1.2rem' },
                fontWeight: 700,
                color: 'text.primary',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                lineHeight: 1.3,
                minHeight: { xs: '2.6em', sm: '3.2em' },
                mb: 1
              }}
            >
              {property.title}
            </Typography>

            <Box 
              onClick={handleOpenMap}
              sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 0.5, 
                mb: 1,
                cursor: 'pointer'
              }}
            >
              <LocationOn 
                sx={{ 
                  color: '#3498db', 
                  fontSize: { xs: '1rem', sm: '1.2rem' }
                }} 
              />
              <Typography 
                variant="body2" 
                sx={{
                  fontSize: { xs: '0.75rem', sm: '0.875rem' },
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
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
                {property.address}, {property.city}
              </Typography>
            </Box>

            <Typography 
              variant="h6" 
              color="primary.main" 
              sx={{ 
                fontSize: { xs: '1.1rem', sm: '1.25rem' },
                fontWeight: 700,
                mb: 1.5
              }}
            >
              {formatPrice(property.price)}
            </Typography>
            
            <Typography 
              variant="body2" 
              color="text.secondary"
              sx={{ 
                fontSize: { xs: '0.75rem', sm: '0.875rem' },
                mb: 1.5
              }}
            >
              {formatPrice(pricePerSqFt)}/sq ft
            </Typography>

            <Grid container spacing={3}>
              <Grid item xs={4}>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                    <Bed sx={{ fontSize: { xs: '1rem', sm: '1.2rem' }, color: 'text.secondary', mr: 0.5 }} />
                    <Typography variant="body2" fontWeight="medium" fontSize={{ xs: '0.75rem', sm: '0.875rem' }}>
                      {property.bedrooms}
                    </Typography>
                  </Box>
                  <Typography variant="caption" color="text.secondary" fontSize={{ xs: '0.625rem', sm: '0.75rem' }}>
                    Beds
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={4}>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                    <Bathtub sx={{ fontSize: { xs: '1rem', sm: '1.2rem' }, color: 'text.secondary', mr: 0.5 }} />
                    <Typography variant="body2" fontWeight="medium" fontSize={{ xs: '0.75rem', sm: '0.875rem' }}>
                      {property.bathrooms}
                    </Typography>
                  </Box>
                  <Typography variant="caption" color="text.secondary" fontSize={{ xs: '0.625rem', sm: '0.75rem' }}>
                    Baths
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={4}>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                    <SquareFoot sx={{ fontSize: { xs: '1rem', sm: '1.2rem' }, color: 'text.secondary', mr: 0.5 }} />
                    <Typography variant="body2" fontWeight="medium" fontSize={{ xs: '0.75rem', sm: '0.875rem' }}>
                      {property.square_feet.toLocaleString()}
                    </Typography>
                  </Box>
                  <Typography variant="caption" color="text.secondary" fontSize={{ xs: '0.625rem', sm: '0.75rem' }}>
                    Sq Ft
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Box>
        </CardContent>
      </Card>

      <PropertyMap
        properties={[{
          id: property.id.toString(),
          title: property.title,
          price: formatPrice(property.price),
          latitude: property.latitude,
          longitude: property.longitude,
          address: `${property.address}, ${property.city}`,
          thumbnail: property.images[0],
          pricePerSqFt: `${formatPrice(pricePerSqFt)}`,
          beds: property.bedrooms,
          baths: property.bathrooms,
          sqft: property.square_feet,
          type: property.property_type,
          status: property.listing_type
        }]}
        isOpen={isMapOpen}
        onClose={() => setIsMapOpen(false)}
        center={[property.latitude, property.longitude]}
        zoom={15}
      />
    </>
  );
};

export default PropertyCard;