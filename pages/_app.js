import '../styles/globals.css';
import { useEffect } from 'react';
import { initThemeToggle, applyTheme, listenForOSThemeChanges } from '../utils/themeToggle';

function MyApp({ Component, pageProps }) {
  // Initialize theme toggle on client-side only
  useEffect(() => {
    // Apply theme immediately to prevent flash of wrong theme
    applyTheme();
    
    // Initialize theme toggle button
    initThemeToggle();
    
    // Listen for OS theme changes
    listenForOSThemeChanges();
  }, []);

  return <Component {...pageProps} />;
}

export default MyApp;