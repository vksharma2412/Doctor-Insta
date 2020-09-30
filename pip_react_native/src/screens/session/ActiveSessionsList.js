import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet, FlatList, Image } from 'react-native'
import { SafeAreaComponent, CommonHeader, RangeDatePickerComponent, AppTextComp, AppButton, CommonDropDown } from '../../components';
import { Strings, Dimen, Color, Constant, Assets } from '../../../res/index';
import { NetworkManager, Utility } from '../../utils/index';
import URL from '../../../res/URL';
import Session from '../../utils/Session';
import ActiveSessionsListItem from "./ActiveSessionsListItem";
import Modal from 'react-native-modal';
import String from '../../../res/String';
import { PlaceholderComponent } from '../../components/PlaceholderComponent';
let moment = require('moment')


class ActiveSessionsList extends React.Component {

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
            status: ['Active'],
            dropdownHeader: '',
            selectedStatus: '',
            allSubjects: [],
        }
    }



    async componentDidMount() {
        await this.activeSessionApiHandler(this.state.skip)
    }




    render() {
        console.log('this.state.ti' + this.state.activeSessionList.length)
        return (
            <SafeAreaComponent
                StatusBarTextColor={'light-content'}
                color={Color.textColor.pentaColor}>
                <View style={{ flex: 1, }}>
                    <View style={{ flex: 0.15, backgroundColor: Color.textColor.pentaColor, }}>
                        <CommonHeader
                            containerStyle={{ marginHorizontal: '3%', paddingTop: 15 }}
                            headerTrue={this.props.route.params.headerName}
                            headerTitleFontsize={Dimen.mediumTextSize}
                            headerTitleColor={Color.secondayTextColor}
                            headerTtileFontWieght={'700'}
                            headerTitleFontsize={16}
                            leftIconStyle={{ tintColor: Color.secondayTextColor }}
                            rightIcon={!Session.sharedInstance.isStudent && Session.sharedInstance.userDetails[Constant.userDetailsFields.isVerified] ? Assets.studentBookingList.filterIcon : undefined}
                            rightIconPress={() => {
                                this.setState({ isModalshow: true })
                            }} />
                    </View>
                    <View style={{ flex: 0.85, marginBottom: -60, top: -20, paddingBottom: '13%', borderTopLeftRadius: 20, borderTopRightRadius: 20, width: '100%', backgroundColor: Color.secondayTextColor }}>
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
                            initialNumToRender={20}
                            onEndReachedThreshold={20}
                            onEndReached={() => {
                                this.handleLoadMore()
                            }}
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
                    {this.isModalVisible()}
                </View>
                {this.state.datePickerVisible && <RangeDatePickerComponent
                    onChange={this.onChange} />}
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


    handleLoadMore = () => {
        if (this.state.currentPage <= this.state.total_page) {
            this.setState({ currentPage: this.state.currentPage + 1 }, () => { this.props.events(this.state.currentPage) })

        }
    }


    placeholder() {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>

                <PlaceholderComponent
                    containerStyle={{ borderTopRightRadius: 20, borderTopLeftRadius: 20 }}
                    placeHolderImage={Assets.homeScreen.no_session_illust}
                    placeholderHeader={this.state.activeSessionList.length == 0 ? 'No Session Found' : ''}
                    placeholderMessage={this.state.activeSessionList.length == 0 ? '' : ''}
                />
            </View>

        )
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
                                        dropdownHeader: Constant.searchAPITerms.subjects, dropdown: true, search_term: Constant.searchAPITerms.subjects, isModalshow: false

                                    }, () => {
                                        console.log("this.state.educaton" + this.state.education)
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
                                        dropdownHeader: String.activeSessions.status, search_term: String.activeSessions.status, isModalshow: false, data: this.state.status

                                    }, () => this.setStatusData())
                                }}
                            >

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
            this.setState({ data: this.state.status.map(obj => obj), dropdown: true })
            // alert(this.state.data)
        }, 1000);

    }

    cancelModal = () => {
        this.setState({ isModalshow: false })
    }


    onChange = (startDate, endDate = null) => {
        console.log(`Data changes to ${startDate} !=====> ${endDate}`);
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
                dropdown: isdropdownVisible,
                selectedStatus: item,
                search_term: String.activeSessions.status,
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
        // let data = await res.data.map((obj) => obj._id.subjects)
        // // console.log(JSON.stringify(data))
        // // res.data.forEach(element => {

        // // });
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
        console.log('this.state.startDate => ' + this.state.startDate)
        NetworkManager.networkManagerInstance.progressBarRequest(true)



        let data = {}
        data.tutor_id = Session.sharedInstance.userDetails[Constant.userDetailsFields._id]
        data.skip = this.state.skip
        data.limit = 20
        data.status = [this.state.selectedStatus]
        data.subjects = this.state.selectedSubject == 'All' ? this.state.allSubjects : [this.state.selectedSubject]
        data.from_date = moment(this.state.startDate).format('YYYY-MM-DD')
        data.to_date = moment(this.state.endDate).format('YYYY-MM-DD')
        data.urgent_booking = this.state.urgent_booking

        try {
            const res = await NetworkManager.networkManagerInstance.fetchRequest(URL.filterNewlyAddedSession, URL.postRequest, true, data, () => { this.applyFiltersApiHandler() });
            if (res.statusCode === 200) {
                NetworkManager.networkManagerInstance.progressBarRequest(false)
                this.setState({ activeSessionList: res.data, isModalshow: false })
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
    // applyFiltersApiHandler = async () => {
    //     console.log('this.state.startDate => ' + this.state.startDate)
    //     NetworkManager.networkManagerInstance.progressBarRequest(true)

    //     let data = {}
    //     data.tutor_id = Session.sharedInstance.userDetails[Constant.userDetailsFields._id]
    //     data.skip = this.state.skip
    //     data.limit = 20
    //     data.status = ['Active']
    //     data.subjects = ['Physics']
    //     data.from_date = moment(this.state.startDate).format('YYYY-MM-DD')
    //     data.to_date = moment(this.state.endDate).format('YYYY-MM-DD')
    //     data.urgent_booking = this.state.urgent_booking

    //     try {
    //         const res = await NetworkManager.networkManagerInstance.fetchRequest(URL.tutorFilterSession, URL.postRequest, true, data, () => { this.applyFiltersApiHandler() });
    //         if (res.statusCode === 200) {
    //             NetworkManager.networkManagerInstance.progressBarRequest(false)
    //             this.setState({ data: res.data })
    //         } else {
    //             this.setState({ isModalshow: true })
    //             NetworkManager.networkManagerInstance.progressBarRequest(false)
    //         }
    //     } catch (error) {
    //         this.setState({ isModalshow: true })
    //         NetworkManager.networkManagerInstance.progressBarRequest(false)
    //         console.log("GET TUTOR SUBJECTS API FAILED " + error)
    //     }
    // }

    activeSessionApiHandler = async (skips) => {



        NetworkManager.networkManagerInstance.progressBarRequest(true)

        try {
            let data = {}
            let api = ''
            data = {


                "skip": 0,
                "limit": 100
            }


            if (!Session.sharedInstance.isStudent && Session.sharedInstance.userDetails[Constant.userDetailsFields.isVerified]) {
                api = URL.newlyAddedSession
                data.tutor_id = Session.sharedInstance.userDetails[Constant.userDetailsFields._id]
            } else {
                api = URL.getSessions
                data.student_id = Session.sharedInstance.userDetails[Constant.userDetailsFields._id]
                data.status = [
                    Constant.sessionType.active, Constant.sessionType.upcoming
                ]
            }




            const res = await NetworkManager.networkManagerInstance.fetchRequest(api, URL.postRequest, true, data, () => this.activeSessionApiHandler())
            if (res.statusCode == 200) {
                if (__DEV__) console.log('JSON.stringify(res.data)' + JSON.stringify(res.data))
                if (!Session.sharedInstance.isStudent && Session.sharedInstance.userDetails[Constant.userDetailsFields.isVerified]) {
                    this.setState({ activeSessionList: [...res.data.Urgent, ...res.data.Active, ...this.state.activeSessionList] })

                } else {
                    this.setState({ activeSessionList: [...res.data.result, ...this.state.activeSessionList] })

                }
                NetworkManager.networkManagerInstance.progressBarRequest(false)
            } else {
                console.log(res.message)
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


export default ActiveSessionsList;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Color.textColor.pentaColor
    },
});
