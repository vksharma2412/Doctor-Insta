import React, { Component } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Image,
    TextInput,
    TouchableWithoutFeedback,
    KeyboardAvoidingView,
    ScrollView,
    Keyboard,
    BackHandler,
    Platform,
    Dimensions
} from 'react-native';
import { AppButton, AppImageComponent, SelectCity } from '../../components';
import { Strings, Assets, Dimen, Color, Styles, URL, AsyncStorageValues } from '../../../res/index';
import { API_CALL, COUNTRY_CODE_API } from '../../redux/Actions';
import { connect } from 'react-redux';
import { NetworkManager } from '../../utils';
import Utility, { showToast } from '../../utils/Utility';
import String from '../../../res/String';
import Flag from 'react-native-flags';
import Session from '../../utils/Session';
import DeviceInfo from 'react-native-device-info';
import firebase from 'react-native-firebase';
import RNExitApp from 'react-native-exit-app';


const majorVersionIOS = parseInt(Platform.Version);
const { width, height } = Dimensions.get("window");
class Login extends Component {

    constructor(props) {
        super(props);
        this.state = {
            mobileNo: '',
            mobileNoLength: 10,
            data: {},
            selectedRegex: '^[+]255[0-9]{10}$',
            country: {
                country: 'Tanzania',
                code: '+255',
                country_code: 'TZ',
                currency_code: "TZS",
              
                currency_symbol: "TSh"
               
            },
            dropdown: false,
        };
    }

    componentDidMount() {

        let context = this;
        firebase.messaging().getToken().then(fcmToken => {
            if (fcmToken) {
                context.fcmToken = fcmToken;
                console.log('[FCM][Token] ' + fcmToken);
            } else {
                console.log('[FCM][Token] user doesn\'t have a device token yet'); // user doesn't have a device token yet
            }
        });

        this.countryCodeApiHandler();
        BackHandler.addEventListener('loginHardwareBackPress', this.handleBackButtonClick);

    }



    async componentWillUnmount() {
        BackHandler.removeEventListener('loginHardwareBackPress', () => { });
    }


    handleBackButtonClick = async () => {
        if (this.props.navigation.dangerouslyGetState().routes[this.props.navigation.dangerouslyGetState().routes.length - 1].name == 'Login') {
            if (Platform.OS == "ios") {
                RNExitApp.exitApp()
            } else {
                BackHandler.exitApp()
            }

        }
    }
    ///////////////////////////////////REQUESTS//////////////////////////////////////
    countryCodeApiHandler = () => {
        let data = {
            api: URL.countryCode,
            requestType: URL.getRequest,
            type: COUNTRY_CODE_API,
            showProgressBar: true,
        };
        this.props.apiDispatcher(data);
    };

    loginAPIHandler = async () => {
        let mobileNo = this.state.country.code + '' + this.state.mobileNo;
        // let mobileNo =   "+91" + this.state.mobileNo
        const deviceId = DeviceInfo.getUniqueId();
        const fcmSchema = {
            device_type: 'mobile',
            deviceId: deviceId,
            regToken: this.fcmToken + '',
        };
        let data = {
            mobile: mobileNo,
            fcmToken: fcmSchema,
            country: this.state.country.country,
            currency_code: this.state.country.currency_code,
            currency: this.state.country.currency_symbol,
            'map': {
                'type': 'Point',
                'coordinates': [
                    0, 1,
                ],
            },
        };
        const res = await NetworkManager.networkManagerInstance.fetchRequest(URL.login, URL.postRequest, true, data, () => {
            this.loginAPIHandler();
        });
        if (res.statusCode === 200) {
            this.props.navigation.navigate('VerifyOtp', {
                mobile: mobileNo,
                _id: res.data._id,
                country: this.state.country.country,
                currency_code: this.state.country.country_code,
                currency: this.state.country.currency_symbol,
            });

            try {
                await Utility.sharedInstance._storeData(AsyncStorageValues.countryName, this.state.country.country, String.asynstorageMsgs.updateCountryName);
                Session.sharedInstance.countryName = this.state.country.country;
                Session.sharedInstance.countryCodeObj = this.state.country;
                await Utility.sharedInstance._storeData(AsyncStorageValues.countryObj, this.state.country, String.asynstorageMsgs.updateCountryName);

            } catch (error) {
                if (__DEV__) {
                    console.log('COULD NOT STORE COUNTRY NAME');
                }
            }
        } else {
            Utility.sharedInstance.showToast(res.message);
        }
    };

    updateCountry = (item, isdropdownVisible) => {


        let mobileNoLength = this.getMobileMaxLength(item);
        let _regx = item.regex;
        let updatedRegex = _regx.replace('+', '[+]');
        updatedRegex = updatedRegex.replace('/', '');

        this.setState({
            dropdown: isdropdownVisible,


            country: item,

            mobileNoLength: mobileNoLength,
            selectedRegex: updatedRegex,
        });
    };

    render() {

        Utility.sharedInstance.navigation = this.props.navigation;
        return (
            <KeyboardAvoidingView
                style={{ flex: 1, flexDirection: 'column' }}
                behavior={Platform.OS === 'ios' ? 'padding' : null}
                enabled>

                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <ScrollView
                        contentContainerStyle={{ flexGrow: 1 }}
                        keyboardShouldPersistTaps='always'
                        showsVerticalScrollIndicator={false}>
                        <View style={{ flex: 1 }}>
                            <View style={{ flex: 0.5 }}>
                                <AppImageComponent
                                    backgroundColor={Color.introColor.quarternaryColor}
                                    src={Assets.login.loginImage}
                                    bottomImg={Assets.common.purpleCut} />
                            </View>
                            {this.footerView()}
                        </View>
                    </ScrollView>
                </TouchableWithoutFeedback>
            </KeyboardAvoidingView>
        );
    }

    footerView() {
        return (
            <View style={{ flex: 0.5, backgroundColor: Color.introColor.quarternaryColor }}>
                <View style={{ flex: 1, backgroundColor: 'white', borderTopLeftRadius: 60, padding: 30 }}>
                    {this.phoneinputView()}
                    <AppButton
                        buttonStyle={{ alignSelf: 'center', width: '100%', marginBottom: 20 }}
                        onPress={() => {
                            if (this.formValidation(this.state.country.code, this.state.mobileNo)) {
                                this.loginAPIHandler();
                            }
                        }}
                        isEnabled={this.state.mobileNo.length === this.state.mobileNoLength ? true : false}
                        buttonText={Strings.login.verifyMobile}
                    />
                    {this.termsCondition()}
                    {this.state.dropdown && this.state.data != undefined && this.state.data != '' && <SelectCity
                        isModalshow={this.state.dropdown}
                        cancelModal={() => this.setState({ dropdown: false })}
                        data={this.state.data}
                        getCountry={this.updateCountry}
                    />}
                </View>
            </View>
        );
    }

    phoneinputView() {
        return (
            <View style={{ flex: 0.65, marginTop: 20 }}>
                <Text style={[styles.textHeader, {
                    textAlign: 'center',
                }]}>{Strings.login.headerEplore}</Text>
                <View style={{ marginTop: 30 }}>
                    <Text style={[Styles.textDesc, { textAlign: 'left' }]}>{Strings.login.enterMobileNo}</Text>

                    <View style={{
                        flexDirection: 'row',
                        borderBottomWidth: 1,
                        borderBottomColor: Color.borderColor.primaryColor,
                    }}>
                        <Flag
                            style={{
                                alignSelf: 'center',


                            }}
                            code={this.state.country.country_code}
                            size={32}
                        />
                        <TouchableOpacity
                            style={{
                                flex: 0.25,
                                flexDirection: 'row',
                                alignItems: 'center',
                                borderRightWidth: 1,
                                borderRightColor: Color.borderColor.primaryColor,
                            }}
                            onPress={() => {
                                this.setState({ dropdown: true }, () => {
                                    if (!this.state.data || this.state.data == '') {
                                        this.countryCodeApiHandler();
                                    }
                                });
                            }}>
                            <Text style={{
                                fontSize: 16,
                                paddingLeft: 10,
                            }}>{this.state.country.code}</Text>
                            <View style={{ paddingHorizontal: 4 }}>
                                <Image source={Assets.common.drop_down} />
                            </View>
                        </TouchableOpacity>
                        <View
                            style={{ flex: 0.75, justifyContent: 'center' }}>
                            <TextInput
                                style={{ color: 'black', paddingLeft: 15, fontSize: 16, padding: 0 }}
                                placeholder={'11 222 3333'}
                                maxLength={this.state.mobileNoLength}
                                onChangeText={(text) => {

                                    if (text.includes('.')) {
                                        showToast(String.toastMsgs.login.validMobileNo);
                                        return false;
                                    }
                                    if (isNaN(text) && text != '.') {
                                        showToast(String.toastMsgs.login.validMobileNo);
                                        return false;
                                    }
                                    this.setState({ mobileNo: text });
                                }}
                                value={this.state.mobileNo}
                                keyboardType={'numeric'}
                            />
                        </View>
                    </View>
                </View>
            </View>
        );
    }

    termsCondition() {
        return <View style={{ alignItems: 'center' }}>
            <Text style={{
                color: Color.textColor.secondaryColor,
                fontSize: Dimen.verySmallTextSize,
            }}>{Strings.login.termscond1}</Text>
            <View style={{ flexDirection: 'row', margin: 3 }}>
                <TouchableOpacity>
                    <Text style={{
                        color: Color.textColor.tertiary,
                        fontSize: Dimen.verySmallTextSize,
                    }}>{Strings.login.termsofuse}</Text>
                </TouchableOpacity>
                <Text style={{
                    color: Color.textColor.secondaryColor,
                    fontSize: Dimen.verySmallTextSize,
                }}> {Strings.login.and} </Text>
                <TouchableOpacity>
                    <Text style={{
                        color: Color.textColor.tertiary,
                        fontSize: Dimen.verySmallTextSize,
                    }}>{Strings.login.privacyPolicy}</Text>
                </TouchableOpacity>
            </View>
        </View>;
    }

    getMobileMaxLength = (_data) => {
        let str = _data.regex;
        let brcopen = str.indexOf('{').toString();
        let brcClose = str.indexOf('}').toString();
        let mobileMaxLength = str.substring(parseInt(brcopen) + 1, parseInt(brcClose));
        return parseInt(mobileMaxLength);
    };

    formValidation = (country_code, mobileNo) => {
        if (!Utility.sharedInstance.validateEmptyField(country_code, String.toastMsgs.login.countryCodeNotFound)) {
            return false;
        }
        if (!Utility.sharedInstance.validateEmptyField(mobileNo, String.toastMsgs.login.pleaseEnterMobile)) {
            return false;
        }
        if (!Utility.sharedInstance.validateMobileNumber(this.state.country.code + mobileNo, this.state.selectedRegex, String.toastMsgs.login.validMobileNo)) {
            return false;
        }

        return true;
    };

    UNSAFE_componentWillReceiveProps = nextProps => {
        let defaultCountryObj = {};

        Utility.sharedInstance.HOC.showHideProgressBar(true);

        if (nextProps.countryCode.statusCode) {
            try {
                defaultCountryObj = nextProps.countryCode.data.filter((obj) => obj.code == '+255');
            } catch (error) {
            }
            this.setState({
                data: nextProps.countryCode.data != '' ? nextProps.countryCode.data : '',
                country: defaultCountryObj != '' ? defaultCountryObj[0] : '',
            });
            Utility.sharedInstance.HOC.showHideProgressBar(false);
        }
        Utility.sharedInstance.HOC.showHideProgressBar(false);
    };



};


const mapStateToProps = state => {

    return {
        countryCode: state.apiReducer.countryCode.data != '' ? state.apiReducer.countryCode : '',
    };
};

const mapDispatchToProps = dispatch => {
    return {
        apiDispatcher: (data) => dispatch({ type: API_CALL, data }),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Login);


const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    textHeader: {
        color: Color.textColor.primaryColor,
        fontSize: Dimen.xvlargeTextSize,
        fontWeight: 'bold',
    },
    textDesc: {
        // marginTop: 20,
        paddingTop: 10,
        color: Color.textColor.secondaryColor,
        fontSize: Dimen.smallTextSize,
        // lineHeight: 25,
        textAlign: 'center',
    },

});
