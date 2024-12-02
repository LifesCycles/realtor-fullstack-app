import { useState, useEffect } from 'react';
import { useParams, Link as RouterLink } from 'react-router-dom';
import { Container, Typography, Box, Paper, Chip, CircularProgress, useTheme, useMediaQuery, Divider } from '@mui/material';
import { Link as MuiLink } from '@mui/material';
import { Grid } from '@mui/material';
import { Bed, Bathtub, SquareFoot, Home, Sell, LocationOn, CalendarMonth, ThreeSixty } from '@mui/icons-material';

// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';
// Import Swiper core and required modules
import { Navigation, Pagination, EffectCreative } from 'swiper/modules';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-creative';

import VirtualTour from '../components/VirtualTour';
import { Property } from '../types/property';
import { mockProperties } from '../mock/properties';
import { mockRentalProperties } from '../mock/rentalProperties';

const PropertyDetailPage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { id } = useParams<{ id: string }>();
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadedImages, setLoadedImages] = useState<Set<string>>(new Set());
  const [failedImages, setFailedImages] = useState<Set<string>>(new Set());
  const [showVirtualTour, setShowVirtualTour] = useState(false);

  useEffect(() => {
    if (!property) return;

    const preloadImages = async () => {
      const imagePromises = property.images.map((imageUrl) => {
        return new Promise((resolve) => {
          const img = new Image();
          img.onload = () => {
            setLoadedImages(prev => new Set(prev).add(imageUrl));
            resolve(true);
          };
          img.onerror = () => {
            console.error(`Failed to load image: ${imageUrl}`);
            setFailedImages(prev => new Set(prev).add(imageUrl));
            resolve(false);
          };
          img.src = imageUrl;
        });
      });

      await Promise.all(imagePromises);
    };

    preloadImages();
  }, [property]);

  useEffect(() => {
    const fetchProperty = () => {
      try {
        if (id) {
          const numericId = parseInt(id);
          // First try to find in sale properties
          let foundProperty = mockProperties.find(p => p.id === numericId);
          
          // If not found, try rental properties
          if (!foundProperty) {
            foundProperty = mockRentalProperties.find(p => p.id === numericId);
          }

          if (foundProperty) {
            setProperty(foundProperty);
          } else {
            console.warn(`Property with ID ${numericId} not found in either sales or rental listings`);
            setProperty(null);
          }
        }
      } catch (error) {
        console.error('Error fetching property:', error);
        setProperty(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProperty();
  }, [id]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress />
      </Box>
    );
  }

  if (!property) {
    return (
      <Container>
        <Typography variant="h5" color="error" textAlign="center" mt={4}>
          Property not found
        </Typography>
      </Container>
    );
  }

  return (
    <Box 
      sx={{ 
        minHeight: '100vh',
        bgcolor: (theme) => theme.palette.mode === 'dark' ? 'background.default' : '#FAFBFF',
        py: { xs: 3, sm: 5 }
      }}
    >
      <Container maxWidth="lg">
        {/* Back Button */}
        <Box sx={{ mb: 4 }}>
          <MuiLink
            component={RouterLink}
            to="/"
            sx={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 1,
              color: 'text.secondary',
              textDecoration: 'none',
              fontSize: '0.95rem',
              fontWeight: 500,
              transition: 'all 0.2s ease-in-out',
              '&:hover': {
                color: 'primary.main',
                transform: 'translateX(-4px)'
              }
            }}
          >
            ← Return to Property Listings
          </MuiLink>
        </Box>

        {/* Property Header */}
        <Box sx={{ mb: 5 }}>
          <Typography 
            variant="h3" 
            component="h1" 
            gutterBottom
            sx={{ 
              fontWeight: 700,
              fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' },
              mb: 2,
              letterSpacing: '-0.02em',
              background: 'linear-gradient(45deg, #1a237e 30%, #0d47a1 90%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            {property.title}
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
            <LocationOn sx={{ color: 'primary.main', fontSize: '1.5rem' }} />
            <Typography 
              variant="h6" 
              sx={{ 
                color: 'text.secondary',
                letterSpacing: '0.02em',
                fontWeight: 500,
                fontSize: { xs: '1rem', sm: '1.1rem' }
              }}
            >
              {property.address}, {property.city}, {property.state} {property.zip_code}
            </Typography>
          </Box>
          <Box sx={{ 
            display: 'flex', 
            gap: 2, 
            flexWrap: 'wrap',
            '& .MuiChip-root': {
              px: 2,
              height: 36,
              fontSize: '0.95rem',
              fontWeight: 600,
              backdropFilter: 'blur(8px)',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              '&:hover': {
                transform: 'translateY(-3px) scale(1.02)',
                boxShadow: '0 10px 20px rgba(0,0,0,0.12)'
              }
            }
          }}>
            <Chip 
              label={`$${property.price.toLocaleString()}`}
              sx={{
                background: 'linear-gradient(135deg, #2193b0 0%, #6dd5ed 100%)',
                color: 'white',
                fontSize: '1.1rem',
                height: 42,
                border: '2px solid rgba(255,255,255,0.2)',
                '& .MuiChip-icon': {
                  color: 'white !important',
                  fontSize: '1.3rem',
                  animation: 'pulse 2s infinite'
                },
                '@keyframes pulse': {
                  '0%': {
                    transform: 'scale(1)',
                    opacity: 1
                  },
                  '50%': {
                    transform: 'scale(1.1)',
                    opacity: 0.8
                  },
                  '100%': {
                    transform: 'scale(1)',
                    opacity: 1
                  }
                }
              }}
              icon={<Sell sx={{ transform: 'rotate(-15deg)' }} />}
            />
            <Chip 
              label={property.listing_type}
              sx={{
                background: property.listing_type.toLowerCase() === 'for sale' 
                  ? 'linear-gradient(135deg, #FF416C 0%, #FF4B2B 100%)'
                  : 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)',
                color: 'white',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                border: '2px solid rgba(255,255,255,0.2)',
                animation: 'slideIn 0.5s ease-out',
                '@keyframes slideIn': {
                  from: {
                    opacity: 0,
                    transform: 'translateX(-20px)'
                  },
                  to: {
                    opacity: 1,
                    transform: 'translateX(0)'
                  }
                }
              }}
            />
            <Chip 
              label={property.property_type}
              sx={{
                background: 'linear-gradient(135deg, #8E2DE2 0%, #4A00E0 100%)',
                color: 'white',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                border: '2px solid rgba(255,255,255,0.2)',
                animation: 'slideIn 0.5s ease-out 0.1s',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 100%)',
                  borderRadius: 'inherit',
                  transition: 'opacity 0.3s ease',
                  opacity: 0
                },
                '&:hover::before': {
                  opacity: 1
                }
              }}
            />
            <Chip 
              icon={<CalendarMonth sx={{ color: 'inherit !important' }} />}
              label={`Listed ${new Date(property.listDate).toLocaleDateString('en-US', { 
                month: 'long',
                day: 'numeric',
                year: 'numeric'
              })}`}
              variant="outlined"
              sx={{
                borderWidth: 2,
                borderColor: 'rgba(0,0,0,0.12)',
                background: 'rgba(255,255,255,0.8)',
                backdropFilter: 'blur(8px)',
                color: 'text.primary',
                '& .MuiChip-icon': {
                  color: 'inherit',
                  transition: 'transform 0.3s ease',
                },
                '&:hover .MuiChip-icon': {
                  transform: 'rotate(15deg)'
                }
              }}
            />
          </Box>
        </Box>

        {/* Image Gallery */}
        <Paper 
          elevation={0}
          sx={{ 
            borderRadius: { xs: 3, sm: 4 },
            overflow: 'hidden',
            mb: 5,
            bgcolor: 'background.paper',
            position: 'relative',
            border: '1px solid',
            borderColor: 'divider',
            boxShadow: '0 10px 40px -10px rgba(0,0,0,0.1)'
          }}
        >
          <Box
            sx={{
              position: 'relative',
              height: { xs: 300, sm: 400, md: 500 },
              '.swiper': {
                width: '100%',
                height: '100%'
              },
              '.swiper-slide': {
                width: '100%',
                height: '100%',
                position: 'relative'
              },
            }}
          >
            <Box 
              sx={{
                '--swiper-navigation-size': isMobile ? '20px' : '25px',
                '--swiper-pagination-bullet-size': isMobile ? '6px' : '8px',
                '& .swiper-button-next, & .swiper-button-prev': {
                  color: 'primary.main',
                  opacity: 0.8,
                  transition: 'opacity 0.2s ease-in-out',
                  '&:hover': {
                    opacity: 1
                  }
                },
                '& .swiper-pagination-bullet': {
                  backgroundColor: 'primary.main',
                  opacity: 0.6,
                  '&.swiper-pagination-bullet-active': {
                    opacity: 1
                  }
                }
              }}
            >
              <Swiper
                modules={[Navigation, Pagination, EffectCreative]}
                spaceBetween={0}
                slidesPerView={1}
                navigation={{
                  enabled: !isMobile,
                  hideOnClick: true
                }}
                pagination={{ 
                  clickable: true,
                  type: 'bullets',
                  dynamicBullets: true
                }}
                speed={600}
                resistance={true}
                resistanceRatio={0.85}
                touchRatio={1}
                touchAngle={45}
                effect="creative"
                creativeEffect={{
                  prev: {
                    translate: ['-30%', 0, -1],
                    opacity: 0,
                    scale: 0.9,
                  },
                  next: {
                    translate: ['100%', 0, 0],
                    opacity: 0,
                    scale: 0.9,
                  },
                }}
                grabCursor={true}
                observer={true}
                observeParents={true}
                preventInteractionOnTransition={false}
                watchSlidesProgress={true}
              >
                {property.images
                  .filter(image => !failedImages.has(image))
                  .map((image, index) => (
                  <SwiperSlide key={index}>
                    {!loadedImages.has(image) ? (
                      <Box
                        sx={{
                          width: '100%',
                          height: '100%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          bgcolor: 'action.hover'
                        }}
                      >
                        <CircularProgress />
                      </Box>
                    ) : (
                      <Box
                        component="img"
                        src={image}
                        alt={`${property.title} - Image ${index + 1}`}
                        sx={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                          userSelect: 'none'
                        }}
                      />
                    )}
                  </SwiperSlide>
                ))}
              </Swiper>
            </Box>
          </Box>
        </Paper>

        {/* Virtual Tour Button */}
        <Box sx={{ mb: 5 }}>
          <Paper
            sx={{
              p: 3.5,
              borderRadius: 3,
              cursor: 'pointer',
              transition: 'all 0.3s ease-in-out',
              '&:hover': {
                transform: 'translateY(-3px)',
                boxShadow: '0 12px 30px rgba(0,0,0,0.08)'
              },
              display: 'flex',
              alignItems: 'center',
              gap: 3,
              bgcolor: 'background.paper',
              backgroundImage: 'linear-gradient(135deg, rgba(25,118,210,0.05), rgba(25,118,210,0))',
              border: '1px solid',
              borderColor: 'divider'
            }}
            elevation={0}
            onClick={() => setShowVirtualTour(true)}
          >
            <ThreeSixty sx={{ fontSize: 48, color: 'primary.main' }} />
            <Box>
              <Typography variant="h5" sx={{ fontWeight: 600, mb: 0.5, letterSpacing: '-0.01em' }}>
                Experience Virtual Tour
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ letterSpacing: '0.01em' }}>
                Step inside with our immersive 3D walkthrough
              </Typography>
            </Box>
          </Paper>
        </Box>

        {/* Virtual Tour Modal */}
        <VirtualTour
          open={showVirtualTour}
          onClose={() => setShowVirtualTour(false)}
          title={property.title}
          thumbnailUrl={property.images[0]}
        />

        {/* Property Details Grid */}
        <Grid container spacing={4}>
          {/* Left Column - Main Details */}
          <Grid item xs={12} md={8}>
            <Paper 
              elevation={0}
              sx={{ 
                p: { xs: 3, sm: 4 }, 
                borderRadius: 3,
                mb: 4,
                background: 'linear-gradient(to bottom right, #FFFFFF, #FAFBFF)',
                border: '1px solid',
                borderColor: 'divider',
                boxShadow: '0 10px 40px -10px rgba(0,0,0,0.1)'
              }}
            >
              <Typography 
                variant="h4" 
                gutterBottom 
                sx={{ 
                  fontWeight: 700,
                  color: 'text.primary',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 2,
                  mb: 4,
                  letterSpacing: '-0.02em',
                  '&::after': {
                    content: '""',
                    flexGrow: 1,
                    height: '2px',
                    background: 'linear-gradient(to right, rgba(25,118,210,0.2), rgba(25,118,210,0))',
                    ml: 2
                  }
                }}
              >
                Property Overview
              </Typography>
              <Typography 
                variant="body1" 
                sx={{ 
                  mb: 4, 
                  color: 'text.secondary',
                  lineHeight: 1.8,
                  letterSpacing: '0.01em',
                  fontSize: '1.05rem'
                }}
              >
                {property.description}
              </Typography>
              
              <Divider sx={{ my: 4 }} />
              
              <Typography 
                variant="h4" 
                gutterBottom 
                sx={{ 
                  fontWeight: 700,
                  color: 'text.primary',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 2,
                  mb: 4,
                  letterSpacing: '-0.02em',
                  '&::after': {
                    content: '""',
                    flexGrow: 1,
                    height: '2px',
                    background: 'linear-gradient(to right, rgba(25,118,210,0.2), rgba(25,118,210,0))',
                    ml: 2
                  }
                }}
              >
                Key Features
              </Typography>
              <Grid container spacing={3} sx={{ mb: 2 }}>
                {[
                  { icon: Bed, label: 'Bedrooms', value: property.bedrooms },
                  { icon: Bathtub, label: 'Bathrooms', value: property.bathrooms },
                  { icon: SquareFoot, label: 'Square Feet', value: `${property.square_feet.toLocaleString()} sq ft` },
                  { icon: Home, label: 'Property Type', value: property.property_type }
                ].map((detail, index) => (
                  <Grid item xs={6} sm={3} key={index}>
                    <Box 
                      sx={{ 
                        display: 'flex', 
                        flexDirection: 'column',
                        alignItems: 'center',
                        textAlign: 'center',
                        gap: 1.5,
                        p: 3,
                        borderRadius: 3,
                        bgcolor: 'background.paper',
                        border: '1px solid',
                        borderColor: 'divider',
                        transition: 'all 0.2s ease-in-out',
                        '&:hover': {
                          transform: 'translateY(-2px)',
                          boxShadow: '0 8px 24px rgba(0,0,0,0.06)'
                        }
                      }}
                    >
                      <detail.icon sx={{ color: 'primary.main', fontSize: 32 }} />
                      <Box>
                        <Typography 
                          variant="h6" 
                          sx={{ 
                            fontWeight: 700,
                            color: 'text.primary',
                            mb: 0.5,
                            fontSize: '1.25rem'
                          }}
                        >
                          {detail.value}
                        </Typography>
                        <Typography 
                          variant="body2" 
                          color="text.secondary"
                          sx={{ fontSize: '0.9rem' }}
                        >
                          {detail.label}
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </Paper>
          </Grid>

          {/* Right Column - Price and Contact */}
          <Grid item xs={12} md={4}>
            <Paper 
              elevation={0}
              sx={{ 
                p: 4, 
                borderRadius: 3, 
                mb: 3, 
                position: 'sticky', 
                top: 24,
                border: '1px solid',
                borderColor: 'divider',
                background: 'linear-gradient(135deg, #FFFFFF, #FAFBFF)',
                boxShadow: '0 10px 40px -10px rgba(0,0,0,0.1)'
              }}
            >
              <Typography 
                variant="h4" 
                gutterBottom 
                sx={{ 
                  fontWeight: 700,
                  color: 'text.primary',
                  display: 'flex',
                  alignItems: 'baseline',
                  gap: 1
                }}
              >
                ${property.price.toLocaleString()}
                <Typography 
                  component="span" 
                  variant="body2" 
                  sx={{ 
                    color: 'text.secondary',
                    fontWeight: 'normal' 
                  }}
                >
                  ${Math.round(property.price / property.square_feet).toLocaleString()}/ft²
                </Typography>
              </Typography>

              <Box sx={{ mt: 3 }}>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  Listed by
                </Typography>
                <Typography variant="body1" fontWeight="medium">
                  Luxury Real Estate Group
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Contact: (555) 123-4567
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Email: contact@luxuryrealestate.com
                </Typography>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default PropertyDetailPage;