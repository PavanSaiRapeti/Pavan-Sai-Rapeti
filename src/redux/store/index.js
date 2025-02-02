import { createStore } from 'redux';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { createWrapper } from 'next-redux-wrapper';
import rootReducer from '../reducers';

const persistConfig = {
  key: 'root',
  storage,
  blacklist: ['camera'], // Add the reducer key you want to exclude from persistence
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

const makeStore = () => {
  const store = createStore(persistedReducer);
  store.__PERSISTOR = persistStore(store); // Add this line to handle persistor
  return store;
};

export const wrapper = createWrapper(makeStore);