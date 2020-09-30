import React, { Component } from 'react';
import { View, TouchableOpacity, StyleSheet, FlatList, Text, BackHandler, Image, ScrollView, Keyboard } from 'react-native'
import { SafeAreaComponent, CommonHeader, AppTextComp, AppButton, RangeDatePickerComponent, CommonDropDown } from '../../components';
import { Strings, Dimen, Color, Constant, Assets } from '../../../res/index';
import { NetworkManager } from '../../utils/index';
import Modal from 'react-native-modal';
import URL from '../../../res/URL';
import Session from '../../utils/Session';
import ActiveSessionsListItem from "../session/ActiveSessionsListItem";
import Drawer from 'react-native-drawer'
// import DatepickerRange from 'react-native-range-datepicker';
import Dates from 'react-native-dates';
import Utility, { showToast } from '../../utils/Utility';
import { PlaceholderComponent } from '../../components/PlaceholderComponent';
let moment = require('moment')


class StudentBookingList extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            activeSessionList: [],
            skip: 0,
            datePickerVisible: false,
            isModalshow: false,
            startDate: '',
            endDate: '',
            dateRange: '',
            status: '',
            subject: '',
            selectedSubject: '',
            urgent_booking: false,
            data: [],
            dropdown: false,
            // status: ['Active'],
            dropdownHeader: '',
            selectedStatus: '',
            allSubjects: [],
            status: [
                { filter: 'Active', value: ['Active'] },
                { filter: 'Applied', value: ['Upcoming'] },
                { filter: 'Scheduled', value: ['Ongoing', 'Started',], },
                { filter: 'Completed', value: ['Completed'] },
                { filter: 'Cancelled', value: ['Cancelled'] },
            ],
        }
    }



    async componentDidMount() {
        await this.activeSessionApiHandler(this.state.skip)
        BackHandler.addEventListener('hardwareBackPressScanning', this.handleBackButtonClick);
    }

    async componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPressScanning', () => { });
    }


    handleBackButtonClick = async () => {
        if (this.state.isFilterOpen) {
            this.setState({ isFilterOpen: false })
            this.closeControlPanel()
            return false
        } else {
            this.props.navigation.goBack()
        }
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

    cancelModal = () => {
        this.setState({ isModalshow: false, })
    }


    isModalVisible() {
        return (
            <View style={{ width: '100%' }}>

                <Modal isVisible={this.state.isModalshow} style={{ marginHorizontal: 0, justifyContent: 'flex-end', marginBottom: 0 }} hasBackdrop={true} onBackButtonPress={this.cancelModal} coverScreen={true} onBackdropPress={this.cancelModal} >

                    <View style={{ height: 350, width: '100%', backgroundColor: 'white', borderColor: 'white' }}>

                        <View style={{ flex: 0.1, flexDirection: 'row', }}>
                            <View style={{ flex: 0.33 }}></View>
                            <View style={{ flex: 0.33, alignItems: 'center' }}>
                                <Text style={{ height: 53, fontSize: 18, color: '#0B61AF', paddingTop: 13 }}>FILTER</Text>
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
                                }}>

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
                                        dropdownHeader: Constant.searchAPITerms.subjects, dropdown: true, search_term: Constant.searchAPITerms.subjects, isModalshow: false

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
                                        dropdownHeader: Strings.activeSessions.status, search_term: Strings.activeSessions.status, isModalshow: false, data: this.state.status.map(obj => obj.filter)
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

    render() {
        const { startDate, endDate, displayedDate } = this.state;






        return (


            <SafeAreaComponent
                StatusBarTextColor={'light-content'}
                color={Color.textColor.pentaColor}
            >

                <View style={{ flex: 1 }}>
                    <View style={{ flex: 0.13, backgroundColor: Color.textColor.pentaColor, }}>
                        <CommonHeader
                            containerStyle={{ marginHorizontal: '3%', paddingTop: 15 }}
                            headerTrue={Strings.studentBookList.screenHeader}
                            headerTitleFontsize={Dimen.mediumTextSize}
                            headerTitleColor={Color.secondayTextColor}
                            headerTtileFontWieght={'700'}
                            headerTitleFontsize={16}
                            leftIconStyle={{ tintColor: Color.secondayTextColor }}
                            rightIcon={Assets.studentBookingList.filterIcon}
                            rightIconPress={() => {
                                this.setState({ isModalshow: true })

                            }}
                        />
                    </View>

                    <View style={{ flex: 0.87, marginBottom: -60, top: -20, paddingBottom: '13%', borderTopLeftRadius: 20, borderTopRightRadius: 20, width: '100%', backgroundColor: Color.secondayTextColor }}>
                        {this.state.activeSessionList.length == 0 && this.placeholder()}
                        {this.state.activeSessionList.length > 0 && <FlatList
                            style={{ marginTop: 10 }}
                            data={this.state.activeSessionList}
                            // refreshControl={
                            //     <RefreshControl
                            //         refreshing={this.state.refreshing}
                            //         onRefresh={this._onRefresh}
                            //         tintColor={colors.primaryColor}
                            //     />
                            // }      
                            showsVerticalScrollIndicator={false}
                            // initialNumToRender={20}
                            // onEndReachedThreshold={20}
                            // onEndReached={() => {
                            //     this.handleLoadMore()
                            // }}
                            onEndReachedThreshold={0.1}

                            renderItem={({ item }) =>
                                <TouchableOpacity
                                    // onPress={() =>
                                    //     this.props.navigation.navigate(constants.router.EventDetails, { item } = { item })
                                    // }
                                    activeOpacity={0.5}
                                >
                                    <ActiveSessionsListItem item={item} />
                                </TouchableOpacity>
                            }
                            keyExtractor={item => item._id}
                        />}
                    </View>
                </View>
                {
                    this.state.datePickerVisible && <RangeDatePickerComponent
                        onChange={this.onChange}
                    />
                }
                {this.isModalVisible()}

                {
                    this.state.dropdown != "" && this.state.data.length > 0 && <CommonDropDown
                        isModalshow={this.state.dropdown}
                        cancelModal={() => this.setState({ dropdown: false, data: "" })}
                        data={this.state.data}
                        getCountry={this.updateData}
                        dropdownHeader={this.state.dropdownHeader}
                        listItemField={'value'}
                    />
                }
            </SafeAreaComponent >

        )
    };


    // handleLoadMore = () => {
    //     if (this.state.currentPage <= this.state.total_page) {
    //         this.setState({ currentPage: this.state.currentPage + 1 }, () => { this.props.events(this.state.currentPage) })

    //     }
    // }



    setStatusData = async () => {
        setTimeout(() => {
            this.setState({ data: this.state.status.map(obj => obj.filter), dropdown: true, })

        }, 500);

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


    placeholder() {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>

                <PlaceholderComponent
                    containerStyle={{ borderTopRightRadius: 20, borderTopLeftRadius: 20 }}
                    placeHolderImage={Assets.homeScreen.no_session_illust}
                    placeholderHeader={this.state.activeSessionList.length == 0 ? Strings.bookingList.noSessionBookedYet : ''}
                    placeholderMessage={this.state.activeSessionList.length == 0 ? '' : ''}
                />
            </View>

        )
    }

    updateData = (item, isdropdownVisible) => {

        if (this.state.dropdownHeader.localeCompare(Strings.activeSessions.status) === 0) {
            this.setState({
                dropdown: isdropdownVisible,
                selectedStatus: item,
                search_term: Strings.activeSessions.status,
                data: '',
                isModalshow: true
            });
        } else {
            this.setState({
                dropdown: isdropdownVisible,
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
        data.student_id = Session.sharedInstance.userDetails[Constant.userDetailsFields._id]
        try {
            const res = await NetworkManager.networkManagerInstance.fetchRequest(URL.studentGetSubjects, URL.postRequest, true, data, () => { this.dropDownLoader() });
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
        // if (data.length > 1)
        data.push('All')
        this.setState({ data: [...data], allSubjects: this.getSubjects(res) })
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
        this.setState({ isModalshow: false })
        NetworkManager.networkManagerInstance.progressBarRequest(true)



        let data = {}
        data.student_id = Session.sharedInstance.userDetails[Constant.userDetailsFields._id]
        data.skip = this.state.skip
        data.limit = 20
        data.status = this.state.status.filter(obj => obj.filter == this.state.selectedStatus)[0].value
        data.subjects = this.state.selectedSubject == 'All' ? this.state.allSubjects : [this.state.selectedSubject]
        data.from_date = moment(this.state.startDate).format('YYYY-MM-DD')
        data.to_date = moment(this.state.endDate).format('YYYY-MM-DD')


        try {
            const res = await NetworkManager.networkManagerInstance.fetchRequest(URL.getStudentSessions, URL.postRequest, true, data, () => { this.applyFiltersApiHandler() });
            if (res.statusCode === 200) {
                NetworkManager.networkManagerInstance.progressBarRequest(false)
                this.setState({ activeSessionList: res.data, isModalshow: false })
            } else {
                this.setState({ isModalshow: false })
                this.setState({ activeSessionList: [], isModalshow: false })
                NetworkManager.networkManagerInstance.progressBarRequest(false)
            }
        } catch (error) {
            this.setState({ activeSessionList: [], isModalshow: true })

            NetworkManager.networkManagerInstance.progressBarRequest(false)
            console.log("GET TUTOR SUBJECTS API FAILED " + error)
        }
    }

    activeSessionApiHandler = async (skips) => {
        NetworkManager.networkManagerInstance.progressBarRequest(true)
        try {
            let data = {}
            data = {
                "student_id": Session.sharedInstance.userDetails[Constant.userDetailsFields._id],
                "status": [
                    Constant.sessionType.completed, Constant.sessionType.active, Constant.sessionType.upcoming, Constant.sessionType.onGoing, Constant.sessionType.started
                ],
                "skip": 0,
                "limit": 200
            }
            const res = await NetworkManager.networkManagerInstance.fetchRequest(URL.getSessions, URL.postRequest, true, data, () => this.activeSessionApiHandler())
            if (res.statusCode == 200) {
                if (__DEV__) console.log('JSON.stringify(res.data)' + JSON.stringify(res.data))
                this.setState({ activeSessionList: [...res.data.result, ...this.state.activeSessionList] })
                NetworkManager.networkManagerInstance.progressBarRequest(false)
            } else {
                NetworkManager.networkManagerInstance.progressBarRequest(false)
            }
        } catch (error) {
            NetworkManager.networkManagerInstance.progressBarRequest(false)
            if (__DEV__) console.log(error)
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



export default StudentBookingList;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Color.textColor.pentaColor
    },
});
const drawerStyles = { drawer: { shadowColor: 'grey', shadowOpacity: 0.2, shadowRadius: 3 }, main: { paddingLeft: 3 } }