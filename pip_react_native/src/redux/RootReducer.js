import { combineReducers } from "redux";
import { apiReducer } from "./reducers/api/ApiReducer";

export default combineReducers({
    apiReducer: apiReducer
});