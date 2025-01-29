import { SET_CAMERA_REF } from '../actions/cameraActions';

// Initial State
const initialState = {
  cameraRef: null,
};

// Reducer
export function cameraReducer(state = initialState, action) {
  switch (action.type) {
    case SET_CAMERA_REF:
      return { ...state, cameraRef: action.payload };
    default:
      return state;
  }
} 