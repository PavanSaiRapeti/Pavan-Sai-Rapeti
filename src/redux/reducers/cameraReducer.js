import { SET_CAMERA_REF, SET_SCROLL, SET_SCROLL_BTM } from '../actions/cameraActions';

// Initial State
const initialState = {
  cameraRef: null,
  isScroll: false,
  isScrollToBtm: false,
};

// Reducer
const cameraReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_CAMERA_REF:
      return { ...state, cameraRef: action.payload };
    case SET_SCROLL:
      return { ...state, isScroll: action.payload };
    case SET_SCROLL_BTM:
      return { ...state, isScrollToBtm: action.payload };
    default:
      return state;
  }
};

export default cameraReducer; 