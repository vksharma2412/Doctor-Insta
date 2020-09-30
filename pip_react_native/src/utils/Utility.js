import Toast from 'react-native-simple-toast';
import { ToastAndroid, Platform, NativeModules } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import Constants from '../../res/Constants';
import String from '../../res/String';

import { GoogleSignin, statusCodes } from '@react-native-community/google-signin';
import { LoginManager, AccessToken } from 'react-native-fbsdk';
import NetworkManager from './NetworkManager';
import { CommonActions } from '@react-navigation/native';
import Session from './Session';
import { Color, Dimen, Strings, Assets, Constant, URL, AsyncStorageValues } from '../../res';

let moment = require('moment');
import RNExitApp from 'react-native-exit-app';
import Share from 'react-native-share';

var ApplozicChat = NativeModules.ApplozicChat;
// import EventEmitter from 'EventEmitter'
import EventEmitter from 'react-native/Libraries/vendor/emitter/EventEmitter';


export default class Utility {
    static sharedInstance = Utility.sharedInstance == null ? new Utility() : Utility.sharedInstance;
    HOC = undefined;
    navigation = undefined;
    EventEmitter = new EventEmitter();
    validateEmptyField = (fieldValue, errorText) => {
        if (fieldValue.trim() == '') {
            showToast(errorText);
            return false;
        }
        return true;
    };

    validateEmptyField(fieldValue, errorText) {
        console.log(fieldValue, errorText);
        if (fieldValue.trim() == '') {
            showToast(errorText);
            return false;
        }
        return true;
    }


    validateMobileNumber(fieldValue, regExr, errmsg) {
        // const regEx = regExr
        if (this.validateRegex(regExr, fieldValue)) {
            return true;
        } else {
            showToast(errmsg);
            return false;
        }
    }

    validateName(name) {
        if (!this.validateRegex(Constants.regex.alphabet, name)) {
            showToast(String.toastMsgs.studentReg.validName);
            return false;
        }
        return true;
    }


    validateRegex = (regex, text) => {
        let regx = new RegExp(regex);
        console.log('regx.test(text)' + regx.test(text));
        return regx.test(text);
    };

    validateEmailAddress(email) {
        if (!this.validateRegex(Constants.regex.email, email)) {
            showToast(String.toastMsgs.studentReg.validEmail);
            return false;
        }
        return true;
    }

    static log(msg, ...options) {
        if (__DEV__) {
            console.log(msg, options);
        }
    }

    isApplogicLogin = () => {
        ApplozicChat.isUserLogIn((response) => {
            if (response == 'true') {
                console.log('CHCEK LOGGED IN');
                /// User is logged in already
            } else {
                console.log('CHCEK LOGGED OUT');
                /// User is not logged in yet.
            }
        });
    };

    loginApplozic = (userData, name) => {
        console.log('userData' + JSON.stringify(userData));
        ApplozicChat.login(userData, (error, response) => {
            if (__DEV__) {
                console.log('login_applozic_error', error);
            }
            if (__DEV__ && error != null) {
                showToast('Unable to login in Applozic  ' + error);
            }
            if (__DEV__) {
                console.log('login_applozic_response', response);
            }
        });
    };

    //  Applozic Login Function
    //  loginApplozic = (emailId, name) => {
    //     ApplozicChat.login({
    //         'userId': emailId,
    //         'displayName': name
    //     }, (error, response) => {
    //         if (__DEV__) console.log('login_applozic_error', error)
    //         if (__DEV__ && error != null) this.showToast('Unable to login in Applozic')
    //         if (__DEV__) console.log('login_applozic_response', response)
    //     })
    // }

    logoutApplozic = () => {
        ApplozicChat.logoutUser((error, response) => {
            if (__DEV__) {
                console.log('logout_applozic_error' + error);
            }
            if (__DEV__) {
                console.log('logout_applozic_response' + response);
            }
        });
    };

    logoutAPI() {


    }

    appLogoutHandler = async () => {

        let data = {}
        data.user_id = Session.sharedInstance.userDetails[Constant.userDetailsFields._id]

        NetworkManager.networkManagerInstance.fetchRequest(URL.logout, URL.postRequest, true, data, () => this.appLogoutHandler())
            .then(async (res) => {
                if (res.statusCode == 200) {


                    Session.sharedInstance.userDetails = '';
                    Session.sharedInstance.id = undefined;
                    Session.sharedInstance.token = undefined;
                    Session.sharedInstance.name = undefined;
                    Session.sharedInstance.email = undefined;
                    Session.sharedInstance.education = undefined;
                    Session.sharedInstance.imageUrl = undefined;
                    Session.sharedInstance.isTutor = undefined;
                    Session.sharedInstance.countryCode = undefined;
                    Session.sharedInstance.userDetails = undefined;
                    Session.sharedInstance.countryName = undefined;

                    await AsyncStorage.setItem(AsyncStorageValues.token, '');
                    await AsyncStorage.setItem(AsyncStorageValues.userData, '');
                    await AsyncStorage.setItem(AsyncStorageValues.isTutor, '');
                    await AsyncStorage.setItem(AsyncStorageValues.userDetails, '');
                    await AsyncStorage.setItem(AsyncStorageValues.countryObj, '');

                    Utility.sharedInstance.navigation.navigate(Constants.routeName.login);


                }
            })
            .catch(e => {
                console.log('Logut API  FAILED', e)
            })


    };


    facebookLogin = async () => {
        let data;
        data = await LoginManager.logInWithPermissions(['public_profile', 'email'])
            .then(async (result) => {
                if (result.isCancelled) {
                    showToast('Login was cancelled');
                    return null;
                }
                return await AccessToken.getCurrentAccessToken();
            })
            .then(async (data) => {
                NetworkManager.networkManagerInstance.progressBarRequest(false);

                return await fetch('https://graph.facebook.com/v2.5/me?fields=name,email,picture.width(200),friends&access_token=' + data.accessToken.toString())
                    .then((response) => response.json())
                    .then((json) => {
                        return json;
                    })
                    .catch(() => {
                        if (__DEV__) {
                            console.log('ERROR GETTING DATA FROM FACEBOOK');
                        }
                    });
            })
            .catch(err => {
                NetworkManager.networkManagerInstance.progressBarRequest(false);
                if (__DEV__) {
                    console.log('fail', err);
                }
            });

        return data;
    };


    async _configureGoogleSignIn() {
        await GoogleSignin.hasPlayServices();
        GoogleSignin.configure({
            webClientId: '464550427948-m6ton896thoeubgmpeigmfaeudgqrqbc.apps.googleusercontent.com',
            offlineAccess: false,
        });
    }


    googleSignin = async () => {
        try {
            const userInfo = await GoogleSignin.signIn();
            GoogleSignin.revokeAccess();
            return userInfo;

        } catch (error) {
            if (error.code === statusCodes.SIGN_IN_CANCELLED) {
                if (__DEV__) {
                    console.log('this is cancel progressed');
                }
            } else if (error.code === statusCodes.IN_PROGRESS) {
                if (__DEV__) {
                    console.log('this is ');
                }
            } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
                if (__DEV__) {
                    console.log('playServices is not availabel');
                }
            } else {
                if (__DEV__) {
                    console.log('this error', error.toString());
                }
            }

        }
    };


    _storeData = async (key, data, msg) => {

        if (__DEV__) {
            console.log('_storeData_storeData_storeData' + msg);
        }

        try {
            await AsyncStorage.setItem(
                key,
                JSON.stringify(data),
            );
        } catch (error) {
            if (__DEV__) {
                console.log(error);
            }
        }
    };

    async _retrieveData(key) {
        try {
            const value = await AsyncStorage.getItem(key);
            if (value !== null) {
                // We have data!!
                console.log('Value ' + value);
                return value;
            }
        } catch (error) {
            // Error retrieving data
        }
    };


    formatDate(date, format) {
        return moment(date).format(format == undefined ? 'DD MMMM, YYYY' : format);
    }

    async backPressAppExit() {
        if (Platform.OS == 'ios') {
            RNExitApp.exitApp();
        } else {

            BackHandler.exitApp();
        }

    }


    formatTimeinHour(dateAndTime, format) {

        let startTime = moment.utc(dateAndTime).local().format('hh:mm A').replace('PM', '');
        let endTime = moment.utc(dateAndTime).local().add(1, 'hour').format('h:mm A');
        let time = startTime + '- ' + endTime;

        return time;
    }

    startTime(dateAndTime, format) {
        if (dateAndTime) {
            let startTime = moment(dateAndTime).format('h:mm ').replace('PM' || 'AM', '');
            return startTime;
        } else {
            return '';
        }

    }

    endTime(dateAndTime, format) {

        if (dateAndTime) {
            let endTime = moment(dateAndTime).format('h:mm ').replace('PM' || 'AM', '');
            return endTime;
        } else {
            return '';
        }

    }

    notificationTimeFormat(dateTime)
    {
        return moment(dateTime).format('DD/MM/YYYY, h:mm a');
    }

    raiseDisputeTimeFormat(dateAndTime, format) {

        if (dateAndTime) {
            let endTime = moment(dateAndTime).format('h:mm A');
            return endTime;
        } else {
            return '';
        }
    }


    getStatus(status) {
        switch (status) {
            case 'Active':
                return 'Active';
            case 'Upcoming':
                return 'Applied';
            case 'Expired':
                return 'Expired';
            default:
                break;
        }
    }


    share(msg) {
        console.log('this is on utility msge', msg);
        let options = {
            message: msg,
        };
        Share.open(options)
            .then((res) => {
                console.log(res);
            })
            .catch((err) => {
                err && console.log(err);
            });
        return;
    }

    calculateRating(arr) {
        console.log('Rating Araa', JSON.stringify(arr));
        let tempApp = [];
        tempApp = arr;
        if (tempApp.length > 0) {
            let length = tempApp.length;
            let sum = tempApp.reduce((total, curValue) => total + curValue.star_rating);
            console.log('sum==>> ' + JSON.stringify(sum));
            return sum / length;
        } else {
            return null;
        }
    }

    isRatingCompletedForCurrentSession(ratingArray, session_id) {

        let tempArr = [];
        tempArr = ratingArray;
        if (tempArr.length > 0) {

            let filter = tempArr.filter(obj => obj.session_id == session_id);
            console.log('ratingArray===>>' + JSON.stringify(filter));
            if (filter.length > 0) {
                return true;
            } else {
                return false;
            }
        } else {
            return false;
        }
    }

    averageRating(ratingArray) {
        let tempArr = [];
        tempArr = ratingArray;
        if (tempArr.length > 0) {
            let ratingArray = tempArr.map(obj => obj.star_rating);
            return ratingArray.reduce((sum, curr) => sum + curr) / ratingArray.length;
        } else {
            return 5;
        }
    }


    getStatusN(item) {
        if (!Session.sharedInstance.isStudent) {
            if (item.urgent_booking) {
                return 'Urgent';
            } else if (item.status == 'New') {
                return 'New';
            } else if (item.status == 'Resolved') {
                return 'Resolved';
            }
            else if (item.status == 'Unresolved') {
                return 'Not Resolved';
            }
            else if (item.status == 'Expired') {
                return 'Expired';
            }
            else {
                return null;
            }
        } else {
            if (item.status == Constants.sessionType.active) {
                return 'Active';
            }
            if (item.status == Constants.sessionType.upcoming) {
                return 'Applied';
            } else if (item.status == Constants.sessionType.completed) {
                return 'Completed';
            } else if (item.status == Constants.sessionType.cancelled) {
                return 'Cancelled';
            } else if (item.status == 'New') {
                return 'New';
            } else if (item.status == 'Resolved') {
                return 'Resolved';
            } else if (item.status == 'Unresolved') {
                return 'Not Resolved';
            }
            else {
                return 'Scheduled';
            }
        }
    }

    getStatuColor(item) {

        if (!Session.sharedInstance.isStudent) {
            if (item.urgent_booking) {
                return Color.textColor.pentaColor;
            } else if (item.status == 'New') {
                return Color.textColor.activeTextColor;
            } else if (item.status == 'Resolved') {
                return Color.textColor.completedStatusTextComor;
            } else if (item.status == 'Unresolved') {
                return Color.textColor.pentaColor;
            }
            else if (item.status == 'Expired') {
                return Color.textColor.pentaColor;
            }
            else {
                return null;
            }
        } else {
            if (item.status == Constants.sessionType.active) {
                return Color.textColor.activeTextColor;
            }
            if (item.status == Constants.sessionType.upcoming) {
                return Color.textColor.appliedText;
            } else if (item.status == Constants.sessionType.completed) {
                return Color.textColor.completedStatusTextComor;
            } else if (item.status == Constants.sessionType.cancelled) {
                return Color.textColor.pentaColor;
            }
            else if (item.status == 'New') {
                return Color.textColor.activeTextColor;
            } else if (item.status == 'Resolved') {
                return Color.textColor.completedStatusTextComor;
            } else if (item.status == 'Unresolved') {
                return Color.textColor.pentaColor;
            } else {
                return '#000000';
            }
        }


    }

    getStatuBackGroundColor(item) {
        if (!Session.sharedInstance.isStudent) {
            if (item.urgent_booking) {
                return Color.textColor.urgentTextColor;
            } else if (item.status == 'New') {
                return Color.introColor.activeBackground;
            } else if (item.status == 'Resolved') {
                return Color.textColor.completedStatusBackGround;
            } else if (item.status == 'Unresolved') {
                return Color.textColor.urgentTextColor;
            }
            else if (item.status == 'Expired') {
                return Color.textColor.urgentTextColor;
            }



            else {
                return null;
            }
        }
        else {
            if (item.status == Constants.sessionType.active) {
                return Color.introColor.activeBackground;
            }
            if (item.status == Constants.sessionType.upcoming) {
                return Color.introColor.appliedBackgroundColor;
            } else if (item.status == Constants.sessionType.completed) {
                return Color.textColor.completedStatusBackGround;
            } else if (item.status == Constants.sessionType.cancelled) {
                return Color.textColor.urgentTextColor;
            }
            else if (item.status == 'New') {
                return Color.introColor.activeBackground;
            } else if (item.status == 'Pending') {
                return Color.introColor.activeBackground;
            } else if (item.status == 'Resolved') {
                return Color.textColor.completedStatusBackGround;
            } else if (item.status == 'Unresolved') {
                return Color.textColor.urgentTextColor;
            }
            else {
                return Color.borderColor.tertiaryColor;
            }
        }
    }


    isEmpty(obj) {
        for (var prop in obj) {
            if (obj.hasOwnProperty(prop)) {
                return false;
            }
        }

        return JSON.stringify(obj) === JSON.stringify({});
    }


}


export async function showToast(message) {

    Toast.show(message)
}


export async function _storeData(key, data, msg) {

    if (__DEV__) {
        console.log(msg)
    }

    try {
        await AsyncStorage.setItem(
            key,
            JSON.stringify(data)
        );
    } catch (error) {
        if (__DEV__) {
            console.log(error)
        }
    }
};

export async function _retrieveData(key) {
    try {
        const value = await AsyncStorage.getItem(key);
        if (value !== null) {
            // We have data!!
            console.log("Value " + value);
            return value;
        }
    } catch (error) {
        // Error retrieving data
    }
};





