import { takeEvery, all } from 'redux-saga/effects';
import { apiWatcherSaga } from './reducers/api/ApiSaga'
export default function* rootSaga() {
    yield all([
        ...apiWatcherSaga
    ]);
}