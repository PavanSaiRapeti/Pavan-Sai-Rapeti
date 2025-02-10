import React, { useEffect } from 'react';
import { Provider, ReactReduxContext, useDispatch } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import '../styles/globals.css';
import { persistor, wrapper } from '../redux/store';

function MyApp({ Component, ...rest }) {
  const { store, props } = wrapper.useWrappedStore(rest);


  return (
    <Provider store={store}>
    <PersistGate loading={null} persistor={store.__PERSISTOR}>
      <Component {...props.pageProps} />
    </PersistGate>
  </Provider>)
}

export default wrapper.withRedux(MyApp);
