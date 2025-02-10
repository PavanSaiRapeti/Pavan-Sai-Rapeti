import { takeEvery, call, put } from 'redux-saga/effects';
import { SET_CAMERA_REF } from '../actions/cameraActions';

// Worker Saga
function* handleCameraRef(action) {
  try {
    // Perform any side effects here
    console.log('Camera ref set:', action.payload);
  } catch (error) {
    console.error('Error handling camera ref:', error);
  }
}

// Watcher Saga
export function* watchCameraRef() {
  yield takeEvery(SET_CAMERA_REF, handleCameraRef);
} 