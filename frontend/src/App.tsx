import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { lazy, Suspense } from 'react';
import theme from './theme';

// Lazy load pages
const HomePage = lazy(() => import('./pages/HomePage'));
const PropertyDetailPage = lazy(() => import('./pages/PropertyDetailPage'));
const MapViewPage = lazy(() => import('./pages/MapView'));
const RentPage = lazy(() => import('./pages/RentPage'));

// Loading component
const LoadingPage = () => (
  <div style={{ 
    display: 'flex', 
    justifyContent: 'center', 
    alignItems: 'center', 
    height: '100vh' 
  }}>
    <CssBaseline />
    Loading...
  </div>
);

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <Suspense fallback={<LoadingPage />}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/property/:id" element={<PropertyDetailPage />} />
            <Route path="/map" element={<MapViewPage />} />
            <Route path="/rent" element={<RentPage />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;