import { createStore, applyMiddleware } from 'redux';
import createSagaMiddleware from 'redux-saga';
import { watchCameraRef } from './sagas/cameraSaga';
import { cameraReducer } from './reducers/cameraReducer';

// Create the saga middleware
const sagaMiddleware = createSagaMiddleware();

// Create the Redux store
const store = createStore(cameraReducer, applyMiddleware(sagaMiddleware));

// Run the saga
sagaMiddleware.run(watchCameraRef);

export default store; 