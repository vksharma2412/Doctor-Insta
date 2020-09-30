import React, { Component } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, FlatList, TouchableWithoutFeedback, KeyboardAvoidingView, ScrollView, Keyboard, ImageBackground } from 'react-native'
import { AppButton, AppImageComponent, SafeAreaComponent, CommonHeader, AppTextComp, PopUp, CommonDropDown } from '../../components';
import { Strings, Assets, Dimen, Color, Styles, Constant } from '../../../res/index';
import { TextInput } from 'react-native-gesture-handler';
import Constants from '../../../res/Constants';
import { NetworkManager, Utility } from '../../utils/index';
import URL, { apis } from '../../../res/URL';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import Session from '../../utils/Session';
import String from '../../../res/String';
import { showToast } from '../../utils/Utility';
let moment = require('moment')


class ReScheduleSession extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            showDialog: false,
            topic: '',
            selectedDate: '',
            selectedTime: '',
            date: '',
            time: '',
            dropdown: false,
            visibility: false,
            displayDateAndTime: '',
            dateTimeDecider: '',
            isPopVisible: false,
            timeStamp: '',
            start_time: '',
        }
    }


    hadnleConfirm = (dateAndTime) => {

        // let date = moment(new Date(this.state.timeStamp)).toDate()
        let time = ''

        if (this.state.dateTimeDecider.localeCompare(Constant.dateTime.date) == 0) {

            let selectedDate = moment(new Date(dateAndTime), 'YYYY-MM-DD').utc().format('YYYY-M-DD')
            let currentDate = moment().format('YYYY-MM-DD')
            console.log("selectedDate", selectedDate)
            if (moment(currentDate, 'YYYY-MM-DD') > (moment(selectedDate, 'YYYY-MM-DD'))) {
                this.setState({ visibility: false })
                showToast("Please select future dates")
                return
            }
            this.setState({ date: selectedDate, timeStamp: dateAndTime, visibility: false, start_time: '', end_time: '', time_unit: '' })
        }
        if (this.state.dateTimeDecider.localeCompare(Constant.dateTime.time) == 0) {
            let selectedDate = moment(new Date(dateAndTime), 'YYYY-MM-DD').format('HH:mm:ss').toString()
            let addedDate = moment(this.state.timeStamp, 'YYYY-MM-DD').format().toString()
            let currentDate = moment().format('YYYY-MM-DD hh:mm A')
            if (__DEV__) console.log("moment(moment(this.state.timeStamp, 'YYY-MM-DD').format('YYYY-MM-DD')∂∂ + selectedDate)==>" + moment(moment(this.state.timeStamp, 'YYY-MM-DD')).format('YYYY-MM-DD'))
            if (__DEV__) console.log("====??????    " + moment(addedDate + " " + selectedDate, "YYYY-MM-DD, hh:mm a").format('YYYY MM DD hh:mm a'))
            if (__DEV__) console.log("moment(addedDate  + selectedDate)" + moment(addedDate + " " + selectedDate, "YYYY-MM-DD, HH:mm"))
            if (__DEV__) console.log("moment()" + moment())
            let date = moment(addedDate + " " + selectedDate, "YYYY-MM-DD, HH:mm").toISOString()

            if (__DEV__) console.log("date=====> " + date)
            if (!moment(addedDate + " " + selectedDate, "YYYY-MM-DD, hh:mm a").isSameOrAfter(moment())) {
                this.setState({ visibility: false })
                showToast("Please select future Time")
                return
            }
            const timeAndDate = moment(dateAndTime)
            if (__DEV__) console.log('timeAndDate' + moment(new Date(timeAndDate).getTime()).add(1, 'hour').format('A'))
            this.setState({
                timeStamp: moment(addedDate + " " + selectedDate, "YYYY-MM-DD, hh:mm a").utc().format('YYYY-MM-DD HH:mm:ss'),
                start_time: moment(timeAndDate).utc(),
                end_time: moment(moment(new Date(timeAndDate).getTime()).add(1, 'hour')).utc(),
                time_unit: moment(new Date(timeAndDate).getTime()).add(1, 'hour').format('A'), visibility: false,
                tempTime: moment(addedDate + " " + selectedDate, "YYYY-MM-DD, hh:mm a").utc()
            }, () => console.log('moment(addedDate + " " + selectedDate, "YYYY-MM-DD, hh:mm a")' + this.state.timeStamp))
        }
    }


    onPressCancel = () => {
        this.setState({ visibility: false })
    }

    showHideDatePicker = () => {
        this.setState({ visibility: true })
    }


    selectDateComponent = () => {
        return (
            <View style={{ paddingTop: 10, marginHorizontal: 20 }}>

                <TouchableOpacity
                    style={{ width: '100%', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderBottomWidth: 1, borderBottomColor: Color.borderColor.primaryColor }}
                    onPress={() => { this.setState({ dateTimeDecider: Constant.dateTime.date, visibility: true }) }}>
                    <AppTextComp
                        value={this.state.timeStamp != '' ? Utility.sharedInstance.formatDate(this.state.timeStamp) : ''}
                        onChangeText={(text) => this.setState({ date: this.state.date })}
                        placeholder={Strings.session.selectDate}
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


            </View>
        )
    }

    selectTimeComponent = () => {
        return (
            <View style={{ paddingTop: 10, marginHorizontal: 20, }}>
                <TouchableOpacity
                    style={{ width: '100%', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderBottomWidth: 1, borderBottomColor: Color.borderColor.primaryColor }}
                    onPress={() => this.setState({ dateTimeDecider: Constant.dateTime.time, visibility: true })}>
                    <AppTextComp
                        value={this.state.start_time != '' ? Utility.sharedInstance.formatTimeinHour(this.state.start_time) : ''}
                        onChangeText={(text) => this.setState({ start_time: this.state.start_time })}
                        placeholder={Strings.bookingSession.selectTime}
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

            </View>
        )
    }

    render() {
        return (
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
                            contentContainerStyle={{ flexGrow: 1, backgroundColor: Color.secondayTextColor }}
                            keyboardShouldPersistTaps='always'
                            showsVerticalScrollIndicator={false}>
                            <View style={{ flex: 1, }}>
                                <View style={{ flex: 0.05, paddingTop: 10, paddingBottom: 15, backgroundColor: Color.textColor.pentaColor, }}>
                                    <CommonHeader
                                        containerStyle={{ marginHorizontal: '3%' }}
                                        headerTrue={Strings.session.rescheduleTitle}
                                        headerTitleFontsize={Dimen.mediumTextSize}
                                        headerTitleColor={Color.secondayTextColor}
                                        headerTtileFontWieght={'700'}
                                        headerTitleFontsize={16}
                                        leftIconStyle={{ tintColor: Color.secondayTextColor }} />
                                </View>
                                <View style={{ flex: 0.95, top: -20, paddingBottom: '13%', borderTopLeftRadius: 20, borderTopRightRadius: 20, width: '100%', backgroundColor: Color.secondayTextColor }}>

                                    <View style={{ flex: 0.9, paddingTop: 10 }}>
                                        <View style={{ flex: 1 }}>
                                            {this.selectDateComponent()}
                                            {this.selectTimeComponent()}
                                        </View>
                                    </View>

                                    <PopUp
                                        isPopVisible={this.state.isPopVisible}
                                        headerText={Strings.session.rescheduleTitle}
                                        descriptionText={Strings.session.rescheduleSubTitle}
                                        rightButtonText={Strings.session.yes}
                                        leftButtonText={Strings.session.no}
                                        rightButtonOnPress={async () => {
                                            this.setState({ isPopVisible: false })
                                            this.rescheduleSessionApiHandler()
                                        }}
                                        leftButtonOnPress={() => { this.setState({ isPopVisible: false }) }}
                                    />
                                    <DateTimePickerModal
                                        isVisible={this.state.visibility}
                                        onConfirm={this.hadnleConfirm}
                                        onCancel={this.onPressCancel}
                                        mode={this.state.dateTimeDecider}
                                        headerTextIOS={this.state.dateTimeDecider == 'time' ? 'Pick a Time' : 'Pick a Date'}
                                    />

                                </View>



                            </View>
                            {this.continueButton()}
                            {this.state.dropdown != false && this.state.rating.length > 0 && <CommonDropDown
                                isModalshow={this.state.dropdown}
                                cancelModal={() => this.setState({ dropdown: false, data: "" })}
                                data={this.state.rating}
                                getCountry={this.updateData}
                                dropdownHeader={this.state.dropdownHeader}
                                listItemField={'value'}
                            />}
                        </ScrollView>


                    </TouchableWithoutFeedback>
                </KeyboardAvoidingView>
            </SafeAreaComponent >
        )
    };




    continueButton() {
        return (
            <View style={{ flex: 0.1, width: '90%', justifyContent: 'flex-end', alignSelf: 'center', marginBottom: 20, }}>

                <AppButton
                    buttonStyle={{ width: '100%' }}
                    onPress={() => {
                        if (!this.formValidation()) {
                            return
                        }

                        this.setState({ isPopVisible: true })
                    }}
                    isEnabled={true}
                    buttonText={Strings.session.rescheduleTitle}
                />
            </View>
        )
    }



    updateData = (item, isdropdownVisible) => {
        this.setState({
            dropdown: false,
            selectedRating: item,

        });


    }


    rescheduleSessionApiHandler = async () => {
        if (!this.formValidation()) {
            return
        }


        let data = {
            tutor_id: Session.sharedInstance.userDetails[Constant.userDetailsFields._id],
            timestamp: moment.utc(this.state.timeStamp).toDate(),
            session_id: this.props.route.params.session_id != undefined ? this.props.route.params.session_id : ''
            // session_id: '5f562f9ad26ddd3d31bab66d'

        }

        console.log('this is data Value', data)

        const res = await NetworkManager.networkManagerInstance.fetchRequest(URL.tutorRescheduleSession, URL.postRequest, true, data, () => this.rescheduleSessionApiHandler())
        console.log('this is checking datya res', JSON.stringify(res))
        if (res.statusCode == 200) {
            showToast(res.message)
            NetworkManager.networkManagerInstance.progressBarRequest(false)
            this.props.navigation.navigate('SuccessScreen')
        } else {
            showToast(res.message)
            NetworkManager.networkManagerInstance.progressBarRequest(false)
            console.log('RESCHEDULE FAILED')
        }

    }


    formValidation() {

        if (!Utility.sharedInstance.validateEmptyField(this.state.timeStamp.toString(), String.toastMsgs.slotBookingToastMsgs.enterDate)) {
            return
        }

        if (!Utility.sharedInstance.validateEmptyField(this.state.start_time.toString(), String.toastMsgs.slotBookingToastMsgs.enterTime)) {
            return
        }



        return true
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



export default ReScheduleSession;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Color.textColor.pentaColor
    },
});
