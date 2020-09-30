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


class SlotBooking extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            showDialog: false,
            topic: '',
            selectedDate: this.props.route.params.data.timestamp ? this.props.route.params.data.timestamp : '',
            selectedTime: this.props.route.params.data.timestamp ? this.props.route.params.data.timestamp : '',
            selectedBudgetAndRating: '',
            dropdownHeader: 'Select Rating',
            dropdown: false,
            budget: this.props.route.params.data.budget ? this.props.route.params.data.budget.toString() : '',
            data: [],
            rating: ['5 Star', '4+ Star', '3+ Star', '2+ Star', '1+ Star'],
            star_rating: '',
            urgent_booking: this.props.route.params.data.urgent_booking ? this.props.route.params.data.urgent_booking : false,
            claimFreeSession: this.props.route.params.data.claim_free_session ? this.props.route.params.data.claim_free_session : false,
            selectedRating: '',
            selectedTime: '',
            selectedDate: '',
            visibility: false,
            displayDateAndTime: '',
            dateTimeDecider: '',
            isPopVisible: false,
            date: '',
            time: '',
            isReschedule: this.props.route.params.data.isReschedule ? this.props.route.params.data.isReschedule.toString() : false,
            selectedRating: this.props.route.params.data.star_rating ? this.props.route.params.data.star_rating.toString() : '',

            timeStamp: '',
            start_time: '',
            end_time: '',
            time_unit: '',
            min: undefined,
            max: undefined,
            tempTime: '',
            sessionStatus : this.props.route.params.data.status ? this.props.route.params.data.status : null,

        }
    }


    async componentDidMount() {
        await this.getBiddingPriceApiHandler()
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

    bookSessionApiHandling = async () => {

        let data = {
            student_id: this.state.studentId,
            education: this.state.sessionId,
            grade: '',
            topic: '',
            description: '',
            timestamp: 0,
            budget: 0,
            star_rating: 0,
            urgent_booking: true,
            country: '',
            currency: '50',
            map: {
                type: this.state.mapType,
                coordinates: [
                    this.state.xCordinate,
                    this.state.yCordinate
                ]
            }

        }
        const res = await NetworkManager.networkManagerInstance.fetchRequest(URL.bookSession, URL.postRequest, true, data, () => this.apiHandler())
        console.log("this is checking response", res)
        if (res.statusCode == 200) {
            // this.props.navigation.navigate('')
        } else {
            showToast(res.message)
        }
        return
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

    selectBudgetRatingComponent = () => {
        return (
            <View style={{ justifyContent: 'space-evenly', paddingVertical: 20 }}>
                <View style={{ marginHorizontal: 20, flexDirection: 'row', justifyContent: 'space-between', }}>
                    <AppTextComp
                        value={this.state.budget}
                        onChangeText={(text) => {
                            if (isNaN(text))
                                showToast(String.toastMsgs.slotBookingToastMsgs.enterAmount)
                            else
                                this.setState({ budget: text })
                        }}
                        placeholder={Strings.session.budget + '( In ' + Session.sharedInstance.countryCodeObj.currency_symbol + ' )'}
                        fontSize={16}
                        editable={(this.props.route.params.data.status == "Started") ? false : true}
                        autoCapitalize='none'
                        labelEnabled={true}
                        tintColor={Color.borderColor.secondaryColor}
                        lineWidth={1}
                        activeLineWidth={1}
                        width='100%'
                        style={{ width: '40%' }}
                        keyboardType={'numeric'}
                        materialTextInput
                    />
                    <TouchableOpacity
                        style={{ width: '40%', paddingRight: 10, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderBottomWidth: 1, borderBottomColor: Color.borderColor.primaryColor }}
                        onPress={() => this.setState({ data: this.state.star_rating, dropdown: true })}>
                        <AppTextComp
                            value={this.state.selectedRating}
                            onChangeText={(text) => this.setState({ selectedRating: this.state.selectedRating })}
                            placeholder={Strings.session.tutorRating}
                            fontSize={16}
                            editable={false}
                            autoCapitalize='none'
                            labelEnabled={true}
                            tintColor={Color.borderColor.secondaryColor}
                            lineWidth={0}
                            activeLineWidth={0}
                            width='90%'
                            // keyboardType='default'
                            materialTextInput />
                        <Image style={{ marginLeft: 5 }} source={Assets.common.drop_down} />
                    </TouchableOpacity>
                </View>
            </View>
        )
    }

    render() {
        console.log('this.state.ti' + JSON.stringify(this.props.route.params.data))
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
                                <View style={{ flex: 0.2, paddingTop: 10, paddingBottom: 15, backgroundColor: Color.textColor.pentaColor, }}>
                                    <CommonHeader
                                        containerStyle={{ marginHorizontal: '3%' }}
                                        headerTrue={Strings.bookingSession.bookSession}
                                        headerTitleFontsize={Dimen.mediumTextSize}
                                        headerTitleColor={Color.secondayTextColor}
                                        headerTtileFontWieght={'700'}
                                        headerTitleFontsize={16}
                                        leftIconStyle={{ tintColor: Color.secondayTextColor }} />
                                </View>
                                <View style={{ flex: 0.8, top: -20, paddingBottom: '13%', borderTopLeftRadius: 20, borderTopRightRadius: 20, width: '100%', backgroundColor: Color.secondayTextColor }}>

                                    {/* <View style={{ flex: 1 }}> */}
                                    <View style={{ flex: 0.9, paddingTop: 10 }}>
                                        <View style={{ flex: 1 }}>
                                            {this.selectDateComponent()}
                                            {this.selectTimeComponent()}
                                            {this.selectBudgetRatingComponent()}
                                            <View
                                                style={{ height: 60, flexDirection: 'row', justifyContent: 'space-between', marginHorizontal: 18, alignItems: 'center' }}
                                            >
                                                <Text style={{ fontSize: 16, color: Color.textColor.quarternary }}>{Strings.session.urgentBooking}</Text>
                                                <TouchableOpacity
                                                    onPress={() => { this.setState({ urgent_booking: !this.state.urgent_booking }) }}
                                                >
                                                    <Image style={{ width: 24, height: 24 }} source={this.state.urgent_booking ? Assets.session.checked : Assets.session.unchecked}></Image>
                                                </TouchableOpacity>
                                            </View>
                                            <View style={{ height: 1, backgroundColor: Color.borderColor.primaryColor, marginHorizontal: 20, justifyContent: 'center' }}></View>

                                            <View
                                                style={{ height: 60, flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 18, alignItems: 'center', }}
                                            >
                                                <Text style={{ fontSize: 16, color: Color.textColor.quarternary }}>{Strings.session.claimFreeSession}</Text>
                                                <TouchableOpacity
                                                    onPress={() => { this.setState({ claimFreeSession: !this.state.claimFreeSession }) }}

                                                >
                                                    <Image style={{ width: 24, height: 24 }} source={this.state.claimFreeSession ? Assets.session.checked : Assets.session.unchecked}></Image>
                                                </TouchableOpacity>
                                            </View>
                                            <View style={{ paddingTop: 20 }}>
                                                <View style={{ height: 90, backgroundColor: '#FECB2714', alignItems: 'center', justifyContent: 'center', marginHorizontal: 20, borderWidth: 1.5, borderColor: Color.borderColor.tertiaryColor, borderStyle: 'dashed', borderRadius: 5 }}>
                                                    <Text style={{ fontSize: 14, textAlign: 'center', paddingHorizontal: 22 }}>{Strings.session.youWillBeCharged}{'\n'}{Strings.session.moreThanAnHour}</Text>
                                                </View>
                                            </View>
                                        </View>
                                    </View>
                                    {/* <View style={{ flex: 0.1, backgroundColor: 'red', bottom: 0 }}> */}

                                    {/* </View> */}
                                    <PopUp
                                        isPopVisible={this.state.isPopVisible}
                                        headerText={Strings.session.confirmationTitle}
                                        descriptionText={Strings.popUpMessage.bookSession.desc}
                                        rightButtonText={Strings.session.yes}
                                        leftButtonText={Strings.session.no}
                                        rightButtonOnPress={async () => {
                                            this.setState({ isPopVisible: false })
                                            if (!this.state.isReschedule) {
                                                this.bookSessionApiHandler()
                                            } else {
                                                this.rescheduleSessionApiHandler()
                                            }

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
                            {/* </View> */}
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
                    buttonText={Strings.slotBooking.requestBooking}
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


    bookSessionApiHandler = async () => {
        if (!this.formValidation()) {
            return
        }



        if (this.props.route.params.images.length == 0) {
            NetworkManager.networkManagerInstance.progressBarRequest(true)
            let params = await this.getParams()
            const res = await NetworkManager.networkManagerInstance.fetchRequest(URL.bookSession, URL.postRequest, true, params, () => this.bookSessionApiHandler())
            if (res.statusCode == 200) {
                NetworkManager.networkManagerInstance.progressBarRequest(false)
                this.props.navigation.navigate('SuccessScreen')
            } else {
                showToast(res.message)
                NetworkManager.networkManagerInstance.progressBarRequest(false)
                console.log('BOOKING FAILED')
            }
        } else {
            NetworkManager.networkManagerInstance.progressBarRequest(true)
            let formdata = await this.getParams()
            const res = await NetworkManager.networkManagerInstance.fetchMultiPartRequest(URL.bookSession, URL.postRequest, formdata, true, () => this.bookSessionApiHandler())
            if (res.statusCode == 200) {
                NetworkManager.networkManagerInstance.progressBarRequest(false)
                this.props.navigation.navigate('SuccessScreen')
            } else {
                showToast(res.message)
                NetworkManager.networkManagerInstance.progressBarRequest(false)
                console.log('BOOKING FAILED')
            }
        }


    }


    rescheduleSessionApiHandler = async () => {
        if (!this.formValidation()) {
            return
        }


        let params = await this.getParams()
        params.id = this.props.route.params.data._id
        if (this.props.route.params.images.length == 0) {
            NetworkManager.networkManagerInstance.progressBarRequest(true)

            const res = await NetworkManager.networkManagerInstance.fetchRequest(URL.rescheduleSession, URL.postRequest, true, params, () => this.rescheduleSessionApiHandler())
            if (res.statusCode == 200) {
                showToast(res.message)
                NetworkManager.networkManagerInstance.progressBarRequest(false)
                this.props.navigation.navigate('SuccessScreen')
            } else {
                showToast(res.message)
                NetworkManager.networkManagerInstance.progressBarRequest(false)
                console.log('BOOKING FAILED')
            }
        } else {
            NetworkManager.networkManagerInstance.progressBarRequest(true)
            let formdata = await this.getParams()
            formdata.append('id', this.props.route.params.data._id)
            const res = await NetworkManager.networkManagerInstance.fetchMultiPartRequest(URL.rescheduleSession, URL.postRequest, formdata, true, () => this.rescheduleSessionApiHandler())
            if (res.statusCode == 200) {
                showToast(res.message)
                NetworkManager.networkManagerInstance.progressBarRequest(false)
                this.props.navigation.navigate('SuccessScreen')
            } else {
                showToast(res.message)
                NetworkManager.networkManagerInstance.progressBarRequest(false)
                console.log('BOOKING FAILED')
            }
        }


    }


    getBiddingPriceApiHandler = async () => {
        console.log('BOOKING FAILED')

        let params = {}

        params.country = Session.sharedInstance.countryName
        params.education = this.props.route.params.education
        params.grade = this.props.route.params.grades
        params.subject = this.props.route.params.subject

        console.log('BOOKING FAILED')
        const res = await NetworkManager.networkManagerInstance.fetchRequest('tutor/getBiddingPrice', URL.postRequest, true, params, () => this.getBiddingPriceApiHandler())
        if (res.statusCode == 200) {
            if (res.data != {} || res.data)
                this.setState({ max: res.data.max_amt, min: res.data.min_amt })
            else
                showToast("Budget range not available")
        } else {
            showToast(res.message)
            console.log('getBiddingPriceApiHandler FAILED')
        }

    }


    formValidation() {

        if (!Utility.sharedInstance.validateEmptyField(this.state.timeStamp.toString(), String.toastMsgs.slotBookingToastMsgs.enterDate)) {
            return
        }

        if (!Utility.sharedInstance.validateEmptyField(this.state.start_time.toString(), String.toastMsgs.slotBookingToastMsgs.enterTime)) {
            return
        }

        if (!Utility.sharedInstance.validateEmptyField(this.state.budget.toString(), String.toastMsgs.slotBookingToastMsgs.enterBudget)) {
            return
        }

        if (!this.isUrgetnBooking()) {
            return
        }

        if (this.state.min != undefined && this.state.max != undefined)
            if (!(parseInt(this.state.min) <= parseInt(this.state.budget) && parseInt(this.state.max) >= parseInt(this.state.budget))) {
                showToast(`For this education minimum budget should be ` + `${this.state.min} ` + `and maximum budget is ` + ` ${this.state.max}`)
                return
            }




        return true
    }


    isUrgetnBooking() {

        if (this.state.urgent_booking == true) {
            let now = moment(new Date()); //todays date
            let stillUtc = moment.utc(this.state.timeStamp).toDate();
            var timeStampLocal = moment(stillUtc).local()
            // .local().format('YYYY-MM-DD HH:mm:ss');
            console.log("this.state.timeStamp===>>>>   " + timeStampLocal)

            // let timeStamp = moment.utc(date).toDate()
            let duration = moment.duration(moment(timeStampLocal).diff(now.local()));
            let hours = duration.hours();
            console.log("this.state.urgent_booking===>>CHECK" + hours)
            if (hours < 3) {
                showToast('Sorry! You can book the session on an immediate basis at least 3 hours prior to the session timing.')
                return false
            }
            return true
        } else {
            return true
        }
    }

    async getParams() {




        if (this.props.route.params.images.length == 0) {
            let data = {}
            data.student_id = Session.sharedInstance.userDetails[Constant.userDetailsFields._id]
            data.country = Session.sharedInstance.countryName
            data.education = this.props.route.params.education
            data.grade = this.props.route.params.grades
            data.subjects = this.props.route.params.subject
            data.topic = this.props.route.params.topic
            data.description = this.props.route.params.description
            data.timestamp = moment.utc(this.state.timeStamp).toDate()
            data.budget = parseInt(this.state.budget) + ''
            if (this.state.selectedRating != '') {
                data.star_rating = parseInt(this.state.selectedRating)
            }
            data.urgent_booking = this.state.urgent_booking + ''
            data.currency = Session.sharedInstance.countryCodeObj.currency_symbol
            data.map = JSON.stringify({
                "type": "Point",
                "coordinates": [
                    0, 1
                ]
            })
            data.commission_type = this.state.isReschedule ? Constants.commisionType.reschedule : Constants.commisionType.bookings
            data.claim_free_session = this.state.claimFreeSession + ''
            data.start_time = this.state.start_time
            data.end_time = this.state.end_time
            data.time_unit = this.state.time_unit

            return data
        } else {

            let date = new Date()
            let formdata = new FormData()
            formdata.append('student_id', Session.sharedInstance.userDetails[Constant.userDetailsFields._id])
            formdata.append('country', Session.sharedInstance.countryName)
            formdata.append('education', this.props.route.params.education)
            formdata.append('grade', this.props.route.params.grades)
            formdata.append('subjects', this.props.route.params.subject)
            formdata.append('topic', this.props.route.params.topic)
            formdata.append('description', this.props.route.params.description + '')
            formdata.append('timestamp', moment.utc(this.state.timeStamp).toDate() + '')
            formdata.append('budget', parseInt(this.state.budget) + '')
            if (this.state.selectedRating != '') {
                formdata.append('star_rating', parseInt(this.state.selectedRating) + '')
            }

            formdata.append('urgent_booking', this.state.urgent_booking + '')
            formdata.append('currency', Session.sharedInstance.countryCodeObj.currency_symbol)
            formdata.append("map", "{\"type\":\"Point\",\"coordinates\":[0,1]}");

            formdata.append('commission_type', this.state.isReschedule ? Constants.commisionType.reschedule : Constants.commisionType.bookings)
            formdata.append('claim_free_session', this.state.claimFreeSession + '')
            formdata.append('start_time', this.state.start_time + "")
            formdata.append('end_time', this.state.end_time + "")
            formdata.append('time_unit', this.state.time_unit)



            this.props.route.params.images.forEach((item, i) => {

                let newFile = {
                    uri: this.isValidURL(item) ? item : item.uri,
                    type: "image/jpg",
                    name: `${Math.floor(date.getTime() + (date.getSeconds() / 2))}.jpg`,
                }

                formdata.append("image_urls[]", newFile);
            });

            return formdata
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

};


export default SlotBooking;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Color.textColor.pentaColor
    },
});
