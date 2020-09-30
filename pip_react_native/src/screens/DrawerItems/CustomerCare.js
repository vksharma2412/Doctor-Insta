import React, { Component } from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet, KeyboardAvoidingView, ScrollView, TouchableWithoutFeedback, Keyboard, Image, Dimensions, ImageBackground } from 'react-native'
import { CommonHeader, SafeAreaComponent, AppButton, PlaceholderComponent, AppTextComp, CommonDropDown } from '../../components';
import { Color, Dimen, Strings, Assets, Constant, URL } from '../../../res';
import Constants from '../../../res/Constants';
import String from '../../../res/String';
import { TextInput } from 'react-native-gesture-handler';
import Session from '../../utils/Session';
import { NetworkManager, Utility } from '../../utils';
import { showToast } from '../../utils/Utility';


class MyTutor extends Component {

    constructor(props) {
        super(props)
        this.state = {
            name: '',
            email: '',
            description: '',
        }
    }


    render() {
        return (

            <SafeAreaComponent
                StatusBarTextColor={'light-content'}
                color={Color.textColor.pentaColor}

            >

                <KeyboardAvoidingView
                    style={{ flex: 1, flexDirection: 'column', }}
                    behavior={Platform.OS === 'ios' ? 'padding' : null}
                    enabled>

                    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                        <ScrollView
                            contentContainerStyle={{ flexGrow: 1, }}
                            keyboardShouldPersistTaps='always'
                            showsVerticalScrollIndicator={false}>
                            <View style={{ flex: 1 }}>
                                <View style={{ flex: 1, height: Dimen.phoneHeight }}>
                                    <View style={{ flex: 0.12, backgroundColor: Color.textColor.pentaColor, justifyContent: 'center' }}>
                                        <CommonHeader
                                            backImage={Assets.homeScreen.side_menu_icon}
                                            onPress={() => this.props.navigation.openDrawer()}
                                            containerStyle={{ marginHorizontal: '3%' }}
                                            headerTrue={Strings.customerCare.customerCare}
                                            headerTitleFontsize={Dimen.mediumTextSize}
                                            headerTitleColor={Color.secondayTextColor}
                                            leftIconStyle={{ tintColor: Color.secondayTextColor }}
                                        />
                                    </View>
                                    <View style={{ flex: 0.88, top: -20, borderTopLeftRadius: 20, borderTopRightRadius: 20, height: Dimen.phoneHeight, width: '100%', backgroundColor: Color.secondayTextColor }}>
                                        {/* <KeyboardAvoidingView
                            contentContainerStyle={{ flex: 1, backgroundColor: 'red', height: Dimen.phoneHeight, width: Dimen.phoneWidth }}
                        >
                            <ScrollView
                                contentContainerStyle={{ flexGrow: 1, paddingTop: 20 }}
                                keyboardShouldPersistTaps='always'
                            > */}
                                        <View style={{ flex: 0.70, marginHorizontal: '5%' }}>
                                            <AppTextComp
                                                value={this.state.name}
                                                onChangeText={(text) => this.setState({ name: text })}
                                                placeholder={String.studentSignUp.fullName}
                                                fontSize={16}

                                                autoCapitalize='none'
                                                labelEnabled={true}
                                                tintColor={Color.borderColor.secondaryColor}
                                                lineWidth={1}
                                                activeLineWidth={1}
                                                width='100%'
                                                style={{ paddingTop: 10 }}
                                                keyboardType='default'
                                                materialTextInput />
                                            <AppTextComp
                                                value={this.state.email}
                                                onChangeText={(text) => this.setState({ email: text })}
                                                placeholder={String.studentSignUp.emailAddress}
                                                fontSize={16}

                                                autoCapitalize='none'
                                                labelEnabled={true}
                                                tintColor={Color.borderColor.secondaryColor}
                                                lineWidth={1}
                                                activeLineWidth={1}
                                                width='100%'
                                                style={{ paddingTop: 10 }}
                                                keyboardType='default'
                                                materialTextInput />

                                            <View style={{ paddingTop: 20, paddingBottom: 30 }}>
                                                <Text style={{ paddingVertical: 10 }}>{String.customerCare.placeholder}</Text>
                                                <TextInput
                                                    style={{ borderRadius: 8, justifyContent: 'flex-start', paddingTop: 20, height: 200, width: '100%', borderColor: Color.borderColor.primaryColor, borderWidth: 1, paddingHorizontal: 20, }}
                                                    multiline={true}
                                                    value={this.state.description}
                                                    onChangeText={(text) => this.setState({ description: text })}
                                                    textAlignVertical={'top'}
                                                />
                                            </View>
                                        </View>
                                    </View>
                                    <View style={{ flex: .07, backgroundColor: Color.secondayTextColor }}>
                                        {this.continueButton()}
                                    </View>
                                    <View style={{ flex: .1, backgroundColor: Color.secondayTextColor }}>
                                    </View>
                                </View>
                            </View>
                        </ScrollView>
                    </TouchableWithoutFeedback>
                </KeyboardAvoidingView>


            </SafeAreaComponent>



        )
    };


    continueButton() {
        return (
            <View style={{ flex: 0.1, width: '90%', flex: 1, bottom: 0, justifyContent: 'flex-end', alignItems: 'center', alignSelf: 'center' }}>

                <AppButton
                    buttonStyle={{ width: '95%' }}
                    onPress={this.customerCareApiHandler}
                    isEnabled={true}
                    buttonText={String.homeScreen.submit}
                />
            </View>
        )
    }




    customerCareApiHandler = async () => {

        // "user_id": "5f24295cee88b028c07fa4cf",
        //     "name": "Deepak",
        //         "email": "meenu.singh@affle.com",
        //             "description": "Hello how are you"

        if (!this.formValidation()) {
            return
        }

        let params = {}

        params.user_id = Session.sharedInstance.userDetails._id,
            params.name = this.state.name
        params.email = this.state.email
        params.description = this.state.description



        const res = await NetworkManager.networkManagerInstance.fetchRequest(URL.customerQuery, URL.postRequest, true, params, () => {
            this.customerCareApiHandler()
        });
        if (res.statusCode === 200) {

            showToast(res.message)
            this.props.navigation.navigate(Constant.routeName.homeScreen, {
            })
        } else {
            Utility.sharedInstance.showToast(res.message)
        }
    }



    loginAPIHandler = async () => {

        // let mobileNo =   "+91" + this.state.mobileNo

        let data = {
            mobile: mobileNo,
            country: this.state.countryCodeObj.country_code,
            currency_code: this.state.countryCodeObj.currency_code,
            currency: this.state.countryCodeObj.currency_symbol,
            "map": {
                "type": "Point",
                "coordinates": [
                    0, 1
                ]
            },
        }
        const res = await NetworkManager.networkManagerInstance.fetchRequest(URL.login, URL.postRequest, true, data, () => {
            this.loginAPIHandler()
        });
        if (res.statusCode === 200) {
            this.props.navigation.navigate('VerifyOtp', {
                mobile: mobileNo,
                _id: res.data._id,
                country: this.state.countryCodeObj.country_code,
                currency_code: this.state.countryCodeObj.currency_code,
                currency: this.state.countryCodeObj.currency_symbol,
            })
        } else {
            Utility.sharedInstance.showToast(res.message)
        }
    }




    formValidation = () => {
        if (!Utility.sharedInstance.validateEmptyField(this.state.name, String.toastMsgs.studentReg.enterName)) {
            return false
        }
        if (this.state.name.length > 0) {
            if (!Utility.sharedInstance.validateName(this.state.name)) {
                return false
            }
        }
        if (!Utility.sharedInstance.validateEmptyField(this.state.email, String.toastMsgs.studentReg.enterEmail)) {
            return false
        }
        if (!Utility.sharedInstance.validateEmailAddress(this.state.email)) {
            return false
        }
        if (!Utility.sharedInstance.validateEmptyField(this.state.description, String.toastMsgs.customerCare.enterDesc)) {
            return false
        }

        return true
    }


};

export default MyTutor;

const styles = StyleSheet.create({
    container: {
        flex: 1,

    },
    buttonStyle: {
        padding: 10,
        borderWidth: 1,
        borderRadius: 5,
        margin: 20
    },
    textStyle: {
        fontSize: 14
    },
    responsiveImage: {
        width: Dimen.phoneWidth - 20,
        height: undefined,
        alignSelf: 'center',
        aspectRatio: 135 / 85,
        borderRadius: 10
    },
});