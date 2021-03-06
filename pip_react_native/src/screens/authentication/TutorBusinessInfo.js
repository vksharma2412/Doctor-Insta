import React, { Component, createRef, } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, BackHandler, Image, TouchableWithoutFeedback, KeyboardAvoidingView, ScrollView, Keyboard } from 'react-native'
import { AppButton, CommonHeader, SafeAreaComponent, AppTextComp } from '../../components';
import { Strings, Assets, Dimen, Color, Constant, URL, AsyncStorageValues } from '../../../res/index';
import Drawer from 'react-native-drawer'
import String from '../../../res/String';
import Utility, { showToast } from "../../utils/Utility";
import ImagePicker from 'react-native-image-crop-picker';
import { NetworkManager } from '../../utils';
import Constants from '../../../res/Constants';
import Session from '../../utils/Session';




class TutorBusinessInfo extends Component {
    closeControlPanel = () => { this._drawer.close() };
    openControlPanel = () => {
        Keyboard.dismiss()
        this._drawer.open()
    };

    constructor(props) {
        super(props)
        this.state = {
            userId: Session.sharedInstance.userDetails[Constant.userDetailsFields._id],
            name: '',
            email: '',
            referralCode: '',
            businessNo: Session.sharedInstance.userDetails[Constant.userDetailsFields.business_license_number] != undefined ? Session.sharedInstance.userDetails[Constant.userDetailsFields.business_license_number] : '',
            insuranceNo: Session.sharedInstance.userDetails[Constant.userDetailsFields.insurance_number] != undefined ? Session.sharedInstance.userDetails[Constant.userDetailsFields.insurance_number] : '',
            licenseImagefileName: Session.sharedInstance.userDetails[Constants.userDetailsFields.license_image] != undefined ? this.GetFilename(Session.sharedInstance.userDetails[Constant.userDetailsFields.license_image]) : '',
            licenseImage: Session.sharedInstance.userDetails[Constants.userDetailsFields.license_image] != undefined ? Session.sharedInstance.userDetails[Constant.userDetailsFields.license_image] : '',
            licenseImageSize: '',
            isLicenseClicked: false,
            identityImagefileName: Session.sharedInstance.userDetails[Constants.userDetailsFields.identity_proof] != undefined ? this.GetFilename(Session.sharedInstance.userDetails[Constant.userDetailsFields.identity_proof]) : '',
            identityImage: Session.sharedInstance.userDetails[Constants.userDetailsFields.identity_proof] != undefined ? Session.sharedInstance.userDetails[Constant.userDetailsFields.identity_proof] : '',
            identityImageSize: '',
            isIdentityClicked: false,
            addressImagefileName: Session.sharedInstance.userDetails[Constants.userDetailsFields.address_proof] != undefined ? this.GetFilename(Session.sharedInstance.userDetails[Constant.userDetailsFields.address_proof]) : '',
            addressImage: Session.sharedInstance.userDetails[Constants.userDetailsFields.address_proof] != undefined ? Session.sharedInstance.userDetails[Constant.userDetailsFields.address_proof] : '',
            addressImageSize: '',
            isAddressClicked: false,
            certificationServiceImagefileName: Session.sharedInstance.userDetails[Constants.userDetailsFields.certification_of_service] != undefined ? this.GetFilename(Session.sharedInstance.userDetails[Constant.userDetailsFields.certification_of_service]) : '',
            certificationServiceImage: Session.sharedInstance.userDetails[Constants.userDetailsFields.certification_of_service] != undefined ? Session.sharedInstance.userDetails[Constant.userDetailsFields.certification_of_service] : '',
            isCertificationClicked: false,
            certificationServiceImageSize: '',
            education: [{
                value: 'HSC',
            }, {
                value: 'SSC',
            }, {
                value: 'Bachelors',
            }, {
                value: 'Masters',
            }, {
                value: 'Goverment Prep',
            }],
        }

    }

    ref = createRef(null)

    render() {
        return (
            this.bottomSheetDrawer()
        )
    }


    async componentDidMount() {
        BackHandler.addEventListener('loginHardwareBackPress', this.handleBackButtonClick);
    }

    async componentWillUnmount() {
        BackHandler.removeEventListener('loginHardwareBackPress', () => { });
    }


    handleBackButtonClick = async () => {
        if (this.props.navigation.dangerouslyGetState().routes[this.props.navigation.dangerouslyGetState().routes.length - 1].name == 'Login') {
            Session.sharedInstance.isStudent = true
            this.props.navigation.goBack()

        }
    }

    tutorbusinessApiHandler = async () => {

        const { identityImage, addressImage } = this.state
        if (!this.formValidation(identityImage, addressImage)) {
            return
        }
        let formData = this.createFormData()

        if (Session.sharedInstance.userDetails[Constants.userDetailsFields.license_image] != this.state.licenseImage || Session.sharedInstance.userDetails[Constants.userDetailsFields.identity_proof] != this.state.identityImage ||
            Session.sharedInstance.userDetails[Constants.userDetailsFields.address_proof] != this.state.addressImage || Session.sharedInstance.userDetails[Constants.userDetailsFields.certification_of_service] != this.state.certificationServiceImage) {


            const res = await NetworkManager.networkManagerInstance.fetchMultiPartRequest(URL.updateTutor, URL.putRequest, formData, true, () => { this.tutorbusinessApiHandler() });
            if (res.statusCode === 200) {

                await Utility.sharedInstance._storeData(AsyncStorageValues.userDetails, res.data, String.asynstorageMsgs.updateStudentData)
                Session.sharedInstance.userDetails = res.data
                Session.sharedInstance.isStudent = false
                Session.sharedInstance.isTutorBusninessInfo = true
                NetworkManager.networkManagerInstance.progressBarRequest(false)
                this.props.navigation.navigate(Constant.routeName.tutorQualification, { _id: res.data._id })

            } else {
                NetworkManager.networkManagerInstance.progressBarRequest(false)
                showToast(res.message)
            }
        } else {
            let params = this.createParams()
            const res = await NetworkManager.networkManagerInstance.fetchRequest(URL.updateTutor, URL.putRequest, true, params, () => { this.tutorbusinessApiHandler() });
            if (res.statusCode === 200) {
                await Utility.sharedInstance._storeData(AsyncStorageValues.userDetails, res.data, String.asynstorageMsgs.updateStudentData)
                Session.sharedInstance.userDetails = res.data
                Session.sharedInstance.isStudent = false
                Session.sharedInstance.isTutorBusninessInfo = true
                NetworkManager.networkManagerInstance.progressBarRequest(false)
                this.props.navigation.navigate(Constant.routeName.tutorQualification, { _id: res.data._id })

            } else {
                NetworkManager.networkManagerInstance.progressBarRequest(false)
                showToast(res.message)
            }
        }

    }



    createFormData() {
        let dataUpdated = false
        let date = new Date()



        let liscence = {
            uri: this.state.licenseImage.uri,
            type: 'image/jpg',
            name: `${Math.floor(date.getTime() + (date.getSeconds() / 2))}.jpg`,
        }
        let identity = {
            uri: this.state.identityImage.uri,
            type: 'image/jpg',
            name: `${Math.floor(date.getTime() + (date.getSeconds() / 2))}.jpg`,
        }
        let address = {
            uri: this.state.addressImage.uri,
            type: 'image/jpg',
            name: `${Math.floor(date.getTime() + (date.getSeconds() / 2))}.jpg`,
        }
        let certification = {
            uri: this.state.certificationServiceImage.uri,
            type: 'image/jpg',
            name: `${Math.floor(date.getTime() + (date.getSeconds() / 2))}.jpg`,
        }
        try {
            let formData = new FormData();

            formData.append('id', this.state.userId)
            formData.append('stage_count', 2)
            if (this.state.businessNo != '') {
                if (Session.sharedInstance.userDetails[Constants.userDetailsFields.business_license_number] != this.state.businessNo) {
                    formData.append('business_license_number', this.state.businessNo)
                    dataUpdated = true
                }
            }// Optional
            if (this.state.insuranceNo != '') {
                if (Session.sharedInstance.userDetails[Constants.userDetailsFields.insurance_number] != this.state.insuranceNo)
                    formData.append('insurance_number', this.state.insuranceNo)     // Optional
                dataUpdated = true
            }

            if (this.state.licenseImage != '') {
                if (Session.sharedInstance.userDetails[Constants.userDetailsFields.license_image] != this.state.licenseImage) {
                    formData.append('license_image', liscence)
                    dataUpdated = true

                }
            }       // Optional
            if (this.state.identityImage != '') {
                if (Session.sharedInstance.userDetails[Constants.userDetailsFields.identity_proof] != this.state.identityImage) {
                    formData.append('identity_proof', identity)
                    dataUpdated = true
                }
            }
            if (Session.sharedInstance.userDetails[Constants.userDetailsFields.address_proof] != this.state.addressImage) {
                formData.append('address_proof', address)
                dataUpdated = true
            }
            if (this.props.route.params?.navigateFrom == 'SideDrawer') {
                formData.append('is_student', true)
                dataUpdated = true
            }

            if (this.state.certificationServiceImage != '') {
                if (this.state.certificationServiceImage != '') {
                    if (Session.sharedInstance.userDetails[Constants.userDetailsFields.certification_of_service] != this.state.certificationServiceImage) {
                        formData.append('certification_of_service', certification)
                        dataUpdated = true
                    }
                }
            }// Optional
            if (__DEV__) console.log("FORMDATA" + JSON.stringify(formData))
            if (dataUpdated) {
                formData.append('isVerified', false)
            }
            return formData
        } catch (error) {
            NetworkManager.networkManagerInstance.progressBarRequest(false)
            console.log("STUDENT_API_HANDLER " + error)
        }

    }


    createParams() {
        let dataUpdated = false
        const { identityImage, addressImage } = this.state

        if (!this.formValidation(identityImage, addressImage)) {
            return
        }
        let formData = new FormData();

        if (this.props.route.params?.navigateFrom == 'SideDrawer') {
            formData.append('is_student', true)
            dataUpdated = true
        }
        formData.id = this.state.userId
        if (this.state.businessNo != '') {
            if (Session.sharedInstance.userDetails[Constants.userDetailsFields.business_license_number] != this.state.businessNo) {
                formData.business_license_number = this.state.businessNo
                dataUpdated = true
            }
        }// Optional
        if (this.state.insuranceNo != '') {
            if (Session.sharedInstance.userDetails[Constants.userDetailsFields.insurance_number] != this.state.insuranceNo) {
                formData.insurance_number = this.state.insuranceNo     // Optional
                dataUpdated = true
            }
        }
        if (dataUpdated) {
            formData.isVerified = false
        }
        return formData

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
                                    {this.header()}
                                    {this.inputFields()}
                                    {this.uploadDocuments()}
                                </View>
                            </TouchableWithoutFeedback>
                        </ScrollView>
                    </KeyboardAvoidingView>
                    {this.continueButton()}
                </SafeAreaComponent>
            </Drawer>
        )
    }



    header() {
        return (
            <View style={{ flex: 0.1, justifyContent: 'center', alignItems: 'center', marginHorizontal: 20 }}>
                <CommonHeader
                    onPress={() => {
                        this.props.navigation.goBack()
                        Session.sharedInstance.isStudent = true
                    }}
                    headerTrue={String.teacherSignUp.businessInfo}
                    pageCount={String.teacherSignUp.twoOfThree}
                // skip={String.teacherSignUp.skip}
                // skiponPress={() => this.props.navigation.navigate(Constant.routeName.tutorQualification, { _id: this.state.userId })}
                />
            </View>
        )
    }


    inputFields() {
        return (
            <View style={{ flex: 0.25, }}>
                <View style={{ flex: 1, marginHorizontal: 20, marginBottom: 2, }}>

                    <AppTextComp
                        value={this.state.businessNo}
                        onChangeText={(text) => this.setState({ businessNo: text })}
                        placeholder={String.teacherSignUp.businessNo}
                        fontSize={16}
                        style={{ paddingTop: 10 }}
                        autoCapitalize='none'
                        labelEnabled={true}
                        // renderAccessory={() => accessoryView(this.state.cardType.icon)}
                        tintColor={Color.borderColor.secondaryColor}
                        lineWidth={1}
                        activeLineWidth={1}
                        width='100%'
                        maxLength={10}
                        keyboardType='default'
                        autoCapitalize={'characters'}
                        materialTextInput />
                    <AppTextComp
                        value={this.state.insuranceNo}
                        onChangeText={(text) => this.setState({ insuranceNo: text })}
                        placeholder={String.teacherSignUp.insuranceNo}
                        fontSize={16}
                        style={{ paddingTop: 10 }}
                        autoCapitalize='none'
                        labelEnabled={true}
                        maxLength={10}
                        // renderAccessory={() => accessoryView(this.state.cardType.icon)}
                        tintColor={Color.borderColor.secondaryColor}
                        lineWidth={1}
                        activeLineWidth={1}
                        width='100%'
                        keyboardType='default'
                        autoCapitalize={'characters'}
                        materialTextInput />


                </View>

                <View style={{ width: '100%', height: 10, backgroundColor: Color.listSeperator.primary, marginTop: 2 }}></View>
            </View>
        )
    }

    uploadDocuments() {
        return (
            <View style={{ flex: 0.75 }}>
                <ScrollView
                    contentContainerStyle={{ flexGrow: 1, marginHorizontal: '8%' }}
                >
                    <View>
                        <View style={{ flex: 0.2, }}>
                            {this.state.licenseImage != '' && <View style={{ flex: 1, paddingVertical: 10, marginRight: 5 }}>
                                <Text style={{ fontSize: 16 }}>{String.teacherSignUp.licenseImage}</Text>
                                <Text style={{ fontSize: 9, color: Color.borderColor.primaryColor }}>{String.teacherSignUp.ieDrivingLic}</Text>
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingBottom: 10 }}>
                                    <View style={{ flexDirection: 'row', marginLeft: 10 }}>
                                        <Image source={Assets.teacherRegistration.files} />
                                        <View style={{ marginHorizontal: 10, }}>
                                            <Text style={{ color: Color.borderColor.primaryColor, fontSize: Dimen.vvvSmallTextSize }} >{this.state.licenseImagefileName}</Text>
                                            <Text style={{ color: Color.borderColor.primaryColor, lineHeight: 12, fontSize: Dimen.vvvvvSmalTextSize }}>{this.state.licenseImageSize}</Text>
                                        </View>
                                    </View>
                                    <View>
                                        <TouchableOpacity style={{ padding: 5, alignSelf: 'center' }}

                                            onPress={() => {
                                                this.setState({ licenseImage: '' })
                                            }}
                                        >
                                            <Image source={Assets.teacherRegistration.delete} />
                                        </TouchableOpacity>
                                    </View>
                                </View>
                                <View style={{ height: 2, width: '100%', backgroundColor: Color.listSeperator.primary, }}></View>

                            </View>}
                            {
                                this.state.licenseImage == '' && <View style={{ flex: 1, paddingVertical: 10 }}>
                                    <View style={{ flex: 0.95, justifyContent: 'space-between', flexDirection: 'row', alignItems: 'center', paddingVertical: 10 }}>
                                        <View>
                                            <Text style={{ fontSize: Dimen.mediumTextSize, fontWeight: '600' }}>{String.teacherSignUp.licenseImage}</Text>
                                            <Text style={{ fontSize: Dimen.vvvvSmallTextSize, fontWeight: '600', color: Color.borderColor.primaryColor, }}>{String.teacherSignUp.ieDrivingLic}</Text>
                                        </View>
                                        <TouchableOpacity style={{ padding: 5, alignSelf: 'center' }}

                                            onPress={() => {
                                                this.openControlPanel()
                                                this.setState({ isLicenseClicked: true })
                                            }}
                                        >
                                            <Image source={Assets.teacherRegistration.upload} />
                                        </TouchableOpacity>
                                    </View>
                                    <View style={{ flex: 0.05, height: 2, width: '100%', backgroundColor: Color.listSeperator.primary, }}></View>

                                </View>


                            }
                        </View>

                        <View style={{ flex: 0.2, }}>
                            {this.state.identityImage != '' && <View style={{ flex: 1, paddingVertical: 10, marginRight: 5 }}>
                                <Text style={{ fontSize: 16 }}>{String.teacherSignUp.identityImage}</Text>
                                <Text style={{ fontSize: 9, color: Color.borderColor.primaryColor }}>{String.teacherSignUp.ieidentityProof}</Text>
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingBottom: 10 }}>
                                    <View style={{ flexDirection: 'row', marginLeft: 10 }}>
                                        <Image source={Assets.teacherRegistration.files} />
                                        <View style={{ marginHorizontal: 10, }}>
                                            <Text style={{ color: Color.borderColor.primaryColor, fontSize: Dimen.vvvSmallTextSize }} >{this.state.identityImagefileName}</Text>
                                            <Text style={{ color: Color.borderColor.primaryColor, lineHeight: 12, fontSize: Dimen.vvvvvSmalTextSize }}>{this.state.identityImageSize}</Text>
                                        </View>
                                    </View>
                                    <View>
                                        <TouchableOpacity style={{ padding: 5, alignSelf: 'center' }}

                                            onPress={() => {
                                                this.setState({ identityImage: '' })
                                            }}
                                        >
                                            <Image source={Assets.teacherRegistration.delete} />
                                        </TouchableOpacity>
                                    </View>
                                </View>
                                <View style={{ height: 2, width: '100%', backgroundColor: Color.listSeperator.primary, }}></View>

                            </View>}
                            {
                                this.state.identityImage == '' && <View style={{ flex: 1, paddingVertical: 10 }}>
                                    <View style={{ flex: 0.95, justifyContent: 'space-between', flexDirection: 'row', alignItems: 'center', paddingVertical: 10 }}>
                                        <View>
                                            <Text style={{ fontSize: Dimen.mediumTextSize, fontWeight: '600' }}>{String.teacherSignUp.identityProof}</Text>
                                            <Text style={{ fontSize: Dimen.vvvvSmallTextSize, fontWeight: '600', color: Color.borderColor.primaryColor, }}>{String.teacherSignUp.ieidentityProof}</Text>
                                        </View>
                                        <TouchableOpacity style={{ padding: 5, alignSelf: 'center' }}

                                            onPress={() => {
                                                this.openControlPanel()
                                                this.setState({ isIdentityClicked: true })
                                            }}
                                        >
                                            <Image source={Assets.teacherRegistration.upload} />
                                        </TouchableOpacity>
                                    </View>
                                    <View style={{ flex: 0.05, height: 2, width: '100%', backgroundColor: Color.listSeperator.primary, }}></View>

                                </View>


                            }
                        </View>
                        <View style={{ flex: 0.2, }}>
                            {this.state.addressImage != '' && <View style={{ flex: 1, paddingVertical: 10, marginRight: 5 }}>
                                <Text style={{ fontSize: 16 }}>{String.teacherSignUp.addressProof}</Text>
                                <Text style={{ fontSize: 9, color: Color.borderColor.primaryColor }}>{String.teacherSignUp.ieAddressProof}</Text>
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingBottom: 10 }}>
                                    <View style={{ flexDirection: 'row', marginLeft: 10 }}>
                                        <Image source={Assets.teacherRegistration.files} />
                                        <View style={{ marginHorizontal: 10, }}>
                                            <Text style={{ color: Color.borderColor.primaryColor, fontSize: Dimen.vvvSmallTextSize }} >{this.state.addressImagefileName}</Text>
                                            <Text style={{ color: Color.borderColor.primaryColor, lineHeight: 12, fontSize: Dimen.vvvvvSmalTextSize }}>{this.state.addressImageSize}</Text>
                                        </View>
                                    </View>
                                    <View>
                                        <TouchableOpacity style={{ padding: 5, alignSelf: 'center' }}
                                            onPress={() => {
                                                this.setState({ addressImage: '' })
                                            }}
                                        >
                                            <Image source={Assets.teacherRegistration.delete} />
                                        </TouchableOpacity>
                                    </View>
                                </View>
                                <View style={{ height: 2, width: '100%', backgroundColor: Color.listSeperator.primary, }}></View>

                            </View>}
                            {
                                this.state.addressImage == '' && <View style={{ flex: 1, paddingVertical: 10 }}>
                                    <View style={{ flex: 0.95, justifyContent: 'space-between', flexDirection: 'row', alignItems: 'center', paddingVertical: 10 }}>
                                        <View>
                                            <Text style={{ fontSize: Dimen.mediumTextSize, fontWeight: '600' }}>{String.teacherSignUp.addressProof}</Text>
                                            <Text style={{ fontSize: Dimen.vvvvSmallTextSize, fontWeight: '600', color: Color.borderColor.primaryColor, }}>{String.teacherSignUp.ieAddressProof}</Text>
                                        </View>
                                        <TouchableOpacity style={{ padding: 5, alignSelf: 'center' }}


                                            onPress={() => {
                                                this.openControlPanel()
                                                this.setState({ isAddressClicked: true })
                                            }}
                                        >
                                            <Image source={Assets.teacherRegistration.upload} />
                                        </TouchableOpacity>
                                    </View>
                                    <View style={{ flex: 0.05, height: 2, width: '100%', backgroundColor: Color.listSeperator.primary, }}></View>

                                </View>


                            }
                        </View>
                        <View style={{ flex: 0.2, }}>
                            {this.state.certificationServiceImage != '' && <View style={{ flex: 1, paddingVertical: 10, marginRight: 5 }}>
                                <Text style={{ fontSize: 16 }}>{String.teacherSignUp.certificationOfService}</Text>
                                <Text style={{ fontSize: 9, color: Color.borderColor.primaryColor }}>{String.teacherSignUp.domesticWorkerAccount}</Text>
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingBottom: 10 }}>
                                    <View style={{ flexDirection: 'row', marginLeft: 10 }}>
                                        <Image source={Assets.teacherRegistration.files} />
                                        <View style={{ marginHorizontal: 10, }}>
                                            <Text style={{ color: Color.borderColor.primaryColor, fontSize: Dimen.vvvSmallTextSize }} >{this.state.certificationServiceImagefileName}</Text>
                                            <Text style={{ color: Color.borderColor.primaryColor, lineHeight: 12, fontSize: Dimen.vvvvvSmalTextSize }}>{this.state.licenseImageSize}</Text>
                                        </View>
                                    </View>
                                    <View>
                                        <TouchableOpacity style={{ padding: 5, alignSelf: 'center' }}

                                            onPress={() => {
                                                this.setState({ certificationServiceImage: '' })
                                            }}
                                        >
                                            <Image source={Assets.teacherRegistration.delete} />
                                        </TouchableOpacity>
                                    </View>
                                </View>
                                <View style={{ height: 2, width: '100%', backgroundColor: Color.listSeperator.primary, }}></View>

                            </View>}
                            {
                                this.state.certificationServiceImage == '' && <View style={{ flex: 1, paddingVertical: 10 }}>
                                    <View style={{ flex: 0.95, justifyContent: 'space-between', flexDirection: 'row', alignItems: 'center', paddingVertical: 10 }}>
                                        <View>
                                            <Text style={{ fontSize: Dimen.mediumTextSize, fontWeight: '600' }}>{String.teacherSignUp.certificationOfService}</Text>
                                            <Text style={{ fontSize: Dimen.vvvvSmallTextSize, fontWeight: '600', color: Color.borderColor.primaryColor, }}>{String.teacherSignUp.domesticWorkerAccount}</Text>
                                        </View>
                                        <TouchableOpacity style={{ padding: 5, alignSelf: 'center' }}


                                            onPress={() => {
                                                this.openControlPanel()
                                                this.setState({ isCertificationClicked: true })
                                            }}
                                        >
                                            <Image source={Assets.teacherRegistration.upload} />
                                        </TouchableOpacity>
                                    </View>
                                    <View style={{ flex: 0.05, height: 2, width: '100%', backgroundColor: Color.listSeperator.primary, }}></View>

                                </View>


                            }
                        </View>
                    </View>
                </ScrollView >
            </View>
        )
    }

    continueButton() {
        return (
            <View style={{ width: '90%', justifyContent: 'center', alignItems: 'center', alignSelf: 'center', marginBottom: 20 }}>
                <AppButton
                    buttonStyle={{ width: '100%' }}
                    onPress={this.tutorbusinessApiHandler}
                    isEnabled={true}
                    buttonText={Strings.studentSignUp.continue}
                />
            </View>
        )
    }



    LaunchImageLibrary() {
        ImagePicker.openPicker({
            cropping: true,
            cropperToolbarColor: Color.secondayTextColor,
            mediaType: 'photo'
        }).then(image => {
            this.closeControlPanel()
            let source = { uri: image.path };
            let sizeinMB = image.size * 0.000001;
            let size = sizeinMB.toPrecision(3) + ' MB'
            let fileName = image.path.substring(image.path.lastIndexOf('/') + 1)
            if (this.state.isLicenseClicked) {
                this.setState({ licenseImage: source, isLicenseClicked: false, licenseImagefileName: fileName, licenseImageSize: size });
            } else if (this.state.isIdentityClicked) {
                this.setState({ identityImage: source, isIdentityClicked: false, identityImagefileName: fileName, identityImageSize: size });
            } else if (this.state.isAddressClicked) {
                this.setState({ addressImage: source, isAddressClicked: false, addressImagefileName: fileName, addressImageSize: size });
            } else if (this.state.isCertificationClicked) {
                this.setState({ certificationServiceImage: source, isCertificationClicked: false, certificationServiceImagefileName: fileName, certificationServiceImageSize: size });
            }
        }).catch(e => {
            if (__DEV__) console.log("error", e)
            closeControlPanel()
        });
    }

    LaunchCamera() {
        ImagePicker.openCamera({
            cropping: true,
            cropperToolbarColor: Color.secondayTextColor,
            mediaType: 'photo'
        }).then(image => {
            this.closeControlPanel()
            let source = { uri: image.path };
            let sizeinMB = image.size * 0.000001;
            let size = sizeinMB.toPrecision(3) + ' MB'
            let fileName = image.path.substring(image.path.lastIndexOf('/') + 1)
            if (this.state.isLicenseClicked) {
                this.setState({ licenseImage: source, isLicenseClicked: false, licenseImagefileName: fileName, licenseImageSize: size });
            } else if (this.state.isIdentityClicked) {
                this.setState({ identityImage: source, isIdentityClicked: false, identityImagefileName: fileName, identityImageSize: size });
            } else if (this.state.isAddressClicked) {
                this.setState({ addressImage: source, isAddressClicked: false, addressImagefileName: fileName, addressImageSize: size });
            } else if (this.state.isCertificationClicked) {
                this.setState({ certificationServiceImage: source, isCertificationClicked: false, certificationServiceImagefileName: fileName, certificationServiceImageSize: size });
            }
        });
    }



    formValidation() {
        // if (!Utility.sharedInstance.validateEmptyField(country_code, String.toastMsgs.login.countryCodeNotFound)) {
        //     return false
        // }

        // if (!Utility.sharedInstance.validateEmptyField(country_code, String.toastMsgs.login.countryCodeNotFound)) {
        //     return false
        // }
        if (this.state.identityImage.length == 0) {
            showToast(String.toastMsgs.tutor.identityProof)
            return
        }

        if (this.state.addressImage.length == 0) {
            showToast(String.toastMsgs.tutor.addressProof)
            return false
        }

        return true
    }


    GetFilename(url) {
        if (url != undefined) {
            let arr = url.split('/')
            return arr[arr.length - 1]
        } else {
            return ''
        }

    }

    getFileSize(filePath) {
        return ''
        //     await RNFetchBlob.fs.stat(filePath)
        //         .then((stats) => { })
        //         .catch((err) => { })
    }

}

export default TutorBusinessInfo;



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
    textStyle: {
        fontSize: 16,
        color: Color.borderColor.secondaryColor,
        marginLeft: 20
    }
});
const drawerStyles = { drawer: { shadowColor: 'grey', shadowOpacity: 0.2, shadowRadius: 3 }, main: { paddingLeft: 3 } }
