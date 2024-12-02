import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { App } from '@capacitor/app';

export const useAppBackButton = () => {
  const navigate = useNavigate();
  const location = useLocation();
  let lastBackPress = 0;

  useEffect(() => {
    const handleBackButton = async () => {
      if (location.pathname === '/') {
        const currentTime = new Date().getTime();
        const timeDiff = currentTime - lastBackPress;

        if (timeDiff < 2000 && timeDiff > 0) {
          // If pressed twice within 2 seconds on home page, exit app
          await App.exitApp();
        } else {
          lastBackPress = currentTime;
          // Create and show a professional looking toast
          const snackbar = document.createElement('div');
          snackbar.style.position = 'fixed';
          snackbar.style.bottom = '32px';
          snackbar.style.left = '50%';
          snackbar.style.transform = 'translateX(-50%) translateY(0)';
          snackbar.style.backgroundColor = '#1976d2'; // MUI primary color
          snackbar.style.color = 'white';
          snackbar.style.padding = '14px 24px';
          snackbar.style.borderRadius = '8px';
          snackbar.style.boxShadow = '0 3px 5px rgba(0,0,0,0.2)';
          snackbar.style.zIndex = '9999';
          snackbar.style.fontSize = '0.875rem';
          snackbar.style.fontWeight = '500';
          snackbar.style.fontFamily = '"Roboto", "Helvetica", "Arial", sans-serif';
          snackbar.style.minWidth = '200px';
          snackbar.style.textAlign = 'center';
          snackbar.style.animation = 'slideUp 0.3s ease-out';
          snackbar.textContent = 'Press back again to exit';
          
          // Add animation keyframes
          const style = document.createElement('style');
          style.textContent = `
            @keyframes slideUp {
              from {
                transform: translateX(-50%) translateY(100%);
                opacity: 0;
              }
              to {
                transform: translateX(-50%) translateY(0);
                opacity: 1;
              }
            }
          `;
          document.head.appendChild(style);
          document.body.appendChild(snackbar);
          
          // Remove after delay with fade out animation
          setTimeout(() => {
            snackbar.style.animation = 'slideDown 0.3s ease-in';
            style.textContent += `
              @keyframes slideDown {
                from {
                  transform: translateX(-50%) translateY(0);
                  opacity: 1;
                }
                to {
                  transform: translateX(-50%) translateY(100%);
                  opacity: 0;
                }
              }
            `;
            setTimeout(() => {
              document.body.removeChild(snackbar);
              document.head.removeChild(style);
            }, 300);
          }, 1700);
        }
      } else {
        // On other pages, navigate back
        navigate(-1);
      }
    };

    // Add the back button listener
    App.addListener('backButton', handleBackButton);

    // Cleanup on unmount
    return () => {
      App.removeAllListeners();
    };
  }, [navigate, location.pathname]);
};
