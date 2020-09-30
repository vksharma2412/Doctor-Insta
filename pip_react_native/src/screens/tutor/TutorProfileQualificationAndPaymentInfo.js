import React, { useState, Component } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, TextInput, FlatList, TouchableWithoutFeedback, KeyboardAvoidingView, ScrollView, Keyboard } from 'react-native'
import { AppButton, AppImageComponent, SafeAreaComponent, InputTextField, CommonHeader, CommonDropDown, AppTextComp } from '../../components';
import { Strings, Assets, Dimen, Color, Styles, Constant, URL, AsyncStorageValues, } from '../../../res/index';
import String from '../../../res/String';
import RangeSlider from 'rn-range-slider';
import Constants from '../../../res/Constants';
import { Utility, NetworkManager, } from '../../utils';
import { showToast } from '../../utils/Utility';
import { API_CALL, EDUCATION_DETAIL_API_CALL } from "../../redux/Actions";
import { connect } from "react-redux";
import Slider from 'react-native-slider';
import Session from '../../utils/Session';


class TutorProfileQualificationAndPaymentInfo extends Component {

    constructor(props) {
        super(props)
        this.state = {
            addSubjectObj: Session.sharedInstance.userDetails[Constants.userDetailsFields.tutor_education_details].length > 0 ? Session.sharedInstance.userDetails[Constants.userDetailsFields.tutor_education_details] : [{
                'tutor_teaching_subject': '',
                'tutor_teaching_grade': '',
                tutor_service_charge_per_hour: 0,
            }],
            selectedTutorPrice: -1,
            selectedEducation: Session.sharedInstance.userDetails[Constants.userDetailsFields.tutor_education] != undefined ? Session.sharedInstance.userDetails[Constants.userDetailsFields.tutor_education] : '',
            selectedSubject: '',
            otherEducationName: Session.sharedInstance.userDetails[Constants.userDetailsFields.otherEducation] != undefined ? Session.sharedInstance.otherEducation[Constants.userDetailsFields.otherEducation] : '',
            isListdata: false,
            listIndex: 0,
            selectedQualification: Session.sharedInstance.userDetails[Constants.userDetailsFields.qualification] != undefined ? Session.sharedInstance.userDetails[Constants.userDetailsFields.qualification] : '',
            selectedGrade: '',
            serviceCharge: '',
            rangeLow: 0,
            dropdownHeader: '',
            search_term: 'education',
            dropdown: '',
            data: [],
            value: 0,
            currentGradeIndex: '',


        }
    }

    componentWillMount() {
        this.setState({
            addSubjectObj: Session.sharedInstance.userDetails[Constants.userDetailsFields.tutor_education_details].length > 0 ? Session.sharedInstance.userDetails[Constants.userDetailsFields.tutor_education_details] : [{
                'tutor_teaching_subject': '',
                'tutor_teaching_grade': '',
                tutor_service_charge_per_hour: 0,
            }]
        })
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

    render() {
        return (
            <SafeAreaComponent
                StatusBarTextColor={'dark-content'}
            >
                <View style={styles.container}>
                    <KeyboardAvoidingView
                        style={{ flexGrow: 1, flexDirection: 'column', }}
                        keyboardVerticalOffset={40}
                        behavior={Platform.OS === 'ios' ? 'padding' : null}
                        enabled>

                        <ScrollView
                            contentContainerStyle={{ flexGrow: 1 }}
                            keyboardShouldPersistTaps='always'
                        >
                            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                                <View style={{ flex: 1 }}>
                                    <View style={{ flex: 1 }}>
                                        {this.header()}
                                        {this.addEducation()}
                                        {this.addSubjects()}</View>
                                    {this.state.dropdown != "" && this.state.data.length > 0 && <CommonDropDown
                                        isModalshow={this.state.dropdown}
                                        cancelModal={() => this.setState({ dropdown: false, data: "" })}
                                        data={this.state.data}
                                        getCountry={this.updateData}
                                        dropdownHeader={this.state.dropdownHeader}
                                        listItemField={'value'}
                                    />}


                                </View>
                            </TouchableWithoutFeedback>
                        </ScrollView>
                    </KeyboardAvoidingView>
                    {!this.state.showKeyboard && this.continueButton()}
                </View>
            </SafeAreaComponent>
        )




    }



    header() {

        return (
            <View style={{ marginHorizontal: 20 }}>
                <CommonHeader
                    headerTrue={String.tutor.tutorQualificationAndPayment}
                    pageCount={String.teacherSignUp.threeOfThree}
                />
            </View>
        )
    }
    addEducation() {
        return (
            <View style={{ flex: 0.05, justifyContent: 'space-evenly' }}>
                <View style={{ marginHorizontal: 20 }}>
                    <TouchableOpacity
                        style={{ marginTop: 30, width: '100%', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderBottomWidth: 1, borderBottomColor: Color.borderColor.primaryColor }}
                        onPress={() => {
                            this.setState({
                                dropdownHeader: String.teacherSignUp.yourEducation, dropdown: true, search_term: Constant.searchAPITerms.education,

                            }, () => {
                                this.dropDownLoader()
                            })
                        }}>
                        <AppTextComp
                            value={this.state.selectedEducation}
                            placeholder={String.teacherSignUp.yourEducation}
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
                        materialTextInput
                    />}

                    <AppTextComp
                        style={{ paddingTop: 30, width: '100%' }}
                        value={this.state.selectedQualification}
                        onChangeText={(text) => {
                            this.setState({ selectedQualification: text })
                        }}
                        placeholder={String.teacherSignUp.qualification}
                        fontSize={16}
                        autoCapitalize='none'
                        labelEnabled={true}
                        tintColor={Color.borderColor.secondaryColor}
                        lineWidth={1}
                        activeLineWidth={1}
                        width='100%'
                        materialTextInput
                    />
                </View>

                <View style={{ width: '100%', height: 10, backgroundColor: Color.listSeperator.primary, marginTop: 20 }}></View>
            </View>
        )
    }


    addSubjects() {
        let that = this
        return (
            <View style={{ flex: 0.95, marginBottom: 60 }}>

                <FlatList
                    data={this.state.addSubjectObj}
                    renderItem={({ item, index }) =>
                        <View>
                            <View style={{ marginHorizontal: 20 }}>
                                <TouchableOpacity

                                    style={{ marginTop: 30, width: '100%', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderBottomWidth: 1, borderBottomColor: Color.borderColor.primaryColor }}
                                    onPress={() => {
                                        if (this.state.selectedQualification == "") {
                                            if (!this.formValidation()) {
                                                return
                                            }
                                        }

                                        this.setState({ dropdown: true, dropdownHeader: String.teacherSignUp.selectGrade, search_term: Constant.searchAPITerms.grade, isListdata: true, listIndex: index }, () => {
                                            this.addedListDropDownLoader(item.tutor_teaching_grade)
                                        })

                                    }}>
                                    <AppTextComp
                                        value={item.tutor_teaching_grade}
                                        placeholder={String.teacherSignUp.selectGrade}
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

                                <TouchableOpacity
                                    style={{ marginTop: 30, width: '100%', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderBottomWidth: 1, borderBottomColor: Color.borderColor.primaryColor }}
                                    onPress={() => {

                                        if (item.tutor_teaching_grade == "") {
                                            if (!this.formValidation()) {
                                                return
                                            }
                                            showToast(Strings.toastMsgs.tutor.selectGrade)
                                            return
                                        }

                                        this.setState({ dropdown: true, dropdownHeader: String.teacherSignUp.addSubject, search_term: Constant.searchAPITerms.subjects, isListdata: true, listIndex: index, currentGradeIndex: item.tutor_teaching_grade }, () => this.addedListDropDownLoader(item.tutor_teaching_grade))
                                    }
                                    }
                                >
                                    <AppTextComp
                                        value={item.tutor_teaching_subject}
                                        placeholder={String.teacherSignUp.addSubject}
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



                                <View style={{ marginTop: 20, flex: 0.4 }}>
                                    <Text style={{ color: Color.borderColor.primaryColor, lineHeight: 12, fontSize: Dimen.verySmallTextSize }}>{String.teacherSignUp.serviceCharge}</Text>
                                    <Text style={{ lineHeight: 30, }}>{item.tutor_service_charge_per_hour}$</Text>
                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', height: 80, }}>
                                        <Text>{String.teacherSignUp.zeroDollar}</Text>

                                        <Slider
                                            style={{ width: '80%', height: 80, top: -20 }}
                                            value={item.tutor_service_charge_per_hour}
                                            minimumValue={0}
                                            maximumValue={100}
                                            thumbTintColor={Color.borderColor.secondaryColor}
                                            minimumTrackTintColor={Color.borderColor.secondaryColor}
                                            step={1}
                                            onValueChange={(value) => {
                                                let _arr = this.state.addSubjectObj
                                                _arr[index].tutor_service_charge_per_hour = value

                                                this.setState({ addSubjectObj: _arr, selectedTutorPrice: value })
                                            }} />
                                        <Text>{String.teacherSignUp.hundredDollar}</Text>
                                    </View>
                                    <View style={{ height: 50, width: '100%', }}>
                                        <TouchableOpacity style={{ flexDirection: 'row', justifyContent: 'flex-end' }}
                                            onPress={
                                                () => {
                                                    this.setState({ listIndex: index }, this.state.addSubjectObj.length == 1 ? this._addSubject : this._removeSubject)
                                                }}>
                                            {this.state.addSubjectObj.length == 1 && <Image source={Assets.teacherRegistration.addICon} style={{ marginRight: 15 }} />}
                                            <Text style={{ fontSize: Dimen.verySmallTextSize, color: Color.textColor.pentaColor }}>{this.state.addSubjectObj.length == 1 ? String.teacherSignUp.addSubject.toUpperCase() : String.teacherSignUp.removeSubject.toUpperCase()}</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </View>
                            <View style={{ width: '100%', height: 10, backgroundColor: Color.listSeperator.primary, marginTop: 20 }}></View>

                        </View>}

                    keyExtractor={item => item.id}
                    ListFooterComponent={this.footerComponent()}
                />
            </View>
        )
    }


    footerComponent() {
        return (
            <View>
                {this.state.addSubjectObj.length > 1 && <View>
                    <View style={{ marginHorizontal: 20 }}>

                        <View style={{ marginTop: 20, flex: 0.4 }}>

                            <View style={{ height: 50, width: '100%', }}>
                                <TouchableOpacity style={{ flexDirection: 'row', justifyContent: 'flex-end' }}
                                    onPress={this._addSubject}>
                                    <Image source={Assets.teacherRegistration.addICon} style={{ marginRight: 15 }} />
                                    <Text style={{ fontSize: Dimen.verySmallTextSize, color: Color.textColor.pentaColor }}>{String.teacherSignUp.addSubject.toUpperCase()}</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>

                    <TouchableOpacity style={{ flexDirection: 'row', height: 30, width: '85%', paddingBottom: 20, justifyContent: 'space-between', alignItems: 'center', paddingBottom: 40, paddingTop: 30, marginHorizontal: '4%' }}>
                        <View>
                            <Text style={{ fontSize: Dimen.mediumTextSize }}>{String.teacherSignUp.addPaymentDetails}</Text>
                        </View>
                        <View>
                            <Image source={Assets.teacherRegistration.arrowBack} />
                        </View>
                    </TouchableOpacity>
                </View>}
            </View>

        )
    }


    continueButton() {
        return (
            <View style={{ position: 'absolute', bottom: 0, justifyContent: 'center', alignItems: 'center', marginBottom: 20, width: '90%', alignSelf: 'center' }}>
                <AppButton
                    buttonStyle={{ width: '100%' }}
                    onPress={this.tutorQualificationApiHandler}
                    isEnabled={true}
                    buttonText={Strings.studentSignUp.continue}
                />
            </View>
        )
    }


    tutorQualificationApiHandler = async () => {


        if (!Utility.sharedInstance.validateEmptyField(this.state.selectedEducation, String.toastMsgs.tutor.selectEduction)) {
            return
        }

        if (this.state.selectedEducation == "Other") {
            if (!Utility.sharedInstance.validateEmptyField(this.state.otherEducationName, String.toastMsgs.tutor.otherField)) {
                return false
            }
        }
        if (!Utility.sharedInstance.validateEmptyField(this.state.selectedQualification, String.toastMsgs.tutor.qualification)) {
            return
        }

        if (!this.isEmptyCard()) {
            return
        }

        if (
            Session.sharedInstance.userDetails[Constants.userDetailsFields.tutor_education] !== this.state.selectedEducation ||
            Session.sharedInstance.userDetails[Constants.userDetailsFields.qualification] !== this.state.selectedQualification ||
            this.state.selectedTutorPrice != -1
        ) {
            NetworkManager.networkManagerInstance.progressBarRequest(true)

            try {
                const res = await NetworkManager.networkManagerInstance.fetchRequest(URL.updateTutor, URL.putRequest, true, this.formData(), () => { this.tutorQualificationApiHandler() });
                if (res.statusCode === 200) {
                    await Utility.sharedInstance._storeData(AsyncStorageValues.userDetails, res.data, String.asynstorageMsgs.updateTutorData)
                    Session.sharedInstance.userDetails = res.data
                    Session.sharedInstance.isStudent = false
                    NetworkManager.networkManagerInstance.progressBarRequest(false)
                    this.props.navigation.navigate(Constant.routeName.waitingForApproval)
                } else {
                    NetworkManager.networkManagerInstance.progressBarRequest(false)

                }

            } catch (error) {
                NetworkManager.networkManagerInstance.progressBarRequest(false)
                console.log("UPDATE_TUTOR_API " + error)
            }
        }

    }


    formData() {
        let dataUpdated = false
        let _tempData = this.state.addSubjectObj
        let data = []
        for (let index = 0; index < _tempData.length; index++) {
            let tutor_education_details = {}
            tutor_education_details.tutor_teaching_subject = _tempData[index].tutor_teaching_subject;
            tutor_education_details.tutor_teaching_grade = _tempData[index].tutor_teaching_grade;
            tutor_education_details.tutor_service_charge_per_hour = _tempData[index].tutor_service_charge_per_hour;
            data.push(tutor_education_details)
        }

        let formData = {}
        formData.isVerified = false
        formData.id = Session.sharedInstance.userDetails[Constants.userDetailsFields._id]
        if (Session.sharedInstance.userDetails[Constant.userDetailsFields.tutor_education] != this.state.selectedEducation) {
            dataUpdated = true
            formData.tutor_education = this.state.selectedEducation
        }

        if (Session.sharedInstance.userDetails[Constant.userDetailsFields.qualification] != this.state.otherEducationName) {
            dataUpdated = true
            formData.qualification = this.state.selectedQualification
        }

        formData.tutor_education_details = data

        if (dataUpdated) {
            formData.isVerified = false
        }
        return formData

    }




    dropDownLoader = async () => {
        NetworkManager.networkManagerInstance.progressBarRequest(true)

        let data = {}
        if (this.state.search_term == Constant.searchAPITerms.education) {
            data.country = Session.sharedInstance.countryName,
                data.search_term = this.state.search_term
        } else if (this.state.search_term == Constant.searchAPITerms.subjects) {
            data.country = Session.sharedInstance.countryName
            data.search_term = this.state.search_term
            data.education = this.state.selectedEducation == "Other" ? "Tertiary" : this.state.selectedEducation
            data.tutor_teaching_grade = this.state.selectedGrade
        } else if (this.state.search_term == Constant.searchAPITerms.tutor_teaching_grade) {
            data.country = Session.sharedInstance.countryName
            data.search_term = this.state.search_term
            data.education = this.state.selectedEducation == "Other" ? "Tertiary" : this.state.selectedEducation
        }
        try {
            const res = await NetworkManager.networkManagerInstance.fetchRequest(URL.getEducationDetails, URL.postRequest, true, data, () => { this.dropDownLoader() });
            if (res.statusCode === 200) {
                NetworkManager.networkManagerInstance.progressBarRequest(false)
                this.settingModalData(res)
            } else {
                NetworkManager.networkManagerInstance.progressBarRequest(false)
            }
        } catch (error) {
            NetworkManager.networkManagerInstance.progressBarRequest(false)
            console.log("UPDATE_TUTOR_API " + error)
        }

    }
    addedListDropDownLoader = async (tutor_teaching_grade) => {
        NetworkManager.networkManagerInstance.progressBarRequest(true)
        let data = {}
        if (this.state.search_term == Constant.searchAPITerms.education) {
            data.country = Session.sharedInstance.countryName,
                data.search_term = this.state.search_term
        } else if (this.state.search_term == Constant.searchAPITerms.subjects) {
            data.country = Session.sharedInstance.countryName
            data.search_term = this.state.search_term
            data.education = this.state.selectedEducation == "Other" ? "Tertiary" : this.state.selectedEducation
            data.grade = tutor_teaching_grade
        } else if (this.state.search_term == Constant.searchAPITerms.grade) {
            data.country = Session.sharedInstance.countryName
            data.search_term = this.state.search_term
            data.education = this.state.selectedEducation == "Other" ? "Tertiary" : this.state.selectedEducation
        }
        try {
            const res = await NetworkManager.networkManagerInstance.fetchRequest(URL.getEducationDetails, URL.postRequest, true, data, () => { this.addedListDropDownLoader() });
            if (res.statusCode === 200) {
                NetworkManager.networkManagerInstance.progressBarRequest(false)
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
            this.setState({ data: this.state.search_term == Constant.searchAPITerms.education ? [...res.data.education, "Other"] : res.data.education })
        } else if (this.state.search_term == Constant.searchAPITerms.grade) {
            this.setState({ data: res.data.grade })
        } else if (this.state.search_term == Constant.searchAPITerms.subjects) {
            this.setState({ data: res.data[0].subjects })
        }
    }




    updateData = (item, isdropdownVisible) => {


        let _arr = this.state.addSubjectObj
        let _obj = {};



        if (this.state.dropdownHeader.localeCompare(String.teacherSignUp.yourEducation) === 0) {

            this.setState({
                dropdown: isdropdownVisible,
                selectedEducation: item,
                search_term: Constant.searchAPITerms.education,
                data: '',
                otherEducationName: '', selectedQualification: '', value: 0, addSubjectObj: [{
                    'tutor_teaching_subject': '',
                    'tutor_teaching_grade': '',
                    tutor_service_charge_per_hour: 0.
                }], selectedGrade: '', selectedSubject: '', serviceCharge: '',
            });

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

            if (this.state.dropdownHeader === String.teacherSignUp.selectGrade) {


                let tutor_teaching_subject = _arr[this.state.listIndex].tutor_teaching_subject
                let tutor_service_charge_per_hour = _arr[this.state.listIndex].tutor_service_charge_per_hour
                _obj.tutor_teaching_grade = item
                _obj.tutor_teaching_subject = tutor_teaching_subject
                _obj.tutor_service_charge_per_hour = tutor_service_charge_per_hour
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

                if (this.state.addSubjectObj.some(obj => obj['tutor_teaching_grade'] === this.state.currentGradeIndex && obj['tutor_teaching_subject'] === item)) {
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
                    let tutor_teaching_grade = _arr[this.state.listIndex].tutor_teaching_grade
                    let tutor_service_charge_per_hour = _arr[this.state.listIndex].tutor_service_charge_per_hour
                    _obj.tutor_teaching_grade = tutor_teaching_grade
                    _obj.tutor_teaching_subject = item
                    _obj.tutor_service_charge_per_hour = tutor_service_charge_per_hour
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

    _addSubject = () => {

        if (!this.isEmptyCard()) {
            return
        }

        let obj = {}
        let arr = []
        obj['tutor_teaching_subject'] = ""
        obj['tutor_teaching_grade'] = ""
        obj['tutor_service_charge_per_hour'] = 0
        arr.push(obj)
        let data = [...this.state.addSubjectObj, ...arr]

        this.setState({ addSubjectObj: data, selectedSubject: '', rangeLow: 0, selectedGrade: '' })

    }

    _removeSubject = () => {
        let temp = this.state.addSubjectObj
        temp.splice(this.state.listIndex, 1);
        this.setState({ addSubjectObj: temp })
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
        if (!Utility.sharedInstance.validateEmptyField(this.state.selectedQualification, String.toastMsgs.tutor.qualification)) {
            return
        }

        return true

    }

    arraysEqual(a, b) {
        if (a === b) return true;
        if (a == null || b == null) return false;
        if (a.length !== b.length) return false;

        for (var i = 0; i < a.length; ++i) {
            if (a[i] !== b[i]) return false;
        }
        return true;
    }



    isEmptyCard() {
        let addSubject = this.state.addSubjectObj.length
        if (this.state.addSubjectObj[addSubject - 1].tutor_teaching_grade.localeCompare("") == 0) {
            showToast(String.toastMsgs.tutor.selectGrade)
            return false
        }
        if (this.state.addSubjectObj[addSubject - 1].tutor_teaching_subject.localeCompare("") == 0) {
            showToast(String.toastMsgs.tutor.selectSubject)
            return false
        }
        return true
    }


};






export default TutorProfileQualificationAndPaymentInfo;



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







});