import { all, put } from 'redux-saga/effects';
import watchCameraRef from '.';

export default function* rootSaga() {
    console.log('Root saga started');
    yield all([
        ...watchCameraRef(),
    ]);
}