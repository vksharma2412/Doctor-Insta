import React, { Component } from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet, KeyboardAvoidingView, ScrollView, TouchableWithoutFeedback, Keyboard, Image, Dimensions, ImageBackground } from 'react-native'
import { CommonHeader, SafeAreaComponent, AppButton, RangeDatePickerComponent, AppTextComp, CommonDropDown } from '../../components';
import { Color, Dimen, Strings, Assets, Constant, URL } from '../../../res';
import Constants from '../../../res/Constants';
import String from '../../../res/String';
import ActiveSessionsListItem from "../session/ActiveSessionsListItem";
import Session from '../../utils/Session';
import { NetworkManager, Utility } from '../../utils';
import Modal from 'react-native-modal';
import DeviceInfo from 'react-native-device-info';
import { PlaceholderComponent } from '../../components/PlaceholderComponent';
let moment = require('moment')





class MyManageSessions extends Component {

    constructor(props) {
        super(props)
        this.state = {
            manageSessionList: [],
            skip: 0,
            datePickerVisible: false,
            isModalshow: false,
            startDate: '',
            endDate: '',
            dateRange: '',
            subject: '',
            selectedSubject: '',
            urgent_booking: false,
            data: [],
            dropdown: false,
            // status: ['Upcoming', 'Ongoing', 'Started', 'Completed', 'Cancelled'],
            dropdownHeader: '',
            selectedStatus: '',
            allSubjects: [],
            getHeaderIndex: 0,
            status: [{ filter: 'Applied', value: ['Upcoming'] },
            { filter: 'Scheduled', value: ['Ongoing', 'Started',], },
            { filter: 'Completed', value: ['Completed'] },
            { filter: 'Cancelled', value: ['Cancelled'] },
            ]
        }
    }

    componentDidMount() {

        this.didSubscribe = this.props.navigation.addListener('focus', async () => {
            await this.manageSessionApiHandler()
        });
    }



    render() {

        return (

            <SafeAreaComponent
                color={Color.textColor.pentaColor}
                StatusBarTextColor={'light-content'}
            >

                <View style={{ flex: 1, height: Dimen.phoneHeight, borderTopRightRadius: 20, height: Dimen.phoneHeight, width: '100%', backgroundColor: Color.secondayTextColor }}>

                    <View style={{ flex: 0.15, backgroundColor: Color.textColor.pentaColor, }}>
                        <CommonHeader
                            backImage={Assets.homeScreen.side_menu_icon}
                            onPress={() => this.props.navigation.openDrawer()}
                            containerStyle={{ marginHorizontal: '3%', paddingTop: 15 }}
                            headerTrue={Strings.bookingSession.mangesession}
                            headerTitleFontsize={Dimen.mediumTextSize}
                            headerTitleColor={Color.secondayTextColor}
                            headerTtileFontWieght={'700'}
                            headerTitleFontsize={16}
                            leftIconStyle={{ tintColor: Color.secondayTextColor }}
                            rightIcon={!Session.sharedInstance.isStudent && Session.sharedInstance.userDetails[Constant.userDetailsFields.isVerified] ? Assets.studentBookingList.filterIcon : undefined}
                            rightIconPress={() => {
                                this.setState({ isModalshow: true })
                            }}
                        />
                    </View>
                    <View style={{ flex: 0.85, top: -20, borderTopLeftRadius: 20, borderTopRightRadius: 20, height: Dimen.phoneHeight, width: '100%', backgroundColor: Color.secondayTextColor, alignItems: 'center' }}>
                        <View style={{
                            flex: 0.1,
                            flexDirection: 'column',
                            marginTop: 20,
                        }}>
                            <FlatList
                                horizontal={true}
                                contentContainerStyle={{ paddingRight: 25 }}
                                showsHorizontalScrollIndicator={false}
                                data={this.state.status}
                                keyExtractor={(result) => result.key}
                                renderItem={({ item, index }) => {
                                    return (
                                        <TouchableOpacity
                                            style={{ paddingHorizontal: DeviceInfo.isTablet() ? 50 : 0 }}
                                            activeOpacity={0.8}
                                            onPress={() => this.setState({ getHeaderIndex: index, selectedStatus: this.state.status[index].filter }, () => {
                                                this.manageSessionApiHandler()
                                            })}>
                                            <View style={{
                                                marginTop: 10,
                                                height: 35,
                                                margin: 8,
                                                borderColor: this.state.getHeaderIndex == index ? '#0C61AF' : Color.secondayTextColor,
                                                borderWidth: 1,
                                                shadowOffset: { width: 0, height: 1 },
                                                shadowOpacity: Platform.OS == "android" ? 1 : .3,
                                                shadowRadius: Platform.OS == "android" ? 10 : 5,
                                                borderRadius: 19,
                                                elevation: this.state.getHeaderIndex == index ? 5 : 1,
                                                marginHorizontal: 20,
                                                backgroundColor: this.state.getHeaderIndex == index ? '#E5EEF6' : Color.secondayTextColor,
                                                flexDirection: 'column',
                                                justifyContent: 'center',
                                                alignItems: 'center',
                                                width: '90%',
                                            }}>
                                                <View style={{ height: 35, width: 85, justifyContent: 'center' }}>
                                                    <Text style={{ fontSize: 14, textAlign: 'center', color: this.state.getHeaderIndex == index ? '#0B61AF' : Color.textColor.quarternary }}>{item.filter}</Text>
                                                </View>
                                            </View>
                                        </TouchableOpacity>)
                                }} />
                        </View>
                        {this.state.manageSessionList == 0 && this.placeholder()}
                        {this.state.manageSessionList.length > 0 && this.overallStatus(this.state.manageSessionList)}
                    </View>
                    {this.isModalVisible()}
                </View>
                {this.state.datePickerVisible && <RangeDatePickerComponent
                    onChange={this.onChange}
                />}
                {this.state.dropdown != "" && this.state.data.length > 0 && <CommonDropDown
                    isModalshow={this.state.dropdown}
                    cancelModal={() => this.setState({ dropdown: false, data: "" })}
                    data={this.state.data}
                    getCountry={this.updateData}
                    dropdownHeader={this.state.dropdownHeader}
                    listItemField={'value'}
                />}


            </SafeAreaComponent>



        )
    };



    placeholder() {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>

                <PlaceholderComponent
                    containerStyle={{ borderTopRightRadius: 20, borderTopLeftRadius: 20 }}
                    placeHolderImage={Assets.homeScreen.no_session_illust}
                    placeholderHeader={this.state.manageSessionList.length == 0 ? Strings.bookingList.noSessionBookedYet : ''}
                    placeholderMessage={this.state.manageSessionList.length == 0 ? '' : ''}
                />
            </View>

        )
    }

    overallStatus(lists) {

        return (
            <View style={{ flex: 0.99, width: '100%', marginTop: 20 }}>
                <FlatList
                    contentContainerStyle={{ flexGrow: 1, width: '100%' }}
                    showsHorizontalScrollIndicator={false}
                    data={lists}
                    renderItem={({ item }) =>
                        <ActiveSessionsListItem item={item}
                            navifationFrom={'ManageSession'}

                        />


                    }
                />
            </View>
        )
    }

    manageSessionApiHandler = async (skip) => {
        let data = {}
        data.skip = this.state.skip
        data.limit = 20
        data.tutor_id = Session.sharedInstance.userDetails[Constants.userDetailsFields._id]
        data.status = this.state.status.filter((obj => obj.filter == this.state.selectedStatus))[0].value

        const res = await NetworkManager.networkManagerInstance.fetchRequest(URL.tutorManageSession, URL.postRequest, true, data, () => this.manageSessionApiHandler())
        if (res.statusCode == 200) {
            if (__DEV__) console.log("sessiondetails", JSON.stringify(res))
            this.setState({ manageSessionList: res.data })
        } else {
            console.log('BOOKING FAILED')
        }
    }



    isModalVisible() {
        return (
            <View style={{ width: '100%' }}>

                <Modal isVisible={this.state.isModalshow} style={{ marginHorizontal: 0, justifyContent: 'flex-end', marginBottom: 0 }} hasBackdrop={true} onBackButtonPress={this.cancelModal} coverScreen={true} onBackdropPress={this.cancelModal} >

                    <View style={{ height: 350, width: '100%', backgroundColor: 'white', borderColor: 'white' }}>

                        <View style={{ flex: 0.1, flexDirection: 'row', }}>
                            <View style={{ flex: 0.33 }}></View>
                            <View style={{ flex: 0.33, alignItems: 'center' }}>
                                <Text style={{ height: 53, fontSize: 18, color: '#007bfd', paddingTop: 13 }}>FILTERS</Text>
                            </View>
                            <View style={{ flex: 0.33, }}>
                                <TouchableOpacity style={{ alignItems: 'flex-end', justifyContent: 'center', paddingRight: 15 }}
                                    onPress={() => { this.setState({ dateRange: '', selectedSubject: '', selectedStatus: '', urgent_booking: '' }) }}>
                                    <Text style={{ height: 53, fontSize: 14, color: Color.textColor.pentaColor, paddingTop: 20 }}>RESET</Text>
                                </TouchableOpacity>
                            </View>
                        </View>

                        <View style={{ flex: 0.9, marginHorizontal: 15, justifyContent: 'space-around' }}>

                            <TouchableOpacity
                                style={{ paddingTop: 10, width: '100%', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderBottomWidth: 1, borderBottomColor: Color.borderColor.primaryColor }}
                                onPress={() => {
                                    this.setState({ datePickerVisible: true, isModalshow: false })
                                }}
                            >

                                <AppTextComp
                                    value={this.state.dateRange}
                                    onChangeText={(text) => this.setState({ selectedSubject: this.state.dateRange })}
                                    placeholder={Strings.bookingList.dates}
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
                                style={{ paddingTop: 10, width: '100%', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderBottomWidth: 1, borderBottomColor: Color.borderColor.primaryColor }}
                                onPress={() => {
                                    this.setState({
                                        dropdownHeader: Constant.searchAPITerms.subjects, dropdown: true, search_term: String.activeSessions.status, isModalshow: false
                                    }, () => {
                                        this.dropDownLoader()
                                    })
                                }}
                            >

                                <AppTextComp
                                    // style={{ backgroundColor: 'red' }}
                                    value={this.state.selectedSubject}
                                    onChangeText={(text) => this.setState({ selectedSubject: this.state.selectedSubject })}
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

                            <TouchableOpacity
                                style={{ paddingTop: 10, width: '100%', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderBottomWidth: 1, borderBottomColor: Color.borderColor.primaryColor }}
                                onPress={() => {
                                    this.setState({
                                        dropdownHeader: String.activeSessions.status, search_term: String.activeSessions.status, isModalshow: false, data: this.state.status.map(obj => obj.filter)

                                    }, () => {
                                        this.setStatusData()
                                    })
                                }}>
                                <AppTextComp
                                    // style={{ backgroundColor: 'red' }}
                                    value={this.state.selectedStatus}
                                    onChangeText={(text) => this.setState({ selectedSubject: this.state.selectedStatus })}
                                    placeholder={Strings.bookingList.status}
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
                            <View
                                style={{ height: 60, flexDirection: 'row', alignItems: 'center' }}>
                                <Text style={{ fontSize: 16, color: Color.textColor.quarternary, paddingRight: 40 }}>{Strings.session.urgentBooking}</Text>
                                <TouchableOpacity
                                    onPress={() => { this.setState({ urgent_booking: !this.state.urgent_booking }) }}>
                                    <Image style={{ width: 24, height: 24 }} source={this.state.urgent_booking ? Assets.session.checked : Assets.session.unchecked}></Image>
                                </TouchableOpacity>
                            </View>

                            <AppButton
                                buttonStyle={{ alignSelf: 'center', width: '90%', marginBottom: 20, backgroundColor: Color.appBackgroundColor, borderColor: Color.buttonColor.enableButton, borderWidth: 1, borderRadius: 25, }}
                                onPress={this.applyFiltersApiHandler}
                                isEnabled={true}
                                // buttonText={Strings.bidList.rejectBid}
                                camelCaseText={Strings.bookingList.applyFilter}
                                isUpperCase={true}
                                buttonTextStyle={{ color: Color.buttonColor.enableButton, fontSize: 14 }}
                            />
                        </View>
                    </View>
                </Modal>
            </View>
        )
    }

    setStatusData = async () => {
        setTimeout(() => {
            this.setState({ data: this.state.status.map(obj => obj.filter), dropdown: true })
            // alert(this.state.data)
        }, 1000);

    }
    cancelModal = () => {
        this.setState({ isModalshow: false })
    }


    onChange = (startDate, endDate = null) => {
        if (endDate != null) {
            let dateRange = moment(startDate).format('DD MMM YYYY') + '-' + moment(endDate).format('DD MMM YYYY')
            this.setState({ startDate: startDate, endDate: endDate, dateRange: dateRange, isModalshow: true, datePickerVisible: false });
        } else {
            let dateRange = moment(startDate).format('DD MMM YYYY') + '-' + moment(endDate).format('DD MMM YYYY')
            this.setState({ startDate: startDate, endDate: endDate, dateRange: dateRange });
        }


    }


    updateData = (item, isdropdownVisible) => {

        if (this.state.dropdownHeader.localeCompare(String.activeSessions.status) === 0) {
            this.setState({
                dropdown: false,
                selectedStatus: item,
                search_term: String.activeSessions.status,
                data: '',
                isModalshow: true
            });
        } else {
            this.setState({
                dropdown: false,
                selectedSubject: item,
                search_term: Constant.searchAPITerms.subjects,
                data: '',
                isModalshow: true
            });
        }
    }


    dropDownLoader = async () => {
        NetworkManager.networkManagerInstance.progressBarRequest(true)

        let data = {}
        data.tutor_id = Session.sharedInstance.userDetails[Constant.userDetailsFields._id]
        try {
            const res = await NetworkManager.networkManagerInstance.fetchRequest(URL.getAllTutorSubjects, URL.postRequest, true, data, () => { this.dropDownLoader() });
            if (res.statusCode === 200) {
                NetworkManager.networkManagerInstance.progressBarRequest(false)
                await this.loadingDropdownData(res.data)
            } else {
                this.setState({ isModalshow: true })
                NetworkManager.networkManagerInstance.progressBarRequest(false)
            }
        } catch (error) {
            this.setState({ isModalshow: true })
            NetworkManager.networkManagerInstance.progressBarRequest(false)
            console.log("GET TUTOR SUBJECTS API FAILED " + error)
        }
    }

    loadingDropdownData = async (res) => {

        let data = this.getSubjects(res)
        data.push('All')
        this.setState({ data: data, allSubjects: this.getSubjects(res) }, () => this.state.data)
    }

    getSubjects(res) {
        let data = []
        for (let index = 0; index < res.length; index++) {
            const temp = res[index]._id.subjects;
            data.push(temp)

        }
        return data
    }


    applyFiltersApiHandler = async () => {

        if (!this.formValidation()) {
            return
        }
        NetworkManager.networkManagerInstance.progressBarRequest(true)



        let data = {}
        data.tutor_id = Session.sharedInstance.userDetails[Constant.userDetailsFields._id]
        data.skip = this.state.skip
        data.limit = 20
        data.status = this.state.status.filter(obj => obj.filter == this.state.selectedStatus)[0].value
        data.subjects = this.state.selectedSubject == 'All' ? this.state.allSubjects : [this.state.selectedSubject]
        data.from_date = moment(this.state.startDate).format('YYYY-MM-DD')
        data.to_date = moment(this.state.endDate).format('YYYY-MM-DD')
        if (this.state.urgent_booking == true) {
            data.urgent_booking = this.state.urgent_booking
        } else {
            data.urgent_booking = false
        }
        try {
            const res = await NetworkManager.networkManagerInstance.fetchRequest(URL.tutoFilterSession, URL.postRequest, true, data, () => { this.applyFiltersApiHandler() });
            if (res.statusCode === 200) {
                NetworkManager.networkManagerInstance.progressBarRequest(false)
                this.setState({ manageSessionList: res.data, isModalshow: false, getHeaderIndex: this.state.status.findIndex((element) => element.filter == this.state.selectedStatus) })
            } else {
                this.setState({ isModalshow: true })
                NetworkManager.networkManagerInstance.progressBarRequest(false)
            }
        } catch (error) {
            this.setState({ isModalshow: true })
            NetworkManager.networkManagerInstance.progressBarRequest(false)
            console.log("GET TUTOR SUBJECTS API FAILED " + error)
        }
    }


    formValidation = () => {

        if (!Utility.sharedInstance.validateEmptyField(this.state.dateRange, 'Please select Date')) {
            return false
        }
        if (!Utility.sharedInstance.validateEmptyField(this.state.selectedSubject, 'No Subject Found')) {
            return false
        }
        if (!Utility.sharedInstance.validateEmptyField(this.state.selectedStatus, 'Please select status'))
            return false

        return true
    }




};

export default MyManageSessions;

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