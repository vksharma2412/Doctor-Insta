import React, { Component } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, TouchableWithoutFeedback, FlatList, ScrollView, NativeModules, ImageBackground } from 'react-native'
import { AppButton, AppImageComponent, SafeAreaComponent, CommonHeader, PopUp } from '../../components';
import { Strings, Assets, Dimen, Color, Styles, Constant, URL } from '../../../res/index';
import { TextInput } from 'react-native-gesture-handler';
import Constants from '../../../res/Constants';
import Session from '../../utils/Session';
import { NetworkManager, Utility, NavUtil } from '../../utils';
var ApplozicChat = NativeModules.ApplozicChat;




class TutorSessionDetails extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            showDialog: false,
            colorSet: false,
            data: {},
            // startCancelSession: Strings.session.startSession,
            // student_id: this.props.route.params.student_id != '' ? this.props.route.params.student_id : '',
            // session_id: this.props.route.params.session_id != '' ? this.props.route.params.session_id : '',
            // session_Type: this.props.route.params.status != '' ? this.props.route.params.status : '',
            // isPopVisible: false,
            bidPostedBy: {},
            bidDetails: {}
            // userId: this.props.route.params.userId != '' ? this.props.route.params.userId : '',
        }
    }

    async componentDidMount() {
        await this.sessionDetailApiHandler()
    }


    render() {
        return (
            <View style={styles.container}>
                <ScrollView
                    contentContainerStyle={{ flexGrow: 1 }}
                    keyboardShouldPersistTaps='always'
                >
                    <View style={{ flex: 1 }}>
                        <View style={styles.topView}>

                            <CommonHeader
                                backImage={Assets.common.blackBackButton}
                                headerTitleColor={Color.appBackgroundColor}
                                leftIconStyle={{ tintColor: Color.secondayTextColor }}
                                headerTtileFontWieght={'600'}
                                headerTitleFontsize={16}
                                headerTrue={'Session Detail'}
                            />
                        </View>

                        <View style={styles.bottomView}>
                            <View style={{ flex: .80, paddingHorizontal: 25 }}>
                                <View style={{ flex: .68 }}>
                                    <View style={{ flex: 1, justifyContent: 'center' }}>
                                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingTop: 25 }}>
                                            <View style={{ flex: 0.7 }}>
                                                <Text style={{ fontSize: 20, fontWeight: 'bold', color: Color.textColor.quarternary, }}>{this.state.data.subjects}</Text>
                                            </View>
                                            <View style={{ flex: 0.3, alignItems: 'flex-end' }}>

                                                {(this.state.session_Type == Constant.sessionType.active || this.state.session_Type == Constant.sessionType.upcoming) && <View style={{ padding: 3, borderRadius: 5, justifyContent: 'center', alignItems: 'center', height: 30, width: 70, backgroundColor: this.state.session_Type == Constants.sessionType.active ? Color.introColor.activeBackground : Color.introColor.appliedBackgroundColor }}>
                                                    <Text style={{ color: this.state.session_Type == Constants.sessionType.active ? Color.textColor.activeTextColor : Color.textColor.appliedText, fontWeight: '400' }}>{Utility.sharedInstance.getStatus(this.state.session_Type)}</Text>
                                                </View>}
                                            </View>
                                        </View>
                                        {this.state.data.urgent_booking == true && <Text style={{ fontSize: 12, fontWeight: '700', color: Color.textColor.pentaColor, paddingVertical: 1 }}>Urgent Requirment</Text>}
                                    </View>

                                    <View style={{ flex: 1 }}>
                                        <Text style={[{ paddingTop: 0 }, styles.headertextStyle]}>{Strings.session.topic}</Text>
                                        <Text style={styles.desctextStyle}>{this.state.data.topic}</Text>
                                    </View>
                                    <View style={{ flex: 1 }}>
                                        <Text style={styles.headertextStyle}>{Strings.session.decreption}</Text>
                                        <Text style={[{ paddingVertical: 1, lineHeight: 25 }, styles.desctextStyle]}>{this.state.data.description}</Text>
                                    </View>

                                    <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between' }}>
                                        <View style={{}}>
                                            <Text style={styles.headertextStyle}>{Strings.homeScreen.sessionDate}</Text>
                                            <Text style={styles.desctextStyle}>{this.state.data.timestamp != '' ? Utility.sharedInstance.formatDate(this.state.data.timestamp) : ''}</Text>

                                        </View>

                                        <View style={{ paddingRight: 30 }}>
                                            <Text style={styles.headertextStyle}>{Strings.session.sessionTime}</Text>
                                            {this.state.data.timestamp && <Text style={[{ paddingTop: 5 }, styles.desctextStyle]}>{this.state.data.timestamp != '' ? Utility.sharedInstance.formatTimeinHour(this.state.data.timestamp) : ''}</Text>}

                                        </View>
                                    </View>
                                    <View style={{ flex: 1 }}>
                                        <Text style={styles.headertextStyle}>{Strings.session.budget}</Text>
                                        <Text style={[{ paddingTop: 5 }, styles.desctextStyle]}>{this.state.data.currency} {this.state.data.budget}</Text>
                                    </View>
                                </View>
                                {this.state.data.image_urls != 0 && <View style={{ flex: .32 }}>
                                    <Text style={{ fontSize: 12, fontWeight: '500', color: Color.textColor.resendOtp, paddingTop: 0 }}>{Strings.session.images}</Text>
                                    <View style={{ flex: 0.5, alignItems: 'flex-start', paddingTop: 10 }}>
                                        <FlatList
                                            numColumns={3}
                                            contentContainerStyle={{ flexGrow: 1, }}
                                            data={this.state.data.image_urls}
                                            renderItem={this.renderUserDoubtImagesItem}
                                            ItemSeparatorComponent={() => <View style={{ padding: 5 }}></View>}
                                        />
                                    </View>
                                </View>}
                            </View>

                            <View style={{ flex: 2, backgroundColor: '#000000', borderWidth: 1, opacity: .10 }}></View>

                            <View style={{ flex: .15, paddingHorizontal: 25 }}>
                                {this.state.session_Type != Constant.sessionType.active && this.state.session_Type != Constant.sessionType.upcoming && <View style={{ flex: .1 }}>
                                    <Text style={{ color: Color.textColor.resendOtp, fontSize: 12, fontWeight: '500', paddingTop: 15 }}>{Strings.session.sessionWith}</Text>
                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                        <View style={{ flexDirection: 'row' }}>
                                            <Image
                                                source={{ uri: this.state.bidPostedBy.profile_picture }}
                                                style={{ width: 40, height: 40, borderRadius: 20, marginTop: 10, }}
                                            ></Image>
                                            <View style={{ alignItems: 'flex-start', paddingLeft: 10, paddingTop: 10 }}>
                                                <Text style={{ fontSize: 16, fontWeight: '500', color: Color.textColor.otpInput, paddingVertical: 3 }}>
                                                    {this.state.bidPostedBy.name}
                                                </Text>
                                                <TouchableOpacity
                                                    onPress={() => alert('Development in Pregress')}
                                                >
                                                    <Text style={{ color: Color.textColor.sessionProfileText, fontSize: 12, fontWeight: '700' }}>
                                                        {Strings.session.viewProfile}
                                                    </Text>
                                                </TouchableOpacity>
                                            </View>
                                        </View>
                                        <TouchableOpacity
                                            onPress={() => ApplozicChat.openChatWithUser(this.state.bidPostedBy.email)}
                                        >
                                            <Image
                                                source={Assets.session.chatIcon}
                                                style={{ width: 24, height: 24, marginTop: 10 }}
                                            ></Image>
                                        </TouchableOpacity>

                                    </View>
                                </View>}
                                <View style={{ flex: .9, justifyContent: 'flex-end', alignItems: 'center', paddingBottom: 20 }}>

                                    {this.buttonViewer()}



                                </View>
                            </View>
                        </View>
                    </View>
                </ScrollView >
                <PopUp
                    isPopVisible={false}
                    headerText={this.state.startCancelSession == Strings.session.startSession ? Strings.session.makePaymentTitle : Strings.session.rescheduleTitle}
                    descriptionText={this.state.startCancelSession == Strings.session.startSession ? Strings.session.makePaymentSubTitle : Strings.session.rescheduleSubTitle}
                    rightButtonText={Strings.session.yes}
                    leftButtonText={Strings.session.no}
                    rightButtonOnPress={async () => {

                        if (this.state.startCancelSession == Strings.session.cancelSession) {
                            this.setState({ isPopVisible: false })
                            let _tempData = this.state.data
                            _tempData.isReschedule = true
                            Utility.sharedInstance.navigation.navigate('BookSession', { data: _tempData })

                        } else {
                        }
                    }}
                    leftButtonOnPress={() => {
                        if (this.state.startCancelSession == Strings.session.cancelSession) {
                            this.setState({ isPopVisible: false })
                            Utility.sharedInstance.navigation.navigate('CancellationReasonScreen', { student_id: this.state.student_id, session_id: this.state.session_id })

                        } else {

                        }

                    }}
                />
            </View >
        )
    };


    buttonViewer() {
        switch (this.state.session_Type) {
            case Constant.sessionType.active:
                return (<View></View>)

            case Constant.sessionType.upcoming:
                return (<TouchableOpacity
                    style={[styles.buttonContainer,
                    {
                        backgroundColor: this.state.startCancelSession == Strings.session.startSession ? Color.buttonColor.enableButton : Color.secondayTextColor,
                        borderWidth: 1,
                        borderColor: this.state.startCancelSession == Strings.session.startSession ? Color.secondayTextColor : Color.buttonColor.enableButton,
                    }]}
                    activeOpacity={0.8}
                    onPress={() => {
                        NavUtil.navUtil.navigateTo(this, Constants.routeName.bidList, { session_id: this.state.session_id })

                    }
                    }
                >
                    <Text style={[styles.textStyle, { fontWeight: '800', color: this.state.startCancelSession == Strings.session.startSession ? Color.secondayTextColor : Color.buttonColor.enableButton }]}>{Strings.session.reviewBids.toUpperCase()}</Text>
                </TouchableOpacity>)

            case Constant.sessionType.onGoing:
                return (<TouchableOpacity
                    style={[styles.buttonContainer,
                    {
                        backgroundColor: this.state.startCancelSession == Strings.session.startSession ? Color.buttonColor.enableButton : Color.secondayTextColor,
                        borderWidth: 1,
                        borderColor: this.state.startCancelSession == Strings.session.startSession ? Color.secondayTextColor : Color.buttonColor.enableButton,
                    }]}
                    activeOpacity={0.8}
                    onPress={async () => {
                        await this.startSessionApiHandler()
                        NavUtil.navUtil.navigateTo(this, Constants.routeName.landingScreen)
                        // alert('Start Session and Make Payment')
                        // this.setState({ startCancelSession: Strings.session.startSession, showDialog: true })
                        // this.props.navigation.navigate(''),
                    }
                    }
                >
                    <Text style={[styles.textStyle, { fontWeight: '800', color: this.state.startCancelSession == Strings.session.startSession ? Color.secondayTextColor : Color.buttonColor.enableButton }]}>{Strings.session.startSession.toUpperCase()}</Text>
                </TouchableOpacity>)

            case Constant.sessionType.started:
                return (<TouchableOpacity
                    style={[styles.buttonContainer,
                    {
                        backgroundColor: this.state.startCancelSession == Strings.session.startSession ? Color.buttonColor.enableButton : Color.secondayTextColor,
                        borderWidth: 1,
                        borderColor: this.state.startCancelSession == Strings.session.startSession ? Color.secondayTextColor : Color.buttonColor.enableButton,
                    }]}
                    activeOpacity={0.8}
                    onPress={() => {
                        alert('Join Session ')
                        // this.setState({ startCancelSession: Strings.session.startSession, showDialog: true })
                        // this.props.navigation.navigate(''),
                    }
                    }
                >
                    <Text style={[styles.textStyle, { fontWeight: '800', color: this.state.startCancelSession == Strings.session.startSession ? Color.secondayTextColor : Color.buttonColor.enableButton }]}>{Strings.session.joinSession.toUpperCase()}</Text>
                </TouchableOpacity>)

            case Constant.sessionType.active:
                return (<View></View>)

            default:
                break;
        }

    }


    sessionDetailApiHandler = async () => {

        let data = {}
        if (this.state.session_Type == Constants.sessionType.active) {
            // data.student_id = this.state.student_id
            data.session_id = this.state.session_id
            //  data.status = Constants.sessionType.active
        }
        if (this.state.session_Type) {
            // data.student_id = Session.sharedInstance.userDetails[Constant.userDetailsFields._id]
            data.session_id = this.state.session_id
        }
        const res = await NetworkManager.networkManagerInstance.fetchRequest(URL.sessionDetail, URL.postRequest, true, data, () => this.sessionDetailApiHandler())
        if (res.statusCode == 200) {
            if (this.state.session_Type == Constants.sessionType.active) {
                this.setState({ data: res.data })
            } else {
                this.setState({ data: res.data[0], bidPostedBy: res.data[0].BidPostedBy[0] != undefined ? res.data[0].BidPostedBy[0] : '', bidDetails: res.data[0].bidPosted != undefined ? res.data[0].bidPosted : '', })
            }

        } else {
            console.log('BOOKING FAILED')
        }
    }

    startSessionApiHandler = async () => {
        let data = {}
        data.student_id = Session.sharedInstance.userDetails[Constant.userDetailsFields._id]
        data.session_id = this.state.session_id
        data.bid_id = this.state.bidDetails._id

        const res = await NetworkManager.networkManagerInstance.fetchRequest(URL.startSession, URL.postRequest, true, data, () => this.startSessionApiHandler())
        if (res.statusCode == 200) {
            this.setState({ data: res.data })
        } else {
            console.log('START SESSION API FAILURE')
        }
    }





    renderUserDoubtImagesItem = ({ item, index }) => {
        return (

            <View style={{ paddingRight: 20 }}>
                <Image style={{ height: 80, width: 80, }} source={{ uri: item }} />

            </View>
        )
    }
};

export default TutorSessionDetails;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Color.textColor.pentaColor
    },

    topView: {
        flex: 0.08,
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: 20,
        paddingTop: 30
    },
    bottomView: {
        flex: .92,
        backgroundColor: Color.appBackgroundColor,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
    },
    buttonSeprateView: {
        flex: .28
    },

    buttonContainer: {
        height: 50,
        alignItems: 'center',
        justifyContent: 'center',
        width: '95%',
        borderRadius: 25,
    },

    textStyle: {
        fontSize: 16
    },
    headertextStyle: {
        fontSize: Dimen.verySmallTextSize,
        fontWeight: 'bold',
        color: Color.textColor.resendOtp,

    },
    desctextStyle: {
        fontSize: Dimen.smallTextSize,
        fontWeight: '700',
        color: Color.textColor.quarternary,
    }
});
