import { configureStore } from '@reduxjs/toolkit';
import { createWrapper } from 'next-redux-wrapper';
import createSagaMiddleware from 'redux-saga';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import rootReducer from '../reducers';
import rootSaga from '../sagas/rootSaga';

const persistConfig = {
  key: 'root',
  storage,
  blacklist :['camera']
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

const makeStore = () => {
  const sagaMiddleware = createSagaMiddleware();
  const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({ thunk: false, serializableCheck: false }).concat(sagaMiddleware),
  });

  store.sagaTask = sagaMiddleware.run(rootSaga);
  store.__PERSISTOR = persistStore(store);

  return store;
};

export const wrapper = createWrapper(makeStore);