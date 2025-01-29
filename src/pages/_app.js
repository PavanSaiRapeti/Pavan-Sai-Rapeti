import { useState, useEffect } from 'react';
import LoadingScreen from '../components/LoadingScreen';
import { Provider } from 'react-redux';
import store from '../redux/store';
import '../styles/globals.css';

function MyApp({ Component, pageProps }) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const handleStart = () => setLoading(true);
    const handleComplete = () => setLoading(false);

    // Simulate loading delay for demonstration
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <Provider store={store}>
      {loading ? <LoadingScreen /> : <Component {...pageProps} />}
    </Provider>
  );
}

export default MyApp;
