import React, { Component, createRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, FlatList, TouchableWithoutFeedback, KeyboardAvoidingView, ScrollView, Keyboard, ImageBackground } from 'react-native'
import { AppButton, AppImageComponent, SafeAreaComponent, CommonHeader, AppTextComp, CommonDropDown } from '../../components';
import { Strings, Assets, Dimen, Color, Styles, Constant } from '../../../res/index';
import { TextInput } from 'react-native-gesture-handler';
import Constants from '../../../res/Constants';
import Drawer from 'react-native-drawer'




class BookASession extends React.Component {
    closeControlPanel = () => { this._drawer.close() };
    openControlPanel = () => {
        Keyboard.dismiss()
        this._drawer.open()
    };
    constructor(props) {
        super(props)
        this.state = {
            userDoubtImages: [
                { url: 'https://funda-app-dev.storage.googleapis.com/1594918691327_1594918681737.jpg' },
                { url: "https://funda-app-dev.storage.googleapis.com/1594918682384_1594918681737.jpg", },
                { url: 'https://funda-app-dev.storage.googleapis.com/1594918691327_1594918681737.jpg' },
                { url: "https://funda-app-dev.storage.googleapis.com/1594918682384_1594918681737.jpg", },
                { url: "https://funda-app-dev.storage.googleapis.com/1594918682384_1594918681737.jpg", },

            ],
            addSubjectObj: [],
            selectedEducation: '',
            selectedSubject: '',
            otherEducationName: '',
            isListdata: false,
            listIndex: 0,
            selectedQualification: '',
            selectedGrade: '',
            serviceCharge: '',
            rangeLow: 0,
            dropdownHeader: '',
            search_term: 'education',
            dropdown: '',
            data: [],
            value: 0,
            currentGradeIndex: '',
            selectedStudentId: '',
            topic: '',
            decreptionData: '',
        }
    }

    ref = createRef(null)



    render() {
        return (

            < Drawer ref={(ref) => this._drawer = ref}
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


                        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>

                            <ScrollView
                                contentContainerStyle={{ flexGrow: 1, }}
                                keyboardShouldPersistTaps='always'
                                showsVerticalScrollIndicator={false}>
                                <View style={{ flex: 1 }}>
                                    <View style={{ flex: 1, height: Dimen.phoneHeight }}>
                                        <View style={{ flex: 0.12, backgroundColor: Color.textColor.pentaColor, }}>
                                            <CommonHeader
                                                backImage={Assets.homeScreen.side_menu_icon}
                                                onPress={() => this.props.navigation.openDrawer()}
                                                containerStyle={{ marginHorizontal: '3%' }}
                                                headerTrue={Strings.customerCare.customerCare}
                                                headerTitleFontsize={Dimen.mediumTextSize}
                                                headerTitleColor={Color.secondayTextColor}
                                                leftIconStyle={{ tintColor: Color.secondayTextColor }}
                                            />
                                        </View>
                                        <View style={{ flex: 0.88, top: -20, borderTopLeftRadius: 20, borderTopRightRadius: 20, height: Dimen.phoneHeight, width: '100%', backgroundColor: Color.secondayTextColor }}>
                                            <View style={{ flex: 0.9, marginHorizontal: '5%' }}>
                                                <View style={{ flex: 0.4, backgroundColor: 'red' }}>

                                                    {this.addEducation()}


                                                    {this.addGrade()}


                                                    {this.addSubjects()}


                                                    {/* {this.addEducation()} */}
                                                    <AppTextComp
                                                        value={this.state.topic}
                                                        onChangeText={(text) => this.setState({ topic: text })}
                                                        placeholder={Strings.session.topic}
                                                        fontSize={16}
                                                        style={{ paddingTop: 10 }}
                                                        autoCapitalize='none'
                                                        labelEnabled={true}
                                                        tintColor={Color.borderColor.primaryColor}
                                                        lineWidth={1}
                                                        activeLineWidth={1}
                                                        width='100%'
                                                        keyboardType='default'
                                                        materialTextInput />


                                                    <AppTextComp
                                                        value={this.state.decreptionData}
                                                        onChangeText={(text) => this.setState({ decreptionData: text })}
                                                        placeholder={Strings.session.descreption}
                                                        fontSize={16}
                                                        style={{ paddingTop: 10 }}
                                                        autoCapitalize='none'
                                                        labelEnabled={true}
                                                        tintColor={Color.borderColor.primaryColor}
                                                        lineWidth={1}
                                                        activeLineWidth={1}
                                                        width='100%'
                                                        keyboardType='default'
                                                        materialTextInput />

                                                </View>

                                            </View>

                                            <View style={{ flex: 0.6 }}>
                                                <TouchableOpacity
                                                    style={{ flex: 2, backgroundColor: '#FECB2714', alignItems: 'center', justifyContent: 'center', marginHorizontal: 20, borderWidth: 1.5, borderColor: Color.borderColor.tertiaryColor, borderStyle: 'dashed', borderRadius: 5 }}
                                                    onPress={() => { this.openControlPanel() }}
                                                >
                                                    <Image style={{ alignSelf: 'center', height: 20, width: 20 }} source={Assets.session.add}></Image>
                                                    <Text style={{ fontSize: 12, paddingTop: 5 }}>{Strings.session.uploadImage}</Text>
                                                </TouchableOpacity>
                                                <View style={{ flex: 0.3 }}>
                                                    <FlatList
                                                        horizontal
                                                        // pagingEnabled={true}
                                                        // numColumns={5}
                                                        contentContainerStyle={{ flexGrow: 1, }}
                                                        data={this.state.userDoubtImages}
                                                        renderItem={this.renderUserDoubtImagesItem}
                                                        ItemSeparatorComponent={() => <View style={{ padding: 5 }}></View>}
                                                    />
                                                </View>
                                                <View style={{ flex: 1 }}></View>
                                            </View>
                                        </View>
                                    </View>
                                    {/* <View style={{ flex: .03, justifyContent: 'flex-start', width: '90%', alignSelf: 'center' }}>
                                        <AppButton
                                            onPress={() => this.props.navigation.navigate('SlotBooking',
                                                {
                                                    passStudent_Id: this.state.selectedStudentId,
                                                    passEducation: this.state.selectedEducation,
                                                    passSubject: this.state.selectedSubject,
                                                    passGrade: this.state.selectedGrade,
                                                    passTopic: this.state.topic,
                                                    passDecreption: this.state.decreptionData
                                                })}
                                            isEnabled={true}
                                            buttonText={Strings.studentSignUp.continue}
                                        />
                                    </View> */}
                                </View>
                                {/* <CommonDropDown
                                        isModalshow={this.state.dropdown}
                                        cancelModal={() => this.setState({ dropdown: false, data: "" })}
                                        data={this.state.data}
                                        getCountry={this.updateData}
                                        dropdownHeader={this.state.dropdownHeader}
                                        listItemField={'value'}
                                    /> */}
                                {/* {this.state.dropdown != "" && this.state.data.length > 0 && <CommonDropDown
                        isModalshow={this.state.dropdown}
                        cancelModal={() => this.setState({ dropdown: false, data: "" })}
                        data={this.state.data}
                        getCountry={this.updateData}
                        dropdownHeader={this.state.dropdownHeader}
                        listItemField={'value'}
                    />} */}

                            </ScrollView>
                        </TouchableWithoutFeedback>
                    </KeyboardAvoidingView>
                </SafeAreaComponent>

            </Drawer >
        )
    };

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
            this.setState({ imageSource: image, doubtImage: source }, () => { this.uploadDoubtImage(this.state.doubtImage) });
        }).catch(e => {
            if (__DEV__) console.log("error", e)
            closeControlPanel()
            showToast(e)
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
            this.setState({ imageSource: image, doubtImage: source });
        });
    }

    uploadDoubtImage = (passURL) => {
        this.state.userDoubtImages.push({ url: passURL.uri })
        alert(this.state.userDoubtImages.length)
    }

    removeDoubtImage = () => {
        this.state.userDoubtImages.pop()
        alert(this.state.userDoubtImages.length)
    }

    renderUserDoubtImagesItem = ({ item, index }) => {
        return (
            <View style={{ padding: 5 }} >
                <ImageBackground style={{ height: 80, width: 80 }} source={{ uri: item.url }} >
                    <TouchableOpacity style={{ top: -10, right: -10, position: 'absolute', padding: 5 }}
                        onPress={() => { this.removeDoubtImage() }}
                    >
                        <Image source={Assets.homeScreen.crossIcon} />
                    </TouchableOpacity>
                </ImageBackground>
            </View>)
    }


    addEducation = () => {
        return (

            <TouchableOpacity
                style={{ paddingTop: 30, width: '100%', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderBottomWidth: 1, borderBottomColor: Color.borderColor.primaryColor }}
                onPress={() => {
                    this.setState({
                        dropdownHeader: Strings.teacherSignUp.yourEducation, dropdown: true, search_term: Constant.searchAPITerms.education,

                    }, () => {
                        // console.log("this.state.educaton" + this.state.education)
                        this.dropDownLoader()
                    })
                }}>
                <AppTextComp
                    value={this.state.selectedEducation}
                    onChangeText={(text) => this.setState({ selectedEducation: this.state.selectedEducation })}
                    placeholder={Strings.teacherSignUp.yourEducation}
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
            </TouchableOpacity>

        )
    }

    addGrade = () => {
        return (

            <TouchableOpacity
                style={{ paddingTop: 30, width: '100%', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderBottomWidth: 1, borderBottomColor: Color.borderColor.primaryColor }}
                onPress={() => this.setState({ dropdown: true, dropdownHeader: Strings.teacherSignUp.selectGrade, data: this.state.education })}>
                <AppTextComp
                    value={this.state.selectedEducation}
                    onChangeText={(text) => this.setState({ selectedEducation: this.state.selectedEducation })}
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
            </TouchableOpacity>


        )
    }

    addSubjects = () => {
        return (

            <TouchableOpacity
                style={{ paddingTop: 30, width: '100%', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderBottomWidth: 1, borderBottomColor: Color.borderColor.primaryColor }}
                onPress={() => this.setState({ dropdown: true, dropdownHeader: Strings.teacherSignUp.addSubject, data: this.state.education })}>
                <AppTextComp
                    value={this.state.selectedEducation}
                    onChangeText={(text) => this.setState({ selectedEducation: this.state.selectedEducation })}
                    placeholder={Strings.teacherSignUp.addSubject}
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
            </TouchableOpacity>


        )
    }

    dropDownLoader = async () => {
        NetworkManager.networkManagerInstance.progressBarRequest(true)

        console.log("searchItem" + this.state.search_term)
        console.log("searchItem" + this.state.selectedEducation)
        let data = {}
        console.log('this is data checkign', data)
        if (this.state.search_term == Constant.searchAPITerms.education) {
            data.country = "IN",
                data.search_term = this.state.search_term
        } else if (this.state.search_term == Constant.searchAPITerms.subjects) {
            data.country = "IN"
            data.search_term = this.state.search_term
            data.education = this.state.selectedEducation == "Other" ? "Tertiary" : this.state.selectedEducation
            data.grade = this.state.selectedGrade
        } else if (this.state.search_term == Constant.searchAPITerms.grade) {
            data.country = "IN"
            data.search_term = this.state.search_term
            data.education = this.state.selectedEducation == "Other" ? "Tertiary" : this.state.selectedEducation
        }
        try {
            const res = await NetworkManager.networkManagerInstance.fetchRequest(URL.getEducationDetails, URL.postRequest, true, data, () => { this.dropDownLoader(props) });
            if (res.statusCode === 200) {
                NetworkManager.networkManagerInstance.progressBarRequest(false)
                this.setState({ data: this.state.search_term == Constant.searchAPITerms.education ? [...res.data, "Other"] : res.data }, () => { console.log('this is getting data from newtwork', this.state.data) })
            } else {
                NetworkManager.networkManagerInstance.progressBarRequest(false)
            }
        } catch (error) {
            NetworkManager.networkManagerInstance.progressBarRequest(false)
            console.log("UPDATE_TUTOR_API " + error)
        }

    }

    updateData = (item, isdropdownVisible) => {


        let _arr = this.state.addSubjectObj
        let _obj = {};



        if (this.state.dropdownHeader.localeCompare(Strings.teacherSignUp.yourEducation) === 0) {

            // if (this.state.selectedEducation.localeCompare("Other") === 0) {
            //     this.setState({
            //         dropdown: isdropdownVisible,
            //         selectedEducation: 'Tertiary',
            //         search_term: Constant.searchAPITerms.education,
            //         data: ''
            //     });
            // } else {

            this.setState({
                dropdown: isdropdownVisible,
                selectedEducation: item,
                search_term: Constant.searchAPITerms.education,
                data: '',
                otherEducationName: '', selectedQualification: '', value: 0, addSubjectObj: [], selectedGrade: '', selectedSubject: '', serviceCharge: '',
            });
            // }

        }
        if (this.state.dropdownHeader.localeCompare(String.teacherSignUp.selectQualification) === 0) {
            this.setState({
                dropdown: isdropdownVisible,
                selectedQualification: item,
                search_term: Constant.searchAPITerms.subjects,
                data: ''
            })
        }

        if (this.state.isListdata != true) {

            if (this.state.dropdownHeader.localeCompare(String.teacherSignUp.selectGrade) === 0) {
                this.setState({
                    dropdown: isdropdownVisible,
                    selectedGrade: item,
                    search_term: Constant.searchAPITerms.grade,
                    data: ''
                })
            }
            if (this.state.dropdownHeader.localeCompare(String.teacherSignUp.addSubject) === 0) {

                this.setState({
                    dropdown: isdropdownVisible,
                    selectedSubject: item,
                    search_term: Constant.searchAPITerms.grade,
                    data: ''
                })
            }
        } else {
            // In case of editing added subjects 

            if (this.state.dropdownHeader === String.teacherSignUp.selectGrade) {
                let subject = _arr[this.state.listIndex].subject
                let sliderRange = _arr[this.state.listIndex].sliderRange
                _obj.grade = item
                _obj.subject = subject
                _obj.sliderRange = sliderRange
                _arr.splice(this.state.listIndex, 1, _obj)
                this.setState({
                    dropdown: false,
                    search_term: Constant.searchAPITerms.grade,
                    data: '',
                    addSubjectObj: _arr,
                    isListdata: false,
                    currentGradeIndex: ''

                })
            }
            if (this.state.dropdownHeader.localeCompare(String.teacherSignUp.addSubject) === 0) {

                if (this.state.addSubjectObj.some(obj => obj['grade'] === this.state.currentGradeIndex && obj['subject'] === item)) {
                    showToast(String.toastMsgs.tutor.subjectAlreadyAdded)

                    this.setState({
                        dropdown: false,
                        search_term: Constant.searchAPITerms.grade,
                        data: '',
                        addSubjectObj: _arr,
                        selectEduction: '',
                        isListdata: false,
                        currentGradeIndex: ''


                    })

                } else {
                    let grade = _arr[this.state.listIndex].grade
                    let sliderRange = _arr[this.state.listIndex].sliderRange
                    _obj.grade = grade
                    _obj.subject = item
                    _obj.sliderRange = sliderRange
                    _arr.splice(this.state.listIndex, 1, _obj)

                    this.setState({
                        dropdown: false,
                        search_term: Constant.searchAPITerms.grade,
                        data: '',
                        addSubjectObj: _arr,
                        selectEduction: '',
                        isListdata: false,
                        currentGradeIndex: ''


                    })
                }
            }


        }


    }

};

export default BookASession;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Color.textColor.pentaColor
    },
});
const drawerStyles = { drawer: { shadowColor: 'grey', shadowOpacity: 0.2, shadowRadius: 3 }, main: { paddingLeft: 3 } }
