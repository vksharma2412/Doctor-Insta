import React, { Component } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, TextInput, ImageBackground, TouchableWithoutFeedback, KeyboardAvoidingView, ScrollView, Keyboard, Alert } from 'react-native'
import { AppButton, AppImageComponent, CommonHeader, SafeAreaComponent, InputTextField, AppTextInput, AppTextComp, CommonDropDown } from '../../components';
import { Strings, Assets, Dimen, Color, Styles, URL, Constant, AsyncStorageValues } from '../../../res/index';
import { NetworkManager } from '../../utils';
import Utility, { showToast, validateEmailAddress, validateEmptyField, _storeData } from "../../utils/Utility";
import AsyncStorage from '@react-native-community/async-storage';
import Session from '../../utils/Session';
import Constants from '../../../res/Constants';
let moment = require('moment')






class MyTutorDetails extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            student_Id: this.props.route.params.student_Id != undefined ? this.props.route.params.student_Id : '',
            session_Id: this.props.route.params.session_Id != undefined ? this.props.route.params.session_Id : '',
            tutor_Id: this.props.route.params.tutor_Id != undefined ? this.props.route.params.tutor_Id : '',
            subject: this.props.route.params.subject != undefined ? this.props.route.params.subject : '',
            passIndex: this.props.route.params.passIndex != undefined ? this.props.route.params.passIndex : '',
            tutorPic: '',
            name: '',
            education: '',
            ratedValue: '',
            topic: '',
            description: '',
            sessionDate: '',
            start_Time: '',
            end_Time: '',
            amountPaid: '',
            paymentMode: ''

        }

    }

    componentDidMount() {
        this.getTutorSessionDetails()
    }

    getTutorSessionDetails = async () => {
        let data = {
            student_id: this.state.student_Id,
            session_id: this.state.session_Id,
            tutor_id: this.state.tutor_Id
        }
        const res = await NetworkManager.networkManagerInstance.fetchRequest(URL.getTutorProfile, URL.postRequest, true, data, () => this.getTutorSessionDetails())
        console.log('this is checking data on Tutor Details', JSON.stringify(res.data[0].BidPostedBy[0].rating))
        if (res.statusCode == 200) {
            this.setState({
                tutorPic: res.data[0].BidPostedBy[0].profile_picture != undefined ? res.data[0].BidPostedBy[0].profile_picture : '',
                name: res.data[0].BidPostedBy[0].name != undefined ? res.data[0].BidPostedBy[0].name : '',
                education: res.data[0].BidPostedBy[0].qualification != undefined ? res.data[0].BidPostedBy[0].qualification : '',
                ratedValue: res.data[0].BidPostedBy[0].rating[this.state.passIndex].star_rating == 0 || undefined ? 5 : res.data[0].BidPostedBy[0].rating[this.state.passIndex].star_rating,
                topic: res.data[0].topic != undefined ? res.data[0].topic : '',
                description: res.data[0].description != undefined ? res.data[0].description : '',
                sessionDate: res.data[0].timestamp != undefined ? res.data[0].timestamp : '',
                start_Time: res.data[0].start_time != undefined ? res.data[0].start_time : '',
                end_Time: res.data[0].end_time != undefined ? res.data[0].end_time : '',
                amountPaid: '',
                paymentMode: ''
            })
        } else {
            showToast(res.message)
        }
    }


    isValidURL = (string) => {

        console.log("+++>>>>string" + string)
        let res
        try {
            res = string.match(/(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g);
        } catch (e) {
            return false
        }
        return (res !== null)
    };

    render() {
        const { tutorPic, name, education, ratedValue, subject, topic, description, sessionDate, sessionTime, amountPaid, paymentMode } = this.state
        return (
            <SafeAreaComponent
                StatusBarTextColor={'dark-content'}
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
                                <View style={{ flex: 12, marginHorizontal: 20 }}>
                                    <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                                        <CommonHeader
                                            onPress={() => {
                                                this.props.navigation.goBack()
                                            }}
                                        />
                                    </View>
                                    <View style={{ flex: 10.90 }}>
                                        <View style={{ flex: .30, alignItems: 'center', justifyContent: 'center', }}>
                                            <ImageBackground
                                                source={this.state.tutorPic == '' ? Assets.studentRegistration.uploadProfile : { uri: this.state.tutorPic, cache: 'force-cache' }}
                                                style={styles.ProfilePic}
                                                borderRadius={50}
                                                borderColor={Color.borderColor.primaryColor}
                                                borderWidth={1}
                                                resizeMode={'cover'}>
                                            </ImageBackground>
                                            <View style={{ flexDirection: 'row' }}>
                                                <Text style={{ fontSize: 20, fontWeight: '700', color: Color.textColor.septaColor, paddingTop: 10 }}>{name}</Text>
                                                <Image style={{ marginTop: 15, marginLeft: 5 }} source={Assets.tutorProfile.verifiedIcon}></Image>
                                            </View>
                                            <Text style={{ fontSize: 14, color: Color.textColor.secondaryColor, paddingTop: this.state.education == '' ? 0 : 10 }}>{education}</Text>
                                            <View style={{ flexDirection: 'row', alignItems: 'center', paddingTop: 10 }}>
                                                <Image
                                                    source={Assets.tutor.star_icon}
                                                ></Image>
                                                <Text style={{ fontSize: 14, fontWeight: '700', color: Color.buttonColor.enableButton, paddingLeft: 6 }}>{ratedValue}</Text>
                                            </View>
                                        </View>
                                        <View style={{ flex: 10.60, paddingHorizontal: 25, paddingVertical: '10%' }}>
                                            <View style={{ flex: 1 }}>
                                                <AppTextComp
                                                    value={subject}
                                                    onChangeText={(text) => this.setState({ subject: text })}
                                                    placeholder={'Subject'}
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
                                            <View style={{ flex: 1 }}>
                                                <AppTextComp
                                                    value={topic}
                                                    onChangeText={(text) => this.setState({ subject: text })}
                                                    placeholder={'Topic'}
                                                    editable={false}
                                                    fontSize={16}
                                                    style={{ paddingTop: 10 }}
                                                    autoCapitalize='none'
                                                    labelEnabled={true}
                                                    tintColor={Color.borderColor.secondaryColor}
                                                    lineWidth={0}
                                                    activeLineWidth={1}
                                                    width='100%'
                                                    disabledLineWidth={false}
                                                    keyboardType='default'
                                                    materialTextInput />
                                            </View>
                                            <View style={{ flex: 1 }}>
                                                <AppTextComp
                                                    value={description}
                                                    onChangeText={(text) => this.setState({ subject: text })}
                                                    placeholder={'Description'}
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
                                            <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-around' }}>
                                                <View style={{ flex: .50 }}>
                                                    <AppTextComp
                                                        value={this.state.sessionDate != '' ? Utility.sharedInstance.formatDate(this.state.sessionDate) : ''}
                                                        onChangeText={(text) => this.setState({ subject: text })}
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
                                                <View style={{ flex: .10 }}>
                                                </View>
                                                <View style={{ flex: .40 }}>
                                                    <AppTextComp
                                                        value={Utility.sharedInstance.formatTimeinHour(this.state.start_Time)}
                                                        onChangeText={(text) => this.setState({ subject: text })}
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

                                            <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-around' }}>
                                                <View style={{ flex: .40 }}>
                                                    <AppTextComp
                                                        value={amountPaid}
                                                        onChangeText={(text) => this.setState({ subject: text })}
                                                        placeholder={'Amount paid'}
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
                                                        value={paymentMode}
                                                        onChangeText={(text) => this.setState({ subject: text })}
                                                        placeholder={'Payment mode'}
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
                                    </View>
                                    <View style={{ flex: .10 }}>
                                        <AppButton
                                            buttonStyle={{ width: '100%' }}
                                            onPress={() => this.props.navigation.navigate(Constants.routeName.tutorBookSession)}
                                            isEnabled={true}
                                            buttonText={Strings.tutor.bookAgain}
                                        />
                                    </View>
                                </View>
                            </View>
                        </ScrollView>

                    </TouchableWithoutFeedback>

                </KeyboardAvoidingView>
            </SafeAreaComponent>
        )
    }

}

export default MyTutorDetails;



const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    ProfilePic: {
        width: 100,
        height: 100,
        alignItems: 'center',
        justifyContent: 'center',
    },
});
