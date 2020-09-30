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






class TutorViewProfile extends Component {

    constructor(props) {
        super(props)
        this.state = {
            tutorPic: this.props.route.params.bidPosterProfileImage != undefined ? this.props.route.params.bidPosterProfileImage : '',
            name: this.props.route.params.bidPosterName != undefined ? this.props.route.params.bidPosterName : '',
            ratedValue: this.props.route.params.ratingValue != undefined ? this.props.route.params.ratingValue : '',
            bid_amount: this.props.route.params.bidAmountPass != undefined ? this.props.route.params.bidAmountPass : '',
            detailProposal: this.props.route.params.detailsProposal != undefined ? this.props.route.params.detailsProposal : '',
            education: this.props.route.params.education != undefined ? this.props.route.params.education : '',
            tutorQualification: this.props.route.params.qualification != undefined ? this.props.route.params.qualification : '',
            teachingSubject: this.props.route.params.teachingSubject != undefined ? this.props.route.params.teachingSubject : '',
        }


    }



    render() {
        const { tutorPic, name, tutorQualification, ratedValue, education, bid_amount, teachingSubject, detailProposal } = this.state
        return (
            <SafeAreaComponent StatusBarTextColor={'dark-content'}>
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
                                                source={{ uri: tutorPic, cache: 'force-cache' }}
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
                                            <Text style={{ fontSize: 14, color: Color.textColor.secondaryColor, paddingTop: this.state.tutorQualification == '' ? 0 : 10, paddingBottom: this.state.tutorQualification == '' ? 0 : 10 }}>{tutorQualification}</Text>
                                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                                <Image
                                                    source={Assets.tutor.star_icon}
                                                ></Image>
                                                <Text style={{ fontSize: 14, fontWeight: '700', color: Color.buttonColor.enableButton, paddingLeft: 6 }}>{ratedValue}</Text>
                                            </View>
                                        </View>
                                        <View style={{ flex: 10.60, paddingHorizontal: 25, paddingVertical: '10%' }}>
                                            <View style={{ flex: 3 }}>
                                                <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-around' }}>
                                                    <View style={{ flex: .50 }}>
                                                        <AppTextComp
                                                            value={education}
                                                            onChangeText={(text) => this.setState({ education: text })}
                                                            placeholder={'Education'}
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
                                                            value={bid_amount}
                                                            onChangeText={(text) => this.setState({ bid_amount: text })}
                                                            placeholder={'Quoted'}
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

                                                {tutorQualification ? <View style={{ flex: 1 }}>
                                                    <AppTextComp
                                                        value={teachingSubject}
                                                        onChangeText={(text) => this.setState({ teachingSubject: text })}
                                                        placeholder={'Teaching Subjects'}
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
                                                </View> : <View></View>}
                                                <View style={{ flex: 1 }}>
                                                    <AppTextComp
                                                        value={detailProposal}
                                                        onChangeText={(text) => this.setState({ detailProposal: text })}
                                                        placeholder={'Detail Proposal'}
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
                                            <View style={{ flex: 7.60 }}>
                                            </View>
                                        </View>
                                    </View>
                                    <View style={{ flex: .10 }}>
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

export default TutorViewProfile;



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
