// Action Types
export const SET_CAMERA_REF = 'SET_CAMERA_REF';
export const SET_SCROLL = 'SET_SCROLL';
export const SET_SCROLL_BTM = 'SET_SCROLL_BTM';

// Action Creators
export const setCameraRef = (cameraRef) => ({
  type: SET_CAMERA_REF,
  payload: cameraRef,
});

export const setScroll = (isScroll) => ({
  type: SET_SCROLL,
  payload: isScroll,
});

export const setScrollBtm = (scrollBtmValue) => ({
  type: SET_SCROLL_BTM,
  payload: scrollBtmValue,
});

