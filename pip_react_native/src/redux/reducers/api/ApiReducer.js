import {
    API_CALL_FAILURE, DUMMY_API_CALL,
    COUNTRY_CODE_API,
    LOGIN_API_CALL,
    EDUCATION_DETAIL_API_CALL,
    CHANGE_NOTIFICATION_BELL_ICON
} from '../../Actions';

const initialState = {
    testResponse: '',
    countryCode: '',
    login: '',
    user: '',
    educationDetails: '',
    newNotification: false, // for changing notification icon in the headers

}

export function apiReducer(state = initialState, action) {
    switch (action.type) {
        case API_CALL_FAILURE:
            console.log("action", action);
            return {
                ...state
            }
        case DUMMY_API_CALL:
            console.log("action", action);
            return {
                ...state,
                testResponse: action.data
            }
        case COUNTRY_CODE_API:
            console.log("action", action);
            return {
                ...state,
                countryCode: action.data
            }
        case LOGIN_API_CALL:
            console.log("action", action);
            return {
                ...state,
                login: action.data
            }
        case EDUCATION_DETAIL_API_CALL:
            console.log("action", action);
            return {
                ...state,
                educationDetails: action.data
            }
        case CHANGE_NOTIFICATION_BELL_ICON:
            if (__DEV__) console.log("action", action);
            return {
                ...state,
                newNotification: action.value
            };
        default:
            return state;
    }
}