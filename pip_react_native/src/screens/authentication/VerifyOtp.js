import React, { Component } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform, Permission, PermissionsAndroid, Image, TextInput, TouchableWithoutFeedback, StatusBar, KeyboardAvoidingView, ScrollView, Keyboard } from 'react-native'
import { AppButton, AppImageComponent, SafeAreaComponent, OtpBox } from '../../components';
import { Strings, Assets, Color, Styles, AsyncStorageValues } from '../../../res/index';
import URL, { apis } from '../../../res/URL';
import { API_CALL, DUMMY_API_CALL } from "../../../src/redux/Actions";
import { NetworkManager } from '../../utils/index';
import Utility, { showToast, _storeData } from '../../utils/Utility';
import Constants from '../../../res/Constants';
import AsyncStorage from '@react-native-community/async-storage';
import SmsListener from 'react-native-android-sms-listener'
import Session from "../../utils/Session";
import String from '../../../res/String';




class VerifyOtp extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            count: 0,
            resendDisable: true,
            resendEnable: false,
            userid: this.props.route.params._id != "" ? this.props.route.params._id : '',
            timer: 30,
            otpCode: '',
            mobileNo: this.props.route.params.mobile != "" ? this.props.route.params.mobile : '',
            "country": this.props.route.params.country != "" ? this.props.route.params.country : "",
            "currency_code": this.props.route.params.currency_code != "" ? this.props.route.params.currency_code : "",
            "currency": this.props.route.params.currency != "" ? this.props.route.params.currency : "",

        }
    }

    //Code for Timer begin
    componentDidMount() {
        this.startTimer()
    }

    componentDidUpdate() {
        if (this.state.timer === 0) {
            clearInterval(this.interval);
        }
    }

    componentWillUnmount() {
        this.resetTimer()
    }

    resetTimer = () => {
        clearInterval(this.interval);
    }

    startTimer = () => {
        this.requestReadSmsPermission()
        this.interval = setInterval(
            () => this.setState((prevState) => ({ timer: prevState.timer - 1 })),
            1000
        );

        if (Platform.OS == 'android')

            this.smsListener = SmsListener.addListener(message => {
                this.setCode(message);
                // alert('JSON.stringify(message)', JSON.stringify(message))
            });

    }

    setTimerValue = () => {
        if (this.state.timer == 0) {
            this.setState({ timer: 30 })
            this.startTimer()
        }
    }
    //code for timer end


    async requestReadSmsPermission() {
        try {
            var granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.READ_SMS, {
                title: 'Auto Verification OTP',
                message: 'need access to read sms, to verify OTP'
            }
            );
            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                granted = await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.RECEIVE_SMS, {
                    title: 'Receive SMS',
                    message: 'Need access to receive sms, to verify OTP'
                }
                );
                if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                    SmsListener.addListener(message => {
                        this.setCode(message)
                    });
                } else {
                }
            } else {
            }
        } catch (err) {
            console.log(err);
        }
    }

    setCode = async (message) => {
        let code = '';
        if (message.originatingAddress.includes("574388" || "57273" || '57575791')) {
            code = message.body.match(/\b\d{6}\b/);
            if (code != '') {
                this.setState({
                    otpCode: code,
                }, () => {
                    // this.smsListener.removeListener()
                    this.apiHandler()
                })
            }
        }
    }

    apiHandler = async () => {


        let otp = Array.isArray(this.state.otpCode) ? this.state.otpCode[0] : this.state.otpCode

        let data = {
            id: this.state.userid,
            mobile: this.state.mobileNo,
            otp: Platform.OS == 'android' ? otp : this.state.otpCode
        }

        const res = await NetworkManager.networkManagerInstance.fetchRequest(URL.verifyOtp, URL.postRequest, true, data, () => this.apiHandler())
        if (res.statusCode == 200) {


            if (res.data.hasOwnProperty('email')) {
                let userData = {}
                userData.id = res.data._id;
                userData.mobile = res.data.mobile;
                userData.email = res.data.email;

                await AsyncStorage.setItem(AsyncStorageValues.token, JSON.stringify(res.data.token))
                await AsyncStorage.setItem(AsyncStorageValues.userData, JSON.stringify(userData))
                await Utility.sharedInstance._storeData(AsyncStorageValues.userDetails, res.data, String.asynstorageMsgs.updateStudentData)
                Session.sharedInstance.id = res.data._id
                Session.sharedInstance.name = res.data.mobile
                Session.sharedInstance.email = res.data.email
                Session.sharedInstance.countryCode = res.data.country
                Session.sharedInstance.userDetails = res.data

                NetworkManager.networkManagerInstance.token = res.data.token;
                if (res.data.is_tutor == true && res.data.isVerified == false && res.data.rejected == false) {
                    this.props.navigation.navigate(Constants.routeName.waitingForApproval)
                } else {
                    this.props.navigation.navigate(Constants.routeName.homeScreen)
                }

            }
            else {
                let userData = {}
                userData.id = res.data._id;
                userData.mobile = res.data.mobile;
                Session.sharedInstance.id = res.data._id
                Session.sharedInstance.name = res.data.mobile
                Session.sharedInstance.email = res.data.email
                Session.sharedInstance.countryCode = res.data.country
                Session.sharedInstance.userDetails = res.data
                await AsyncStorage.setItem(AsyncStorageValues.token, JSON.stringify(res.data.token))
                await AsyncStorage.setItem(AsyncStorageValues.userData, JSON.stringify(userData))
                await Utility.sharedInstance._storeData(AsyncStorageValues.userDetails, res.data, String.asynstorageMsgs.updateStudentData)
                NetworkManager.networkManagerInstance.token = res.data.token;
                this.props.navigation.navigate(Constants.routeName.userType, { userId: this.state.userid })
            }
        } else {
            showToast(res.message)
        }
        return
    }

    formValidation = (country_code, mobileNo) => {

        if (!Utility.sharedInstance.validateEmptyField(country_code, String.toastMsgs.login.countryCodeNotFound)) {
            return false
        }
        if (!Utility.sharedInstance.validateEmptyField(mobileNo, String.toastMsgs.login.pleaseEnterMobile)) {
            return false
        }

        return true
    }

    resendOtpApiHandler = async () => {
        let data = {
            mobile: '+' + this.state.mobileNo,
            "map": {
                "type": "Point",
                "coordinates": [
                    0, 1
                ]
            },
            currency_code: this.state.currency_code,
            "country": this.state.country,
            "currency": this.state.currency
        }

        const res = await NetworkManager.networkManagerInstance.fetchRequest(URL.login, URL.postRequest, true, data, () => { this.loginAPIHandler(props, mobileNo) });
        if (res.statusCode === 200) {
            this.props.navigation.navigate('VerifyOtp', { mobile: this.state.mobileNo, _id: res.data._id })
        } else {
            Utility.sharedInstance.showToast(res.message)
        }
    }

    render() {
        return (
            <SafeAreaComponent
                color={Color.listSeperator} >
                <View style={styles.container}>
                    <KeyboardAvoidingView
                        style={{ flexGrow: 1, flexDirection: 'column', }}
                        keyboardVerticalOffset={40}
                        behavior={Platform.OS === 'ios' ? 'padding' : null}
                        enabled>

                        <ScrollView
                            contentContainerStyle={{ flexGrow: 1 }}
                            keyboardShouldPersistTaps='always'
                        >
                            <View style={styles.topView}>
                                <TouchableOpacity onPress={() => this.props.navigation.goBack()} style={{ flex: 1 }}>
                                    <Image style={{ flex: 1 }} style={styles.backImage} source={Assets.common.back}></Image>
                                </TouchableOpacity>
                            </View>
                            <View style={styles.middleView}>
                                <Image source={Assets.verifyOtp.fingerTap}>
                                </Image>
                            </View>
                            <View style={styles.bottomView}>
                                <View style={styles.bottomTopView}>
                                    <Text style={styles.verifyOtpTxt}>{Strings.verifyOtp.verifyOtp}</Text>
                                    <Text style={styles.sentTxt}>{Strings.verifyOtp.weHave}</Text>
                                    <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                                        <Text style={{ fontSize: 14, fontWeight: '700', paddingTop: 2, color: Color.textColor.quarternary }}>
                                            {this.state.mobileNo}
                                        </Text>
                                        <Text style={{ marginLeft: 5, color: Color.textColor.secondaryColor, fontSize: 14 }}>
                                            {Strings.verifyOtp.pleaseEnter}
                                        </Text>
                                    </View>
                                    <TouchableOpacity
                                        onPress={() => this.props.navigation.navigate('Login', { mobile: this.state.mobileNo })}>
                                        <Text style={styles.wrongNumberTxt}>{Strings.verifyOtp.wrongNumber}</Text>
                                    </TouchableOpacity>
                                    <View style={styles.underLine}></View>
                                </View>
                                <View style={styles.bottomBottomView}>
                                    <View style={styles.buttonView}>
                                        {/* <AppButton
                                            onPress={() => alert('Under Devlopment')}
                                            isEnabled={true}
                                            buttonText={Strings.verifyOtp.verify}
                                        /> */}
                                    </View>
                                    <View style={styles.otpBoxView}>
                                        <OtpBox
                                            containerStyle={{ justifyContent: 'center' }}
                                            // otpCode={otpCode}
                                            otpCode={this.state.otpCode}
                                            digitInput={{ color: Color.textColor.otpInput, padding: 5 }}
                                            secureTextEntry={false}
                                            length={6}
                                            digitWrapper={{}}
                                            onComplete={(code) => {
                                                this.setState({ otpCode: code }, () => {
                                                    if (this.state.otpCode.length == 6) {
                                                        this.apiHandler()
                                                    }
                                                })
                                            }}
                                            style={{ color: Color.textColor.primaryColor }}
                                        />
                                    </View>
                                    <View style={styles.resendView}>
                                        <Text style={styles.timerTxt}>
                                            00:{this.state.timer}
                                        </Text>
                                        <TouchableOpacity
                                            onPress={() => { this.setState({ count: this.state.count + 1 }), this.resendOtpApiHandler(), this.setTimerValue() }}
                                            disabled={this.state.timer == 0 ? this.state.resendEnable : this.state.resendDisable}
                                        >
                                            <Text style={[styles.resendOtpTxt, { color: this.state.resendDisable ? Color.textColor.resendOtp : Color.textColor.resendOtp }]}>
                                                {Strings.verifyOtp.resendOtp.toUpperCase()}
                                            </Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </View>
                        </ScrollView>
                    </KeyboardAvoidingView>
                </View>
            </SafeAreaComponent>
        )
    };
};

export default VerifyOtp;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },

    topView: {
        flex: .05,
    },

    backImage: {
        marginLeft: 15,
        marginTop: 10,
        height: 35,
        width: 35
    },

    middleView: {
        flex: .15,
        alignItems: 'center',
        justifyContent: 'center'
    },

    verifyOtpTxt: {
        fontSize: 20,
        fontWeight: '700',
        textAlign: 'center',
        color: Color.textColor.quarternaryColor,
        paddingVertical: 15
    },

    bottomView: {
        flex: .8,
    },

    bottomTopView: {
        flex: .2
    },

    bottomBottomView: {
        flex: .6
    },

    sentTxt: {
        textAlign: 'center',
        color: Color.textColor.secondaryColor,
        fontSize: 14,
        lineHeight: 25,
    },

    wrongNumberTxt: {
        textAlign: 'center',
        color: Color.textColor.wrongNumber,
        fontSize: 14,
        fontWeight: '600',
        paddingTop: 5
    },

    underLine: {
        backgroundColor: Color.textColor.wrongNumber,
        width: 106,
        height: .5,
        alignSelf: 'center'
    },

    buttonView: {
        alignItems: 'center',
        flex: 1,
    },

    otpBoxView: {
        flex: 1,
    },

    resendView: {
        flex: 1,
        alignItems: 'center'
    },

    timerTxt: {
        color: Color.introColor.primaryColor,
        fontSize: 14,
        fontWeight: '600',
        paddingVertical: 10
    },

    resendOtpTxt: {
        fontSize: 14,
        fontWeight: '600',
    }

});
