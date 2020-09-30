
import React, { Component, createRef, } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, TextInput, ImageBackground, TouchableWithoutFeedback, KeyboardAvoidingView, ScrollView, Keyboard } from 'react-native'
import { AppButton, AppImageComponent, CommonHeader, SafeAreaComponent, InputTextField, AppTextInput, AppTextComp, CommonDropDown, PopUp } from '../../components';
import { Strings, Assets, Dimen, Color, Styles, URL, Constant, AsyncStorageValues } from '../../../res/index';
// import { Dropdown } from 'react-native-material-dropdown';
import Drawer from 'react-native-drawer'
import String from '../../../res/String';
import Utility, { showToast, validateEmailAddress, validateEmptyField, _storeData } from "../../utils/Utility";
import ImagePicker from 'react-native-image-crop-picker';
import { NetworkManager } from '../../utils';
import AsyncStorage from '@react-native-community/async-storage';
import Session from '../../utils/Session';
import Constants from '../../../res/Constants';




class StudentEditProfile extends Component {

    closeControlPanel = () => { this._drawer.close() };
    openControlPanel = () => {
        Keyboard.dismiss()
        this._drawer.open()
    };

    constructor(props) {
        super(props)
        this.state = {
            userId: this.isEmptyField(Session.sharedInstance.userDetails, Constants.userDetailsFields._id) ? this.isEmptyField(Session.sharedInstance.userDetails, Constants.userDetailsFields._id) : '',
            profileImage: this.isEmptyField(Session.sharedInstance.userDetails, Constants.userDetailsFields.profile_picture) ? this.isEmptyField(Session.sharedInstance.userDetails, Constants.userDetailsFields.profile_picture) : '',
            name: this.isEmptyField(Session.sharedInstance.userDetails, Constants.userDetailsFields.name) ? this.isEmptyField(Session.sharedInstance.userDetails, Constants.userDetailsFields.name) : '',
            email: this.isEmptyField(Session.sharedInstance.userDetails, Constants.userDetailsFields.email) ? this.isEmptyField(Session.sharedInstance.userDetails, Constants.userDetailsFields.email) : '',
            mobileNumber: this.isEmptyField(Session.sharedInstance.userDetails, Constants.userDetailsFields.mobile) ? this.isEmptyField(Session.sharedInstance.userDetails, Constants.userDetailsFields.mobile) : '',
            imageSource: '',
            educationSelected: this.isEmptyField(Session.sharedInstance.userDetails, Constants.userDetailsFields.education) ? this.isEmptyField(Session.sharedInstance.userDetails, Constants.userDetailsFields.education) : '',
            education: [],
            formData: null,
            dropdown: '',
            otherEducationName: '',
            referralCode: '',
            isPopVisible: false,
            isEditableReferral: true
        }
    }

    ref = createRef(null)

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

    LaunchImageLibrary() {
        ImagePicker.openPicker({
            width: 300,
            height: 400,
            cropping: true,
            cropperToolbarColor: Color.secondayTextColor,
            cropperCircleOverlay: true,
            mediaType: 'photo',
        }).then(image => {
            this.closeControlPanel()
            let source = { uri: image.path };
            this.setState({ imageSource: image, profileImage: source });
        }).catch(e => {
            // if (__DEV__) console.log("error", e)
            this.closeControlPanel()
        });
    }

    LaunchCamera() {
        ImagePicker.openCamera({
            width: 300,
            height: 400,
            cropping: true,
            cropperToolbarColor: Color.secondayTextColor,
            cropperCircleOverlay: true,
            mediaType: 'photo'
        }).then(image => {
            this.closeControlPanel()
            let source = { uri: image.path };
            this.setState({ imageSource: image, profileImage: source });
        });
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


    studentApiHandler = async () => {
        let date = new Date()
        const { name, email, educationSelected } = this.state

        if (this.isEmptyField(Session.sharedInstance.userDetails, Constants.userDetailsFields.profile_picture) != this.state.profileImage) {
            if (!this.formValidation(name, email, educationSelected)) {
                return
            }
            try {
                let formData = new FormData();
                formData.append('id', this.state.userId)
                if (this.state.name != '')
                    formData.append('name', this.state.name)
                formData.append('email', this.state.email)

                let image = {
                    uri: this.state.profileImage.hasOwnProperty('uri') ? this.state.profileImage.uri : this.state.profileImage,
                    type: 'image/jpg',
                    name: `${Math.floor(date.getTime() + (date.getSeconds() / 2))}.jpg`,
                }

                if (this.state.educationSelected != '')
                    formData.append('student_education', this.state.educationSelected)


                // if (this.state.referralCode != '')
                //     formData.append('referred_by', this.state.referralCode)
                if (this.state.profileImage != '')
                    formData.append('profile_picture', image)
                console.log("FormData" + JSON.stringify(formData))

                const res = await NetworkManager.networkManagerInstance.fetchMultiPartRequest(URL.updateStudent, URL.putRequest, formData, true, () => { this.studentApiHandler() });

                if (res.statusCode === 200) {
                    await this._storeData()
                    await Utility.sharedInstance._storeData(AsyncStorageValues.userDetails, res.data, String.asynstorageMsgs.updateStudentData)
                    Session.sharedInstance.userDetails = res.data

                    NetworkManager.networkManagerInstance.progressBarRequest(false)
                    this.props.navigation.navigate(Constant.routeName.homeScreen, { mobile: this.state.mobileNo, _id: res.data._id })
                } else {
                    NetworkManager.networkManagerInstance.progressBarRequest(false)
                    showToast(res.message)
                }

            } catch (error) {
                NetworkManager.networkManagerInstance.progressBarRequest(false)
                console.log("STUDENT_API_HANDLER " + error)
            }

        } else {
            if (!this.formValidation(name, email, educationSelected)) {
                return
            }
            if (this.isEmptyField(Session.sharedInstance.userDetails, Constants.userDetailsFields.name) != this.state.name || this.isEmptyField(Session.sharedInstance.userDetails, Constants.userDetailsFields.education) != this.state.educationSelected) {
                let data = {
                    id: this.state.userId,
                    name: this.state.name,
                    email: this.state.email,
                }
                const res = await NetworkManager.networkManagerInstance.fetchRequest(URL.updateStudent, URL.putRequest, true, data, () => this.studentApiHandler())
                if (res.statusCode == 200) {
                    await this._storeData()
                    await Utility.sharedInstance._storeData(AsyncStorageValues.userDetails, res.data, String.asynstorageMsgs.updateStudentData)
                    Session.sharedInstance.userDetails = res.data
                    NetworkManager.networkManagerInstance.progressBarRequest(false)
                    this.props.navigation.navigate(Constant.routeName.homeScreen)
                } else {
                    NetworkManager.networkManagerInstance.progressBarRequest(false)
                    showToast(res.message)
                }
            }

        }
    }



    async _storeData() {

        try {
            await AsyncStorage.setItem(AsyncStorageValues.isTutor, JSON.stringify('false'))
        } catch (error) {
            if (__DEV__) console.log("COULD NOT SET IS TUTOR")
        }
    }



    formValidation(name, email, educationSelected) {

        if (this.state.profileImage.length == 0) {
            showToast(String.toastMsgs.studentReg.uploadImage)
            return false
        }
        if (this.state.name.length > 0) {
            if (!Utility.sharedInstance.validateName(name)) {
                return false
            }
        }
        if (!Utility.sharedInstance.validateEmptyField(name, String.toastMsgs.studentReg.enterName)) {
            return false
        }
        if (!Utility.sharedInstance.validateEmptyField(email, String.toastMsgs.studentReg.enterEmail)) {
            return false
        }
        if (!Utility.sharedInstance.validateEmptyField(educationSelected, String.toastMsgs.studentReg.enterEducation)) {
            return false
        }
        if (!Utility.sharedInstance.validateEmailAddress(email)) {
            return false
        }
        if (this.state.educationSelected == "Other")
            if (!Utility.sharedInstance.validateEmptyField(this.state.otherEducationName, String.toastMsgs.tutor.otherField)) {
                return false
            } { }

        return true
    }



    educationDropdown = (text, index) => {
        this.setState({ educationSelected: text, })
    }

    updateData = (item, isdropdownVisible) => {
        console.log("item" + item)
        this.setState({
            dropdown: isdropdownVisible,
            educationSelected: item,
            education: [],
        }), () => console.log("educationSelected" + this.state.educationSelected);
    }

    dropDownLoader = async () => {
        NetworkManager.networkManagerInstance.progressBarRequest(true)
        let data = {}
        data.country = Session.sharedInstance.countryName,
            data.search_term = Constant.searchAPITerms.education
        try {
            const res = await NetworkManager.networkManagerInstance.fetchRequest(URL.getEducationDetails, URL.postRequest, true, data, () => { this.dropDownLoader() });
            if (res.statusCode === 200) {
                NetworkManager.networkManagerInstance.progressBarRequest(false)
                this.setState({ education: [...res.data.education, 'Other'], })
            } else {
                NetworkManager.networkManagerInstance.progressBarRequest(false)
            }
        } catch (error) {
            NetworkManager.networkManagerInstance.progressBarRequest(false)
            console.log("UPDATE_TUTOR_API " + error)
        }

    }

    verifyReferralCode = async () => {
        parameterData = {
            referral_id: this.state.referralCode,
            student_id: this.state.userId
        }
        const res = await NetworkManager.networkManagerInstance.fetchRequest(URL.verifyRefferalCode, URL.postRequest, true, parameterData, () => this.apiHandler())
        if (res.statusCode === 200) {
            let showPopUpMesssage = res.message
            let base_Price = res.data.base_price
            let country_currency = res.data.currency
            NetworkManager.networkManagerInstance.progressBarRequest(false)
            this.setState({ isPopVisible: true, isEditableReferral: false, popUpMessage: `${showPopUpMesssage} ${country_currency} ${base_Price}${'.'}` })
        } else {
            NetworkManager.networkManagerInstance.progressBarRequest(false)
            this.setState({ referralCode: '' })
            showToast(res.message)
        }
    }

    render() {
        const { profileImage, name, email, mobileNumber, referralCode, educationSelected } = this.state
        console.log('this is checking image url:.....before', this.state.profileImage)
        return (
            <Drawer ref={(ref) => this._drawer = ref}
                type="overlay"
                content={
                    <View style={{ backgroundColor: 'transparent', position: 'absolute', bottom: 0, left: 0, right: 0, paddingLeft: 10, paddingRight: 10, paddingTop: 10 }}>
                        <View style={{ height: 110, borderRadius: 20, elevation: 10, backgroundColor: 'white', borderColor: 'white' }}>
                            <TouchableOpacity style={{ alignItems: 'center', justifyContent: 'center' }}
                                onPress={() => this.LaunchImageLibrary()}
                            ><Text style={{ height: 53, fontSize: 18, color: '#007bfd', paddingTop: 13 }}>{Strings.studentSignUp.uploadPicture}</Text></TouchableOpacity>
                            <View style={{ height: 1, backgroundColor: '#d6d6d6' }} />
                            <TouchableOpacity style={{ alignItems: 'center' }}
                                onPress={() => this.LaunchCamera()}
                            ><Text style={{ height: 55, fontSize: 18, justifyContent: 'center', paddingTop: 13, color: '#007bfd' }}>{
                                Strings.studentSignUp.takePicture
                            }</Text></TouchableOpacity>
                        </View>
                        <View style={{ height: 55, borderRadius: 20, elevation: 10, marginBottom: 10, backgroundColor: 'white', borderColor: 'white', alignItems: 'center', marginTop: 10 }}>
                            <TouchableOpacity onPress={() => this.closeControlPanel()}><Text style={{ height: 55, fontSize: 18, marginTop: 13, color: '#007bfd' }}>{Strings.studentSignUp.cancel}</Text></TouchableOpacity>
                        </View>
                    </View>}
                tapToClose={true}
                acceptTap={true}
                openDrawerOffset={0}
                panCloseMask={0}
                closedDrawerOffset={-3}
                styles={drawerStyles}
                tweenHandler={(ratio) => ({
                    mainOverlay: { opacity: ratio / 1.5, backgroundColor: 'lightgrey' }
                })}
            >
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
                                                rightIcon={Assets.studentProfile.done}
                                                rightIconPress={() => this.studentApiHandler()}

                                            />
                                        </View>
                                        <View style={{ flex: 0.88, top: -20, borderTopLeftRadius: 20, borderTopRightRadius: 20, height: Dimen.phoneHeight, width: '100%', backgroundColor: Color.secondayTextColor }}>
                                            <View style={{ flex: 0.3, alignItems: 'center', justifyContent: 'center', }}>
                                                <TouchableOpacity
                                                    onPress={() => this.openControlPanel()}>
                                                    <ImageBackground
                                                        // source={Assets.studentRegistration.uploadProfile}
                                                        // source={ profileImage ? { uri: profileImage, cache: 'force-cache' } : Assets.studentRegistration.uploadProfile}
                                                        source={profileImage === '' ? Assets.studentRegistration.uploadProfile : this.isValidURL(profileImage) ? { uri: profileImage, cache: 'force-cache' } : profileImage}

                                                        style={styles.ProfilePic}
                                                        borderRadius={50}
                                                        borderColor={Color.borderColor.primaryColor}
                                                        borderWidth={1}
                                                        resizeMode={'cover'}>
                                                        <View
                                                            style={{
                                                                width: 40,
                                                                height: 40,
                                                                marginTop: 70,
                                                                marginLeft: 70,
                                                                backgroundColor: Color.secondayTextColor,
                                                                borderRadius: 50,
                                                                borderWidth: 1,
                                                                borderColor: Color.borderColor.secondaryColor,
                                                                alignItems: 'center',
                                                                justifyContent: 'center'
                                                            }}>
                                                            <Image
                                                                source={Assets.studentRegistration.uploadicon}
                                                                style={{ width: 20, height: 20, tintColor: Color.borderColor.secondaryColor }}
                                                                resizeMode="contain" />
                                                        </View>
                                                    </ImageBackground>
                                                </TouchableOpacity>

                                            </View>

                                            <View style={{ flex: 0.7 }}>
                                                <View style={{ flex: 1 }}>
                                                    <View style={{ flex: 0.6, paddingHorizontal: 25 }}>

                                                        <AppTextComp
                                                            value={name}
                                                            onChangeText={(text) => this.setState({ name: text })}
                                                            placeholder={Strings.studentSignUp.fullName}
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

                                                        <TouchableOpacity
                                                            style={{ width: '100%', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderBottomWidth: 1, borderBottomColor: Color.borderColor.primaryColor }}
                                                            onPress={() => this.setState({ dropdown: true }, () => this.dropDownLoader())}>
                                                            <AppTextComp
                                                                value={educationSelected}
                                                                onChangeText={(text) => this.setState({ educationSelected: text })}
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
                                                                keyboardType='default'
                                                                materialTextInput
                                                            />
                                                            <Image style={{ marginLeft: 5 }} source={Assets.common.drop_down} />
                                                        </TouchableOpacity>

                                                        {educationSelected == "Other" && <AppTextComp
                                                            value={this.state.otherEducationName}
                                                            onChangeText={(text) => this.setState({ otherEducationName: text })}
                                                            placeholder={Strings.studentSignUp.otherEducation}
                                                            fontSize={16}
                                                            style={{ paddingTop: 10 }}
                                                            autoCapitalize='none'
                                                            labelEnabled={true}
                                                            tintColor={Color.borderColor.secondaryColor}
                                                            lineWidth={1}
                                                            activeLineWidth={1}
                                                            width='100%'
                                                            // keyboardType='default'
                                                            materialTextInput />}


                                                        <AppTextComp
                                                            value={referralCode}
                                                            onChangeText={(text) => this.setState({ referralCode: text }, () => {
                                                                if (this.state.referralCode.length == 8) {
                                                                    this.verifyReferralCode()
                                                                }
                                                            })}
                                                            placeholder={Strings.studentSignUp.referralCode}
                                                            editable={this.state.isEditableReferral}
                                                            fontSize={16}
                                                            autoCapitalize='none'
                                                            labelEnabled={false}
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
                                {this.state.dropdown != "" && this.state.education.length > 0 && <CommonDropDown
                                    isModalshow={this.state.dropdown}
                                    cancelModal={() => this.setState({ dropdown: false })}
                                    data={this.state.education}
                                    getCountry={this.updateData}
                                    dropdownHeader={String.studentSignUp.education}
                                    listItemField={'value'}
                                />}
                            </ScrollView>
                        </TouchableWithoutFeedback>
                    </KeyboardAvoidingView>
                    <PopUp
                        isPopVisible={this.state.isPopVisible}
                        headerText={Strings.studentSignUp.congratulations}
                        descriptionText={this.state.popUpMessage}
                        rightButtonText={Strings.studentSignUp.okay}
                        rightButtonOnPress={async () => {
                            this.setState({ isPopVisible: false })
                        }}
                    />
                </SafeAreaComponent>

            </Drawer >

        )
    };
};

export default StudentEditProfile;

const styles = StyleSheet.create({
    ProfilePic: {
        width: 100,
        height: 100,
        alignItems: 'center',
        justifyContent: 'center',
    },

});

const drawerStyles = { drawer: { shadowColor: 'grey', shadowOpacity: 0.2, shadowRadius: 3 }, main: { paddingLeft: 3 } }

