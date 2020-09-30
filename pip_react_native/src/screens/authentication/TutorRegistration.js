import React, { Component, createRef, } from 'react';
import {
    View, Text, TouchableOpacity, StyleSheet, Image, TextInput, ImageBackground,
    TouchableWithoutFeedback, KeyboardAvoidingView,
    ScrollView, Keyboard, Platform, Dimensions
} from 'react-native'
import { AppButton, AppImageComponent, CommonHeader, SafeAreaComponent, InputTextField, AppTextInput, AppTextComp, PopUp } from '../../components';
import { Strings, Assets, Dimen, Color, Styles, URL, Constant, AsyncStorageValues } from '../../../res/index';
import { Dropdown } from 'react-native-material-dropdown';
import Drawer from 'react-native-drawer'
import String from '../../../res/String';
import Utility, { showToast } from "../../utils/Utility";
import ImagePicker from 'react-native-image-crop-picker';
import { NetworkManager } from '../../utils';
import AsyncStorage from '@react-native-community/async-storage';
import Session from '../../utils/Session';
import Constants from '../../../res/Constants';
import { appleAuth, AppleButton } from '@invertase/react-native-apple-authentication';

const majorVersionIOS = parseInt(Platform.Version);
const { width, height } = Dimensions.get("window");




class TutorRegistration extends Component {
    closeControlPanel = () => { this._drawer.close() };
    openControlPanel = () => {
        Keyboard.dismiss()
        this._drawer.open()
    };



    constructor(props) {
        super(props)
        this.state = {
            userId: Session.sharedInstance.userDetails[Constants.userDetailsFields._id] != '' ? Session.sharedInstance.userDetails[Constants.userDetailsFields._id] : '',
            name: Session.sharedInstance.userDetails[Constants.userDetailsFields.name] != undefined ? Session.sharedInstance.userDetails[Constants.userDetailsFields.name] : '',
            email: Session.sharedInstance.userDetails[Constants.userDetailsFields.email] != undefined ? Session.sharedInstance.userDetails[Constants.userDetailsFields.email] : '',
            imageSource: Session.sharedInstance.userDetails[Constants.userDetailsFields.profile_picture] != undefined ? Session.sharedInstance.userDetails[Constants.userDetailsFields.profile_picture] : '',
            profileImage: Session.sharedInstance.userDetails[Constants.userDetailsFields.profile_picture] != undefined ? Session.sharedInstance.userDetails[Constants.userDetailsFields.profile_picture] : '',
            referralCode: '',
            location: Session.sharedInstance.userDetails[Constants.userDetailsFields.location] != undefined ? Session.sharedInstance.userDetails[Constants.userDetailsFields.location] : '',
            keyboardShow: false,
            isPopVisible: false,
            isEditableReferral: true
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

        if (this.state.referralCode != 8) {
            this.setState({ referralCode: '' })
        }
        if (!this.formValidation()) {
            return
        }
        let formData = this.createFormData()
        if (Session.sharedInstance.userDetails[Constants.userDetailsFields.profile_picture] != this.state.profileImage) {




            const res = await NetworkManager.networkManagerInstance.fetchMultiPartRequest(URL.updateTutor, URL.putRequest, formData, true, () => { this.tutorApiHandler(props) });
            if (res.statusCode === 200) {
                await this._storeData()
                await Utility.sharedInstance._storeData(AsyncStorageValues.userDetails, res.data, String.asynstorageMsgs.updateStudentData)
                Session.sharedInstance.userDetails = res.data
                Session.sharedInstance.isStudent = false
                Session.sharedInstance.isTutorPersonalDetails = true
                NetworkManager.networkManagerInstance.progressBarRequest(false)
                this.props.navigation.navigate(Constant.routeName.tutorBusiness, { _id: this.state.userId })
            } else {
                NetworkManager.networkManagerInstance.progressBarRequest(false)
                showToast(res.message)
            }
        }
        else {
            let params = this.createParmams()
            const res = await NetworkManager.networkManagerInstance.fetchRequest(URL.updateTutor, URL.putRequest, true, params, () => { this.tutorApiHandler(props) });
            if (res.statusCode === 200) {
                await this._storeData()
                await Utility.sharedInstance._storeData(AsyncStorageValues.userDetails, res.data, String.asynstorageMsgs.updateStudentData)
                Session.sharedInstance.userDetails = res.data
                Session.sharedInstance.isStudent = false
                Session.sharedInstance.isTutorPersonalDetails = true
                NetworkManager.networkManagerInstance.progressBarRequest(false)
                this.props.navigation.navigate(Constant.routeName.tutorBusiness, { _id: this.state.userId })
            } else {
                NetworkManager.networkManagerInstance.progressBarRequest(false)
                showToast(res.message)
            }

        }



    }

    createFormData() {
        let dataUpdated = false
        let date = new Date()
        let image = {}
        const { name, email, profileImage, location } = this.state

        if (!this.formValidation(name, email)) {
            return
        }
        try {
            let formData = new FormData();
            formData.append('stage_count', 1)
            formData.append('id', this.state.userId)
            if (this.state.name != '') {
                if (Session.sharedInstance.userDetails[Constants.userDetailsFields.name] != this.state.name)
                    formData.append('name', this.state.name)
                dataUpdated = true
            }
            if (Session.sharedInstance.userDetails[Constants.userDetailsFields.email] != this.state.email) {
                formData.append('email', this.state.email)
                dataUpdated = true
            }

            image = {
                uri: this.state.profileImage.hasOwnProperty('uri') ? this.state.profileImage.uri : this.state.profileImage,
                type: 'image/jpg',
                name: `${Math.floor(date.getTime() + (date.getSeconds() / 2))}.jpg`,
            }


            if (this.state.referralCode.trim() != '')
                formData.append('referral_id', this.state.referralCode)


            if (this.state.profileImage != '') {
                if (Session.sharedInstance.userDetails[Constants.userDetailsFields.profile_picture] != this.state.profileImage) {
                    formData.append('profile_picture', image)
                    dataUpdated = true
                }
            }
            if (dataUpdated) {
                formData.append('isVerified', false)
            }
            if (this.props.route.params.navigateFrom == 'SideDrawer') {
                formData.append('is_student', true)
                dataUpdated = true
            }

            return formData
        } catch (error) {
            NetworkManager.networkManagerInstance.progressBarRequest(false)
        }

    }

    createParmams() {
        let dataUpdated = false
        let date = new Date()
        let image = {}
        const { name, email, profileImage, location } = this.state


        if (!this.formValidation(name, email)) {
            return
        }
        try {
            let formData = {}
            formData.id = this.state.userId
            if (this.props.route.params.navigateFrom == 'SideDrawer') {
                formData.append('is_student', true)
                dataUpdated = true
            }
            if (this.state.name != '') {
                if (Session.sharedInstance.userDetails[Constants.userDetailsFields.name] != this.state.name)
                    formData.name = this.state.name
                dataUpdated = true
            }
            if (Session.sharedInstance.userDetails[Constants.userDetailsFields.email] != this.state.email) {
                formData.email = this.state.email
            }

            image = {
                uri: this.state.profileImage.hasOwnProperty('uri') ? this.state.profileImage.uri : this.state.profileImage,
                type: 'image/jpg',
                name: `${Math.floor(date.getTime() + (date.getSeconds() / 2))}.jpg`,
            }


            // if (this.state.referralCode.trim() != '')
            //     formData.referral_id = this.state.referralCode


            if (this.state.profileImage != '') {
                if (Session.sharedInstance.userDetails[Constants.userDetailsFields.profile_picture] != this.state.profileImage) {
                    formData.profile_picture = image
                    dataUpdated = true
                }
            }
            if (dataUpdated) {
                formData.isVerified = false
            }

            return formData
        } catch (error) {
            NetworkManager.networkManagerInstance.progressBarRequest(false)
            console.log("TUTOR_API_HANDLER " + error)
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
            this.setState({ referralCode: '' })
            showToast(res.message)
        }
    }


    render() {

        return (
            this.bottomSheetDrawer()
        )
    }

    async componentDidMount() {
        await Utility.sharedInstance._configureGoogleSignIn()
    }

    bottomSheetDrawer() {
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
                // side='bottom'
                acceptTap={true}
                openDrawerOffset={0}
                panCloseMask={0}
                closedDrawerOffset={-3}
                styles={drawerStyles}
                tweenHandler={(ratio) => ({
                    mainOverlay: { opacity: ratio / 1.5, backgroundColor: 'lightgrey' }
                })}
            >
                <SafeAreaComponent>
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
                                    {this.imageAndInputTextView()}
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



    // registrationView() {
    //     return (
    //         <View style={{ flex: 1, }}>

    //         </View>
    //     )
    // }

    imageAndInputTextView() {
        const { name, email, referralCode, location } = this.state
        return (
            <View style={{ flex: 1, marginHorizontal: 20 }}>
                <View style={{ flex: 0.1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                    <CommonHeader

                        headerTrue={String.teacherSignUp.personalDetails}
                        pageCount={String.teacherSignUp.oneOdThree}
                    // skip={String.teacherSignUp.skip}
                    />
                </View>
                <View style={{ flex: 0.6 }}>
                    <View style={{ flex: 0.2, alignItems: 'center', paddingTop: 10, justifyContent: 'center', }}>
                        <TouchableOpacity
                            onPress={() => this.openControlPanel()}>
                            <ImageBackground
                                // source={Assets.studentRegistration.uploadProfile}
                                // source={this.state.profileImage === '' ? Assets.studentRegistration.uploadProfile : this.state.profileImage}
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
                                placeholder={String.studentSignUp.fullName}
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
                                placeholder={String.studentSignUp.emailAddress}
                                fontSize={16}
                                style={{ paddingTop: 10, }} autoCapitalize='none'
                                labelEnabled={true}
                                // renderAccessory={() => accessoryView(this.state.cardType.icon)}
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
                                placeholder={String.studentSignUp.referralCode}
                                fontSize={16}
                                style={{ paddingTop: 10, }} autoCapitalize='none'
                                labelEnabled={false}
                                // renderAccessory={() => accessoryView(this.state.cardType.icon)}
                                tintColor={Color.borderColor.secondaryColor}
                                lineWidth={1}
                                activeLineWidth={1}
                                width='100%'
                                keyboardType='default'
                                materialTextInput />
                            {/* <AppTextComp
                                value={location}
                                onChangeText={(text) => this.setState({ location: text })}
                                placeholder={String.studentSignUp.enterLocation}
                                fontSize={16}
                                style={{ paddingTop: 10, }}
                                autoCapitalize='none'
                                labelEnabled={true}
                                // renderAccessory={() => accessoryView(this.state.cardType.icon)}
                                tintColor={Color.borderColor.secondaryColor}
                                lineWidth={1}
                                activeLineWidth={1}
                                width='100%'
                                keyboardType='default'
                                materialTextInput /> */}
                        </View>

                    </View>

                    {!this.state.keyboardShow && this.continueButton()}
                </View>
                <View style={{ flex: 0.1, paddingTop: 45 }}>
                    <View style={{ flex: .30 }}>
                        {majorVersionIOS >= 13 && Platform.OS == "ios" && <AppleButton
                            style={styles.appleButton}
                            cornerRadius={25}
                            buttonStyle={AppleButton.Style.BLACK}
                            buttonType={AppleButton.Type.SIGN_IN}
                            onPress={() => this.onAppleButtonPress()}
                        />}
                    </View>

                </View>
                <View style={{ flex: 0.35 }}>
                    <View style={{ flex: .9, justifyContent: 'flex-end', paddingBottom: 20 }}>
                        <View style={{ flex: 0.4, flexDirection: 'row', justifyContent: 'center', alignItems: 'flex-end', }}>
                            <View style={{ width: '20%', height: 2, backgroundColor: Color.listSeperator.primary }}></View>
                            <Text style={{ paddingHorizontal: 30, bottom: -7 }}>or</Text>
                            <View style={{ width: '20%', height: 2, backgroundColor: Color.listSeperator.primary }}></View>
                        </View>
                        <View style={{ flex: 0.2, paddingTop: 10, paddingBottom: 10 }}>
                            {this.socialButtonContainer()}
                        </View>
                    </View>

                </View>
                <View style={{ flex: 0.05 }}></View>
            </View >
        )
    }

    async onAppleButtonPress() {
        // performs login request
        const appleAuthRequestResponse = await appleAuth.performRequest({
            requestedOperation: appleAuth.Operation.LOGIN,
            requestedScopes: [appleAuth.Scope.EMAIL, appleAuth.Scope.FULL_NAME],
        });
        const { identityToken, nonce, fullName, authorizationCode, user } = appleAuthRequestResponse;
        // get current authentication state for user
        // /!\ This method must be tested on a real device. On the iOS simulator it always throws an error.
        const credentialState = await appleAuth.getCredentialStateForUser(appleAuthRequestResponse.user);

        // use credentialState response to ensure the user is authenticated
        if (credentialState === appleAuth.State.AUTHORIZED && identityToken) {
            // user is authenticated

            let data = {}
            data.name = (appleAuthRequestResponse.givenName != null) ? (appleAuthRequestResponse.givenName + ' ' + appleAuthRequestResponse.familyName) : " None";
            data.email = (appleAuthRequestResponse.email != null) ? appleAuthRequestResponse.email : "None";
            console.log("Apple user Authenticated===>>>" + JSON.stringify(appleAuthRequestResponse))
            this.setState({ name: data.name, email: data.email })

        }

    }

    continueButton() {
        return (
            <View style={{ width: '100%', bottom: 0, alignItems: 'center', alignSelf: 'center', }}>
                <AppButton
                    buttonStyle={{ width: '100%' }}
                    onPress={this.tutorApiHandler}
                    isEnabled={true}
                    buttonText={Strings.studentSignUp.continue}
                />
            </View>
        )
    }



    socialButtonContainer() {
        return (
            <View style={{ flex: 1, justifyContent: 'flex-start', flexDirection: 'row', alignSelf: 'center' }}>
                <TouchableOpacity
                    style={styles.socialButtonContainer}
                    activeOpacity={0.8}
                    onPress={() => this.onFaceBookLogin()}
                >

                    <Image source={Assets.studentRegistration.facebookLogo} />
                    <Text style={styles.textStyle}>{Strings.studentSignUp.registerWithFacebook}</Text>
                </TouchableOpacity>
                <View style={{ flex: 0.3 }}></View>
                <TouchableOpacity
                    style={styles.socialButtonContainer}
                    activeOpacity={0.8}
                    onPress={() => this.googleSignMethod()}
                >
                    <Image style={{ width: 19.26, height: 19.26 }} source={Assets.studentRegistration.googleLogo} />
                    <Text style={styles.textStyle}>{Strings.studentSignUp.registerWithGoogle}</Text>
                </TouchableOpacity>
            </View>
        )
    }



    googleSignMethod = async () => {
        NetworkManager.networkManagerInstance.progressBarRequest(true)

        try {
            let userInfo = await Utility.sharedInstance.googleSignin()
            this.setState({ profileImage: userInfo.user.photo, name: userInfo.user.name, email: userInfo.user.email },)
            NetworkManager.networkManagerInstance.progressBarRequest(false)


        } catch (error) {
            NetworkManager.networkManagerInstance.progressBarRequest(false)
            if (__DEV__) console.log("GOOGLE LOGIN FAILED")
        }
    }



    async onFaceBookLogin() {
        NetworkManager.networkManagerInstance.progressBarRequest(true)
        try {
            let res = await Utility.sharedInstance.facebookLogin()
            this.setState({ profileImage: res.picture.data.url, name: res.name, email: res.email })
            NetworkManager.networkManagerInstance.progressBarRequest(false)
        } catch (error) {
            NetworkManager.networkManagerInstance.progressBarRequest(false)
            if (__DEV__) console.log("FACEBOOK LOGIN FAILED")
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

        if (this.state.profileImage.length == 0) {
            showToast(String.toastMsgs.studentReg.uploadImage)
            return false
        }
        if (this.state.name.length > 0) {
            if (!Utility.sharedInstance.validateName(this.state.name)) {
                return false
            }
        }
        if (!Utility.sharedInstance.validateEmptyField(this.state.name, String.toastMsgs.studentReg.enterName)) {
            return false
        }
        if (!Utility.sharedInstance.validateEmptyField(this.state.email, String.toastMsgs.studentReg.enterEmail)) {
            return false
        }
        if (!Utility.sharedInstance.validateEmailAddress(this.state.email)) {
            return false
        }


        return true
    }


}

export default TutorRegistration;



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
    },
    appleButton: {
        width: width - 40,
        height: 50,
        margin: 0,

    },
});
const drawerStyles = { drawer: { shadowColor: 'grey', shadowOpacity: 0.2, shadowRadius: 3 }, main: { paddingLeft: 3 } }