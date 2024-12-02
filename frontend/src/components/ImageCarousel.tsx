import { Box, useTheme, useMediaQuery } from '@mui/material';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, EffectCreative } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-creative';

interface ImageCarouselProps {
  images: string[];
  alt: string;
  height?: string | number;
}

const ImageCarousel = ({ images, alt, height = 220 }: ImageCarouselProps) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Box 
      sx={{ 
        position: 'relative',
        overflow: 'hidden',
        height,
        '.swiper': {
          width: '100%',
          height: '100%',
          overflow: 'hidden',
          perspective: '1200px'
        },
        '.swiper-slide': {
          width: '100%',
          height: '100%',
          position: 'relative',
          overflow: 'hidden',
          backfaceVisibility: 'hidden',
          transformStyle: 'preserve-3d'
        },
        '.swiper-slide-shadow': {
          background: 'rgba(0, 0, 0, 0.15)'
        },
        '.swiper-wrapper': {
          transitionTimingFunction: 'ease-out'
        },
        '.swiper-button-next, .swiper-button-prev': {
          color: 'white',
          textShadow: '0 0 3px rgba(0,0,0,0.3)',
          width: { xs: '20px', sm: '24px' },
          height: { xs: '20px', sm: '24px' },
          '&:after': {
            fontSize: { xs: '12px', sm: '14px' },
            fontWeight: 'bold'
          },
          '&:hover': {
            transform: 'scale(1.1)',
            transition: 'transform 0.2s'
          },
          backgroundColor: 'rgba(0, 0, 0, 0.3)',
          borderRadius: '50%',
          padding: { xs: '10px', sm: '12px' }
        },
        '.swiper-button-next': {
          right: { xs: 4, sm: 8 }
        },
        '.swiper-button-prev': {
          left: { xs: 4, sm: 8 }
        },
        '.swiper-pagination': {
          bottom: '8px !important',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '6px'
        },
        '.swiper-pagination-bullet': {
          backgroundColor: 'white',
          opacity: 0.7,
          width: '8px',
          height: '8px',
          margin: '0 !important',
          borderRadius: '50%',
          transition: 'all 0.2s ease',
          border: '1px solid rgba(0,0,0,0.3)'
        },
        '.swiper-pagination-bullet-active': {
          opacity: 1,
          backgroundColor: 'white',
          transform: 'scale(1.2)',
          border: '1px solid rgba(0,0,0,0.5)'
        }
      }}
    >
      <Swiper
        modules={[Navigation, Pagination, EffectCreative]}
        spaceBetween={0}
        slidesPerView={1}
        navigation={true}
        pagination={{ 
          clickable: true,
          type: 'bullets'
        }}
        speed={600}
        resistance
        resistanceRatio={0.9}
        touchRatio={0.9}
        direction="horizontal"
        touchAngle={45}
        longSwipes
        longSwipesRatio={0.3}
        longSwipesMs={150}
        followFinger
        watchSlidesProgress
        grabCursor
        simulateTouch
        shortSwipes
        preventInteractionOnTransition={false}
        preventClicks={false}
        preventClicksPropagation={false}
        threshold={8}
        watchOverflow
        observer
        observeParents
        edgeSwipeDetection
        edgeSwipeThreshold={20}
        effect="creative"
        creativeEffect={{
          prev: {
            translate: ['-20%', 0, -1],
            opacity: 0
          },
          next: {
            translate: ['100%', 0, 0],
            opacity: 0
          }
        }}
      >
        {images.map((image, index) => (
          <SwiperSlide key={index}>
            <Box
              component="img"
              src={image}
              alt={`${alt} - Image ${index + 1}`}
              sx={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                userSelect: 'none',
                WebkitTouchCallout: 'none',
                WebkitUserSelect: 'none',
                WebkitTapHighlightColor: 'transparent',
                transform: 'translate3d(0, 0, 0)',
                willChange: 'transform',
                transition: 'transform 0.3s ease-out'
              }}
              draggable={false}
              loading="lazy"
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </Box>
  );
};

export default ImageCarousel;
