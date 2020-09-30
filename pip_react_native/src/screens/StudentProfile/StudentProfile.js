import React, { Component } from 'react';
import { View, Text, StyleSheet, KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard, Image, Dimensions, ImageBackground } from 'react-native'
import { CommonHeader, SafeAreaComponent, AppTextComp } from '../../components';
import { Color, Dimen, Strings, Assets, Constant } from '../../../res';
import Constants from '../../../res/Constants';
import Session from '../../utils/Session';
 
class StudentProfile extends Component {
 
    constructor(props) {
        super(props)
        this.state = {
            student_id: this.isEmptyField(Session.sharedInstance.userDetails, Constants.userDetailsFields._id)!='' ? this.isEmptyField(Session.sharedInstance.userDetails, Constants.userDetailsFields._id) : '',
            profileImage: this.isEmptyField(Session.sharedInstance.userDetails, Constants.userDetailsFields.profile_picture) ? this.isEmptyField(Session.sharedInstance.userDetails, Constants.userDetailsFields.profile_picture) : '',
            name: this.isEmptyField(Session.sharedInstance.userDetails, Constants.userDetailsFields.name) ? this.isEmptyField(Session.sharedInstance.userDetails, Constants.userDetailsFields.name) : '',
            email: this.isEmptyField(Session.sharedInstance.userDetails, Constants.userDetailsFields.email) ? this.isEmptyField(Session.sharedInstance.userDetails, Constants.userDetailsFields.email) : '',
            mobileNumber: this.isEmptyField(Session.sharedInstance.userDetails, Constants.userDetailsFields.mobile) ? this.isEmptyField(Session.sharedInstance.userDetails, Constants.userDetailsFields.mobile) : '',
            education: this.isEmptyField(Session.sharedInstance.userDetails, Constants.userDetailsFields.education) ? this.isEmptyField(Session.sharedInstance.userDetails, Constants.userDetailsFields.education) : '',
            referralCode: ''
            
        }
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

    render() {
        const { profileImage, name, email, mobileNumber, education, referralCode } = this.state
        return (
            <SafeAreaComponent
                StatusBarTextColor={'light-content'}
                color={Color.textColor.pentaColor}
            >
                <View style={{ flex: 1, backgroundColor: Color.secondayTextColor }}>
                    <View style={{ flex: 1, height: Dimen.phoneHeight }}>
                        <View style={{ flex: 0.12, backgroundColor: Color.textColor.pentaColor, justifyContent: 'center' }}>
                            <CommonHeader
                                backImage={Assets.homeScreen.side_menu_icon}
                                onPress={() => this.props.navigation.openDrawer()}
                                containerStyle={{ marginHorizontal: '3%' }}
                                headerTrue={Strings.sideMenu.myProfile}
                                headerTitleFontsize={Dimen.mediumTextSize}
                                headerTitleColor={Color.secondayTextColor}
                                leftIconStyle={{ tintColor: Color.secondayTextColor }}
                                rightIcon={Assets.studentProfile.editProfile}
                                rightIconPress={() => this.props.navigation.navigate('StudentEditProfile')}
                            />
                        </View>
                        <View style={{ flex: 0.88, top: -20, borderTopLeftRadius: 20, borderTopRightRadius: 20, height: Dimen.phoneHeight, width: '100%', backgroundColor: Color.secondayTextColor }}>
                            <View style={{ flex: 0.3, alignItems: 'center', justifyContent: 'center', }}>

                                <ImageBackground
                                    source={this.isEmptyField(Session.sharedInstance.userDetails, Constants.userDetailsFields.profile_picture) ? { uri: this.isEmptyField(Session.sharedInstance.userDetails, Constants.userDetailsFields.profile_picture), cache: 'force-cache' } : Assets.studentRegistration.uploadProfile}
                                    style={styles.ProfilePic}
                                    borderRadius={50}
                                    borderColor={Color.borderColor.primaryColor}
                                    borderWidth={1}
                                    resizeMode={'cover'}>
                                </ImageBackground>
                                <View style={{ flex: 0.20}}></View>
                                <Text style={{ fontSize: 20, color: Color.textColor.studentProfileName, fontWeight: '700', textAlign: 'center' }}>{name}</Text>
                            </View>

                            <View style={{ flex: 0.7 }}>
                                <View style={{ flex: 1 }}>
                                    <View style={{ flex: 0.6, paddingHorizontal: 25 }}>

                                        <AppTextComp
                                            value={email}
                                            onChangeText={(text) => this.setState({ email: text })}
                                            placeholder={Strings.studentSignUp.emailAddress}
                                            editable={false}
                                            fontSize={16}
                                            style={{ paddingTop: 10 }}
                                            autoCapitalize='none'
                                            labelEnabled={true}
                                            tintColor={Color.borderColor.secondaryColor}
                                            lineWidth={1}
                                            activeLineWidth={1}
                                            width='100%'
                                            keyboardType='default'
                                            materialTextInput />

                                        <AppTextComp
                                            value={mobileNumber}
                                            onChangeText={(text) => this.setState({ mobileNumber: text })}
                                            placeholder={Strings.studentSignUp.mobileNumber}
                                            editable={false}
                                            fontSize={16}
                                            style={{ paddingTop: 10 }}
                                            autoCapitalize='none'
                                            labelEnabled={true}
                                            tintColor={Color.borderColor.secondaryColor}
                                            lineWidth={1}
                                            activeLineWidth={1}
                                            width='100%'
                                            keyboardType='default'
                                            materialTextInput />


                                        <View
                                            style={{ width: '100%', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderBottomWidth: 1, borderBottomColor: Color.borderColor.primaryColor }}
                                        >
                                            <AppTextComp
                                                value={education}
                                                onChangeText={(text) => this.setState({ educationSelected: this.state.educationSelected })}
                                                placeholder={Strings.studentSignUp.education}
                                                fontSize={16}
                                                editable={false}
                                                autoCapitalize='none'
                                                style={{ paddingTop: 10 }}
                                                labelEnabled={true}
                                                tintColor={Color.borderColor.secondaryColor}
                                                lineWidth={0}
                                                activeLineWidth={0}
                                                width='90%'
                                                materialTextInput
                                            />
                                        </View>

                                        <AppTextComp
                                            value={referralCode}
                                            onChangeText={(text) => this.setState({ referralCode: text })}
                                            placeholder={Strings.studentSignUp.referralCode}
                                            fontSize={16}
                                            editable={false}
                                            autoCapitalize='none'
                                            labelEnabled={true}
                                            tintColor={Color.borderColor.secondaryColor}
                                            lineWidth={1}
                                            activeLineWidth={1}
                                            width='100%'
                                            style={{ paddingTop: 10 }}
                                            keyboardType='default'
                                            materialTextInput />
                                    </View>


                                </View>


                            </View>
                        </View>
                    </View>
                </View>
            </SafeAreaComponent>
        )
    };
};

export default StudentProfile;

const styles = StyleSheet.create({
    ProfilePic: {
        width: 100,
        height: 100,
        alignItems: 'center',
        justifyContent: 'center',
    },

});