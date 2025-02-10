import { all } from 'redux-saga/effects';
import { watchCameraRef } from './cameraRefSaga';

export default function* rootSaga() {
    console.log('Root saga started');
    yield all([
        watchCameraRef(),
    ]);
}