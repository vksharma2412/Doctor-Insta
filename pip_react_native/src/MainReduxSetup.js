import React, { Component } from 'react';
import { DeviceEventEmitter } from 'react-native';
import { createStore, applyMiddleware, compose } from "redux";
import createSagaMiddleware from "redux-saga";
import { Provider } from "react-redux";
import { composeWithDevTools } from 'redux-devtools-extension';
import reducer from "./redux/RootReducer";
import rootSaga from "./redux/RootSagas";
import App from './screens/App';
import { NetworkManager, Utility, NavUtil } from './utils'
import { Strings, Assets, Dimen, Color, Styles, Constant, URL } from './../res/index'
import Constants from './../res/Constants';


const middleware = []
const enhancers = []
const sagaMiddleware = createSagaMiddleware()
middleware.push(sagaMiddleware)
enhancers.push(applyMiddleware(...middleware))

const createAppropriateStore = createStore
const store = createAppropriateStore(reducer, composeWithDevTools(...enhancers))

sagaMiddleware.run(rootSaga);

class MainReduxSetup extends Component {


      componentDidMount = () => {
        //this.getNativeEvent()
      }

    render() {
        return (
            <Provider store={store}>
                <App />
            </Provider>
        )
    }
}
export default MainReduxSetup
