import React, { useEffect } from 'react';
import { Provider, ReactReduxContext, useDispatch } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import '../styles/globals.css';
import LoadingScreen from '../components/LoadingScreen';
import { persistor, wrapper } from '../redux/store';

function MyApp({ Component, pageProps }) {

  return (
    <ReactReduxContext.Consumer>
    {({ store }) => (
      <PersistGate persistor={store.__PERSISTOR} loading={<div>error in gate</div>}>
        { <Component {...pageProps} />}
      </PersistGate>
    )}
  </ReactReduxContext.Consumer>
  );
}

export default wrapper.withRedux(MyApp);
