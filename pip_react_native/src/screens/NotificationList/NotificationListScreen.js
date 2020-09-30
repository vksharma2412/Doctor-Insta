import React, { Component } from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet, BackHandler, Platform, ScrollView, NativeModules, Image, RefreshControl, ActivityIndicator } from 'react-native'
import { SafeAreaComponent } from '../../components';
import { HomeHeader, } from '../../components/HomeHeader';
import { Color, Dimen, Strings, Assets, Constant, URL } from '../../../res';
import { PlaceholderComponent } from '../../components/PlaceholderComponent';
import { NetworkManager, Utility, NavUtil } from '../../utils';
import Session from '../../utils/Session';
import Constants from '../../../res/Constants';
import { connect } from "react-redux";
import { API_CALL, CHANGE_NOTIFICATION_BELL_ICON } from "../../redux/Actions"
var ApplozicChat = NativeModules.ApplozicChat;
let moment = require('moment')

class NotificationListScreen extends Component {

    constructor(props) {
        super(props)
        this.state = {
            isPopVisible: false,
            notificationlist: [],
            pageNo: 0,
            loading: false, // user list loading
            isRefreshing: false,
            uriError: false
        }
    }

    async componentDidMount() {

        const unsubscribe = this.props.navigation.addListener('focus', async () => {
            console.log('==================>FOCUS')
            this.refreshData(true)

        });
        // await this.notificationListApiHandler()
        BackHandler.addEventListener('hardwareBackPressScanning', this.handleBackButtonClick);
        this.refreshData()
        this.props.changeNotificationBellIconDispatcher(false);
    }

    async componentWillUnmount() {
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

    refreshData(reload = false) {
        if (reload) {
            this.setState({ notificationlist: [], pageNo: 0, isRefreshing: false }, () => {
                this.getNotificationList()
            })
        } else {
            this.setState({
                loading: true,
                isRefreshing: false
            }, () => {
                this.getNotificationList()
            })
        }


    }

    pulltoRefresh = () => {
        this.refreshData(true)
    }

    getNotificationList = async () => {

        let data = {}
        data.user_id = Session.sharedInstance.userDetails[Constant.userDetailsFields._id]
        data.skip = this.state.pageNo*10;
        data.limit = 10;
        const res = await NetworkManager.networkManagerInstance.fetchRequest(URL.listNotifications, URL.postRequest, true, data, () => this.getNotificationList())

        console.log("NotificationData ", JSON.stringify(res))
        if (res.statusCode == 200) {
            this.setState({ notificationlist: this.state.notificationlist.concat(res.data), loading: false, })
        } else {
            this.setState({ loading: false })
            console.log('RAISE DISPUTE FAILED')
        }


    }

    render() {
        // list of notification array
        // const notificationList = [
        //     { img: Assets.session.sampleProfile, title: 'Your English session request has been initiated.', arrowIcon: Assets.settings.arrowForward, goToNextScreen: '', date: '10/07/2020, 12:11 PM' },
        //     { img: Assets.session.sampleProfile, title: 'You have received a new quote on Mathematics Session by tutor Tidiou M baye', arrowIcon: Assets.settings.arrowForward, goToNextScreen: '', date: '10/07/2020, 12:11 PM' },
        //     { img: Assets.session.sampleProfile, title: 'Your English session request has been initiated.', arrowIcon: Assets.settings.arrowForward, goToNextScreen: '', date: '10/07/2020, 12:11 PM' },
        //     { img: Assets.session.sampleProfile, title: 'Your English session will start in 10 min with Jasmine Merlette', arrowIcon: Assets.settings.arrowForward, goToNextScreen: '', date: '10/07/2020, 12:11 PM' },
        //     { img: Assets.session.sampleProfile, title: 'Your English session request has been initiated.', arrowIcon: Assets.settings.arrowForward, goToNextScreen: '', date: '10/07/2020, 12:11 PM' },
        //     { img: Assets.session.sampleProfile, title: 'You have received a new quote on Mathematics Session by tutor Tidiou M baye You have received a new quote on Mathematics Session by tutor Tidiou M baye hello hunny bunny', arrowIcon: Assets.settings.arrowForward, goToNextScreen: '', date: '10/07/2020, 12:11 PM' },
        //     { img: Assets.session.sampleProfile, title: 'Your English session request has been initiated.', arrowIcon: Assets.settings.arrowForward, goToNextScreen: '', date: '10/07/2020, 12:11 PM' },
        //     { img: Assets.session.sampleProfile, title: 'Your English session will start in 10 min with Jasmine Merlette', arrowIcon: Assets.settings.arrowForward, goToNextScreen: '', date: '10/07/2020, 12:11 PM' },
        //     { img: Assets.session.sampleProfile, title: 'Your English session request has been initiated.', arrowIcon: Assets.settings.arrowForward, goToNextScreen: '', date: '10/07/2020, 12:11 PM' },

        // ];

        return (

            <SafeAreaComponent
                StatusBarTextColor={'light-content'}
                color={Color.textColor.pentaColor}
            >

                <View style={{ flex: 1, height: Dimen.phoneHeight, backgroundColor: Color.secondayTextColor }}>
                    <View style={{ flex: 0.12, }}>
                        <HomeHeader
                            containerStyle={{ backgroundColor: Color.textColor.pentaColor }}
                            OnPress={() => this.props.navigation.openDrawer()}
                            onNotificationPress={() => this.props.navigation.navigate('NotificationListScreen')}
                        />
                    </View>
                    <View style={{ flex: 0.88, top: -20, borderTopLeftRadius: 20, borderTopRightRadius: 20, height: Dimen.phoneHeight, width: '100%', backgroundColor: Color.secondayTextColor }}>

                        {this.listofNotification()}


                    </View>
                </View>
            </SafeAreaComponent>

        )
    };


    placeholder() {
        return (
            <View style={{ flex: 0.72, justifyContent: 'center', alignItems: 'center' }}>
                <PlaceholderComponent
                    containerStyle={{ borderTopRightRadius: 20, borderTopLeftRadius: 20, marginTop: 100 }}
                    placeHolderImage={Assets.notification.noNotifications}
                />
                <Text style={{ fontSize: 24, fontWeight: "bold", color: '#3A3A3A' }}>{Strings.homeScreen.nonotificationtitle}</Text>
                <Text style={{ fontSize: 14, color: '#818181' }}>{Strings.homeScreen.nonotificationsubtitle}</Text>
            </View>

        )
    }

    // set notification list
    listofNotification() {
        return (
            <View style={{
                flex: 1, marginHorizontal: '5%', marginVertical: 20,
                //  backgroundColor: Color.secondayTextColor,
                // backgroundColor: "red"

            }}>
                <View>
                    <Text style={{ alignSelf: 'flex-start', marginLeft: 10, marginBottom: 2, color: '#4A4A4A', fontSize: 16, fontWeight: 'bold' }}>Notifications</Text>
                </View>
                <FlatList
                    showsVerticalScrollIndicator={false}
                    data={this.state.notificationlist}
                    keyExtractor={(item, index) => index + ""}
                    refreshControl={
                        <RefreshControl
                            refreshing={this.state.isRefreshing}
                            onRefresh={this.pulltoRefresh}
                        />
                    }
                    renderItem={({ item, index }) => {
                        return (
                            <TouchableOpacity onPress={() => this.onClickListedNotification(item)}>
                                <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', minheight: 75, marginTop: 20 }}>

                                    {item.image == "" && <Image borderRadius={100} style={{ width: 50, height: 50 }} source={Assets.notification.notification_placeholder} />}
                                    {item.image != "" && <Image borderRadius={100} style={{ width: 50, height: 50 }} source={item.image} />}



                                    <View style={{ display: 'flex', flexDirection: 'column', width: '70%' }} >
                                        <Text style={item.seen ? styles.readText : styles.unreadText}>{item.title}</Text>
                                        <Text style={{ flex: 1, fontSize: 12, alignItems: 'center', marginLeft: 15, color: '#AAAAAA', textAlign: 'left' }}>{Utility.sharedInstance.notificationTimeFormat(item.createdAt)}</Text>
                                    </View>
                                    <Image style={{ width: 25, height: 25 }} source={Assets.settings.arrowForward} />
                                </View>
                                <View style={{ marginTop: 15, marginLeft: 75, borderBottomWidth: 1, borderColor: '#E5E5E5' }}></View>
                            </TouchableOpacity>
                        )
                    }}


                    onEndReachedThreshold={0.1}
                    onEndReached={() => this.callOnScrollEnd = true}
                    onMomentumScrollEnd={() => {
                        this.callOnScrollEnd && this.handleLoadMore()
                        this.callOnScrollEnd = false
                    }}
                    ListFooterComponent={this.renderFooter}
                />
            </View>
        )
    }

    handleLoadMore = () => {
        this.setState({ pageNo: this.state.pageNo + 1, loading: true }, () => { this.refreshData() })
    }


    readNotificaition = async (item) => {


        let data = {}

        data.notification_ids = [item._id];
        const res = await NetworkManager.networkManagerInstance.fetchRequest(URL.readNotification, URL.putRequest, true, data, () => this.readNotificaition())
        
        console.log("read data res", JSON.stringify(res))
        if (res.statusCode == 200) {           
        

            switch(item.data.UID)
            {
                case 'sessionDetailStudent':
                        NavUtil.navUtil.navigateTo(this, Constants.routeName.sessionDetail, {
                        session_id: item.data.session_id,                    
                    })
                break;
    
                case 'bidListStudent':
                    NavUtil.navUtil.navigateTo(this, Constants.routeName.sessionDetail, {
                        session_id: item.data.session_id,                    
                    })
                    
                break;
                case 'sessionCompleted':
                    NavUtil.navUtil.navigateTo(this, Constants.routeName.sessionDetail, {
                        session_id: item.data.session_id,                    
                    })
                    
                break;
                case 'profileRejected':
                    NavUtil.navUtil.navigateTo(this, Constants.routeName.tutorProfile)
                    
                break;


                case 'VideoMeeting':
                    NavUtil.navUtil.navigateTo(this, Constants.routeName.sessionDetail, {
                        session_id: item.data.session_id,                    
                    })
                break;
                default:
                    console.log("No action")
                break;
            }
        
        } else {
            //this.setState({ loading:false})
            console.log('read noti FAILED')
        }

    }

    async onClickListedNotification(item) {

        // unread API 
        await this.readNotificaition(item);      
    
    }

    renderFooter = () => {
        return (

            this.state.loading ?
                <View style={{ marginTop: 10, alignItems: "center" }}>
                    <ActivityIndicator size="large" />
                </View> : null
        )
    }

};

const mapDispatchToProps = dispatch => {
    return {
        changeNotificationBellIconDispatcher: (value) => dispatch({ type: CHANGE_NOTIFICATION_BELL_ICON, value }),
    };
};
export default connect(null, mapDispatchToProps)(NotificationListScreen);


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
    },
    readText: {
        flex: 1, fontSize: 14, marginLeft: 15, textAlign: 'left',
        color: '#777684',
    },
    unreadText: {
        flex: 1, fontSize: 14, marginLeft: 15, textAlign: 'left',
        fontWeight: "600",
        color: 'black',

    }
});

