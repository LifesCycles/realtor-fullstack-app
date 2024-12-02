import { useState, useEffect } from 'react';
import { 
  Container, 
  Grid, 
  Typography, 
  Box, 
  TextField, 
  InputAdornment, 
  useTheme, 
  useMediaQuery,
  ToggleButtonGroup,
  ToggleButton,
  Stack,
  Button,
  IconButton,
  Chip,
  Pagination,
  alpha
} from '@mui/material';
import { Search as SearchIcon, GridView, ViewList, Map as MapIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import PropertyCard from '../components/PropertyCard';
import PropertyListItem from '../components/PropertyListItem';
import PropertyMap from '../components/PropertyMap';
import BouncingHouses from '../components/BouncingHouses';
import { Property } from '../types/property';
import { mockProperties } from '../mock/properties';
import { useAppBackButton } from '../hooks/useAppBackButton';
import { useLocation } from 'react-router-dom';

type ViewMode = 'grid' | 'list';

const HomePage = () => {
  useAppBackButton();
  const location = useLocation();
  const [properties] = useState<Property[]>(mockProperties);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [isMapOpen, setIsMapOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(12);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const navigate = useNavigate();

  const filteredProperties = properties.filter(property =>
    property.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    property.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    property.address.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const startIndex = (page - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedProperties = filteredProperties.slice(startIndex, endIndex);

  const handleViewChange = (
    event: React.MouseEvent<HTMLElement>,
    newView: ViewMode | null,
  ): void => {
    if (newView !== null) {
      setViewMode(newView);
    }
  };

  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleItemsPerPageChange = (
    event: React.MouseEvent<HTMLElement>,
    newItemsPerPage: number | null
  ) => {
    if (newItemsPerPage !== null) {
      setItemsPerPage(newItemsPerPage);
      setPage(1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  useEffect(() => {
    setTotalPages(Math.ceil(filteredProperties.length / itemsPerPage));
    setPage(1);
  }, [filteredProperties.length, itemsPerPage]);

  return (
    <Box 
      sx={{ 
        minHeight: '100vh',
        bgcolor: (theme) => theme.palette.mode === 'dark' ? 'background.default' : '#F5F7FA',
        pt: 2
      }}
    >
      <Container maxWidth="lg">
        <Box 
          sx={{ 
            pt: { xs: 4, sm: 6, md: 8 },
            pb: { xs: 3, sm: 4, md: 6 },
            textAlign: 'center',
            background: 'linear-gradient(135deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.18) 100%)',
            backdropFilter: 'blur(8px)',
            borderRadius: { xs: '24px', sm: '32px' },
            mx: { xs: 2, sm: 3, md: 4 },
            position: 'relative',
            overflow: 'hidden',
            border: '1px solid rgba(255,255,255,0.12)',
            boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            touchAction: 'manipulation',
            WebkitTapHighlightColor: 'transparent',
            '&:active': {
              transform: 'scale(0.98)',
              boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
            }
          }}
        >
          <Box
            className="gradient-bg"
            sx={{
              position: 'absolute',
              top: '-50%',
              left: '-50%',
              width: '200%',
              height: '200%',
              background: 'linear-gradient(45deg, #2196F3, #45B7D1, #4ECDC4)',
              opacity: 0.12,
              animation: 'gradientMove 12s ease infinite',
              backgroundSize: '400% 400%',
              zIndex: 0,
              transform: 'rotate(-12deg)',
              filter: 'blur(20px)',
              '@keyframes gradientMove': {
                '0%': {
                  backgroundPosition: '0% 50%',
                  transform: 'rotate(-12deg) translateY(0)'
                },
                '50%': {
                  backgroundPosition: '100% 50%',
                  transform: 'rotate(-8deg) translateY(-20px)'
                },
                '100%': {
                  backgroundPosition: '0% 50%',
                  transform: 'rotate(-12deg) translateY(0)'
                }
              }
            }}
          />
          <Box
            sx={{
              position: 'relative',
              zIndex: 2,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: { xs: 2, sm: 3 },
              py: { xs: 3, sm: 4 }
            }}
          >
            <Typography
              variant="h1"
              sx={{
                fontWeight: 800,
                background: 'linear-gradient(90deg, #3498db, #2ecc71, #3498db)',
                backgroundSize: '200% 100%',
                animation: 'textShine 8s linear infinite',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                fontSize: { xs: '2.5rem', sm: '3.5rem', md: '4rem' },
                lineHeight: { xs: 1.2, sm: 1.3 },
                letterSpacing: { xs: '-0.03em', sm: '-0.02em' },
                textAlign: 'center',
                maxWidth: '90%',
                margin: '0 auto',
                textShadow: '0 2px 4px rgba(0,0,0,0.05)',
                transform: 'translateZ(0)',
                '@keyframes textShine': {
                  '0%': { backgroundPosition: '0% 50%' },
                  '100%': { backgroundPosition: '200% 50%' }
                }
              }}
            >
              Find Your Dream Home
            </Typography>
            <Typography variant="h4" component="h1" gutterBottom align="center" sx={{ fontWeight: 'bold' }}>
              Find your dream home
            </Typography>
            <Typography variant="subtitle1" align="center" sx={{ mb: 4 }}>
              Discover the perfect property that matches your lifestyle
            </Typography>
            <BouncingHouses 
              color="#3498db"
              active={location.pathname === '/' || location.pathname === '/buy'} 
              position="left"
            />
            <BouncingHouses 
              color="#2ecc71"
              active={location.pathname === '/rent'} 
              position="right"
            />
            <Box
              sx={{
                display: 'flex',
                gap: 1.5,
                flexWrap: 'wrap',
                justifyContent: 'center',
                px: { xs: 2, sm: 3 }
              }}
            >
              <Box sx={{ position: 'relative' }}>
                <Chip
                  label="Buy"
                  onClick={() => navigate('/')}
                  sx={{
                    position: 'relative',
                    bgcolor: 'rgba(52, 152, 219, 0.15)',
                    color: '#3498db',
                    fontSize: { xs: '0.9rem', sm: '1rem' },
                    fontWeight: 600,
                    py: 2,
                    px: { xs: 2, sm: 3 },
                    borderRadius: '12px',
                    zIndex: 1,
                    transition: 'transform 0.15s ease',
                    '&:active': {
                      transform: 'scale(0.98)'
                    }
                  }}
                />
              </Box>
              <Box sx={{ position: 'relative' }}>
                <Chip
                  label="Rent"
                  onClick={() => navigate('/rent')}
                  sx={{
                    position: 'relative',
                    bgcolor: 'rgba(46, 204, 113, 0.15)',
                    color: '#2ecc71',
                    fontSize: { xs: '0.9rem', sm: '1rem' },
                    fontWeight: 600,
                    py: 2,
                    px: { xs: 2, sm: 3 },
                    borderRadius: '12px',
                    zIndex: 1,
                    transition: 'transform 0.15s ease',
                    '&:active': {
                      transform: 'scale(0.98)'
                    }
                  }}
                />
              </Box>
            </Box>
          </Box>
        </Box>

        <Box sx={{ px: { xs: 2, sm: 0 }, mb: 3 }}>
          <Stack
            direction="row"
            spacing={2}
            alignItems="center"
            justifyContent="space-between"
            sx={{ maxWidth: '600px', mx: 'auto' }}
          >
            <TextField
              placeholder="Search properties by location, title, or description..."
              variant="outlined"
              fullWidth
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              sx={{
                backgroundColor: 'white',
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  '&:hover fieldset': {
                    borderColor: 'primary.main',
                  },
                },
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon color="action" />
                  </InputAdornment>
                ),
              }}
            />
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button
                variant="contained"
                startIcon={<MapIcon />}
                onClick={(e) => {
                  e.preventDefault();
                  setIsMapOpen(true);
                }}
                sx={{
                  height: '40px',
                  bgcolor: 'primary.main',
                  '&:hover': {
                    bgcolor: 'primary.dark',
                  },
                  display: { xs: 'none', sm: 'flex' }
                }}
              >
                Map View
              </Button>
              <IconButton
                color="primary"
                onClick={(e) => {
                  e.preventDefault();
                  setIsMapOpen(true);
                }}
                sx={{
                  display: { xs: 'flex', sm: 'none' },
                  bgcolor: 'white',
                  '&:hover': { bgcolor: 'white' }
                }}
              >
                <MapIcon />
              </IconButton>
              <ToggleButtonGroup
                value={viewMode}
                exclusive
                onChange={handleViewChange}
                aria-label="view mode"
                size="small"
              >
                <ToggleButton value="grid" aria-label="grid view">
                  <GridView />
                </ToggleButton>
                <ToggleButton value="list" aria-label="list view">
                  <ViewList />
                </ToggleButton>
              </ToggleButtonGroup>
            </Box>
          </Stack>
        </Box>

        <Box sx={{ py: 4 }}>
          {filteredProperties.length === 0 ? (
            <Typography textAlign="center" color="text.secondary">
              No properties found matching your search.
            </Typography>
          ) : viewMode === 'grid' ? (
            <Grid 
              container 
              spacing={{ xs: 2, sm: 3 }}
              columns={{ xs: 2, sm: 8, md: 12 }}
              sx={{
                margin: '0 auto',
                width: '100%',
                '& .MuiGrid-item': {
                  display: 'flex',
                  flexDirection: 'column',
                }
              }}
            >
              {paginatedProperties.map((property) => (
                <Grid 
                  item 
                  key={property.id} 
                  xs={1}
                  sm={4}
                  md={4}
                  sx={{
                    minWidth: { xs: '160px', sm: 'auto' }
                  }}
                >
                  <PropertyCard property={property} />
                </Grid>
              ))}
            </Grid>
          ) : (
            <Stack spacing={3}>
              {paginatedProperties.map((property) => (
                <PropertyListItem key={property.id} property={property} />
              ))}
            </Stack>
          )}
        </Box>

        <Stack 
          direction="column" 
          spacing={3} 
          alignItems="center" 
          sx={{ mt: 4, mb: 4 }}
        >
          <Stack 
            direction="row" 
            spacing={2} 
            alignItems="center"
            sx={{
              bgcolor: alpha(theme.palette.primary.main, 0.04),
              borderRadius: 2,
              p: 1
            }}
          >
            <Typography 
              variant="body2" 
              color="text.secondary"
              sx={{ 
                fontWeight: 500,
                display: { xs: 'none', sm: 'block' }
              }}
            >
              Show:
            </Typography>
            <ToggleButtonGroup
              value={itemsPerPage}
              exclusive
              onChange={handleItemsPerPageChange}
              size="small"
              sx={{
                '& .MuiToggleButton-root': {
                  px: 2,
                  py: 0.5,
                  border: 'none',
                  borderRadius: '8px !important',
                  color: 'text.secondary',
                  '&.Mui-selected': {
                    bgcolor: 'background.paper',
                    color: 'primary.main',
                    fontWeight: 600,
                    boxShadow: theme.shadows[1],
                    '&:hover': {
                      bgcolor: 'background.paper',
                    }
                  },
                  '&:hover': {
                    bgcolor: 'background.paper',
                  }
                }
              }}
            >
              <ToggleButton value={12}>12</ToggleButton>
              <ToggleButton value={24}>24</ToggleButton>
              <ToggleButton value={48}>48</ToggleButton>
            </ToggleButtonGroup>
          </Stack>

          <Pagination 
            count={totalPages}
            page={page}
            onChange={handlePageChange}
            color="primary"
            size="large"
            showFirstButton
            showLastButton
            sx={{
              '& .MuiPaginationItem-root': {
                color: 'text.primary',
              },
              '& .Mui-selected': {
                bgcolor: 'primary.main',
                color: 'white',
                '&:hover': {
                  bgcolor: 'primary.dark',
                },
              },
            }}
          />

          <Typography 
            variant="body2" 
            color="text.secondary"
            sx={{ fontWeight: 500 }}
          >
            Showing {startIndex + 1}-{Math.min(endIndex, filteredProperties.length)} of {filteredProperties.length} properties
          </Typography>
        </Stack>
      </Container>
      <PropertyMap
        properties={filteredProperties.map(property => ({
          id: property.id.toString(),
          title: property.title,
          price: `$${property.price.toLocaleString()}`,
          latitude: property.latitude,
          longitude: property.longitude,
          address: `${property.address}, ${property.city}`,
          thumbnail: property.images[0],
          pricePerSqFt: `$${Math.round(property.price / property.square_feet).toLocaleString()}/sq ft`,
          beds: property.bedrooms,
          baths: property.bathrooms,
          sqft: property.square_feet,
          type: property.property_type,
          status: property.listing_type
        }))}
        isOpen={isMapOpen}
        onClose={() => setIsMapOpen(false)}
        center={[39.8283, -98.5795]} // Geographic center of the United States
        zoom={4} // Zoom level to show entire US
      />
    </Box>
  );
};

export default HomePage;