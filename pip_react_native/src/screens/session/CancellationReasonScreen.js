import React, { Component } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, FlatList, TouchableWithoutFeedback, KeyboardAvoidingView, ScrollView, Keyboard, ImageBackground, Alert } from 'react-native'
import { AppButton, AppImageComponent, SafeAreaComponent, CommonHeader, AppTextComp, CommonDropDown, PopUp } from '../../components';
import { Strings, Assets, Dimen, Color, Styles, Constant } from '../../../res/index';
import { TextInput } from 'react-native-gesture-handler';
import Constants from '../../../res/Constants';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import { NetworkManager, Utility } from '../../utils/index';
import URL, { apis } from '../../../res/URL';
import Session from '../../utils/Session';
import { showToast } from '../../utils/Utility';



var reasonData = [
    { reasonText: 'I am not available at this time', value: 0 },
    { reasonText: 'I choose the wrong Tutor', value: 1 },
    { reasonText: 'I have solved my problem', value: 2 },
    { reasonText: 'Other', value: 3 },
]
var tutorReasonData = [
    { reasonText: 'I am not available at this time', value: 0 },
    { reasonText: 'Bids Placed Mistakenly', value: 1 },
    { reasonText: 'Other', value: 2 },
]


class CancellationReasonScreen extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            reasonSelected: Session.sharedInstance.userDetails[Constants.userDetailsFields.is_tutor] == true ? tutorReasonData[0]['reasonText'] : reasonData[0]['reasonText'],
            startCancelSession: Strings.session.startSession,
            referralCode: '',
            showDialog: false,
            otherCancellationReason: '',
            selectedIndex: 0,
            studentId: '',
            sessionId: '',
            isPopVisible: '',
            reasonData: Session.sharedInstance.userDetails[Constants.userDetailsFields.is_tutor] == true ? tutorReasonData : reasonData,
            verifyChargesDes: ''
        }
    }

    cancelApiHandling = async () => {

        let data = {
            student_id: this.state.studentId,
            session_id: this.state.sessionId,
            cancellation_reason: this.state.reasonSelected
        }

        const res = await NetworkManager.networkManagerInstance.fetchRequest(URL.cancelSession, URL.postRequest, true, data, () => this.apiHandler())
        console.log("this is checking response", res)
        if (res.statusCode == 200) {
            // this.props.navigation.navigate('')
        } else {
            showToast(res.message)
        }
        return
    }

    _renderItem = (item, index) => {
        return (
            <View style={{ flex: 1, paddingTop: 25 }}>
                <TouchableOpacity style={{ flexDirection: 'row', paddingHorizontal: 25, paddingVertical: 5, alignItems: 'center' }}
                    onPress={() => { this.setState({ reasonSelected: item['reasonText'], selectedIndex: index }) }}
                >
                    <Image
                        source={this.state.selectedIndex == index ? Assets.session.filledCirle : Assets.session.unFilledCirle}
                        style={{ width: 20, height: 20 }}
                    >
                    </Image>
                    <Text style={{ fontSize: 14, fontWeight: '700', color: Color.textColor.quarternary, paddingLeft: 15, paddingTop: 0 }}>{item.reasonText}</Text>
                </TouchableOpacity>
            </View>

        )

    }

    render() {
        console.log("this.state.reasonSelected==>>  " + this.state.reasonSelected)
        return (
            <SafeAreaComponent
                color={Color.textColor.pentaColor}
            >
                <View style={styles.container}>
                    <View style={{ flex: .08, paddingHorizontal: 10, justifyContent: 'center', paddingVertical: 15 }}>
                        <CommonHeader
                            backImage={Assets.common.blackBackButton}
                            headerTitleColor={Color.appBackgroundColor}
                            leftIconStyle={{ tintColor: Color.secondayTextColor }}
                            headerTtileFontWieght={'700'}
                            headerTitleFontsize={16}
                            headerTrue={Strings.session.reasonForCancellation}
                        />
                    </View>
                    <View style={{ flex: .92, backgroundColor: Color.appBackgroundColor, borderTopLeftRadius: 20, borderTopRightRadius: 20, }}>
                        <View style={{ flex: 0.89, }}>
                            <View style={{ flex: .45 }}>
                                <FlatList

                                    numColumns={1}
                                    data={this.state.reasonData}
                                    renderItem={({ item, index }) => this._renderItem(item, index)}
                                    keyExtractor={(item, index) => `${index}_users`}
                                />
                            </View>
                            {this.state.reasonSelected == 'Other' ?
                                <View style={{ flex: .36, paddingHorizontal: 30, paddingTop: 15 }}>
                                    <View style={{ flex: .07 }}>
                                        <Text style={{ fontSize: 12, color: Color.textColor.resendOtp }}>
                                            {Strings.session.decreption}
                                        </Text>
                                    </View>
                                    <View style={{ flex: .29, paddingTop: 15 }}>
                                        <TextInput
                                            numberOfLines={5}
                                            multiline={true}
                                            style={{ borderRadius: 8, justifyContent: 'flex-start', paddingTop: 20, height: 149, width: '100%', borderColor: Color.borderColor.primaryColor, borderWidth: 1, paddingHorizontal: 20, }}
                                            textAlignVertical={'top'}
                                            onChangeText={(text) => this.setState({ otherCancellationReason: text })}
                                        ></TextInput>
                                    </View>
                                </View>
                                : <View></View>}
                        </View>


                        <View style={{ flex: 0.03, justifyContent: 'flex-start', width: '90%', alignSelf: 'center' }}>
                            <AppButton
                                onPress={() => {
                                    this.tutorVerifyCharges()
                                }}


                                isEnabled={true}
                                buttonText={Strings.session.cancelSession}
                            />
                        </View>
                    </View>
                </View>
                <PopUp
                    isPopVisible={this.state.isPopVisible}
                    headerText={Strings.session.canelSessionTitle}
                    descriptionText={this.state.verifyChargesDes}
                    rightButtonText={Strings.session.yes}
                    leftButtonText={Strings.session.no}
                    rightButtonOnPress={async () => {

                        this.setState({ isPopVisible: false })
                        this.sessionCancelApiHandler()
                    }}
                    leftButtonOnPress={() => {

                        this.setState({ isPopVisible: false })


                    }}
                />
            </SafeAreaComponent>
        )
    };


    sessionCancelApiHandler = async () => {
        let data = {}
        let api = ''

        if (!Session.sharedInstance.isStudent && Session.sharedInstance.userDetails[Constant.userDetailsFields.isVerified]) {
            api = URL.cancelTutorSession
            data.tutor_id = Session.sharedInstance.userDetails[Constant.userDetailsFields._id]
        } else {
            api = URL.cancelSession
            data.student_id = Session.sharedInstance.userDetails[Constant.userDetailsFields._id]
        }
        data.session_id = this.props.route.params.session_id != '' ? this.props.route.params.session_id : ''
        data.cancellation_reason = this.state.reasonSelected == 'Other' ? 'Other_' + this.state.otherCancellationReason : this.state.reasonSelected

        const res = await NetworkManager.networkManagerInstance.fetchRequest(api, URL.postRequest, true, data, () => this.sessionCancelApiHandler())
        if (res.statusCode == 200) {
            this.setState({ data: res.data })
            Utility.sharedInstance.navigation.navigate('SessionCancelScreen')
        } else {
            if (res.statusCode == 403) {
                showToast(res.message)
            }
        }
    }


    tutorVerifyCharges = async () => {
        let data = {}
        let api = ''

        if (!Session.sharedInstance.isStudent && Session.sharedInstance.userDetails[Constant.userDetailsFields.isVerified]) {
            api = URL.tutorVerifyCharges
            data.tutor_id = Session.sharedInstance.userDetails[Constant.userDetailsFields._id]
        } else {
            api = URL.studentVerifyCharges
            data.student_id = Session.sharedInstance.userDetails[Constant.userDetailsFields._id]
        }
        data.session_id = this.props.route.params.session_id != '' ? this.props.route.params.session_id : ''
        data.type = Constant.verifyCharges.cancellation

        NetworkManager.networkManagerInstance
            .fetchRequest(api, URL.postRequest, true, data, () => this.tutorVerifyCharges())
            .then(res => {
                if (res.statusCode == 200) {

                    if (res.data.percentage_value != '') {
                        this.setState({ verifyChargesDes: `Do you want to cancel this session? You would be charged a cancel fee of ` + res.data.displayMessage.currency_code + ' ' + res.data.displayMessage.percentage_value, isPopVisible: true })
                    } else {
                        this.setState({
                            verifyChargesDes: `Do you want to cancel this session?`, isPopVisible: true
                        })

                    }

                } else {
                    console.log('TUTOR VERIFY CHARGES FAILED')
                }
            })
            .catch(e => {
                console.log('TUTOR VERIFY CHARGES FAILED', e)
            })

    }
};

export default CancellationReasonScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Color.textColor.pentaColor
    },
});
