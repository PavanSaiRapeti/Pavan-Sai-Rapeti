import { SET_CAMERA_REF } from '../actions/cameraActions';
import { SET_SCROLL } from '../actions/types';

// Initial State
const initialState = {
  cameraRef: null,
  isScroll: false,
};

// Reducer
const cameraReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_CAMERA_REF:
      return { ...state, cameraRef: action.payload };
    case SET_SCROLL:
      return { ...state, isScroll: action.payload };
    default:
      return state;
  }
};

export default cameraReducer; 