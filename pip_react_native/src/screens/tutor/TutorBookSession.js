import React, { Component } from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet, KeyboardAvoidingView, ScrollView, TouchableWithoutFeedback, Keyboard, Image, Dimensions, ImageBackground } from 'react-native'
import { CommonHeader, SafeAreaComponent, AppButton, PlaceholderComponent, AppTextComp, CommonDropDown } from '../../components';
import { Color, Dimen, Strings, Assets, Constant, URL } from '../../../res';
import Constants from '../../../res/Constants';
import String from '../../../res/String';
import Drawer from 'react-native-drawer'
import ImagePicker from 'react-native-image-crop-picker';
import { NetworkManager, Utility, NavUtil } from '../../utils';
import { showToast } from '../../utils/Utility';
import Session from '../../utils/Session';


class TutorBookSession extends Component {
    closeControlPanel = () => { this._drawer.close() };
    openControlPanel = () => {
        Keyboard.dismiss()
        this._drawer.open()
    };

    constructor(props) {
        super(props)
        this.state = {
            dropdown: false,
            search_term: '',
            selectedEducation: this.props.route.params != undefined ? this.props.route.params.data.education : '',
            // selectedEducation: '',
            selectedGrade: this.props.route.params != undefined ? this.props.route.params.data.grade : '',
            // selectedGrade: '',
            selectedSubject: this.props.route.params != undefined ? this.props.route.params.data.subjects : '',
            // selectedSubject: '',
            data: [],

            dropdownHeader: '',
            topic: this.props.route.params != undefined ? this.props.route.params.data.topic : '',
            // topic: '',
            description: this.props.route.params != undefined ? this.props.route.params.data.description : '',
            // description: '',

            otherEducationName: '',
            userDoubtImages: this.props.route.params != undefined ? this.props.route.params.data.image_urls : [],
            // userDoubtImages: '',

        }

    }


    render() {
        console.log('this.props.route.params.data' + JSON.stringify(this.props.route.params))
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

                {/* <SafeAreaComponent>
                    <View style={{ flex: 1, height: Dimen.phoneHeight }}> */}
                <SafeAreaComponent
                  StatusBarTextColor={'light-content'}
                  color={Color.textColor.pentaColor}
                >
                    <KeyboardAvoidingView
                        style={{ flex: 1, flexDirection: 'column', }}
                        behavior={Platform.OS === 'ios' ? 'padding' : null}
                        enabled>


                        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                            <ScrollView contentContainerStyle={{ flexGrow: 1 }}
                                keyboardShouldPersistTaps='always'>
                                <View style={{ flex: 1 }}>
                                    <View style={{ flex: 0.12, backgroundColor: Color.textColor.pentaColor, paddingVertical: 10 }}>
                                        <CommonHeader
                                            containerStyle={{ flex: 1, marginHorizontal: '3%' }}
                                            headerTrue={Strings.bookingSession.bookSession}
                                            headerTitleFontsize={Dimen.mediumTextSize}
                                            headerTitleColor={Color.secondayTextColor}
                                            leftIconStyle={{ tintColor: Color.secondayTextColor }}

                                        />
                                    </View>
                                    <View style={{ flex: 0.88, top: -20, paddingBottom: '13%', borderTopLeftRadius: 20, borderTopRightRadius: 20, width: '100%', backgroundColor: Color.secondayTextColor }}>
                                        <ScrollView
                                            contentContainerStyle={{ flexGrow: 1, paddingTop: 20 }}
                                            keyboardShouldPersistTaps='always'
                                        >
                                            <View style={{}}>
                                                {this.inputFields()}
                                                {this.uploadImage()}
                                                {this.state.dropdown != "" && this.state.data.length > 0 && <CommonDropDown
                                                    isModalshow={this.state.dropdown}
                                                    cancelModal={() => this.setState({ dropdown: false, data: "" })}
                                                    data={this.state.data}
                                                    getCountry={this.updateData}
                                                    dropdownHeader={this.state.dropdownHeader}
                                                    listItemField={'value'}
                                                />}

                                            </View>

                                        </ScrollView>
                                        {this.continueButton()}
                                    </View>
                                </View>
                            </ScrollView>
                        </TouchableWithoutFeedback>
                    </KeyboardAvoidingView>

                    {/* </View> */}
                </SafeAreaComponent>
            </Drawer >


        )
    };


    inputFields() {
        return (
            <View style={{ flex: 0.6, marginHorizontal: '4%' }}>
                <TouchableOpacity
                    style={{ paddingTop: 10, width: '100%', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderBottomWidth: 1, borderBottomColor: Color.borderColor.primaryColor }}
                    onPress={() => {
                        this.setState({
                            dropdownHeader: String.teacherSignUp.yourEducation, dropdown: true, search_term: Constant.searchAPITerms.education,

                        }, () => {
                            console.log("this.state.educaton" + this.state.education)
                            this.dropDownLoader()
                        })
                    }}
                >
                    <AppTextComp
                        // style={{ backgroundColor: 'red' }}
                        value={this.state.selectedEducation}
                        onChangeText={(text) => this.setState({ selectedEducation: this.state.selectedEducation })}
                        placeholder={Strings.bookingSession.education}
                        fontSize={16}
                        editable={false}
                        autoCapitalize='none'
                        labelEnabled={true}
                        tintColor={Color.borderColor.secondaryColor}
                        lineWidth={0}
                        activeLineWidth={0}
                        width='90%'
                        // keyboardType='default'
                        materialTextInput
                    />
                    <Image style={{ marginLeft: 5 }} source={Assets.common.drop_down} />
                </TouchableOpacity>

                {this.state.selectedEducation == "Other" && <AppTextComp
                    style={{ paddingTop: 30, width: '100%' }}
                    value={this.state.otherEducationName}
                    onChangeText={(text) => this.setState({ otherEducationName: text })}
                    placeholder={String.teacherSignUp.yourEducation}
                    fontSize={16}
                    autoCapitalize='none'
                    labelEnabled={true}
                    tintColor={Color.borderColor.secondaryColor}
                    lineWidth={1}
                    activeLineWidth={1}
                    width='100%'
                    // keyboardType='default'
                    materialTextInput
                />}
                <TouchableOpacity

                    style={{ paddingTop: 20, width: '100%', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderBottomWidth: 1, borderBottomColor: Color.borderColor.primaryColor }}
                    onPress={() => {
                        if (this.state.selectedEducation == "") {
                            if (!this.formValidation()) {
                                return
                            }
                        }

                        this.setState({ dropdown: true, dropdownHeader: String.teacherSignUp.selectGrade, search_term: Constant.searchAPITerms.grade }, () => this.dropDownLoader())

                    }}
                >
                    <AppTextComp
                        // style={{ backgroundColor: 'red' }}
                        value={this.state.selectedGrade}
                        onChangeText={(text) => this.setState({ selectedEducation: this.state.selectedGrade })}
                        placeholder={Strings.bookingSession.grades}
                        fontSize={16}
                        editable={false}
                        autoCapitalize='none'
                        labelEnabled={true}
                        tintColor={Color.borderColor.secondaryColor}
                        lineWidth={0}
                        activeLineWidth={0}
                        width='90%'
                        // keyboardType='default'
                        materialTextInput
                    />
                    <Image style={{ marginLeft: 5 }} source={Assets.common.drop_down} />
                </TouchableOpacity>
                <TouchableOpacity
                    style={{ paddingTop: 20, width: '100%', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderBottomWidth: 1, borderBottomColor: Color.borderColor.primaryColor }}
                    onPress={() => {
                        if (this.state.selectedGrade == "") {
                            if (!this.formValidation()) {
                                return
                            }
                            showToast(Strings.toastMsgs.tutor.selectGrade)
                            return
                        }
                        this.setState({ dropdown: true, dropdownHeader: String.teacherSignUp.addSubject, search_term: Constant.searchAPITerms.subjects, isListdata: true }, () => this.dropDownLoader())
                    }
                    }
                >
                    <AppTextComp
                        // style={{ backgroundColor: 'red' }}
                        value={this.state.selectedSubject}
                        onChangeText={(text) => this.setState({ selectedEducation: this.state.selectedSubject })}
                        placeholder={Strings.bookingSession.subject}
                        fontSize={16}
                        editable={false}
                        autoCapitalize='none'
                        labelEnabled={true}
                        tintColor={Color.borderColor.secondaryColor}
                        lineWidth={0}
                        activeLineWidth={0}
                        width='90%'
                        // keyboardType='default'
                        materialTextInput
                    />
                    <Image style={{ marginLeft: 5 }} source={Assets.common.drop_down} />
                </TouchableOpacity>

                <AppTextComp
                    value={this.state.topic}
                    onChangeText={(text) => this.setState({ topic: text })}
                    placeholder={Strings.bookingSession.topic}
                    fontSize={16}

                    autoCapitalize='none'
                    labelEnabled={true}
                    tintColor={Color.borderColor.secondaryColor}
                    lineWidth={1}
                    activeLineWidth={1}
                    width='100%'
                    style={{ paddingTop: 25 }}
                    keyboardType='default'
                    materialTextInput />
                <AppTextComp
                    value={this.state.description}
                    onChangeText={(text) => {
                        if (this.state.description.length < 100)
                            this.setState({ description: text })
                        else
                            showToast("Maximum of 100 characters can be entered")
                    }}
                    placeholder={Strings.bookingSession.description}
                    fontSize={16}

                    autoCapitalize='none'
                    labelEnabled={true}
                    tintColor={Color.borderColor.secondaryColor}
                    lineWidth={1}
                    activeLineWidth={1}
                    width='100%'
                    multiline={true}
                    style={{ paddingTop: 25 }}
                    keyboardType='default'
                    materialTextInput />
            </View>
        )
    }

    uploadImage() {
        return (
            <View style={{ flex: 0.4, marginHorizontal: '4%', paddingTop: 20 }}>
                <View style={{ alignItems: 'center', flex: 0.5, }}>
                    <TouchableOpacity style={{ height: 120, width: '100%', alignItems: 'center', justifyContent: 'center', backgroundColor: Color.introColor.activeBackground, borderWidth: 1, borderRadius: 5, borderStyle: 'dashed', borderColor: Color.borderColor.primaryColor }}
                        onPress={() => {

                            if (this.state.topic == '') {
                                if (!this.formValidation()) {
                                    return
                                }
                            }

                            if (this.state.userDoubtImages.length < 5) {
                                this.openControlPanel()
                            } else {
                                showToast(String.toastMsgs.bookSession.photosAdded)
                                return
                            }

                        }}
                    >
                        <Image source={Assets.homeScreen.uploadImage} />
                        <Text style={{ paddingTop: 10 }}>{Strings.bookingSession.uploadImage}</Text>
                    </TouchableOpacity>
                </View>
                <View style={{ flex: 0.5, alignItems: 'flex-start', paddingTop: 30, justifyContent: 'center' }}>
                    <FlatList
                        numColumns={3}
                        contentContainerStyle={{ flexGrow: 1 }}
                        data={this.state.userDoubtImages}
                        renderItem={this.renderUserDoubtImagesItem}
                        ItemSeparatorComponent={() => <View style={{}}>
                        </View>}
                    />
                </View>
            </View>
        )
    }

    renderUserDoubtImagesItem = ({ item, index }) => {
        console.log("item" + JSON.stringify(item))
        return (
            <View style={{ padding: 5, marginRight: 20 }} >
                <ImageBackground style={{ height: 80, width: 80 }} source={{ uri: this.isValidURL(item.uri) ? item.uri : item, cache: 'force-cache' }} >
                    <TouchableOpacity style={{ top: -17, right: -17, position: 'absolute', padding: 12 }}

                        onPress={() => {

                            this.deleteImages(index)
                        }}
                    >
                        <Image source={Assets.homeScreen.crossIcon} />
                    </TouchableOpacity>
                </ImageBackground>
            </View>)
    }

    continueButton() {
        return (
            <View style={{ width: '90%', flex: 1, position: 'absolute', bottom: 0, justifyContent: 'flex-end', alignItems: 'center', alignSelf: 'center' }}>

                <AppButton
                    buttonStyle={{ width: '100%' }}
                    onPress={() => {
                        if (!this.formValidation()) {
                            return
                        }
                        let routeParams = {
                            data: this.props.route.params != undefined ? this.props.route.params.data : ''
                        }
                        let temp = []
                        temp = this.state.userDoubtImages
                        routeParams.education = this.state.selectedEducation
                        routeParams.grades = this.state.selectedGrade
                        routeParams.subject = this.state.selectedSubject
                        routeParams.topic = this.state.topic
                        routeParams.description = this.state.description
                        routeParams.images = temp


                        if (this.state.otherEducationName != '') {
                            routeParams.otherEducationName = this.state.otherEducationName
                        }

                        console.log("routeParams" + JSON.stringify(routeParams.images))
                        NavUtil.navUtil.navigateTo(this, Constants.routeName.tutorSlotBooking, routeParams,)
                    }}
                    isEnabled={true}
                    buttonText={Strings.studentSignUp.continue}
                />
            </View>
        )
    }





    deleteImages = (index) => {
        let images = []
        console.log("splicedImages" + index)
        images = this.state.userDoubtImages
        images.splice(index, 1)
        console.log("splicedImages" + JSON.stringify(images))
        this.setState({ userDoubtImages: images })
    }




    updateData = (item, isdropdownVisible) => {
        if (this.state.dropdownHeader == String.teacherSignUp.yourEducation)
            this.setState({
                dropdown: false,
                selectedEducation: item,
                data: [],
                selectedGrade: '',
                selectedSubject: '',
            });
        if (this.state.dropdownHeader === String.teacherSignUp.selectGrade)
            this.setState({
                dropdown: false,
                selectedGrade: item,
                data: [],
                selectedSubject: '',
            })

        if (this.state.dropdownHeader === String.teacherSignUp.addSubject)
            this.setState({
                dropdown: false,
                selectedSubject: item,
                data: []
            })

    }



    dropDownLoader = async () => {

        NetworkManager.networkManagerInstance.progressBarRequest(true)

        console.log("searchItem" + this.state.search_term)
        console.log("searchItem" + this.state.selectedEducation)
        let data = {}
        if (this.state.search_term == Constant.searchAPITerms.education) {

            data.country = Session.sharedInstance.countryName
            data.search_term = this.state.search_term
        } else if (this.state.search_term == Constant.searchAPITerms.subjects) {
            data.country = Session.sharedInstance.countryName
            data.search_term = this.state.search_term
            data.education = this.state.selectedEducation == "Other" ? "Tertiary" : this.state.selectedEducation
            data.grade = this.state.selectedGrade
        } else if (this.state.search_term == Constant.searchAPITerms.grade) {
            data.country = Session.sharedInstance.countryName
            data.search_term = this.state.search_term
            data.education = this.state.selectedEducation == "Other" ? "Tertiary" : this.state.selectedEducation
        }

        try {
            const res = await NetworkManager.networkManagerInstance.fetchRequest(URL.getEducationDetails, URL.postRequest, true, data, () => { this.dropDownLoader(props) });
            if (res.statusCode === 200) {
                NetworkManager.networkManagerInstance.progressBarRequest(false)
                // this.setState({ data: this.state.search_term == Constant.searchAPITerms.education ? [...res.data, "Other"] : res.data })
                this.settingModalData(res)

            } else {
                NetworkManager.networkManagerInstance.progressBarRequest(false)
            }
        } catch (error) {
            NetworkManager.networkManagerInstance.progressBarRequest(false)
            console.log("UPDATE_TUTOR_API " + error)
        }

    }



    settingModalData(res) {
        if (this.state.search_term == Constant.searchAPITerms.education) {
            this.setState({ data: res.data.education })
        } else if (this.state.search_term == Constant.searchAPITerms.grade) {
            this.setState({ data: res.data.grade })
        } else if (this.state.search_term == Constant.searchAPITerms.subjects) {
            this.setState({ data: res.data[0].subjects })

        }
    }




    formValidation() {

        if (!Utility.sharedInstance.validateEmptyField(this.state.selectedEducation, String.toastMsgs.tutor.selectEduction)) {
            return
        }

        if (this.state.selectedEducation == "Other") {
            if (!Utility.sharedInstance.validateEmptyField(this.state.otherEducationName, String.toastMsgs.tutor.otherField)) {
                return false
            }
        }
        if (!Utility.sharedInstance.validateEmptyField(this.state.selectedGrade, String.toastMsgs.tutor.selectGrade)) {
            return
        }

        if (!Utility.sharedInstance.validateEmptyField(this.state.selectedSubject, String.toastMsgs.tutor.selectSubject)) {
            return
        }
        if (!Utility.sharedInstance.validateEmptyField(this.state.topic, String.toastMsgs.bookSession.addTopic)) {
            return
        }
        if (!Utility.sharedInstance.validateEmptyField(this.state.description, String.toastMsgs.bookSession.addDesc)) {
            return
        }


        // if (!Utility.sharedInstance.validateEmptyField(this.state.description, String.toastMsgs.bookSession.addDesc)) {
        //     return
        // }
        // if (this.state.description.length < 100 && this.state.description.length > 80) {
        //     showToast(String.toastMsgs.bookSession.addDesc)
        // }



        return true

    }




    LaunchImageLibrary() {

        let _tempImages = this.state.userDoubtImages
        let addedImage = []
        ImagePicker.openPicker({
            cropping: true,
            cropperToolbarColor: Color.secondayTextColor,
            mediaType: 'photo',
            compressImageQuality: 0.5

        }).then(image => {
            this.closeControlPanel()
            let sizeinMB = image.size * 0.000001;
            let size = sizeinMB.toPrecision(3) + ' MB'
            console.log("SIZE ==> " + size)
            let source = [{ uri: image.path }];
            addedImage = [..._tempImages, ...source]
            this.setState({ userDoubtImages: addedImage });
        }).catch(e => {
            if (__DEV__) console.log("error", e)
            this.closeControlPanel()
        });
    }

    LaunchCamera() {
        let _tempImages = this.state.userDoubtImages
        let addedImage = []
        ImagePicker.openCamera({
            cropping: true,
            cropperToolbarColor: Color.secondayTextColor,
            mediaType: 'photo',

        }).then(image => {
            this.closeControlPanel()
            let sizeinMB = image.size * 0.000001;
            let size = sizeinMB.toPrecision(3) + ' MB'
            console.log("SIZE CAMERA ==> " + size)
            let source = [{ uri: image.path }];
            addedImage = [..._tempImages, ...source]
            this.setState({ userDoubtImages: addedImage });
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
};

export default TutorBookSession;

const styles = StyleSheet.create({
    container: {
        flex: 1,

    },
    buttonStyle: {
        padding: 10,
        borderWidth: 1,
        borderRadius: 5,
        margin: 20
    },
    textStyle: {
        fontSize: 14
    },
    responsiveImage: {
        width: Dimen.phoneWidth - 20,
        height: undefined,
        alignSelf: 'center',
        aspectRatio: 135 / 85,
        borderRadius: 10
    },
});
const drawerStyles = { drawer: { shadowColor: 'grey', shadowOpacity: 0.2, shadowRadius: 3 }, main: { paddingLeft: 3 } }    