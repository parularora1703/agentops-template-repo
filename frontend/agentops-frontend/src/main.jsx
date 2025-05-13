import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import AOS from 'aos';
import 'aos/dist/aos.css';

function MainApp() {
  useEffect(() => {
    // Initialize AOS for animations on page load
    AOS.init({
      duration: 800,  // Animation duration
      once: true,     // Only animate once when visible
      easing: 'ease-out', // Ease-out for smoother animation
      delay: 100,     // Delay before animations trigger
    });

    // Optionally, refresh AOS animations on window resize
    window.addEventListener('resize', () => {
      AOS.refresh();
    });

    // Clean up the resize event listener when the component is unmounted
    return () => {
      window.removeEventListener('resize', () => {
        AOS.refresh();
      });
    };
  }, []);

  return <App />;
}

ReactDOM.createRoot(document.getElementById('app')).render(
  <React.StrictMode>
    <MainApp />
  </React.StrictMode>
);