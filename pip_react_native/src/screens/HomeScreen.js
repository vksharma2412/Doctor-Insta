import React, { Component } from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet, BackHandler, KeyboardAvoidingView, AppState, ScrollView, NativeModules, TouchableWithoutFeedback, Keyboard, Image, Dimensions, Platform, Alert } from 'react-native'
import { CommonHeader, SafeAreaComponent, AppButton, PopUp } from '../components';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import { HomeHeader, } from '../components/HomeHeader';
import { Color, Dimen, Strings, Assets, Constant, URL } from '../../res';
import String from '../../res/String';
import { PlaceholderComponent } from '../components/PlaceholderComponent';
import SwiperFlatList from 'react-native-swiper-flatlist';
import Constants from '../../res/Constants';
import { color } from 'react-native-reanimated';
import { NavUtil, NetworkManager } from '../utils';
import Session from '../utils/Session';
import ActiveSessionsListItem from "./session/ActiveSessionsListItem";
import ScheduledSessionsListItem from "./session/ScheduledSessionsListItem";
import RNExitApp from 'react-native-exit-app';
import firebase from 'react-native-firebase';
import DeviceInfo from 'react-native-device-info';
import { StackActions, CommonActions } from '@react-navigation/native';
import { connect } from "react-redux";
import { API_CALL, CHANGE_NOTIFICATION_BELL_ICON } from "../redux/Actions"
// optional flow type

//import type { Notification, NotificationOpen } from 'react-native-firebase';


var ApplozicChat = NativeModules.ApplozicChat;
let moment = require('moment')

import Utility, { formatDate, showToast } from '../utils/Utility';


class HomeScreen extends Component {

    constructor(props) {
        super(props)
        this.state = {
            isPopVisible: false,
            scheduleSession: [],
            activeSession: [],
            newleyAddedSession: [], // newleyadded status for tutor,
            previousSessionObj: {},
        }
    }




    componentDidMount() {


        this.subscription = Utility.sharedInstance.EventEmitter.addListener('HOME', (event) => {

            if (__DEV__) console.log(`[EVENT RECEIVED]: ${JSON.stringify(event)}`)
            switch (event.action) {
                case 'REFRESH':
                    {
                        this.homeScreenApiHandler()
                        this.getPreviousSesionRatingApi()
                    }
                    break
                case 'DISMISS':
                    break
            }
        });

        const unsubscribe = this.props.navigation.addListener('focus', async () => {
            console.log('==================>FOCUS')
            await this.homeScreenApiHandler()
            await this.getPreviousSesionRatingApi()

        });

        Utility.sharedInstance.loginApplozic({
            'userId': Session.sharedInstance.userDetails[Constant.userDetailsFields.email],   //Replace it with the userId of the logged in user NOTE : userId need to be string and  +,*,? are not allowed chars in userId.
            'password': "",  //Put password here
            'authenticationTypeId': 1,
            'deviceApnsType': 0    //Set 0 for Development and 1 for Distribution (Release)
        }, Session.sharedInstance.userDetails[Constant.userDetailsFields.name])
        this.createNotificationListeners();
        BackHandler.addEventListener('hardwareBackPressScanning', this.handleBackButtonClick);

        // return unsubscribe;
    }

    async componentWillUnmount() {
        this.subscription();
      //  this.unsubscribe();
        this.notificationListener();
        this.notificationOpenedListener();
        BackHandler.removeEventListener('hardwareBackPressScanning', () => { });
    }




    handleBackButtonClick = async () => {
        if (this.props.navigation.dangerouslyGetState().routes[this.props.navigation.dangerouslyGetState().routes.length - 1].name == 'HomeScreen') {
            this.setState({ isPopVisible: true })
            return false
        } else {
            this.props.navigation.goBack()
        }
    }



    render() {
        return (
            <SafeAreaComponent
                StatusBarTextColor={'light-content'}
                color={Color.textColor.pentaColor}>
                <View style={{ flex: 1, }}>
                    <View style={{ flex: 0.15 }}>
                        <HomeHeader
                            newNotification={this.props.newNotification}
                            containerStyle={{ backgroundColor: Color.textColor.pentaColor }}
                            OnPress={() => this.props.navigation.openDrawer()}
                            onNotificationPress={() => this.props.navigation.navigate('NotificationListScreen')}
                        />
                    </View>
                    <View style={{ flex: 0.85, top: -20, paddingBottom: '13%', borderTopLeftRadius: 20, borderTopRightRadius: 20, width: '100%', backgroundColor: Color.secondayTextColor }}>
                        <ScrollView
                            contentContainerStyle={{ flexGrow: 1, paddingTop: 20 }}>

                            {/* Earnibg Header for tutor home screen */}
                            {!Session.sharedInstance.isStudent && Session.sharedInstance.userDetails[Constant.userDetailsFields.isVerified] && this._tutorEarning()}
                            {this.state.scheduleSession.length > 0 && this._scheduledSessionsView()}
                            {this.state.activeSession.length > 0 && this._activeSessionsView()}
                            {/* newleyadded status for tutor home screen */}
                            {/* {this.state.newleyAddedSession.length > 0 && this._newleyAddedSessionsView()} */}

                            {this.state.activeSession.length == 0 && this.state.scheduleSession.length == 0 ? this.placeholder() : this.state.activeSession.length == 0 ? this.placeholder() : <View />}

                            {/* {this.state.activeSession.length == 0 && <View style={{ flex: 0.7 }}>

                            </View>} */}


                        </ScrollView>
                    </View>
                </View>


                {Session.sharedInstance.isStudent && this.continueButton()}
                {this.popUpView()}

            </SafeAreaComponent>



        )
    };

    placeholder() {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <PlaceholderComponent
                    containerStyle={{ borderTopRightRadius: 20, borderTopLeftRadius: 20 }}
                    placeHolderImage={Assets.homeScreen.no_session_illust}
                    placeholderHeader={this.state.activeSession.length == 0 && this.state.scheduleSession.length == 0 ? Strings.homeScreen.fetchingBookingsHeader : Strings.homeScreen.noActiveSessions}
                    placeholderMessage={this.state.activeSession.length == 0 && this.state.scheduleSession.length == 0 ? Strings.homeScreen.fetchingBookingsDesc : ''}
                />
            </View>

        )
    }
    /// Tutor Earning card  view
    _tutorEarning() {
        return (
            <View style={{ flex: 0.1, borderRadius: 10, backgroundColor: Color.buttonColor.enableButton, marginHorizontal: 20, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 20 }}>
                <View >
                    <Text style={{ fontSize: 16, color: '#9DC0DF', marginBottom: 7 }}>{String.homeScreen.yourEarning}</Text>
                    <View style={{ flexDirection: 'row' }}>
                        <Image height={20} width={18} source={Assets.common.wallet}></Image>
                        <Text style={{ fontSize: 20, color: '#FFFFFF', marginLeft: 10, marginTop: -5, fontWeight: 'bold' }}>$100</Text>
                    </View>
                </View>
                <View>
                    <Image height={24} width={24} source={Assets.settings.arrowForward}></Image>
                </View>

            </View>

        )
    }

    _scheduledSessionsView() {
        return (

            <View style={{ flex: 0.3, width: '100%', paddingTop: 6 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginHorizontal: 20, paddingTop: 5, paddingBottom: 5 }}>
                    <Text style={{ fontSize: Dimen.mediumTextSize, fontWeight: '400', color: Color.textColor.quarternary }}>{String.homeScreen.scheduleSession}</Text>
                    <TouchableOpacity style={{ padding: 3 }}
                        onPress={() => {
                            NavUtil.navUtil.navigateTo(this, Constant.routeName.scheduledSessionList)
                        }}>
                        <Text style={{ fontSize: Dimen.verySmallTextSize, color: Color.textColor.pentaColor, fontWeight: '600' }}>{String.homeScreen.viewAll}</Text>
                    </TouchableOpacity>
                </View>
                <FlatList
                    showsHorizontalScrollIndicator={false}
                    data={this.state.scheduleSession}
                    // renderItem={this._renderItem}
                    renderItem={({ item }) =>
                        <TouchableOpacity
                            onPress={() => {
                                if (!Session.sharedInstance.isStudent && Session.sharedInstance.userDetails[Constant.userDetailsFields.isVerified]) {
                                    this.props.navigation.navigate(Constant.routeName.sessionDetail, { session_id: item._id, status: item.status })

                                } else {
                                    this.props.navigation.navigate(Constants.routeName.sessionDetail, {
                                        session_id: item._id, student_id: item.student_id, status: item.status
                                    })
                                }
                            }}
                            activeOpacity={0.5}
                        >
                            <ScheduledSessionsListItem
                                isList={false}
                                item={item} />
                        </TouchableOpacity>
                    }
                    horizontal={true}
                />
            </View>



        )
    }


    _activeSessionsView() {
        return (
            <View style={{ flex: 0.7, width: '100%' }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginHorizontal: 20, paddingTop: 10, paddingBottom: 5 }}>
                    {Session.sharedInstance.isStudent && <Text style={{ fontSize: Dimen.mediumTextSize, fontWeight: '400', color: Color.textColor.quarternary }}>{String.homeScreen.activeSession}</Text>}
                    {!Session.sharedInstance.isStudent && <Text style={{ fontSize: Dimen.mediumTextSize, fontWeight: '400', color: Color.textColor.quarternary }}>{String.homeScreen.newlyAddedSessions}</Text>}


                </View>
                <FlatList
                    contentContainerStyle={{ flexGrow: 1, width: '100%' }}
                    showsHorizontalScrollIndicator={false}
                    data={this.state.activeSession}
                    renderItem={({ item }) =>

                        <ActiveSessionsListItem item={item} />

                    }
                    ListFooterComponent={this.footerComponent('View More')}

                />
            </View>
        )
    }

    /// newley added session status
    _newleyAddedSessionsView() {
        return (
            <View style={{ flex: 0.7, width: '100%', }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginHorizontal: 20, paddingTop: 10, paddingBottom: 5 }}>
                    <Text style={{ fontSize: Dimen.mediumTextSize, fontWeight: '400', color: Color.textColor.quarternary }}>{String.homeScreen.newlyaddedSession}</Text>

                </View>
                <FlatList
                    contentContainerStyle={{ flexGrow: 1, width: '100%' }}
                    showsHorizontalScrollIndicator={false}
                    data={this.state.activeSession}
                    renderItem={({ item }) =>

                        <ActiveSessionsListItem item={item} />

                    }
                    ListFooterComponent={this.footerComponent('VIEW ALL')}

                />
            </View>
        )
    }

    footerComponent(name) {
        return (
            <View style={{ paddingTop: 30, alignSelf: 'center', paddingBottom: 30 }}>
                <TouchableOpacity style={styles.viewMoreButton}
                    onPress={() => {
                        if (Session.sharedInstance.userDetails[Constants.userDetailsFields.is_tutor]) {
                            NavUtil.navUtil.navigateTo(this, Constant.routeName.activeSessionsList, { headerName: 'Newly Added Session' })
                        } else {
                            NavUtil.navUtil.navigateTo(this, Constant.routeName.activeSessionsList, { headerName: 'Active Session' })
                        }
                    }}
                >
                    <Text style={{ color: Color.textColor.pentaColor }}>{name}</Text>
                </TouchableOpacity>
            </View>
        )
    }

    continueButton() {


        return (

            <View style={{ width: '90%', flex: 1, position: 'absolute', bottom: 0, justifyContent: 'flex-end', alignItems: 'center', marginBottom: 20, alignSelf: 'center' }}>
                <AppButton
                    buttonStyle={{ width: '100%' }}
                    onPress={() => {
                        console.log("this.state.previousSessionObj" + JSON.stringify(this.state.previousSessionObj))
                        if ('isPreviousSessionRated' in this.state.previousSessionObj) {

                            if (!this.state.previousSessionObj.isPreviousSessionRated && this.state.previousSessionObj.isPreviousSessionRated != {}) {
                                NavUtil.navUtil.navigateTo(this, Constants.routeName.ratetutorScreen,
                                    {
                                        session_id: this.state.previousSessionObj.sessionId,
                                        tutor_id: this.state.previousSessionObj.tutorId,
                                        name: this.state.previousSessionObj.name,
                                        profile_pic: this.state.previousSessionObj.profile_pic,
                                        qualification: this.state.previousSessionObj.qualification

                                    })
                            } else {
                                NavUtil.navUtil.navigateTo(this, 'BookSession')
                            }
                        } else {
                            NavUtil.navUtil.navigateTo(this, 'BookSession')
                        }
                    }
                    }
                    // onPress={() => NavUtil.navUtil.navigateTo(this, 'ActiveSessionsList')}
                    isEnabled={true}
                    buttonText={String.homeScreen.bookSession}
                />
            </View>
        )


    }

    popUpView() {
        return (
            <PopUp
                isPopVisible={this.state.isPopVisible}
                headerText={Strings.popUpMessage.exitApp.header}
                descriptionText={Strings.popUpMessage.exitApp.desc}
                rightButtonText={Strings.popUpMessage.button.yes}
                leftButtonText={Strings.popUpMessage.button.no}
                rightButtonOnPress={async () => {
                    this.setState({ isPopVisible: false })
                    if (Platform.OS == "ios") {
                        RNExitApp.exitApp()
                    } else {
                        BackHandler.exitApp()
                    }

                }}
                leftButtonOnPress={() => this.setState({ isPopVisible: false })}
            />
        )
    }


    homeScreenApiHandler = async () => {
        let data = {}
        let NfcmToken = "";

        await firebase.messaging().getToken().then(fcmToken => {
            if (fcmToken) {
                NfcmToken = fcmToken
            }
        })

        const deviceId = DeviceInfo.getUniqueId();
        const fcmSchema = {
            device_type: 'mobile',
            deviceId: deviceId,
            regToken: NfcmToken + ""
        }

        if (!Session.sharedInstance.isStudent && Session.sharedInstance.userDetails[Constant.userDetailsFields.isVerified]) {
            data.tutor_id = Session.sharedInstance.userDetails[Constant.userDetailsFields._id]
            data.skip = 0
            data.limit = 5
            data.fcmToken = fcmSchema
            NetworkManager.networkManagerInstance.fetchRequest(URL.getTutorHome, URL.postRequest, true, data, () => this.homeScreenApiHandler())
                .then(async (res) => {
                    if (res.statusCode == 200) {
                        this.setState({ activeSession: res.data.result, scheduleSession: res.data.Ongoing }
                        )
                    }
                })
                .catch(e => {
                    console.log('BOOKING FAILED', e)
                })

        } else {

            data.student_id = Session.sharedInstance.userDetails[Constant.userDetailsFields._id]
            data.skip = 0
            data.limit = 5
            data.fcmToken = fcmSchema

            const res = await NetworkManager.networkManagerInstance.fetchRequest(URL.homeScreen, URL.postRequest, true, data, () => this.homeScreenApiHandler())
            if (res.statusCode == 200) {
                this.setState({ activeSession: res.data.result, scheduleSession: res.data.Ongoing })
            } else {
                console.log('BOOKING FAILED')
            }
        }

    }

    // onNotification = (notification: Notification) => {
    //    const { title, body, data } = notification;

    //    console.log("on notification data ", JSON.stringify(data))
    //     // modify your notification if required e.g. for this issue:
    //     notification.android.setChannelId(notification.data.channelId);
    //     // then display it by calling displayNotification
    //     firebase.notifications().displayNotification(notification);
    //     this.props.changeNotificationBellIconDispatcher(true);
    // };

    async createNotificationListeners() {

    //    this.unsubscribe = firebase.notifications().onNotification(this.onNotification);
        /*
        * iOS & Android Case
        * Triggered when a particular notification has been received in foreground
        * */
        this.notificationListener = firebase.notifications().onNotification(async (notification) => {
            const { title, body, data } = notification;
            this.props.changeNotificationBellIconDispatcher(true);
            if (__DEV__) console.log("onNotification", JSON.stringify(data))
            const localNotification = new firebase.notifications.Notification()
                .setNotificationId(notification.notificationId)
                .setTitle(notification.title)
                .setSubtitle(notification.subtitle)
                .setBody(notification.body)
               // .setChannelId(notification.data.channelId);
               // notification.android.setChannelId(notification.data.channelId);
            if (Platform.OS === 'android') {
                localNotification._android._channelId = 'funda-channel';

            }
            await firebase.notifications().displayNotification(localNotification);
            if (__DEV__) console.log("onNotification", JSON.stringify(data))
           

        });

        this.notificationOpenedListener = firebase.notifications().onNotificationOpened((notificationOpen) => {
            const { title, body, data } = notificationOpen.notification;
            //  this.showAlert("onNotificationOpened", "body")

            if (data.UID ==  Constants.PushNotificationConstants.sessionDetailStudent) {
                NavUtil.navUtil.navigateTo(this, Constants.routeName.sessionDetail, {
                    session_id: data.session_id,                    
                })
            }else if(data.UID ==  Constants.PushNotificationConstants.profileRejected)
            {
                NavUtil.navUtil.navigateTo(this, Constants.routeName.tutorProfile)
            }
            else{

                NavUtil.navUtil.navigateTo(this, Constants.routeName.NotificationListScreen)
                
            }
            if (__DEV__) console.log("onNotification Open", JSON.stringify(data))
        });

        /*
        * Android Case
        * If your app is closed, you can check if it was opened by a notification being clicked / tapped / opened as follows:
        * */
        let notificationOpen = await firebase.notifications().getInitialNotification();
        if (notificationOpen) {
            const { title, body, data } = notificationOpen.notification;
            if (data.UID ==  Constants.PushNotificationConstants.sessionDetailStudent) {
                NavUtil.navUtil.navigateTo(this, Constants.routeName.sessionDetail, {
                    session_id: data.session_id,                    
                })
                
                
            } else if (data.UID ==  Constants.PushNotificationConstants.bidListStudent) {
                NavUtil.navUtil.navigateTo(this, Constants.routeName.sessionDetail, {
                    session_id: data.session_id,                    
                })
                
               
            } 
            else if (data.UID ==  Constants.PushNotificationConstants.rewardReceived) {
               
                alert("development in progress")
            } 
            else if (data.UID ==  Constants.PushNotificationConstants.profileRejected) {
               
                NavUtil.navUtil.navigateTo(this, Constants.routeName.tutorProfile)
            } 
          
        }


        /*
       * Triggered for data only payload in foreground
       * */
        this.messageListener = firebase.messaging().onMessage((message) => {
            // this.showAlert("onmessage", "body")
            console.log("on message Data ", JSON.stringify(message))
            if (message.hasOwnProperty("_data") && message._data.hasOwnProperty("UID") && message._data.UID == "VideoMeeting") {


                if (Platform.OS == "ios") {

                    this.props.navigation.navigate('RingingView', { sessionId: message._data.sessionId, token: message._data.token2, ringerName: message._data.ringerName });

                } else {
                    if (AppState.currentState == "active") {
                        //this.props.navigation.navigate('RingingView', { sessionId: message._data.sessionId, token: message._data.token2, ringerName: message._data.ringerName });
                    }
                }
            }


        });


    }


    getPreviousSesionRatingApi = async () => {
        let data = {}
        data.student_id = Session.sharedInstance.userDetails[Constants.userDetailsFields._id]
        let res = await NetworkManager.networkManagerInstance.fetchRequest(URL.checkPreviousSessionRated, URL.postRequest, true, data, () => this.getPreviousSesionRatingApi())
        if (res.statusCode == 200) {
            this.setState({ previousSessionObj: res.data })
        }
    }
};

const mapStateToProps = state => {
   // console.log("state of store ", JSON.stringify(state) )
   return {
       isTutor: false,
       newNotification: state.apiReducer.newNotification
   };
};

const mapDispatchToProps = dispatch => {
   return {
       changeNotificationBellIconDispatcher: (value) => dispatch({ type: CHANGE_NOTIFICATION_BELL_ICON, value }),
   };
};

export default connect(mapStateToProps, mapDispatchToProps)(HomeScreen) ;



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
    viewMoreButton: {
        height: 40, width: 110,
        borderWidth: 2, borderColor: Color.textColor.pentaColor,
        borderRadius: 20, justifyContent: 'center',
        alignItems: 'center',
    }
});
