import { combineReducers } from 'redux';
import cameraReducer from './cameraReducer';
// import other reducers

const rootReducer = combineReducers({
  camera: cameraReducer,
  // other reducers
});

export default rootReducer;