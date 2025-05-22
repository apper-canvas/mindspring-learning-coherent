import { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import { AnimatePresence } from 'framer-motion';
import { useDispatch } from 'react-redux';
import { checkNetworkStatus, syncOfflineProgress } from './store/offlineSlice';

// Mocked API for leaderboard sample data (would be real API in production)
import './utils/leaderboardUtils';

// Pages
import Home from './pages/Home';
import NotFound from './pages/NotFound';
import Explore from './pages/Explore';
import Community from './pages/Community';
import Badges from './pages/Badges';
import Courses from './pages/Courses';

// Components
import Header from './components/Header';
import Footer from './components/Footer';

// Register service worker
function App() {
  const dispatch = useDispatch();
  const [darkMode, setDarkMode] = useState(() => {
    // Check for saved theme preference or use system preference
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    return savedTheme === 'dark' || (!savedTheme && prefersDark);
  });

  // Handle online/offline status
  useEffect(() => {
    const handleOnline = () => {
      dispatch(checkNetworkStatus(true));
      toast.success('You are back online!');
      
      // Sync offline progress with server when connection is restored
      dispatch(syncOfflineProgress());
    };

    const handleOffline = () => {
      dispatch(checkNetworkStatus(false));
      toast.info('You are offline. Your progress will be saved locally.');
    };

    // Check initial status
    dispatch(checkNetworkStatus(navigator.onLine));
    
    // Set up event listeners for online/offline status changes
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Initial message if offline
    if (!navigator.onLine) {
      toast.info('You are offline. Your progress will be saved locally.');
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [dispatch]);

  useEffect(() => {
    // Update class on document when darkMode changes
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', darkMode ? 'dark' : 'light');
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode(prev => !prev);
  };

  return (
    <>
      <Header darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
      
      <AnimatePresence mode="wait">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/courses" element={<Courses />} />
          <Route path="/explore" element={<Explore />} />
          <Route path="/community" element={<Community />} />
          <Route path="/badges" element={<Badges />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </AnimatePresence>
      
      <Footer />
      
      <ToastContainer
        position="bottom-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme={darkMode ? 'dark' : 'light'}
      />
    </>
  );
}

export default App;