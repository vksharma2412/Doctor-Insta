import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { ScrollView, Text, View, StyleSheet, Image, AsyncStorage, TouchableOpacity, NativeModules } from 'react-native';
import { SideMenuRow } from '../components/SideMenuRow';
import { connect } from "react-redux";
import { Color, Assets, Strings, URL, Constant, AsyncStorageValues } from '../../res';
import String from '../../res/String';
import Constants from '../../res/Constants';
import Session from '../utils/Session';
import { NavUtil, Utility, NetworkManager } from '../utils';
import { useNavigation } from '@react-navigation/native';
import { PopUp, SafeAreaComponent } from '../components';
import { TutorProfile } from '../screens';
import { showToast } from '../utils/Utility';


var ApplozicChat = NativeModules.ApplozicChat;



let session = Session.sharedInstance.userDetails




class SideDrawer extends Component {
    constructor(props) {
        super(props);

        this.state = {
            token: '',
            id: '',
            progressBar: false,
            isPopVisible: false,
            isStudent: null,
        }
    }



    componentDidMount() {
        this.setState({ isStudent: this.isEmptyField(Session.sharedInstance.userDetails, Constants.userDetailsFields.is_student) })
    }


    render() {
        return (
            <SafeAreaComponent
                StatusBarTextColor={'light-content'}
                color={Color.textColor.pentaColor}
            >
                <View style={styles.container}>
                    <View style={{ flex: 1.5, backgroundColor: Color.textColor.pentaColor }}>
                        <View style={{ flex: 2, flexDirection: 'row', alignItems: 'center', marginLeft: 10 }}>
                            <View style={{ flex: 2.5, }}>
                                <View
                                    style={{
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        width: 60,
                                        height: 60,
                                        backgroundColor: Color.secondayTextColor,
                                        borderRadius: 30,
                                        marginHorizontal: 10,
                                    }}>
                                    <Image
                                        source={this.isEmptyField(Session.sharedInstance.userDetails, Constants.userDetailsFields.profile_picture) ? { uri: this.isEmptyField(Session.sharedInstance.userDetails, Constants.userDetailsFields.profile_picture), cache: 'force-cache' } : Assets.studentRegistration.uploadProfile}
                                        style={{ width: 55, height: 55 }}
                                        borderRadius={27} >
                                    </Image>
                                </View>
                            </View>

                            <View style={{ flex: 7.5, flexDirection: "column", marginLeft: 10, }}>
                                <Text style={{ fontSize: 18, color: Color.secondayTextColor }}>{this.isEmptyField(Session.sharedInstance.userDetails, Constants.userDetailsFields.name)}</Text>
                                {Session.sharedInstance.isTutor && <Text style={{ fontSize: 14, color: Color.secondayTextColor }}>{this.isEmptyField(Session.sharedInstance.userDetails, Constants.userDetailsFields.tutoredu)}</Text>}
                                {!Session.sharedInstance.isTutor && <Text style={{ fontSize: 14, color: Color.secondayTextColor }}>{this.isEmptyField(Session.sharedInstance.userDetails, Constants.userDetailsFields.education)}</Text>}
                            </View>
                        </View>
                    </View>
                    <View style={{ flex: 8.5, backgroundColor: Color.secondayTextColor }}>
                        <ScrollView >
                            <SideMenuRow
                                source={Assets.sideDrawer.home_icon}
                                title={Strings.sideMenu.home}
                                onPress={() => {
                                    if (this.isEmptyField(Session.sharedInstance.userDetails, Constants.userDetailsFields.isVerified) == false && this.isStudent() == false) {
                                        this.screenChangeHandler(Constants.routeName.waitingForApproval)
                                    } else
                                        this.screenChangeHandler('HomeScreen')
                                }}
                            />

                            {this.isStudent() == true && <SideMenuRow
                                source={Assets.sideDrawer.my_tutors_icon}
                                title={Strings.sideMenu.myTutor}
                                onPress={() => this.screenChangeHandler('MyTutorListing')}
                            />}

                            {this.isStudent() == false && this.isEmptyField(Session.sharedInstance.userDetails, Constants.userDetailsFields.isVerified) == true && <SideMenuRow
                                source={Assets.sideDrawer.managesession}
                                title={Strings.sideMenu.managerSession}
                                onPress={() => {
                                    if (this.isEmptyField(Session.sharedInstance.userDetails, Constants.userDetailsFields.isVerified) == false) {
                                        this.screenChangeHandler(Constants.routeName.waitingForApproval)
                                    } else
                                        this.screenChangeHandler(Constants.routeName.myManagerSession)
                                }}
                            />}

                            {this.isStudent() == false && this.isEmptyField(Session.sharedInstance.userDetails, Constants.userDetailsFields.isVerified) == true && <SideMenuRow
                                source={Assets.sideDrawer.my_messages}
                                title={Strings.sideMenu.myMessaage}
                                onPress={() => {
                                    if (this.isEmptyField(Session.sharedInstance.userDetails, Constants.userDetailsFields.isVerified) == false && this.isStudent() == false) {
                                        this.screenChangeHandler(Constants.routeName.waitingForApproval)
                                    } else
                                        ApplozicChat.openChat()
                                }}
                            />}
                            {this.isStudent() == true && <SideMenuRow
                                source={Assets.sideDrawer.my_messages}
                                title={Strings.sideMenu.myMessaage}
                                onPress={() => {
                                    if (this.isEmptyField(Session.sharedInstance.userDetails, Constants.userDetailsFields.isVerified) == false && this.isEmptyField(Session.sharedInstance.userDetails, Constants.userDetailsFields.is_tutor) == true) {
                                        this.screenChangeHandler(Constants.routeName.waitingForApproval)
                                    } else
                                        ApplozicChat.openChat()
                                }}
                            />}

                            {this.isStudent() == false && this.isEmptyField(Session.sharedInstance.userDetails, Constants.userDetailsFields.isVerified) == true && <SideMenuRow
                                source={Assets.sideDrawer.my_earnings}
                                title={Strings.sideMenu.myEarnings}
                                onPress={() => {
                                    alert('Developement in Progress')
                                }}
                            />}
                            {this.isStudent() == true && <SideMenuRow
                                source={Assets.sideDrawer.my_bookings}
                                title={Strings.sideMenu.myBookings}
                                onPress={() => this.screenChangeHandler('StudentBookingList')}
                            />}

                            {this.isStudent() == true && <SideMenuRow
                                source={Assets.sideDrawer.my_classes}
                                title={Strings.sideMenu.myClasses}
                                onPress={() => this.screenChangeHandler(Constants.routeName.myClasses)}
                            />}
                            {this.isStudent() == true && <SideMenuRow
                                source={Assets.sideDrawer.my_profile}
                                title={Strings.sideMenu.myProfile}
                                onPress={() => this.screenChangeHandler(Constants.routeName.studentProfile)}
                            />}
                            {this.isStudent() == true && <SideMenuRow
                                source={Assets.sideDrawer.settings}
                                title={Strings.sideMenu.settings}
                                onPress={() => this.screenChangeHandler(Constants.routeName.settings)}
                            />}
                            {this.isStudent() == false && this.isEmptyField(Session.sharedInstance.userDetails, Constants.userDetailsFields.isVerified) == true && <SideMenuRow
                                source={Assets.sideDrawer.my_profile}
                                title={Strings.sideMenu.myProfile}
                                onPress={() => {
                                     this.screenChangeHandler(Constants.routeName.tutorProfile)

                                    //alert('Development in Progress')
                                }}
                            />}
                            <SideMenuRow
                                source={Assets.sideDrawer.my_profile}
                                title={Strings.sideMenu.notification}
                                onPress={() => {
                                     this.screenChangeHandler(Constants.routeName.NotificationListScreen)

                                    //alert('Development in Progress')
                                }}
                            />

                            {this.isStudent() == false && this.isEmptyField(Session.sharedInstance.userDetails, Constants.userDetailsFields.isVerified) == true && <SideMenuRow
                                source={Assets.sideDrawer.rewards}
                                title={Strings.sideMenu.rewards}
                                onPress={() => {
                                    if (this.isEmptyField(Session.sharedInstance.userDetails, Constants.userDetailsFields.isVerified) == false) {
                                        this.screenChangeHandler(Constants.routeName.waitingForApproval)
                                    } else
                                        alert('Development in Progress')
                                }}
                            />}

                            {this.isStudent() == false && this.isEmptyField(Session.sharedInstance.userDetails, Constants.userDetailsFields.isVerified) == true && <SideMenuRow
                                source={Assets.sideDrawer.settings}
                                title={Strings.sideMenu.settings}
                                onPress={() => {
                                    if (this.isEmptyField(Session.sharedInstance.userDetails, Constants.userDetailsFields.isVerified) == false && this.isEmptyField(Session.sharedInstance.userDetails, Constants.userDetailsFields.is_tutor) == true) {
                                        this.screenChangeHandler(Constants.routeName.waitingForApproval)
                                    } else
                                        this.screenChangeHandler(Constants.routeName.settings)
                                }}
                            />}

                            {this.isStudent() == false && this.isEmptyField(Session.sharedInstance.userDetails, Constants.userDetailsFields.isVerified) == true && <SideMenuRow
                                source={Assets.sideDrawer.customer_care}
                                title={Strings.sideMenu.customerCare}
                                onPress={() => {
                                    if (this.isEmptyField(Session.sharedInstance.userDetails, Constants.userDetailsFields.isVerified) == false && this.isEmptyField(Session.sharedInstance.userDetails, Constants.userDetailsFields.is_tutor) == true) {
                                        this.screenChangeHandler(Constants.routeName.waitingForApproval)
                                    } else
                                        this.screenChangeHandler(Constants.routeName.customerCare)
                                }}
                            />}
                            {this.isStudent() == true && <SideMenuRow
                                source={Assets.sideDrawer.customer_care}
                                title={Strings.sideMenu.customerCare}
                                onPress={() => {
                                    if (this.isEmptyField(Session.sharedInstance.userDetails, Constants.userDetailsFields.isVerified) == false && this.isEmptyField(Session.sharedInstance.userDetails, Constants.userDetailsFields.is_tutor) == true) {
                                        this.screenChangeHandler(Constants.routeName.waitingForApproval)
                                    } else
                                        this.screenChangeHandler(Constants.routeName.customerCare)
                                }}
                            />}


                            <SideMenuRow
                                source={Assets.sideDrawer.logout_icon}
                                title={Strings.sideMenu.logout}
                                onPress={async () => {
                                    this.setState({ isPopVisible: true })

                                }}
                            />
                            {this.popUpView()}

                        </ScrollView>

                        {/* Footer View */}
                        <View style={styles.footerContainer}>
                            <TouchableOpacity
                                onPress={() =>

                                    this.roleReversalApiHandler()}
                                style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <View
                                    style={{
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        width: 50,
                                        height: 50,
                                        backgroundColor: Color.sideMenuFooterColor,
                                        borderRadius: 25,
                                        marginHorizontal: 15,
                                        marginVertical: 10,
                                    }}>
                                    <Image
                                        source={Assets.sideDrawer.switch_icon}
                                        style={{ width: 25, height: 25 }}>
                                    </Image>
                                </View>
                                {this.switchView()}
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </SafeAreaComponent>
        );
    }



    isEmptyField = (userDetails, field) => {
        try {
            if (userDetails[field] != undefined) {
                return userDetails[field]
            } else {
                return null
            }
        } catch (error) {
            return null
        }
    }

    isStudent() {
        try {
            if (Session.sharedInstance.isStudent != undefined) {
                return Session.sharedInstance.isStudent
            } else {
                return null
            }
        } catch (error) {
            return null
        }
    }


    switchView() {
        switch (this.isEmptyField(Session.sharedInstance.userDetails, Constants.userDetailsFields.isVerified)) {
            case true:
                return (
                    <View>
                        {this.isStudent() && <Text>{String.sideMenu.switchToTeacher}</Text>}
                        {!this.isStudent() && <Text>{String.sideMenu.switchToStudent}</Text>}
                    </View>
                )
                break;

            case false:
                return (
                    <View>
                        {this.isStudent() && < Text > {String.sideMenu.switchToTeacher}</Text>}
                        {!this.isStudent() && <Text>{String.sideMenu.switchToStudent}</Text>}
                    </View >
                )
                break;

            default:
                break;
        }
    }


    screenChangeHandler(screenName) {
        Utility.sharedInstance.navigation.navigate(screenName, { navigateFrom: 'SideDrawer' })
    }

    userDetailsHasProperty(property) {
        if (this.isEmptyField(Session.sharedInstance.userDetails, property)) {
            return Session.sharedInstance.userDetails.hasOwnProperty(property)
        }
    }



    popUpView() {

        return (
            <PopUp
                isPopVisible={this.state.isPopVisible}
                headerText={Strings.popUpMessage.logout.header}
                descriptionText={Strings.popUpMessage.logout.desc}
                rightButtonText={Strings.popUpMessage.button.yes}
                leftButtonText={Strings.popUpMessage.button.no}
                rightButtonOnPress={async () => {
                    this.setState({ isPopVisible: false })
                    await Utility.sharedInstance.appLogoutHandler()
                    this.screenChangeHandler(Constants.routeName.login)
                }}
                leftButtonOnPress={() => this.setState({ isPopVisible: false })}
            />
        )
    }


    isTutorDetailsFilled() {

        if (Session.sharedInstance.userDetails[Constants.userDetailsFields.identity_proof] == undefined || Session.sharedInstance.userDetails[Constants.userDetailsFields.identity_proof] == '') {
            return true
        }
        if (Session.sharedInstance.userDetails[Constants.userDetailsFields.tutor_education] == undefined || Session.sharedInstance.userDetails[Constants.userDetailsFields.tutor_education] == '') {
            return true
        }

    }


    roleReversalApiHandler = async () => {



        let nextScreen
        if (this.isStudent() == true) {
            Session.sharedInstance.isStudent = false
            if ((this.userDetailsHasProperty(Constants.userDetailsFields.isVerified))) {
                try {
                    let params = {}
                    params.id = this.isEmptyField(Session.sharedInstance.userDetails, Constants.userDetailsFields._id)
                    params.is_tutor = true
                    params.is_student = false
                    const res = await NetworkManager.networkManagerInstance.fetchRequest(URL.updateTutor, URL.putRequest, true, params, () => { this.updateUserDetails() });
                    if (res.statusCode === 200) {

                        await Utility.sharedInstance._storeData(AsyncStorageValues.userDetails, res.data, String.asynstorageMsgs.updateStudentData)
                        Session.sharedInstance.userDetails = res.data
                        NetworkManager.networkManagerInstance.progressBarRequest(false)


                        this.screenChangeHandler(Constant.routeName.homeScreen)

                        Utility.sharedInstance.EventEmitter.emit('HOME', { action: 'REFRESH' })

                        return
                    } else {
                        NetworkManager.networkManagerInstance.progressBarRequest(false)
                        showToast(res.message)
                        return
                    }
                } catch (error) {
                    NetworkManager.networkManagerInstance.progressBarRequest(false)
                    return
                }
            }
            if (!(this.userDetailsHasProperty(Constants.userDetailsFields.isVerified))) {
                if ((this.userDetailsHasProperty(Constants.userDetailsFields.email))) {
                    nextScreen = Constants.routeName.tutorBusiness;
                }
                if ((this.userDetailsHasProperty(Constants.userDetailsFields.identity_proof))) {
                    nextScreen = Constants.routeName.tutorQualification;
                }
                if ((this.userDetailsHasProperty(Constants.userDetailsFields.tutor_education))) {
                    nextScreen = Constants.routeName.waitingForApproval;
                }
                if (this.userDetailsHasProperty[Constants.userDetailsFields.is_student] == true && this.userDetailsHasProperty[Constants.userDetailsFields.is_tutor] == true && this.userDetailsHasProperty[Constants.userDetailsFields.isVerified] == false) {
                    nextScreen = Constants.routeName.homeScreen;
                }
                if (this.userDetailsHasProperty[Constants.userDetailsFields.is_student] == true && this.userDetailsHasProperty[Constants.userDetailsFields.is_tutor] == false && this.userDetailsHasProperty[Constants.userDetailsFields.isVerified] == false) {
                    nextScreen = Constants.routeName.homeScreen;
                }
                if (this.userDetailsHasProperty[Constants.userDetailsFields.is_student] == false && this.userDetailsHasProperty[Constants.userDetailsFields.is_tutor] == true && this.userDetailsHasProperty[Constants.userDetailsFields.isVerified] == true) {
                    nextScreen = Constants.routeName.homeScreen;
                }
                if (this.userDetailsHasProperty[Constants.userDetailsFields.is_student] == false && this.userDetailsHasProperty[Constants.userDetailsFields.is_tutor] == true && this.userDetailsHasProperty[Constants.userDetailsFields.isVerified] == false) {
                    nextScreen = Constants.routeName.waitingForApproval;
                }
            }
            this.screenChangeHandler(nextScreen)

        } else {
            Session.sharedInstance.isStudent = true
            try {

                let params = {}
                params.id = Session.sharedInstance.userDetails[Constants.userDetailsFields._id]
                params.is_tutor = false
                params.is_student = true
                const res = await NetworkManager.networkManagerInstance.fetchRequest(URL.updateStudent, URL.putRequest, true, params, () => { this.updateUserDetails() });
                if (res.statusCode === 200) {

                    await Utility.sharedInstance._storeData(AsyncStorageValues.userDetails, res.data, String.asynstorageMsgs.updateStudentData)
                    Session.sharedInstance.userDetails = res.data
                    NetworkManager.networkManagerInstance.progressBarRequest(false)
                    Utility.sharedInstance.EventEmitter.emit('HOME', { action: 'REFRESH' })
                    this.screenChangeHandler(Constant.routeName.homeScreen)
                } else {
                    NetworkManager.networkManagerInstance.progressBarRequest(false)
                    Utility.sharedInstance.EventEmitter.emit('HOME', { action: 'REFRESH' })
                    this.screenChangeHandler(Constant.routeName.homeScreen)
                    showToast(res.message)
                }

            } catch (error) {
                NetworkManager.networkManagerInstance.progressBarRequest(false)

                console.log("STUDENT_API_HANDLER " + error)
            }

        }

    }

    formdata = async () => {
        let fordata = new FormData()

        fordata.append('id', Session.sharedInstance.userDetails[Constants.userDetailsFields._id])
        fordata.append('profile_picture', Session.sharedInstance.userDetails[Constants.userDetailsFields.profile_picture])
        fordata.append('is_tutor', true)
    }

}

export default SideDrawer

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    footerContainer: {
        marginBottom: 20,
        backgroundColor: Color.sideMenuFooterColor
    }
});
