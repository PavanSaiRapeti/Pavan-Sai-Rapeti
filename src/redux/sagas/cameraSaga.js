import { takeEvery } from 'redux-saga/effects';
import { SET_CAMERA_REF } from '../actions/cameraActions';

// Worker Saga
function* handleSetCameraRef(action) {
  // Here you can perform side effects if needed
  console.log('Camera reference set:', action.payload);
}

// Watcher Saga
export function* watchCameraRef() {
  yield takeEvery(SET_CAMERA_REF, handleSetCameraRef);
} 