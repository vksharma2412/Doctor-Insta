import React, { Component } from 'react';
import { View, Text, StyleSheet, Platform, KeyboardAvoidingView, ScrollView, TouchableWithoutFeedback, FlatList, TouchableOpacity, Keyboard, Image, Dimensions, ImageBackground } from 'react-native'
import { CommonHeader, SafeAreaComponent, AppTextComp, } from '../../components';
import { Color, Dimen, Strings, Assets } from '../../../res';
import Slider from 'react-native-slider';
import Constants from '../../../res/Constants';
import Session from '../../utils/Session';
import DeviceInfo from 'react-native-device-info';

var screenHeight = Math.round(Dimensions.get('window').height);

class TutorProfile extends Component {

    constructor(props) {
        super(props)
        this.state = {
            tutor_id: this.isEmptyField(Session.sharedInstance.userDetails, Constants.userDetailsFields._id) ? this.isEmptyField(Session.sharedInstance.userDetails, Constants.userDetailsFields._id) : '',
            setHeaderTitle: Strings.sideMenu.myProfile,
            tutorProfileTypeData: [
                { tutorProfileType: 'PERSONAL', value: 0 },
                { tutorProfileType: 'BUSINESS', value: 1 },
                { tutorProfileType: 'QUALIFICATION', value: 2 },
            ],
            addSubjectObj: Session.sharedInstance.userDetails[Constants.userDetailsFields.tutor_education_details].length > 0 ? Session.sharedInstance.userDetails[Constants.userDetailsFields.tutor_education_details] : [{
                'tutor_teaching_subject': '',
                'tutor_teaching_grade': '',
                tutor_service_charge_per_hour: 0,
            }],
            profileImage: this.isEmptyField(Session.sharedInstance.userDetails, Constants.userDetailsFields.profile_picture) ? this.isEmptyField(Session.sharedInstance.userDetails, Constants.userDetailsFields.profile_picture) : '',
            name: this.isEmptyField(Session.sharedInstance.userDetails, Constants.userDetailsFields.name) ? this.isEmptyField(Session.sharedInstance.userDetails, Constants.userDetailsFields.name) : '',
            email: this.isEmptyField(Session.sharedInstance.userDetails, Constants.userDetailsFields.email) ? this.isEmptyField(Session.sharedInstance.userDetails, Constants.userDetailsFields.email) : '',
            mobileNumber: this.isEmptyField(Session.sharedInstance.userDetails, Constants.userDetailsFields.mobile) ? this.isEmptyField(Session.sharedInstance.userDetails, Constants.userDetailsFields.mobile) : '',
            referralCode: 'ASFASDFSD',
            businessNo: this.isEmptyField(Session.sharedInstance.userDetails, Constants.userDetailsFields.business_license_number) ? this.isEmptyField(Session.sharedInstance.userDetails, Constants.userDetailsFields.business_license_number) : '',
            insuranceNo: this.isEmptyField(Session.sharedInstance.userDetails, Constants.userDetailsFields.insurance_number) ? this.isEmptyField(Session.sharedInstance.userDetails, Constants.userDetailsFields.insurance_number) : '',
            licenseImage: this.isEmptyField(Session.sharedInstance.userDetails, Constants.userDetailsFields.license_image) ? this.isEmptyField(Session.sharedInstance.userDetails, Constants.userDetailsFields.license_image) : '',
            identityImage: this.isEmptyField(Session.sharedInstance.userDetails, Constants.userDetailsFields.identity_proof) ? this.isEmptyField(Session.sharedInstance.userDetails, Constants.userDetailsFields.identity_proof) : '',
            addressImage: this.isEmptyField(Session.sharedInstance.userDetails, Constants.userDetailsFields.address_proof) ? this.isEmptyField(Session.sharedInstance.userDetails, Constants.userDetailsFields.address_proof) : '',
            certificationServiceImage: this.isEmptyField(Session.sharedInstance.userDetails, Constants.userDetailsFields.certification_of_service) ? this.isEmptyField(Session.sharedInstance.userDetails, Constants.userDetailsFields.certification_of_service) : '',
            selectedEducation: this.isEmptyField(Session.sharedInstance.userDetails, Constants.userDetailsFields.tutor_education) ? this.isEmptyField(Session.sharedInstance.userDetails, Constants.userDetailsFields.tutor_education) : '',
            selectedQualification: this.isEmptyField(Session.sharedInstance.userDetails, Constants.userDetailsFields.qualification) ? this.isEmptyField(Session.sharedInstance.userDetails, Constants.userDetailsFields.qualification) : '',
            selectedGrade: this.isEmptyField(Session.sharedInstance.userDetails, Constants.userDetailsFields.tutor_grade) ? this.isEmptyField(Session.sharedInstance.userDetails, Constants.userDetailsFields.tutor_grade) : '',
            // selectedSubject: this.isEmptyField(Session.sharedInstance.userDetails, Constants.userDetailsFields.tutor_teaching_subject) ? this.isEmptyField(Session.sharedInstance.userDetails, Constants.userDetailsFields.tu) : '',
            serviceChargeSelectedPerHour: 80,
            selectedIndex: 0,
            tutor_Education_Details: this.isEmptyField(Session.sharedInstance.userDetails, Constants.userDetailsFields.tutor_education_details) ? this.isEmptyField(Session.sharedInstance.userDetails, Constants.userDetailsFields.tutor_education_details) : '',

        }
    }

    setHeaderTitleMethod = (selectedHeaderTitle) => {
        switch (selectedHeaderTitle) {
            case 0:
                return Strings.sideMenu.myProfile;
                break;
            case 1:
                return Strings.tutor.tutorBusinessInfo;
            case 2:
                return Strings.tutor.tutorQualificationAndPayment;
                break;
            default:
                break;
        }
    }

    render() {
        const { setHeaderTitle, tutor_id, profileImage, name, email, mobileNumber, referralCode, businessNo, insuranceNo, selectedEducation, selectedQualification, selectedGrade, selectedSubject, serviceChargeSelectedPerHour, selectedIndex } = this.state
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
                                headerTrue={this.setHeaderTitleMethod(selectedIndex)}
                                headerTitleFontsize={Dimen.mediumTextSize}
                                headerTitleColor={Color.secondayTextColor}
                                leftIconStyle={{ tintColor: Color.secondayTextColor }}
                                rightIcon={Assets.studentProfile.editProfile}
                                rightIconPress={() => this.selectedNavigation(selectedIndex)}
                            />
                        </View>
                        <View style={{ flex: 0.88, top: -20, borderTopLeftRadius: 20, borderTopRightRadius: 20, height: Dimen.phoneHeight, width: '100%', backgroundColor: Color.secondayTextColor }}>
                            {this.selectTutorProfileView(selectedIndex)}
                        </View>
                    </View>
                </View>
            </SafeAreaComponent>
        )
    };

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

    isValidURL = (string) => {
        let res
        try {
            res = string.match(/(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g);
        } catch (e) {
            return false
        }
        return (res !== null)
    };

    _renderItem = (item, index) => {
        return (
            <View style={{ flex: 1, paddingHorizontal: DeviceInfo.isTablet() ? 80 : 0 }}>
                <TouchableOpacity style={{ borderWidth: this.state.selectedIndex == index ? 1 : 0, backgroundColor: this.state.selectedIndex == index ? Color.backgroundColor.primary : Color.secondayTextColor, borderColor: Color.borderColor.secondaryColor, justifyContent: 'center', height: 35, borderRadius: 20, marginTop: 20, paddingHorizontal: 20 }}
                    onPress={() => { this.setState({ selectedIndex: index }) }}
                >
                    <Text style={{ textAlign: 'center', fontSize: 14, fontWeight: '700', color: this.state.selectedIndex == index ? Color.buttonColor.enableButton : Color.textColor.quarternary }}>{item.tutorProfileType}</Text>
                </TouchableOpacity>
            </View>

        )

    }

    _renderItemForBusinessUI = (item, index) => {
        return (
            <View style={{ flex: 14 }}>
                <View style={{ flex: 6, paddingHorizontal: 25 }}>
                    <View
                        style={{ flex: 1, width: '100%', flexDirection: 'row', justifyContent: 'space-between', borderBottomWidth: 1, borderBottomColor: Color.borderColor.primaryColor, paddingTop: 5 }}
                    >
                        <AppTextComp
                            value={this.state.selectedEducation}
                            onChangeText={(text) => this.setState({ selectedEducation: this.state.selectedEducation })}
                            placeholder={Strings.teacherSignUp.edudcation}
                            fontSize={16}
                            editable={false}
                            autoCapitalize='none'
                            labelEnabled={true}
                            tintColor={Color.borderColor.secondaryColor}
                            lineWidth={0}
                            activeLineWidth={0}
                            width='90%'
                            materialTextInput
                        />
                        <Image source={Assets.common.drop_down} />
                    </View>
                    <View style={{ height: 10, opacity: .1, marginVertical: 10 }}></View>
                    <View
                        style={{ flex: 1, width: '100%', flexDirection: 'row', justifyContent: 'space-between', borderBottomWidth: 1, borderBottomColor: Color.borderColor.primaryColor }}
                    >
                        <AppTextComp
                            value={this.state.selectedQualification}
                            onChangeText={(text) => this.setState({ selectedEducation: this.state.selectedQualification })}
                            placeholder={Strings.teacherSignUp.qualification}
                            fontSize={16}
                            editable={false}
                            autoCapitalize='none'
                            labelEnabled={true}
                            tintColor={Color.borderColor.secondaryColor}
                            lineWidth={0}
                            activeLineWidth={0}
                            width='90%'
                            materialTextInput
                        />
                        <Image source={Assets.common.drop_down} />
                    </View>
                    {/* </View> */}
                </View>
                <View style={{ height: 10, backgroundColor: 'black', opacity: .1, marginVertical: 15 }}></View>
                <View style={{ flex: 8, paddingHorizontal: 25, paddingVertical: 30 }}>
                    <View style={{ flex: 1 }}>
                        <View

                            style={{ width: '100%', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderBottomWidth: 1, borderBottomColor: Color.borderColor.primaryColor }}
                        >
                            <AppTextComp
                                value={item.tutor_teaching_grade}
                                onChangeText={(text) => this.setState({ selectedGrade: item.tutor_teaching_grade })}
                                placeholder={Strings.teacherSignUp.selectGrade}
                                fontSize={16}
                                editable={false}
                                autoCapitalize='none'
                                labelEnabled={true}
                                tintColor={Color.borderColor.secondaryColor}
                                lineWidth={0}
                                activeLineWidth={0}
                                width='90%'
                                materialTextInput
                            />
                            <Image style={{ marginLeft: 5 }} source={Assets.common.drop_down} />
                        </View>
                    </View>
                    <View style={{ flex: 1, paddingTop: 20 }}>
                        <View
                            style={{ width: '100%', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderBottomWidth: 1, borderBottomColor: Color.borderColor.primaryColor, paddingTop: 10 }}

                        >
                            <AppTextComp
                                value={item.tutor_teaching_subject}
                                onChangeText={(text) => this.setState({ selectedSubject: item.tutor_teaching_subject })}
                                placeholder={Strings.teacherSignUp.teachingSubject}
                                fontSize={16}
                                editable={false}
                                autoCapitalize='none'
                                labelEnabled={true}
                                tintColor={Color.borderColor.secondaryColor}
                                lineWidth={0}
                                activeLineWidth={0}
                                width='90%'
                                materialTextInput
                            />
                            <Image style={{ marginLeft: 5 }} source={Assets.common.drop_down} />
                        </View>

                    </View>
                    <View style={{ flex: 1, paddingTop: 20 }}>
                        <Text style={{ color: Color.borderColor.primaryColor, lineHeight: 12, fontSize: Dimen.verySmallTextSize }}>{Strings.teacherSignUp.serviceCharge}</Text>
                        <Text style={{ lineHeight: 30, }}>{item.tutor_service_charge_per_hour}$</Text>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', height: 80, }}>
                            <Text>{Strings.teacherSignUp.zeroDollar}</Text>

                            <Slider
                                style={{ width: '80%', height: 80, top: -20 }}
                                value={item.tutor_service_charge_per_hour}
                                minimumValue={0}
                                maximumValue={100}
                                thumbTintColor={Color.borderColor.secondaryColor}
                                minimumTrackTintColor={Color.borderColor.secondaryColor}
                                disabled={true}
                                step={1}
                            />

                            <Text>{Strings.teacherSignUp.hundredDollar}</Text>
                        </View>
                        <View style={{ height: 50, width: '100%', }}>
                            <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}
                            >
                                <Image source={Assets.teacherRegistration.addICon} style={{ marginRight: 15 }} />
                                <Text style={{ fontSize: Dimen.verySmallTextSize, color: Color.textColor.pentaColor }}>{Strings.teacherSignUp.addSubject.toUpperCase()}</Text>
                            </View>
                        </View>
                    </View>

                </View>
                <View style={{ height: 10, backgroundColor: 'black', opacity: .1, marginTop: 30 }}></View>


            </View>
        )
    }

    selectedNavigation = (selectedNavigate) => {
        const { setHeaderTitle, tutor_id, profileImage, name, email, mobileNumber, referralCode, businessNo, insuranceNo, selectedEducation, selectedQualification, selectedGrade, selectedSubject, serviceChargeSelectedPerHour, selectedIndex } = this.state
        switch (selectedNavigate) {
            case 0:
                this.props.navigation.navigate('TutorProfileInfo')
                break;
            case 1:
                this.props.navigation.navigate('TutorProfileBusinessInfo')
                break;
            case 2:
                this.props.navigation.navigate('TutorProfileQualificationAndPaymentInfo')
                break
        }

    }

    selectTutorProfileView = (selectedView) => {
        const { setHeaderTitle, tutor_id, profileImage, name, email, mobileNumber, referralCode, businessNo, insuranceNo, selectedEducation, selectedQualification, selectedGrade, selectedSubject, serviceChargeSelectedPerHour, selectedIndex } = this.state
        switch (selectedView) {
            //Tutor Personal Profile Starts
            case 0:
                return (
                    <>
                        <View style={{ flex: .15, alignSelf: 'center' }}>
                            <FlatList
                                numColumns={1}
                                data={this.state.tutorProfileTypeData}
                                renderItem={({ item, index }) => this._renderItem(item, index)}
                                keyExtractor={(item, index) => `${index}_users`}
                                horizontal={true}
                                showsHorizontalScrollIndicator={false}
                            />
                        </View>
                        <View style={{ flex: 0.25, alignItems: 'center', }}>
                            <ImageBackground
                                source={this.state.profileImage === '' ? Assets.studentRegistration.uploadProfile : this.isValidURL(this.state.profileImage) ? { uri: this.state.profileImage, cache: 'force-cache' } : this.state.profileImage}
                                style={styles.ProfilePic}
                                borderRadius={50}
                                borderColor={Color.borderColor.primaryColor}
                                borderWidth={1}
                                resizeMode={'cover'}>
                            </ImageBackground>
                            <Text style={{ fontSize: 20, color: Color.textColor.studentProfileName, fontWeight: '700', textAlign: 'center', paddingTop: 20 }}>{this.state.name}</Text>
                        </View>

                        <View style={{ flex: 0.48, paddingHorizontal: 25 }}>
                            <View style={{ flex: .24 }}>
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
                                    lineWidth={0}
                                    activeLineWidth={1}
                                    width='100%'
                                    keyboardType='default'
                                    materialTextInput />
                            </View>
                            <View style={{ flex: .24 }}>
                                <AppTextComp
                                    value={mobileNumber}
                                    onChangeText={(text) => this.setState({ mobileNumber: text })}
                                    placeholder={Strings.studentSignUp.mobileNumber}
                                    editable={false}
                                    fontSize={16}
                                    style={{ paddingTop: 10 }}
                                    autoCapitalize='none'
                                    labelEnabled={true}
                                    tintColor={Color.borderColor.primaryColor}
                                    lineWidth={0}
                                    activeLineWidth={1}
                                    width='100%'
                                    keyboardType='default'
                                    materialTextInput />
                            </View>
                        </View>
                    </>
                )
            //Tutor Personal Profile End

            //Tutor Business Profile Starts
            case 1:
                return (
                    <>
                        <View style={{ flex: .15, alignSelf: 'center' }}>
                            <FlatList
                                numColumns={1}
                                data={this.state.tutorProfileTypeData}
                                renderItem={({ item, index }) => this._renderItem(item, index)}
                                keyExtractor={(item, index) => `${index}_users`}
                                horizontal={true}
                                showsHorizontalScrollIndicator={false}
                            />
                        </View>
                        <View style={{ flex: .73 }}>
                            <View style={{ flex: 4, paddingHorizontal: 25 }}>
                                <View style={{ flex: 1 }}>
                                    <AppTextComp
                                        value={businessNo}
                                        onChangeText={(text) => this.setState({ businessNo: text })}
                                        placeholder={Strings.teacherSignUp.businessNo}
                                        editable={false}
                                        fontSize={16}
                                        style={{ paddingTop: 10 }}
                                        autoCapitalize='none'
                                        labelEnabled={true}
                                        tintColor={Color.borderColor.secondaryColor}
                                        lineWidth={1}
                                        activeLineWidth={1}
                                        width='100%'
                                        maxLength={10}
                                        keyboardType='default'
                                        autoCapitalize={'characters'}
                                        materialTextInput />
                                </View>
                                <View style={{ flex: 1 }}>
                                    <AppTextComp
                                        value={this.state.insuranceNo}
                                        onChangeText={(text) => this.setState({ insuranceNo: text })}
                                        placeholder={Strings.teacherSignUp.insuranceNo}
                                        editable={false}
                                        fontSize={16}
                                        style={{ paddingTop: 10 }}
                                        autoCapitalize='none'
                                        labelEnabled={true}
                                        maxLength={10}
                                        tintColor={Color.borderColor.secondaryColor}
                                        lineWidth={1}
                                        activeLineWidth={1}
                                        width='100%'
                                        keyboardType='default'
                                        autoCapitalize={'characters'}
                                        materialTextInput />
                                </View>
                            </View>
                            <View style={{ height: 10, backgroundColor: 'black', opacity: .1, marginVertical: 15 }}></View>
                            <View style={{ flex: 10, paddingHorizontal: 25, paddingVertical: 20 }}>
                                {this.state.licenseImage != '' && <View style={{ flex: 1 }}>
                                    <Text style={{ fontSize: 16 }}>{Strings.teacherSignUp.licenseImage}</Text>
                                    <Text style={{ fontSize: 9, color: Color.borderColor.primaryColor }}>{Strings.teacherSignUp.ieDrivingLic}</Text>
                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingBottom: 10 }}>
                                        <View style={{ flexDirection: 'row', marginLeft: 10 }}>
                                            <Image source={Assets.teacherRegistration.files} />
                                            <View style={{ marginHorizontal: 10, }}>
                                                <Text style={{ color: Color.borderColor.primaryColor, fontSize: Dimen.vvvSmallTextSize }} >{this.state.licenseImagefileName}</Text>
                                                <Text style={{ color: Color.borderColor.primaryColor, lineHeight: 12, fontSize: Dimen.vvvvvSmalTextSize }}>{this.state.licenseImageSize}</Text>
                                            </View>
                                        </View>
                                        <View>
                                            <View style={{ padding: 5, alignSelf: 'center' }}
                                            >
                                                <Image source={Assets.teacherRegistration.delete} />
                                            </View>
                                        </View>
                                    </View>
                                    <View style={{ height: 2, width: '100%', backgroundColor: Color.listSeperator.primary, }}></View>

                                </View>}
                                {this.state.licenseImage == '' && <View style={{ flex: 1, paddingVertical: 10 }}>
                                    <View style={{ flex: 0.95, justifyContent: 'space-between', flexDirection: 'row', alignItems: 'center', paddingVertical: 10 }}>
                                        <View>
                                            <Text style={{ fontSize: Dimen.mediumTextSize, fontWeight: '600' }}>{Strings.teacherSignUp.licenseImage}</Text>
                                            <Text style={{ fontSize: Dimen.vvvvSmallTextSize, fontWeight: '600', color: Color.borderColor.primaryColor, }}>{Strings.teacherSignUp.ieDrivingLic}</Text>
                                        </View>
                                        <View style={{ padding: 5, alignSelf: 'center' }}

                                        >
                                            <Image source={Assets.teacherRegistration.upload} />
                                        </View>
                                    </View>
                                    <View style={{ flex: 0.05, height: 2, width: '100%', backgroundColor: Color.listSeperator.primary, }}></View>

                                </View>}
                                {this.state.identityImage != '' && <View style={{ flex: 1 }}>
                                    <Text style={{ fontSize: 16 }}>{Strings.teacherSignUp.identityImage}</Text>
                                    <Text style={{ fontSize: 9, color: Color.borderColor.primaryColor }}>{Strings.teacherSignUp.ieidentityProof}</Text>
                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingBottom: 10 }}>
                                        <View style={{ flexDirection: 'row', marginLeft: 10 }}>
                                            <Image source={Assets.teacherRegistration.files} />
                                            <View style={{ marginHorizontal: 10, }}>
                                                <Text style={{ color: Color.borderColor.primaryColor, fontSize: Dimen.vvvSmallTextSize }} >{this.state.identityImagefileName}</Text>
                                                <Text style={{ color: Color.borderColor.primaryColor, lineHeight: 12, fontSize: Dimen.vvvvvSmalTextSize }}>{this.state.identityImageSize}</Text>
                                            </View>
                                        </View>
                                        <View>
                                            <View style={{ padding: 5, alignSelf: 'center' }}

                                            >
                                                <Image source={Assets.teacherRegistration.delete} />
                                            </View>
                                        </View>
                                    </View>
                                    <View style={{ height: 2, width: '100%', backgroundColor: Color.listSeperator.primary, }}></View>
                                </View>}
                                {this.state.identityImage == '' && <View style={{ flex: 1, paddingVertical: 10 }}>
                                    <View style={{ flex: 0.95, justifyContent: 'space-between', flexDirection: 'row', alignItems: 'center', paddingVertical: 10 }}>
                                        <View>
                                            <Text style={{ fontSize: Dimen.mediumTextSize, fontWeight: '600' }}>{Strings.teacherSignUp.identityProof}</Text>
                                            <Text style={{ fontSize: Dimen.vvvvSmallTextSize, fontWeight: '600', color: Color.borderColor.primaryColor, }}>{Strings.teacherSignUp.ieidentityProof}</Text>
                                        </View>
                                        <View style={{ padding: 5, alignSelf: 'center' }}
                                        >
                                            <Image source={Assets.teacherRegistration.upload} />
                                        </View>
                                    </View>
                                    <View style={{ flex: 0.05, height: 2, width: '100%', backgroundColor: Color.listSeperator.primary, }}></View>
                                </View>}
                                {this.state.addressImage != '' && <View style={{ flex: 1 }}>
                                    <Text style={{ fontSize: 16 }}>{Strings.teacherSignUp.addressProof}</Text>
                                    <Text style={{ fontSize: 9, color: Color.borderColor.primaryColor }}>{Strings.teacherSignUp.ieAddressProof}</Text>
                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingBottom: 10 }}>
                                        <View style={{ flexDirection: 'row', marginLeft: 10 }}>
                                            <Image source={Assets.teacherRegistration.files} />
                                            <View style={{ marginHorizontal: 10, }}>
                                                <Text style={{ color: Color.borderColor.primaryColor, fontSize: Dimen.vvvSmallTextSize }} >{this.state.addressImagefileName}</Text>
                                                <Text style={{ color: Color.borderColor.primaryColor, lineHeight: 12, fontSize: Dimen.vvvvvSmalTextSize }}>{this.state.addressImageSize}</Text>
                                            </View>
                                        </View>
                                        <View>
                                            <View style={{ padding: 5, alignSelf: 'center' }}

                                            >
                                                <Image source={Assets.teacherRegistration.delete} />
                                            </View>
                                        </View>
                                    </View>
                                    <View style={{ height: 2, width: '100%', backgroundColor: Color.listSeperator.primary, }}></View>
                                </View>}
                                {this.state.addressImage == '' && <View style={{ flex: 1, paddingVertical: 10 }}>
                                    <View style={{ flex: 0.95, justifyContent: 'space-between', flexDirection: 'row', alignItems: 'center', paddingVertical: 10 }}>
                                        <View>
                                            <Text style={{ fontSize: Dimen.mediumTextSize, fontWeight: '600' }}>{Strings.teacherSignUp.addressProof}</Text>
                                            <Text style={{ fontSize: Dimen.vvvvSmallTextSize, fontWeight: '600', color: Color.borderColor.primaryColor, }}>{Strings.teacherSignUp.ieAddressProof}</Text>
                                        </View>
                                        <View style={{ padding: 5, alignSelf: 'center' }}>
                                            <Image source={Assets.teacherRegistration.upload} />
                                        </View>
                                    </View>
                                    <View style={{ flex: 0.05, height: 2, width: '100%', backgroundColor: Color.listSeperator.primary, }}></View>
                                </View>}
                                {this.state.certificationServiceImage != '' && <View style={{ flex: 1 }}>
                                    <Text style={{ fontSize: 16 }}>{Strings.teacherSignUp.certificationOfService}</Text>
                                    <Text style={{ fontSize: 9, color: Color.borderColor.primaryColor }}>{Strings.teacherSignUp.domesticWorkerAccount}</Text>
                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingBottom: 10 }}>
                                        <View style={{ flexDirection: 'row', marginLeft: 10 }}>
                                            <Image source={Assets.teacherRegistration.files} />
                                            <View style={{ marginHorizontal: 10, }}>
                                                <Text style={{ color: Color.borderColor.primaryColor, fontSize: Dimen.vvvSmallTextSize }} >{this.state.certificationServiceImagefileName}</Text>
                                                <Text style={{ color: Color.borderColor.primaryColor, lineHeight: 12, fontSize: Dimen.vvvvvSmalTextSize }}>{this.state.licenseImageSize}</Text>
                                            </View>
                                        </View>
                                        <View>
                                            <View style={{ padding: 5, alignSelf: 'center' }}

                                            >
                                                <Image source={Assets.teacherRegistration.delete} />
                                            </View>
                                        </View>
                                    </View>
                                    <View style={{ height: 2, width: '100%', backgroundColor: Color.listSeperator.primary, }}></View>
                                </View>}
                                {this.state.certificationServiceImage == '' && <View style={{ flex: 1, paddingVertical: 10 }}>
                                    <View style={{ flex: 0.95, justifyContent: 'space-between', flexDirection: 'row', alignItems: 'center', paddingVertical: 10 }}>
                                        <View>
                                            <Text style={{ fontSize: Dimen.mediumTextSize, fontWeight: '600' }}>{Strings.teacherSignUp.certificationOfService}</Text>
                                            <Text style={{ fontSize: Dimen.vvvvSmallTextSize, fontWeight: '600', color: Color.borderColor.primaryColor, }}>{Strings.teacherSignUp.domesticWorkerAccount}</Text>
                                        </View>
                                        <View style={{ padding: 5, alignSelf: 'center' }}
                                        >
                                            <Image source={Assets.teacherRegistration.upload} />
                                        </View>
                                    </View>
                                    <View style={{ flex: 0.05, height: 2, width: '100%', backgroundColor: Color.listSeperator.primary, }}></View>

                                </View>}
                            </View>
                        </View>

                    </>
                )
                break;
            //Tutor Business Profile End

            //Tutor Qualification and Payment Starts
            case 2:
                return (
                    <>
                        <View style={{ flex: .15, alignSelf: 'center' }}>
                            <FlatList
                                numColumns={1}
                                data={this.state.tutorProfileTypeData}
                                renderItem={({ item, index }) => this._renderItem(item, index)}
                                keyExtractor={(item, index) => `${index}_users`}
                                horizontal={true}
                                showsHorizontalScrollIndicator={false}
                            />
                        </View>


                        <View style={{ flex: .73 }}>
                            <FlatList
                                numColumns={1}
                                data={this.state.addSubjectObj}
                                renderItem={({ item, index }) => this._renderItemForBusinessUI(item, index)}
                                keyExtractor={(item, index) => `${index}_users`}
                                horizontal={false}
                                showsVerticalScrollIndicator={false}
                            />
                        </View>
                    </>
                )
                //Tutor Qualification and Payment End
                break;
            default:
                break;
        }

    }

};

export default TutorProfile;

const styles = StyleSheet.create({
    ProfilePic: {
        width: 100,
        height: 100,
        alignItems: 'center',
        justifyContent: 'center',
    },

});