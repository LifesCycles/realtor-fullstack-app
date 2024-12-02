import { Box, Typography, Card, Grid, Chip } from '@mui/material';
import { Bed, Bathtub, SquareFoot, LocationOn } from '@mui/icons-material';
import { Link } from 'react-router-dom';
import { Property } from '../types/property';
import ImageCarousel from './ImageCarousel';
import PropertyTypeIcon from './PropertyTypeIcon';

interface PropertyListItemProps {
  property: Property;
}

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(price);
};

const PropertyListItem = ({ property }: PropertyListItemProps) => {
  const pricePerSqFt = Math.round(property.price / property.square_feet);

  return (
    <Card
      component={Link}
      to={`/property/${property.id}`}
      sx={{
        display: 'flex',
        flexDirection: { xs: 'column', sm: 'row' },
        width: '100%',
        textDecoration: 'none',
        borderRadius: { xs: 2, sm: 3 },
        overflow: 'hidden',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        '&:hover': {
          transform: { xs: 'none', sm: 'translateY(-4px)' },
          boxShadow: (theme) =>
            theme.palette.mode === 'dark'
              ? '0 8px 24px rgba(0,0,0,0.4)'
              : '0 8px 24px rgba(0,0,0,0.1)',
        },
        bgcolor: 'background.paper',
        position: 'relative',
      }}
    >
      <Box
        sx={{
          width: { xs: '100%', sm: '300px' },
          height: { xs: '200px', sm: '220px' },
          position: 'relative',
          flexShrink: 0,
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
            zIndex: 2,
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
              }
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
              }
            }}
          />
        </Box>
      </Box>

      <Box
        sx={{
          p: { xs: 2, sm: 3 },
          display: 'flex',
          flexDirection: 'column',
          flexGrow: 1,
          justifyContent: 'space-between',
        }}
      >
        <Box>
          <Typography
            variant="h6"
            component="h2"
            sx={{
              fontSize: { xs: '1.1rem', sm: '1.25rem' },
              fontWeight: 700,
              mb: 1,
              color: 'text.primary',
            }}
          >
            {property.title}
          </Typography>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 1 }}>
            <LocationOn sx={{ color: 'primary.main', fontSize: { xs: '1rem', sm: '1.2rem' } }} />
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{
                fontSize: { xs: '0.875rem', sm: '1rem' },
              }}
            >
              {property.address}, {property.city}
            </Typography>
          </Box>

          <Typography
            variant="h6"
            color="primary.main"
            sx={{
              fontSize: { xs: '1.25rem', sm: '1.5rem' },
              fontWeight: 700,
              mb: 0.5,
            }}
          >
            {formatPrice(property.price)}
          </Typography>

          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              fontSize: { xs: '0.875rem', sm: '1rem' },
              mb: 2,
            }}
          >
            {formatPrice(pricePerSqFt)}/sq ft
          </Typography>

          <Grid container spacing={3} sx={{ mb: 1 }}>
            <Grid item xs={4}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Bed sx={{ color: 'text.secondary', fontSize: { xs: '1.1rem', sm: '1.25rem' } }} />
                <Typography variant="body1" fontWeight="medium">
                  {property.bedrooms} Beds
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={4}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Bathtub sx={{ color: 'text.secondary', fontSize: { xs: '1.1rem', sm: '1.25rem' } }} />
                <Typography variant="body1" fontWeight="medium">
                  {property.bathrooms} Baths
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={4}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <SquareFoot sx={{ color: 'text.secondary', fontSize: { xs: '1.1rem', sm: '1.25rem' } }} />
                <Typography variant="body1" fontWeight="medium">
                  {property.square_feet.toLocaleString()} Sq Ft
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Card>
  );
};

export default PropertyListItem;
