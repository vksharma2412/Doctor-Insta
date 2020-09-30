import React, { Component } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, FlatList, TouchableWithoutFeedback, KeyboardAvoidingView, ScrollView, Keyboard, ImageBackground, Alert } from 'react-native'
import { AppButton, AppImageComponent, SafeAreaComponent, CommonHeader, AppTextComp, CommonDropDown, PopUp } from '../../components';
import { Strings, Assets, Dimen, Color, Styles, Constant } from '../../../res/index';
import { TextInput } from 'react-native-gesture-handler';
import Constants from '../../../res/Constants';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import { NetworkManager, Utility, NavUtil } from '../../utils/index';
import URL, { apis } from '../../../res/URL';
import Session from '../../utils/Session';
import { showToast } from '../../utils/Utility';



var reasonData = [
    { reasonText: 'Not happy with the Lesson', value: 0 },
    { reasonText: 'Not happy with the Tutor', value: 1 },
    { reasonText: 'Tutor did not answer my question', value: 2 },
    { reasonText: 'Tutor did not understand the subject matter', value: 3 },
    { reasonText: 'The video did not work', value: 4 },
    { reasonText: 'I could not hear my Tutor', value: 5 },
    { reasonText: 'Other', value: 6 },
]
class RaiseDisputeScreen extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            reasonSelected: [],
            startCancelSession: Strings.session.startSession,
            referralCode: '',
            showDialog: false,
            otherCancellationReason: '',
            selectedIndex: 0,
            studentId: '',
            sessionId: '',
            isPopVisible: '',
            disputeList: [],
            selected_id: '',
            student_id: "",
            tutor_id: "",
            session_id: "",

        }
    }

    async componentWillMount() {



        await this.getDisputeList()


        let student_id
        let tutor_id
        let session_id

        if (this.props.route.params.session_id != undefined) {
            if (this.props.route.params.student_id != undefined) {
                student_id = this.props.route.params.student_id
            }
            if (this.props.route.params.tutor_id != undefined) {
                tutor_id = this.props.route.params.tutor_id
            }
            if (this.props.route.params.session_id != undefined) {
                session_id = this.props.route.params.session_id
            }
        }

        if (this.props.route.params != undefined) {
            if (this.props.route.params.hasOwnProperty('student_id')) {
                student_id = this.props.route.params.student_id
            }
            if (this.props.route.params.hasOwnProperty('tutor_id')) {
                tutor_id = this.props.route.params.tutor_id
            }
            if (this.props.route.params.hasOwnProperty('tutor_id')) {
                session_id = this.props.route.params.session_id
            }
        }


        this.setState({ student_id: student_id, tutor_id: tutor_id, session_id: session_id })

    }

    cancelApiHandling = async () => {

        let data = {
            student_id: this.state.studentId,
            session_id: this.state.sessionId,
            cancellation_reason: this.state.reasonSelected
        }

        const res = await NetworkManager.networkManagerInstance.fetchRequest(URL.cancelSession, URL.postRequest, true, data, () => this.apiHandler())
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
                    onPress={() => { this.setState({ reasonSelected: item.option, selectedIndex: index, selected_id: item._id }) }}
                >
                    <Image
                        source={this.state.selectedIndex == index ? Assets.session.filledCirle : Assets.session.unFilledCirle}
                        style={{ width: 20, height: 20 }}
                    >
                    </Image>
                    <Text style={{ fontSize: 14, fontWeight: '700', color: Color.textColor.quarternary, paddingLeft: 15, paddingTop: 0 }}>{item.option}</Text>
                </TouchableOpacity>
            </View>

        )

    }

    render() {
        return (
            <SafeAreaComponent
                color={Color.textColor.pentaColor}
                StatusBarTextColor={'light-content'}

            >
                <View style={styles.container}>
                    <View style={{ flex: .08, paddingHorizontal: 10, marginTop: 10 }}>
                        <CommonHeader
                            backImage={Assets.common.blackBackButton}
                            headerTitleColor={Color.appBackgroundColor}
                            leftIconStyle={{ tintColor: Color.secondayTextColor }}
                            headerTtileFontWieght={'700'}
                            headerTitleFontsize={16}
                            headerTrue={Strings.session.raisedisputetolowercase}
                        />
                    </View>
                    <View style={{ flex: .92, backgroundColor: Color.appBackgroundColor, borderTopLeftRadius: 20, borderTopRightRadius: 20, }}>
                        <View style={{ flex: 1, }}>
                            <View style={{ flex: 1 }}>
                                <FlatList

                                    numColumns={1}
                                    data={this.state.disputeList}
                                    renderItem={({ item, index }) => this._renderItem(item, index)}
                                    keyExtractor={(item, index) => `${index}_users`}
                                />

                            </View>
                            {this.state.reasonSelected == 'Other' && <View style={{ flex: .95, paddingHorizontal: 30 }}>

                                <View style={{ flex: .08, marginTop: 10 }}>
                                    <Text style={{ fontSize: 12, color: Color.textColor.resendOtp }}>
                                        {Strings.session.decreption}
                                    </Text>
                                </View>
                                <View style={{ flex: .72, marginTop: 15 }}>
                                    <TextInput
                                        numberOfLines={5}
                                        multiline={true}
                                        style={{ borderRadius: 8, justifyContent: 'flex-start', paddingTop: 20, height: 125, width: '100%', borderColor: Color.borderColor.primaryColor, borderWidth: 1, paddingHorizontal: 20, }}
                                        textAlignVertical={'top'}
                                        onChangeText={(text) => this.setState({ otherCancellationReason: text })}
                                    ></TextInput>
                                </View>
                            </View>}

                        </View>


                        <View style={{ flex: 0.11, justifyContent: 'flex-start', width: '90%', alignSelf: 'center' }}>
                            <AppButton
                                onPress={() => { this.setState({ isPopVisible: true }) }}
                                isEnabled={true}
                                buttonText={Strings.homeScreen.submit}
                            />
                        </View>
                    </View>
                </View>

                <PopUp
                    isPopVisible={this.state.isPopVisible}
                    headerText={Strings.session.raisedisputetolowercase}
                    descriptionText={Strings.session.raisepopupDiscreption}
                    rightButtonText={Strings.session.yes}
                    leftButtonText={Strings.session.no}
                    rightButtonOnPress={async () => {
                        this.setState({ isPopVisible: false })
                        this.raiseDisputeApiHandler()
                    }}
                    leftButtonOnPress={() => {
                        this.setState({ isPopVisible: false })
                    }}
                />
            </SafeAreaComponent>
        )
    };


    raiseDisputeApiHandler = async () => {
        let data = {}
        let api = ''

        data.user_id_from = Session.sharedInstance.userDetails[Constant.userDetailsFields._id]
        data.dispute_id = this.state.selected_id
        data.session_id = this.state.session_id
        if (this.state.reasonSelected != '') {
            data.description = this.state.reasonSelected == 'Other' ? 'Other_' + this.state.reasonSelected : this.state.reasonSelected
        }
        if (!Session.sharedInstance.isStudent && Session.sharedInstance.userDetails[Constant.userDetailsFields.isVerified]) {
            api = URL.raiseDisputeTutor
            data.user_id_to = this.state.student_id
        } else {
            api = URL.raiseDisputeStudent
            data.user_id_to = this.state.tutor_id
        }
        const res = await NetworkManager.networkManagerInstance.fetchRequest(api, URL.postRequest, true, data, () => this.raiseDisputeApiHandler())
        if (res.statusCode == 200) {
            this.setState({ data: res.data })
            showToast(res.message)
            NavUtil.navUtil.navigateTo(this, Constants.routeName.homeScreen)
        } else {
            console.log('RAISE DISPUTE FAILED')
        }
    }



    getDisputeList = async () => {

        let data = {}
        if (!Session.sharedInstance.isStudent && Session.sharedInstance.userDetails[Constant.userDetailsFields.isVerified]) {
            data.is_tutor = true
        } else {
            data.is_student = true
        }
        const res = await NetworkManager.networkManagerInstance.fetchRequest(URL.getDisputeList, URL.postRequest, true, data, () => this.getDisputeList())
        if (res.statusCode == 200) {
            this.setState({ disputeList: res.data, reasonSelected: res.data[0].option, selected_id: res.data[0]._id })
        } else {
            console.log('DISPUTE LIST')
        }
    }
};

export default RaiseDisputeScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Color.textColor.pentaColor
    },
});
