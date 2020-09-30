import React, { Component } from 'react';
import { View, Text, StyleSheet, KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard, Image, Dimensions, ImageBackground, FlatList, TouchableOpacity } from 'react-native'
import { CommonHeader, SafeAreaComponent, AppButton, AppTextComp } from '../../components';
import { Color, Dimen, Strings, Assets, URL } from '../../../res';
import { NetworkManager } from '../../utils';
// import firebase from 'react-native-firebase';
import Utility, { showToast, validateEmailAddress, validateEmptyField, _storeData } from "../../utils/Utility";




class PaymentSummary extends Component {

    constructor(props) {
        super(props)
        this.state = {
            subjeceSessionName: 'English Session',
            tutorName: 'Jasmine Merlette',
            tutorEducation: 'Post Graduate',
            sessionDate: '12 July, 2020',
            sessionTime: '10:00-11:00 AM',
            subTotalAmont: '$25.00',
            discountAmount: '$25.00',
            serviceChargeAmount: '$25.00',
            estimatedTaxAmount: '$25.00',
            totalAmount: '$25.00'
        }
    }

    makePayment = async () => {
        this.props.navigation.navigate('PaymentSucess')
        // const res = await NetworkManager.networkManagerInstance.fetchMultiPartRequest(URL.getTutorList, URL.getRequest, true, data, () => this.getTutorListData())
        // if (res == 200) {
        //     this.props.navigation.navigate('PaymentSucess')
        // } else {
        //     showToast(res.message)
        // }
    }


    render() {
        const {
            subjeceSessionName,
            tutorName,
            tutorEducation,
            sessionDate,
            sessionTime,
            subTotalAmont,
            discountAmount,
            serviceChargeAmount,
            estimatedTaxAmount,
            totalAmount
        } = this.state
        return (
            <SafeAreaComponent
                StatusBarTextColor={'light-content'}
                color={Color.textColor.pentaColor}
            >
                <View style={{ flex: 1, backgroundColor: Color.secondayTextColor }}>
                    <View style={{ flex: 1, height: Dimen.phoneHeight }}>
                        <View style={{ flex: 0.12, backgroundColor: Color.textColor.pentaColor, justifyContent: 'center' }}>
                            <CommonHeader
                                onPress={() => this.props.navigation.goBack()}
                                containerStyle={{ marginHorizontal: '3%' }}
                                headerTrue={Strings.payment.paymentSummary}
                                headerTitleFontsize={Dimen.mediumTextSize}
                                headerTitleColor={Color.secondayTextColor}
                                leftIconStyle={{ tintColor: Color.secondayTextColor }}
                            />
                        </View>
                        <View style={{ flex: 0.88, top: -20, borderTopLeftRadius: 20, borderTopRightRadius: 20, height: Dimen.phoneHeight, width: '100%', backgroundColor: Color.secondayTextColor }}>
                            <View style={{ flex: 3, padding: 25 }}>
                                <View style={{ flex: .60 }}>
                                    <Text style={{ fontSize: 22, fontWeight: 'bold', color: Color.textColor.quarternary }}>{subjeceSessionName}</Text>
                                </View>
                                <View style={{ flex: 1.2, flexDirection: 'row', alignItems: 'center' }}>
                                    <Image source={Assets.session.sampleProfile} style={{ height: 80, width: 80 }}>
                                    </Image>
                                    <View style={{ paddingLeft: 15 }}>
                                        <Text style={{ fontSize: 20, color: Color.textColor.quarternary, lineHeight: 30 }}>{tutorName}</Text>
                                        <Text style={{ fontSize: 16, color: Color.borderColor.primaryColor, lineHeight: 30 }}>{tutorEducation}</Text>
                                    </View>
                                </View>
                                <View style={{ flex: 1.2, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                                    <View style={{ flex: .40 }}>
                                        <AppTextComp
                                            value={sessionDate}
                                            onChangeText={(text) => this.setState({ sessionDate: text })}
                                            placeholder={'Session date'}
                                            editable={false}
                                            fontSize={16}
                                            style={{ paddingTop: 10 }}
                                            autoCapitalize='none'
                                            labelEnabled={true}
                                            tintColor={Color.borderColor.secondaryColor}
                                            lineWidth={0}
                                            activeLineWidth={1}
                                            width='100%'
                                            keyboardType='default'
                                            materialTextInput />
                                    </View>
                                    <View style={{ flex: .20 }}>
                                    </View>
                                    <View style={{ flex: .40 }}>
                                        <AppTextComp
                                            value={sessionTime}
                                            onChangeText={(text) => this.setState({ sessionTime: text })}
                                            placeholder={'Session time'}
                                            editable={false}
                                            fontSize={16}
                                            style={{ paddingTop: 10 }}
                                            autoCapitalize='none'
                                            labelEnabled={true}
                                            tintColor={Color.borderColor.secondaryColor}
                                            lineWidth={0}
                                            activeLineWidth={1}
                                            width='100%'
                                            keyboardType='default'
                                            materialTextInput />
                                    </View>
                                </View>
                            </View>
                            <View style={{ backgroundColor: 'black', height: 10, opacity: .1 }}></View>
                            <View style={{ flex: 5 }}>
                                <View style={{ flex: 4.5, padding: 25 }}>
                                    <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between' }}>
                                        <Text style={{ fontSize: 14, color: Color.textColor.quarternary }}>{Strings.payment.subTotal}</Text>
                                        <Text style={{ fontSize: 14, color: Color.textColor.quarternary }}>{subTotalAmont}</Text>
                                    </View>
                                    <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between' }}>
                                        <Text style={{ fontSize: 14, color: Color.textColor.quarternary }}>{Strings.payment.discount}</Text>
                                        <Text style={{ fontSize: 14, color: Color.textColor.quarternary }}>{discountAmount}</Text>
                                    </View>
                                    <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between' }}>
                                        <Text style={{ fontSize: 14, color: Color.textColor.quarternary }}>{Strings.payment.serviceCharge}</Text>
                                        <Text style={{ fontSize: 14, color: Color.textColor.quarternary }}>{serviceChargeAmount}</Text>
                                    </View>
                                    <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between' }}>
                                        <Text style={{ fontSize: 14, color: Color.textColor.quarternary }}>{Strings.payment.estimatedTax}</Text>
                                        <Text style={{ fontSize: 14, color: Color.textColor.quarternary }}>{estimatedTaxAmount}</Text>
                                    </View>
                                    <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between' }}>
                                        <Text style={{ fontSize: 16, fontWeight: '700', color: Color.textColor.quarternary }}>{Strings.payment.total}</Text>
                                        <Text style={{ fontSize: 16, fontWeight: '700', color: Color.textColor.quarternary }}>{totalAmount}</Text>
                                    </View>
                                </View>
                                <View style={{ flex: .5, alignItems: 'center', justifyContent: 'center' }}>
                                    <AppButton
                                        buttonStyle={{ width: '90%' }}
                                        onPress={() => this.makePayment()}
                                        isEnabled={true}
                                        buttonText={Strings.payment.proceedToPay}
                                    />
                                </View>
                            </View>
                        </View>
                    </View>
                </View>
            </SafeAreaComponent>
        )
    };
};

export default PaymentSummary;

const styles = StyleSheet.create({
    ProfilePic: {
        width: 100,
        height: 100,
        alignItems: 'center',
        justifyContent: 'center',
    },

});
