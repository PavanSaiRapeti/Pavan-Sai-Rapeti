// Action Types
export const SET_CAMERA_REF = 'SET_CAMERA_REF';
import { SET_SCROLL } from './types';

// Action Creators
export const setCameraRef = (ref) => ({
  type: SET_CAMERA_REF,
  payload: ref,
});

export const setScroll = (scrollValue) => ({
  type: SET_SCROLL,
  payload: scrollValue,
}); 