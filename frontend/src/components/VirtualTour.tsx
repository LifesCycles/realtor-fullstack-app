import React from 'react';
import { Dialog, DialogContent, IconButton, Box, Typography } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

interface VirtualTourProps {
  open: boolean;
  onClose: () => void;
  title: string;
  thumbnailUrl: string;
}

const VirtualTour: React.FC<VirtualTourProps> = ({ open, onClose, title }) => {
  // Kuula virtual tour scenes
  const demoScenes = [
    {
      title: 'Living Room',
      url: 'https://kuula.co/share/57LNl?logo=1&info=1&fs=1&vr=0&zoom=0.1&gyro=0&autorotate=0.3&thumbs=1'
    },
    {
      title: 'Kitchen',
      url: 'https://kuula.co/share/7bKB1?logo=1&info=1&fs=1&vr=0&zoom=0.1&gyro=0&autorotate=0.3&thumbs=1'
    },
    {
      title: 'Bedroom',
      url: 'https://kuula.co/share/7cm79?logo=1&info=1&fs=1&vr=0&zoom=0.1&gyro=0&autorotate=0.3&thumbs=1'
    }
  ];

  const randomScene = demoScenes[Math.floor(Math.random() * demoScenes.length)];

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="xl"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          bgcolor: 'background.paper',
          backgroundImage: 'none',
          overflow: 'hidden'
        }
      }}
    >
      <Box sx={{ 
        position: 'relative',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        p: { xs: 1.5, sm: 1.75 },
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderBottom: '1px solid',
        borderColor: 'rgba(255, 255, 255, 0.2)',
        zIndex: 1,
        mb: '-24px',
        boxShadow: '0 4px 15px rgba(102, 126, 234, 0.25)',
        minHeight: { xs: '60px', sm: '64px' },
        '&::after': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'linear-gradient(45deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 100%)',
          pointerEvents: 'none'
        }
      }}>
        <Typography 
          variant="h6" 
          component="h2" 
          sx={{ 
            fontWeight: 600,
            color: '#ffffff',
            textShadow: '0 2px 4px rgba(0,0,0,0.1)',
            fontSize: { xs: '0.95rem', sm: '1.1rem', md: '1.25rem' },
            textAlign: 'center',
            px: { xs: 4, sm: 6 },
            width: '100%',
            maxWidth: '600px',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap'
          }}
        >
          {title} • {randomScene.title} Virtual Tour
        </Typography>
        <IconButton
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: { xs: 4, sm: 8 },
            top: '50%',
            transform: 'translateY(-50%)',
            color: 'rgba(255, 255, 255, 0.9)',
            padding: { xs: '6px', sm: '8px' },
            '&:hover': {
              color: '#ffffff',
              background: 'rgba(255, 255, 255, 0.1)'
            }
          }}
        >
          <CloseIcon sx={{ fontSize: { xs: '1.25rem', sm: '1.5rem' } }} />
        </IconButton>
      </Box>
      <DialogContent sx={{ p: 0, height: '58vh', minHeight: '360px', bgcolor: '#000', position: 'relative', zIndex: 0, mt: '-1px' }}>
        <Box sx={{ 
          width: '100%',
          height: '100%',
          position: 'relative',
        }}>
          <iframe
            src={randomScene.url}
            style={{
              width: '100%',
              height: '110%',
              border: 'none',
              clipPath: 'inset(9% 0 0 0)',
              marginTop: '-15%',
              position: 'relative'
            }}
            allow="xr-spatial-tracking"
            allowFullScreen
          />
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default VirtualTour;
