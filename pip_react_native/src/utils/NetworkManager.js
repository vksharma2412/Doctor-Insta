import { Component } from "react";
import NetInfo from "@react-native-community/netinfo";
import URL, { apis, AppInfo } from '../../res/URL';
import Utility from './Utility'
import Constants from "../../res/Constants";
const BYPASS_CHECK_FOR_REACHABILITY = false

export default class NetworkManager extends Component {


    constructor(props) {
        super(props)
    }
    static networkManagerInstance = NetworkManager.networkManagerInstance == null ? new NetworkManager() : this.networkManagerInstance;
    isInternetConnected = true;
    token = null;

    progressBarRequest = (status) => {
        Utility.sharedInstance.HOC.showHideProgressBar(status)
    }

    async fetchRequest(api, method, showProgressBar = false, parameters = {}, onRetryClicked = null, serviceTimeOut = AppInfo.serviceTimeOut) {
        if (!this.isInternetConnected) {
            console.log('isInternetConnected :' + this.isInternetConnected);
            if (onRetryClicked != null) {
                Utility.sharedInstance.HOC.showOverlay({ type: 'NO_NETWORK', onRetryClicked: onRetryClicked });
                throw new Error('NO_NETWORK');
            }
            return { statusCode: 400, error: 'Please check your internet connection' };
        }
        if (showProgressBar) {
            this.progressBarRequest(true);
        }
        let headers = {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        };

        if (__DEV__) console.log('this.token ', this.token);
        if (this.token != null) {
            headers['Authorization'] = this.token
        }

        let url = `${URL.baseURL}${api.replace(' ', '')}`;
        let updatedUrl = url.replace(' ', '')
        if (__DEV__) console.log("updatedUrl===>>>  " + updatedUrl)

        let timeout = (1000 * 60) * 2;  // 2 mins
        let body = (method == 'GET' ? null : JSON.stringify(parameters));
        if (__DEV__) {
            console.log(
                '\n--------------------- [Network] ---------------------\nURL: ' + updatedUrl +
                '\nMethod: ' + method +
                '\nHeaders: ' + JSON.stringify(headers) +
                '\nTimeout: ' + timeout +
                '\nParameters:\n' + body + '\n',
            );
        }
        return fetch(url, { method, timeout, headers, body })
            .then(response => {
                console.log('recieved network reponse part2')
                try {
                    return response.json();
                } catch (e) {
                    console.log('recieved network reponse part1', e)
                    console.log('recieved network reponse part1 value', response)
                    return { "statusCode": 400, "message": response }
                }
               
            }).then(async (data) => {
                this.progressBarRequest(false);
                if (__DEV__) {
                    console.log(`[Network Success]: ${JSON.stringify(data)}`);
                }

                if (data.statusCode == 401) {
                    await Utility.sharedInstance.appLogoutHandler()
                    return data;
                }
                return data;
            }).catch(error => {
                this.progressBarRequest(false);
                console.log(" Nwetrk Err ", error);
                return { "statusCode": 400, "message": "Network Failure please try again" }
               // alert(error ? error.message : 'Something went wrong..!!');
            });


            // return fetch(url, {method, timeout, headers, body})
            // .then((response) => response.json())
            // .then((json) => {
            //     console.log(`[Network Success]: ${JSON.stringify(json)}`)
            // })
            // .catch((error) => {
            //   console.error(error);
            // });

    }

    // Reachability
    async internetConnected(shouldBypass = false) {
        if (BYPASS_CHECK_FOR_REACHABILITY) return true
        return this.isInternetConnected
        // return await NetInfo.isConnected.fetch()
        try {
            let response = await fetch("https://www.google.com", { method: 'GET', timeout: 1000 })
            return response.status == 200
        } catch (error) {
            return false
        }
    }

    async reachabilityListener(callback) {
        NetInfo.fetch().then(state => {
            this.isInternetConnected = state.isConnected
            if (callback) callback(this.isInternetConnected)
        })
        const unsubscribe = NetInfo.addEventListener(state => {
            this.isInternetConnected = state.isConnected
            if (callback) callback(this.isInternetConnected)
        })
    }

    async fetchMultiPartRequest(api, method, body, showProgressBar = false, onRetryClicked = null, serviceTimeOut = AppInfo.serviceTimeOut) {

        if (!this.isInternetConnected) {
            console.log('isInternetConnected :' + this.isInternetConnected);
            if (onRetryClicked != null) {
                Utility.sharedInstance.HOC.showOverlay({ type: 'NO_NETWORK', onRetryClicked: onRetryClicked });
                throw new Error('NO_NETWORK');
            }
            return { statusCode: 400, error: 'Please check your internet connection' };
        }
        if (showProgressBar) {
            this.progressBarRequest(true);
        }
        let headers = {
            'Accept': 'application/json',
            'Content-Type': 'multipart/form-data',
        };

        if (this.token != null) {
            headers['Authorization'] = this.token
        }
        let url = `${URL.baseURL}${api}`;
        let timeout = (1000 * 60) * 2;  // 2 mins
        if (__DEV__) {
            console.log(
                '\n--------------------- [Network] ---------------------\nURL: ' + url +
                '\nMethod: ' + method +
                '\nHeaders: ' + JSON.stringify(headers) +
                '\nTimeout: ' + timeout +
                '\nParameters:\n' + JSON.stringify(body) + '\n',
            );
        }
        return fetch(url, { method, timeout, headers, body })
            .then(response => {
                return response.json()
            }).then(async (data) => {


                if (__DEV__) {
                    console.log(`[Network Success]: ${JSON.stringify(data)}`);
                }

                if (data.statusCode == 401) {
                    await Utility.sharedInstance.appLogoutHandler()
                    return data;
                }

                return data;
            }).catch(error => {
                console.log(error);
                alert(error ? error.message : 'Something went wrong..!!');
            });

    }

}