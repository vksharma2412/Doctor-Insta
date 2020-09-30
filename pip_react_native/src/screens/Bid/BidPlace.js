import React, { Component } from 'react';
import { View, Text, StyleSheet, KeyboardAvoidingView, TextInput, TouchableWithoutFeedback, Keyboard, Image, Dimensions, ImageBackground, FlatList, TouchableOpacity } from 'react-native'
import { CommonHeader, SafeAreaComponent, AppButton, AppTextComp } from '../../components';
import { Color, Dimen, Strings, Assets, URL, Constant } from '../../../res';
import Session from '../../utils/Session';
import Constants from '../../../res/Constants';
import { NetworkManager, NavUtil } from '../../utils';
// import firebase from 'react-native-firebase';
import Utility, { showToast, validateEmailAddress, validateEmptyField, _storeData } from "../../utils/Utility";
import { ScrollView } from 'react-native-gesture-handler';
import String from '../../../res/String';




class BidPlace extends Component {

    constructor(props) {
        super(props)
        this.state = {
            bidAmount: '',
            proposalDeecreption: '',
            session_id: this.props.route.params.session_id != '' ? this.props.route.params.session_id : '',
            data: this.props.route.params.data != undefined ? this.props.route.params.data : '',
            max: '',
            min: '',
        }
    }

    async componentDidMount() {
        await this.getBiddingPriceApiHandler()
    }

    placeBid = async () => {


        if (!this.formValidation()) {
            return
        }
        let data = {}

        data.session_id = this.state.session_id;
        data.tutor_id = Session.sharedInstance.userDetails[Constant.userDetailsFields._id];
        data.bid_amount = this.state.bidAmount;
        data.description = this.state.proposalDeecreption;
        data.currency = Session.sharedInstance.countryCodeObj.currency_symbol;


        const res = await NetworkManager.networkManagerInstance.fetchRequest(URL.placeBid, URL.postRequest, true, data, () => this.placeBid())
        if (res.statusCode == 200) {
            NavUtil.navUtil.navigateTo(this, Constants.routeName.BidplaceSuccess)
            //  this.setState({ activeSession: res.data.result, scheduleSession: res.data.Ongoing })
        } else {
            showToast(res.message)
            console.log('BOOKING FAILED')
        }
    }



    getBiddingPriceApiHandler = async () => {


        let params = {}

        params.country = Session.sharedInstance.countryName
        params.education = this.props.route.params.data.education
        params.grade = this.props.route.params.data.grade
        params.subject = this.props.route.params.data.subjects

        const res = await NetworkManager.networkManagerInstance.fetchRequest('tutor/getBiddingPrice', URL.postRequest, true, params, () => this.getBiddingPriceApiHandler())
        if (res.statusCode == 200) {
            if (res.data != {} || res.data)
                this.setState({ max: res.data.max_amt, min: res.data.min_amt })
            else
                showToast("Bid range not available")
        } else {
            showToast(res.message)
            NetworkManager.networkManagerInstance.progressBarRequest(false)
        }

    }


    render() {
        const {
            bidAmount,
        } = this.state
        return (
            <SafeAreaComponent
                StatusBarTextColor={'light-content'}
                color={Color.textColor.pentaColor}
            >
                <ScrollView>
                    <View style={{ flex: 1, backgroundColor: Color.secondayTextColor }}>
                        <View style={{ flex: 1, height: Dimen.phoneHeight }}>
                            <View style={{ flex: 0.12, backgroundColor: Color.textColor.pentaColor, justifyContent: 'center' }}>
                                <CommonHeader
                                    onPress={() => this.props.navigation.goBack()}
                                    containerStyle={{ marginHorizontal: '3%' }}
                                    headerTrue={Strings.bid.placeABid}
                                    headerTitleFontsize={Dimen.mediumTextSize}
                                    headerTitleColor={Color.secondayTextColor}
                                    leftIconStyle={{ tintColor: Color.secondayTextColor }}
                                />
                            </View>
                            <View style={{ flex: 0.88, top: -20, borderTopLeftRadius: 20, borderTopRightRadius: 20, height: Dimen.phoneHeight, width: '100%', backgroundColor: Color.secondayTextColor }}>
                                <View style={{ flex: 3, padding: 25 }}>
                                    <View style={{ flex: 1 }}>
                                        <AppTextComp
                                            value={bidAmount}
                                            onChangeText={(text) => {
                                                if (text.includes(".")) {
                                                    showToast(Strings.toastMsgs.placeaBid.enterValidPrice);
                                                    return false
                                                }
                                                if (isNaN(text) && text != ".") {
                                                    showToast(Strings.toastMsgs.placeaBid.enterValidPrice);
                                                    return false;
                                                }
                                                this.setState({ bidAmount: text })
                                            }}
                                            placeholder={Strings.bid.bidAmount + '( In ' + Session.sharedInstance.countryCodeObj.currency_symbol + ' )'}
                                            editable={true}
                                            fontSize={16}
                                            style={{ paddingTop: 10 }}
                                            autoCapitalize='none'
                                            labelEnabled={true}
                                            tintColor={Color.borderColor.secondaryColor}
                                            lineWidth={1}
                                            activeLineWidth={1}
                                            width='100%'
                                            keyboardType='numeric'
                                            materialTextInput />
                                    </View>
                                    <View style={{ flex: 2, paddingTop: 20 }}>
                                        <View style={{ flex: .20 }}>
                                            <Text style={{ fontSize: 12 }}>{Strings.bid.describeProposal}</Text>
                                        </View>
                                        <View style={{ flex: 1.80, paddingTop: 15, color: Color.borderColor.primaryColor }}>
                                            <TextInput
                                                style={{ borderRadius: 8, justifyContent: 'flex-start', paddingTop: 20, height: 125, width: '100%', borderColor: Color.borderColor.primaryColor, borderWidth: 1, paddingHorizontal: 20, }}
                                                multiline={true}
                                                value={this.state.description}
                                                onChangeText={(text) => this.setState({ proposalDeecreption: text })}
                                                textAlignVertical={'top'}
                                            />
                                        </View>
                                    </View>
                                </View>
                                <View style={{ flex: 5 }}>
                                    <View style={{ flex: 3.5, padding: 25 }}>
                                    </View>
                                    <View style={{ flex: .5, alignItems: 'center', justifyContent: 'center' }}>
                                        <AppButton
                                            buttonStyle={{ width: '90%' }}
                                            onPress={() => this.placeBid()}
                                            isEnabled={true}
                                            buttonText={Strings.bid.submint}
                                        />
                                    </View>
                                    <View style={{ flex: 1, }}>
                                    </View>
                                </View>
                            </View>
                        </View>
                    </View>
                </ScrollView>
            </SafeAreaComponent>
        )
    };


    formValidation() {


        if (!Utility.sharedInstance.validateEmptyField(this.state.proposalDeecreption.toString(), String.toastMsgs.slotBookingToastMsgs.eneterDescription)) {
            return
        }



        if (this.state.min != undefined && this.state.max != undefined)
            if (!(parseInt(this.state.min) <= parseInt(this.state.bidAmount) && parseInt(this.state.max) >= parseInt(this.state.bidAmount))) {
                showToast(`For this education minimum bid amount should be ` + `${this.state.min} ` + `and bid amount is ` + ` ${this.state.max}`)
                return
            }




        return true
    }

};

export default BidPlace;

const styles = StyleSheet.create({
    ProfilePic: {
        width: 100,
        height: 100,
        alignItems: 'center',
        justifyContent: 'center',
    },

});