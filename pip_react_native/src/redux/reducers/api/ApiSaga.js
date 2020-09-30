import { takeEvery, call, put, takeLatest } from "redux-saga/effects";
import { API_CALL, API_CALL_FAILURE } from '../../Actions'
import NetworkManager from '../../../utils/NetworkManager'

export const apiWatcherSaga = [
    takeEvery(API_CALL, apiWorkerSaga),
];

function* apiWorkerSaga(action) {
    try {
        const response = yield call(apiCall, action.data.api, action.data.requestType, action.data.reqObject);
        console.log('res: ', JSON.stringify(response))
        const data = response;
        yield put({ type: action.data.type, data });
    } catch (error) {
        console.log('error', JSON.stringify(error))
        yield put({ type: API_CALL_FAILURE, error });
    }
}

function apiCall(api, request, data) {
    return NetworkManager.networkManagerInstance.fetchRequest(api, request, true, data, true);
}