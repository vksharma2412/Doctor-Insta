import React, { Component, createRef, } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, TextInput, ImageBackground, TouchableWithoutFeedback, KeyboardAvoidingView, ScrollView, Keyboard } from 'react-native'
import { AppButton, AppImageComponent, CommonHeader, SafeAreaComponent, InputTextField, AppTextInput, AppTextComp, PopUp } from '../../components';
import { Strings, Assets, Dimen, Color, Styles, URL, Constant, AsyncStorageValues } from '../../../res/index';
import Drawer from 'react-native-drawer'
import Utility, { showToast } from "../../utils/Utility";
import ImagePicker from 'react-native-image-crop-picker';
import { NetworkManager } from '../../utils';
import AsyncStorage from '@react-native-community/async-storage';
import Session from '../../utils/Session';
import Constants from '../../../res/Constants';






class TutorProfileInfo extends Component {
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
            referralCode: '',
            imageSource: '',
            location: '',
            keyboardShow: false,
            isPopVisible: false,
            isEditableReferral: true
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

    ref = createRef(null)

    componentWillMount() {
        this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', this._keyboardDidShow);
        this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', this._keyboardDidHide);
    }

    componentWillUnmount() {
        this.keyboardDidShowListener.remove();
        this.keyboardDidHideListener.remove();
    }



    _keyboardDidShow = () => {
        this.setState({ showKeyboard: true })
    }

    _keyboardDidHide = () => {
        this.setState({ showKeyboard: false })
    }


    tutorApiHandler = async () => {
        let date = new Date()
        const { name, email, profileImage, location } = this.state
        if (this.isEmptyField(Session.sharedInstance.userDetails, Constants.userDetailsFields.profile_picture) != this.state.profileImage) {
            if (!this.formValidation(name, email)) {
                return
            }
            try {
                let formData = new FormData();
                formData.append('id', this.state.userId)
                formData.append('isVerified', false)
                if (this.state.name != '')
                    formData.append('name', this.state.name)
                formData.append('email', this.state.email)
                let image = {
                    uri: this.state.profileImage.hasOwnProperty('uri') ? this.state.profileImage.uri : this.state.profileImage,
                    type: 'image/jpg',
                    name: `${Math.floor(date.getTime() + (date.getSeconds() / 2))}.jpg`,
                }

                if (this.state.referralCode.trim() != '')
                    formData.append('referred_by', this.state.referralCode)


                if (this.state.profileImage != '')
                    formData.append('profile_picture', image)



                const res = await NetworkManager.networkManagerInstance.fetchMultiPartRequest(URL.updateTutor, URL.putRequest, formData, true, () => { this.studentApiHandler(props) });
                if (res.statusCode === 200) {
                    await this._storeData()
                    await Utility.sharedInstance._storeData(AsyncStorageValues.userDetails, res.data, Strings.asynstorageMsgs.updateStudentData)

                    Session.sharedInstance.userDetails = res.data
                    NetworkManager.networkManagerInstance.progressBarRequest(false)
                    this.props.navigation.navigate(Constant.routeName.waitingForApproval)
                } else {
                    NetworkManager.networkManagerInstance.progressBarRequest(false)
                    showToast(res.message)
                }

            } catch (error) {
                NetworkManager.networkManagerInstance.progressBarRequest(false)
                console.log("STUDENT_API_HANDLER " + error)
            }

        }
        else {
            if (!this.formValidation(name, email)) {
                return
            }
            if (this.isEmptyField(Session.sharedInstance.userDetails, Constants.userDetailsFields.name) != this.state.name || this.isEmptyField(Session.sharedInstance.userDetails, Constants.userDetailsFields.email) != this.state.email) {
                let data = {
                    id: this.state.userId,
                    name: this.state.name,
                    email: this.state.email,
                    isVerified: false
                }
                const res = await NetworkManager.networkManagerInstance.fetchRequest(URL.updateTutor, URL.putRequest, true, data, () => this.tutorApiHandler())
                if (res.statusCode == 200) {
                    await this._storeData()
                    await Utility.sharedInstance._storeData(AsyncStorageValues.userDetails, res.data, Strings.asynstorageMsgs.updateStudentData)
                    Session.sharedInstance.userDetails = res.data
                    NetworkManager.networkManagerInstance.progressBarRequest(false)
                    this.props.navigation.navigate(Constant.routeName.waitingForApproval)
                } else {
                    NetworkManager.networkManagerInstance.progressBarRequest(false)
                    showToast(res.message)
                }
            }

        }


    }


    async _storeData() {

        try {
            await AsyncStorage.setItem(AsyncStorageValues.isTutor, JSON.stringify('true'))
        } catch (error) {
            if (__DEV__) console.log("COULD NOT SET IS TUTOR")
        }
    }

    verifyReferralCode = async () => {
        parameterData = {
            referral_id: this.state.referralCode,
            tutor_id: this.state.userId
        }
        const res = await NetworkManager.networkManagerInstance.fetchRequest(URL.verifyTutorReferal, URL.postRequest, true, parameterData, () => this.apiHandler())
        if (res.statusCode === 200) {
            let showPopUpMesssage = res.message
            let base_Price = res.data.base_price
            let country_currency = res.data.currency
            NetworkManager.networkManagerInstance.progressBarRequest(false)
            this.setState({ isPopVisible: true, popUpMessage: `${showPopUpMesssage} ${country_currency} ${base_Price}${'.'}` })
        } else {
            NetworkManager.networkManagerInstance.progressBarRequest(false)
            showToast(res.message)
        }
    }


    render() {
        const { name, email, referralCode, location } = this.state
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
                    StatusBarTextColor={'dark-content'}
                >
                    <KeyboardAvoidingView
                        style={{ flex: 1, flexDirection: 'column', }}
                        behavior={Platform.OS === 'ios' ? 'padding' : null}
                        enabled>

                        <ScrollView
                            style={{ flex: 1, }}
                            keyboardShouldPersistTaps='always'
                            showsVerticalScrollIndicator={false}>
                            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                                <View style={{ flex: 1, height: Dimen.phoneHeight }}>
                                    <View style={{ flex: 1, marginHorizontal: 20 }}>
                                        <View style={{ flex: 0.10, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                                            <CommonHeader

                                                headerTrue={Strings.teacherSignUp.personalDetails}
                                                pageCount={Strings.teacherSignUp.oneOdThree}
                                            />
                                        </View>
                                        <View style={{ flex: 0.60 }}>
                                            <View style={{ flex: 0.2, alignItems: 'center', paddingTop: 10, justifyContent: 'center', }}>
                                                <TouchableOpacity
                                                    onPress={() => this.openControlPanel()}>
                                                    <ImageBackground
                                                        source={this.state.profileImage === '' ? Assets.studentRegistration.uploadProfile : this.isValidURL(this.state.profileImage) ? { uri: this.state.profileImage, cache: 'force-cache' } : this.state.profileImage}

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
                                            <View style={{ flex: 0.8 }}>
                                                <View style={{ flex: 1 }}>

                                                    <AppTextComp
                                                        value={name}
                                                        onChangeText={(text) => this.setState({ name: text })}
                                                        placeholder={Strings.studentSignUp.fullName}
                                                        fontSize={16}
                                                        style={{ paddingTop: 40, }}
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
                                                        fontSize={16}
                                                        style={{ paddingTop: 10, }} autoCapitalize='none'
                                                        labelEnabled={true}
                                                        tintColor={Color.borderColor.secondaryColor}
                                                        lineWidth={1}
                                                        activeLineWidth={1}
                                                        width='100%'
                                                        keyboardType='default'

                                                        materialTextInput />

                                                    <AppTextComp
                                                        value={referralCode}
                                                        onChangeText={(text) => this.setState({ referralCode: text }, () => {
                                                            if (referralCode.length == 7) {
                                                                this.verifyReferralCode()
                                                            }
                                                        })}
                                                        placeholder={Strings.studentSignUp.referralCode}
                                                        fontSize={16}
                                                        style={{ paddingTop: 10, }} autoCapitalize='none'
                                                        labelEnabled={true}
                                                        tintColor={Color.borderColor.secondaryColor}
                                                        lineWidth={1}
                                                        activeLineWidth={1}
                                                        width='100%'
                                                        keyboardType='default'

                                                        materialTextInput />

                                                </View>

                                            </View>

                                        </View>
                                        <View style={{ flex: 0.20, justifyContent: 'flex-end' }}>
                                            <AppButton
                                                buttonStyle={{ width: '100%' }}
                                                onPress={this.tutorApiHandler}
                                                isEnabled={true}
                                                buttonText={Strings.studentSignUp.continue}
                                            />

                                        </View>
                                        <View style={{ flex: 0.1 }}></View>
                                    </View >
                                </View>
                            </TouchableWithoutFeedback>
                        </ScrollView>
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
            </Drawer>
        )
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


    LaunchImageLibrary() {
        ImagePicker.openPicker({
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
        }).catch(e => {
            if (__DEV__) console.log("error", e)
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


    formValidation(name, email, educationSelected) {


        if (!Utility.sharedInstance.validateEmptyField(name, Strings.toastMsgs.studentReg.enterName)) {
            return
        }
        if (this.state.profileImage.length == 0) {
            showToast(Strings.toastMsgs.studentReg.uploadImage)
            return false
        }
        if (this.state.name.length > 0) {
            if (!Utility.sharedInstance.validateName(name)) {
                return false
            }
        }

        if (!Utility.sharedInstance.validateEmptyField(email, Strings.toastMsgs.studentReg.enterEmail)) {
            return false
        }
        if (!Utility.sharedInstance.validateEmailAddress(email)) {
            return false
        }


        return true
    }


}

export default TutorProfileInfo;



const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    textHeader: {
        color: Color.textColor.primaryColor,
        fontSize: Dimen.xvlargeTextSize,
        fontWeight: 'bold'
    },
    textDesc: {
        marginTop: 20,
        color: Color.textColor.secondaryColor,
        fontSize: Dimen.smallTextSize,
        lineHeight: 25,
        textAlign: 'center'
    },
    ProfilePic: {
        width: 100,
        height: 100,
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonContainer: {
        height: 50,
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        borderRadius: 25,
        borderWidth: 1,
        borderColor: Color.borderColor.secondaryColor,
        flexDirection: 'row',
    },

    socialButtonContainer: {
        height: 50,
        alignItems: 'center',
        justifyContent: 'center',
        width: '40%',
        borderRadius: 25,
        borderWidth: 1,
        borderColor: Color.borderColor.tertiaryColor,
        flexDirection: 'row',
    },
    textStyle: {
        fontSize: 16,
        color: Color.borderColor.secondaryColor,
        marginLeft: 20
    }
});
const drawerStyles = { drawer: { shadowColor: 'grey', shadowOpacity: 0.2, shadowRadius: 3 }, main: { paddingLeft: 3 } }