import React, { Component } from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet, KeyboardAvoidingView, ScrollView, TouchableWithoutFeedback, Keyboard, Image, Dimensions, ImageBackground, TextInput } from 'react-native'
import { AppButton, CommonHeader, SafeAreaComponent, UserRating } from '../../components';
import { Color, Dimen, Strings, Assets, URL, Constant } from '../../../res';
import Session from '../../utils/Session';
import Constants from '../../../res/Constants';
import { NetworkManager, NavUtil } from '../../utils';
import SuccessScreenComponent from '../../components/SuccessScreenComponent';
import String from '../../../res/String';
import { showToast } from '../../utils/Utility';

class RateTutorScreen extends Component {

    constructor(props) {
        super(props)
        this.state = {
            userData: this.props.route.params.userDetails != undefined ? this.props.route.params.userDetails : '',
            ratingDescription: '',
            selectedRating: 0,
            tutor_id: this.props.route.params.tutor_id != undefined ? this.props.route.params.tutor_id : '',
            session_id: this.props.route.params.session_id != undefined ? this.props.route.params.session_id : '',
            name: this.props.route.params.name != undefined ? this.props.route.params.name : '',
            profile_pic: this.props.route.params.profile_pic != undefined ? this.props.route.params.profile_pic : '',
            qualification: this.props.route.params.qualification != undefined ? this.props.route.params.qualification : '',
            student_id: this.props.route.params.student_id != undefined ? this.props.route.params.student_id : '',

        };

    }
    render() {
        console.log('JSON.stringify(this.state.userData)asdfsdf' + JSON.stringify(this.state))
        return (
            <SafeAreaComponent>
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ flexGrow: 1 }}
                >
                    <View style={{ flex: 1, backgroundColor: Color.secondayTextColor }}>
                        <View style={{ alignItems: 'center', flex: .4, justifyContent: 'center', paddingTop: 15 }}>
                            <Image style={{ width: 120, height: 120, borderRadius: 60, borderWidth: 1, borderColor: 'grey' }} source={{ uri: this.state.profile_pic }} />
                            <Text style={{ fontSize: 20, paddingTop: 10, color: '#4A4A4A', alignSelf: 'center', textTransform: 'capitalize' }}>{this.state.name}</Text>
                            <Text style={{ fontSize: 14, paddingTop: 5 }}>{this.state.qualification}</Text>
                        </View>
                        <View style={{ flex: .6 }}>
                            <View style={{ flex: .05 }}>
                                {this.continueRatingClick()}
                            </View>
                            <View style={{ flex: .05, paddingTop: 20 }}>
                                {this.addedfeedbackcontent()}
                            </View>
                            <View style={{ flex: .4 }}></View>
                            <View style={{ flex: .1, paddingTop: 20 }}>
                                <View style={{ flex: .15 }}>
                                    {this.onsubmitClick()}
                                </View>
                                <View style={{ flex: .15 }}>
                                    {this.onRaiseDisputeclick()}
                                </View>
                            </View>
                        </View>
                    </View>
                </ScrollView>
            </SafeAreaComponent>
        )


    };
    // on click on submitted button
    onsubmitClick() {
        return (
            <View style={{ flex: 0.04, paddingHorizontal: 30, marginTop: 43 }}>
                <AppButton
                    buttonStyle={{ width: '100%' }}
                    isEnabled={true}
                    onPress={this.onSubmitApiHandler}
                    buttonText={Strings.homeScreen.submit}
                />
            </View>
        )

    }

    isEmptyField = (userDetails, field) => {
        try {
            if (userDetails[field] != undefined) {
                return userDetails[field]
            } else {
                return null
            }
        } catch (error) {
            return null
        }
    }

    //  click on rating stars
    continueRatingClick() {
        return (
            <View style={{ backgroundColor: Color.secondayTextColor, paddingTop: 20 }}>
                <UserRating
                    onratingCompleted={this.ratingCompleted}
                    count={5}
                    defaultRating={0}
                />
            </View>
        )
    }

    // add feed back content click 
    addedfeedbackcontent() {
        return (
            <View style={{ paddingHorizontal: 30, paddingTop: 15 }}>
                <View style={{ flex: .08 }}>
                    <Text style={{ fontSize: 12, color: Color.textColor.resendOtp }}>
                        {Strings.Review.reviewdecreption}
                    </Text>
                </View>
                <View style={{ flex: .52, paddingTop: 10 }}>
                    <TextInput
                        style={{ borderRadius: 8, justifyContent: 'flex-start', paddingTop: 20, height: 125, width: '100%', borderColor: Color.borderColor.primaryColor, borderWidth: 1, paddingHorizontal: 20, }}
                        numberOfLines={5}
                        multiline={true}
                        onChangeText={(text) => this.setState({ ratingDescription: text })}
                    ></TextInput>
                </View>
            </View>
        )
    }
    // on click getting rating in Interger number 1,2,3,4,5
    ratingCompleted = (rating) => {
        console.log("Rating is: " + rating)
        this.setState({ selectedRating: rating })
    }

    // on click on rasie dispute button
    gotoRaiseDispute() {
        this.props.navigation.navigate('RaiseDisputeScreen', { tutor_id: this.state.tutor_id, student_id: this.state.student_id, session_id: this.state.session_id })
    }

    // on cancel raise dispute click
    onRaiseDisputeclick() {
        return (
            <View style={{ flex: 0.1, width: '100%', paddingHorizontal: 30, alignSelf: 'center', marginTop: 15, marginBottom: 10 }}>
                <AppButton
                    onPress={() => { this.gotoRaiseDispute() }}
                    isEnabled={true}
                    buttonText={Strings.session.raisedispute}
                    buttonStyle={{ alignSelf: 'center', width: '100%', marginBottom: 20, backgroundColor: Color.appBackgroundColor, borderColor: Color.buttonColor.enableButton, borderWidth: 1, borderRadius: 25, }}
                    buttonTextStyle={{ color: Color.buttonColor.enableButton, fontSize: 14 }}
                />
            </View>
        )
    }

    onSubmitApiHandler = async () => {
        if (this.state.selectedRating == 0) {
            showToast('Please Rate')
        } else if (this.state.ratingDescription == '') {
            showToast('Please Write Review')
        } else {
            console.log('this.state', this.state);
            let data = {}
            let api = ''

            data.rate = this.state.selectedRating != '' ? this.state.selectedRating : 0
            data.session_id = this.props.route.params.session_id != '' ? this.props.route.params.session_id : ''
            data.description = this.state.ratingDescription != '' ? this.state.ratingDescription : ''
            if (!Session.sharedInstance.isStudent && Session.sharedInstance.userDetails[Constant.userDetailsFields.isVerified]) {
                api = URL.rateTutor
                data.current_user_type = Constant.userType.lowerCaseTutor
                data.user_id_from = Session.sharedInstance.userDetails[Constant.userDetailsFields._id]
                data.user_id_to = this.state.student_id
            } else {
                api = URL.rateStudent
                data.user_id_from = Session.sharedInstance.userDetails[Constant.userDetailsFields._id]
                data.user_id_to = this.state.tutor_id
                data.current_user_type = Constant.userType.lowerCaseStudent

            }
            const res = await NetworkManager.networkManagerInstance.fetchRequest(api, URL.postRequest, true, data, () => this.onSubmitApiHandler())
            if (res.statusCode == 200) {
                this.setState({ data: res.data, })
                console.log('StateCodes  200 okey')
                NavUtil.navUtil.navigateTo(this, Constants.routeName.successScreenComponent, { butonTitle: String.successScreenComp.buttonText, header: String.successScreenComp.ratingHeader, desc: String.successScreenComp.ratingDesc })
                // Utility.sharedInstance.navigation.navigate('SessionCancelScreen')
            } else {
                console.log('Rating Tutor Api FAILED')
            }
        }

    }
};

export default RateTutorScreen;

const styles = StyleSheet.create({

});