import React, { Component } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, TouchableWithoutFeedback, FlatList, ScrollView, NativeModules, ImageBackground, Dimensions } from 'react-native'
import { AppButton, AppImageComponent, SafeAreaComponent, CommonHeader, PopUp } from '../../components';
import { Strings, Assets, Dimen, Color, Styles, Constant, URL } from '../../../res/index';
import { TextInput } from 'react-native-gesture-handler';
import Constants from '../../../res/Constants';
import Session from '../../utils/Session';
import { NetworkManager, Utility, NavUtil } from '../../utils';
import { showToast } from '../../utils/Utility';
var ApplozicChat = NativeModules.ApplozicChat;
var screenHeight = Math.round(Dimensions.get('window').height);




class SessionDetailScreen extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            showDialog: false,
            colorSet: false,
            data: {},
            startCancelSession: Strings.session.startSession,
            student_id: this.props.route.params.student_id != '' ? this.props.route.params.student_id : '',
            session_id: this.props.route.params.session_id != '' ? this.props.route.params.session_id : '',
            session_Type: this.props.route.params.status != '' ? this.props.route.params.status : '',
            tutor_id: this.props.route.params.tutor_id != '' ? this.props.route.params.tutor_id : '',
            isPopVisible: false,
            bidPostedBy: {},
            bidDetails: {},
            userDetails: {},
            isCurrentSessionRated: false,
            isCurrentSessionDisputeRaised: false,
            verifyChargesDes: '',
            disputeDesc: '',
            disputeTime: '',
            disputeInfo: {},
            tutorViewProfile: 'TutorViewProfile',
            sessionTypeObj: { status: this.props.route.params.status },
            budget: '',
            bidPlaced: false,
            previousSessionObj: {},
            isCurrentUserStudent: this.isEmptyField(Session.sharedInstance.userDetails, Constants.userDetailsFields.is_student) != '' ? this.isEmptyField(Session.sharedInstance.userDetails, Constants.userDetailsFields.is_student) : '',

            // userId: this.props.route.params.userId != '' ? this.props.route.params.userId : '',
        }
    }

    async componentDidMount() {

        this.props.navigation.addListener('focus', async () => {
            console.log('this.props.route.params' + JSON.stringify(this.props.route.params))

            await this.sessionDetailApiHandler()
            await this.getPreviousSesionRatingApi()
            let isCurrentSessionRated
            let isCurrentSessionDisputeRaised
            let disputeDesc = ''
            let disputeTime = ''
            let disputeInfo = ''


            if ('rating' in this.state.bidPostedBy) {
                isCurrentSessionRated = Utility.sharedInstance.isRatingCompletedForCurrentSession(this.state.bidPostedBy.rating, this.state.session_id)
                this.setState({ rating: isCurrentSessionRated })

            } else {
                isCurrentSessionRated = false
            }
            if ('disputeInfo' in this.state.data) {
                disputeInfo = this.state.data.disputeInfo
                disputeDesc = this.state.data.disputeInfo.description
                disputeTime = this.state.data.disputeInfo.createdAt
                isCurrentSessionDisputeRaised = true
            } else {
                isCurrentSessionDisputeRaised = false
            }
            console.log('sessionTypeObj' + JSON.stringify(this.state.sessionTypeObj))
            console.log('isCurrentSessionDisputeRaised' + isCurrentSessionDisputeRaised + '  isCurrentSessionRated == > ' + isCurrentSessionRated)
            this.setState({ isCurrentSessionRated: !isCurrentSessionRated, isCurrentSessionDisputeRaised: !isCurrentSessionDisputeRaised, disputeDesc: disputeDesc, disputeTime: disputeTime, disputeInfo: disputeInfo })
        });
    }

    // getStorageData = async() =>{

    //     console.log("storageData ", JSON.stringify(Session.sharedInstance.userDetails[Constant.userDetailsFields.is_tutor]))
    // }

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

    render() {
        return (
            <View style={styles.container}>
                <ScrollView
                    contentContainerStyle={{ flexGrow: 1 }}
                    keyboardShouldPersistTaps='always'>
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

                                                {<View style={{ padding: 3, borderRadius: 5, justifyContent: 'center', alignItems: 'center', height: 30, width: 100, backgroundColor: Utility.sharedInstance.getStatuBackGroundColor(this.state.data) }}>
                                                    <Text style={{ color: Utility.sharedInstance.getStatuColor(this.state.data), fontWeight: '400' }}>{Utility.sharedInstance.getStatusN(this.state.data)}</Text>
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
                                    <View style={{ flex: 1, flexDirection: 'row' }}>
                                        <View style={{ flex: 1, justifyContent: 'space-between' }}>
                                            <View style={{}}>
                                                <Text style={styles.headertextStyle}>{Strings.homeScreen.sessionDate}</Text>
                                                <Text style={styles.desctextStyle}>{this.state.data.timestamp != '' ? Utility.sharedInstance.formatDate(this.state.data.timestamp) : ''}</Text>

                                            </View>
                                            <View>
                                                <Text style={styles.headertextStyle}>{Strings.session.budget}</Text>
                                                <Text style={[{ paddingTop: 5 }, styles.desctextStyle]}>{this.state.data.currency} {this.state.budget}</Text>
                                            </View>
                                        </View>
                                        {<View style={{ flex: 1, justifyContent: 'space-between' }}>
                                            <View style={{ paddingRight: 20 }}>
                                                <Text style={styles.headertextStyle}>{Strings.session.sessionTime}</Text>
                                                {this.state.data.timestamp && <Text style={[{ paddingTop: 5 }, styles.desctextStyle]}>{this.state.data.timestamp != '' ? Utility.sharedInstance.formatTimeinHour(this.state.data.timestamp) : ''}</Text>}
                                            </View>
                                            {Session.sharedInstance.userDetails[Constant.userDetailsFields.is_tutor] == true && Session.sharedInstance.userDetails[Constant.userDetailsFields.isVerified] == true && (this.state.data.status != Constant.sessionType.active || this.state.data.status != Constant.sessionType.upcoming) && Utility.sharedInstance.isEmpty(this.state.bidPostedBy) != true && <View>
                                                <Text style={styles.headertextStyle}>Posted By</Text>
                                                <Text style={[{ paddingTop: 5 }, styles.desctextStyle]}> {this.state.bidPostedBy.name}</Text>
                                            </View>}
                                        </View>}
                                    </View>
                                </View>
                                {this.state.data.image_urls != 0 && <View style={{ flex: .32 }}>
                                    {<Text style={{ fontSize: 12, fontWeight: '500', color: Color.textColor.resendOtp, paddingTop: 0 }}>{Strings.session.images}</Text>}

                                    <View style={{ flex: 0.5, alignItems: 'flex-start', paddingTop: 10 }}>
                                        <FlatList
                                            numColumns={3}
                                            contentContainerStyle={{ flexGrow: 1, }}
                                            data={this.state.data.image_urls}
                                            renderItem={this.renderUserDoubtImagesItem}
                                            ItemSeparatorComponent={() => <View style={{ padding: 5 }}></View>} />
                                    </View>
                                </View>}
                            </View>
                            <View style={{ flex: .015, backgroundColor: '#000000', borderWidth: 1, opacity: .10 }}></View>
                            <View style={{ flex: .15, paddingHorizontal: 25 }}>
                                {this.sessionWithView()}
                                <View style={{ flex: .9, justifyContent: 'flex-end', alignItems: 'center', paddingBottom: 20 }}>
                                    {this.buttonViewer()}
                                    <View style={styles.buttonSeprateView}></View>
                                    {this.cancelButton()}
                                </View>
                            </View>
                        </View>
                    </View>
                </ScrollView>
                <PopUp
                    isPopVisible={this.state.isPopVisible}
                    headerText={this.state.startCancelSession == Strings.session.startSession ? Strings.session.makePaymentTitle : Strings.session.rescheduleTitle}
                    descriptionText={this.state.startCancelSession == Strings.session.startSession ? Strings.session.makePaymentSubTitle : this.state.verifyChargesDes != '' ? this.state.verifyChargesDes : Strings.session.rescheduleSubTitle}
                    rightButtonText={Strings.session.yes}
                    leftButtonText={Strings.session.no}
                    rightButtonOnPress={async () => {
                        if (Session.sharedInstance.userDetails[Constants.userDetailsFields.is_student]) {
                            if (this.state.startCancelSession == Strings.session.cancelSession) {
                                this.setState({ isPopVisible: false })
                                let _tempData = this.state.data
                                _tempData.isReschedule = true
                                Utility.sharedInstance.navigation.navigate('BookSession', { data: _tempData })
                            } else {
                            }
                        } else {
                            this.setState({ isPopVisible: false })
                            this.rescheduleTutorApiHandler()
                        }
                    }}
                    leftButtonOnPress={() => {
                        if (this.state.startCancelSession == Strings.session.cancelSession) {
                            this.setState({ isPopVisible: false })
                            Utility.sharedInstance.navigation.navigate('CancellationReasonScreen', { session_id: this.state.session_id })
                        } else {
                        }
                    }}
                />
            </View >
        )
    };

    sessionWithView() {

        switch (this.state.data.status) {
            case Constant.sessionType.onGoing:
                return (<View style={{ flex: .1 }}>
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
                                    onPress={() => this.props.navigation.navigate('TutorViewProfile',
                                        {
                                            bidPosterProfileImage: this.state.bidPostedBy.profile_picture,
                                            bidPosterName: this.state.bidPostedBy.name,
                                            ratingValue: Utility.sharedInstance.averageRating(this.state.rating),
                                            bidAmountPass: `${this.state.bidDetails[0].currency} ${this.state.bidDetails[0].bid_amount}`,
                                            detailsProposal: this.state.bidDetails[0].description,
                                            qualification: this.state.bidPostedBy.qualification,
                                            education: this.state.bidPostedBy.is_student ? this.state.bidPostedBy.student_education : this.state.bidPostedBy.tutor_education,
                                            teachingSubject: this.state.bidPostedBy.tutor_education_details == 0 ? '' : this.state.bidPostedBy.tutor_education_details[0].tutor_teaching_subject

                                        })
                                    }
                                >
                                    <Text style={{ color: Color.textColor.sessionProfileText, fontSize: 12, fontWeight: '700' }}>
                                        {Strings.session.viewProfile}
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                        <TouchableOpacity
                            onPress={() => ApplozicChat.openChatWithUser(this.state.bidPostedBy.email)}>
                            <Image
                                source={Assets.session.chatIcon}
                                style={{ width: 24, height: 24, marginTop: 10 }}
                            ></Image>
                        </TouchableOpacity>
                    </View>
                </View>)
                break
            case Constant.sessionType.started:
                return (<View style={{ flex: .1 }}>
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
                                    onPress={() => this.props.navigation.navigate('TutorViewProfile',
                                        {
                                            bidPosterProfileImage: this.state.bidPostedBy.profile_picture,
                                            bidPosterName: this.state.bidPostedBy.name,
                                            ratingValue: Utility.sharedInstance.averageRating(this.state.rating),
                                            bidAmountPass: `${this.state.bidDetails[0].currency} ${this.state.bidDetails[0].bid_amount}`,
                                            detailsProposal: this.state.bidDetails[0].description,
                                            qualification: this.state.bidPostedBy.qualification,
                                            education: this.state.bidPostedBy.is_student ? this.state.bidPostedBy.student_education : this.state.bidPostedBy.tutor_education,
                                            teachingSubject: this.state.bidPostedBy.tutor_education_details == 0 ? '' : this.state.bidPostedBy.tutor_education_details[0].tutor_teaching_subject
                                        })
                                    }
                                >
                                    <Text style={{ color: Color.textColor.sessionProfileText, fontSize: 12, fontWeight: '700' }}>
                                        {Strings.session.viewProfile}
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                        <TouchableOpacity
                            onPress={() => ApplozicChat.openChatWithUser(this.state.bidPostedBy.email)}>
                            <Image
                                source={Assets.session.chatIcon}
                                style={{ width: 24, height: 24, marginTop: 10 }}
                            ></Image>
                        </TouchableOpacity>
                    </View>
                </View>)
                break
            case Constant.sessionType.completed:
                if (!this.state.isCurrentSessionDisputeRaised) {
                    return (<View style={{ flex: .1 }}>
                        <Text style={{ color: Color.textColor.resendOtp, fontSize: 12, fontWeight: '500', paddingTop: 15 }}>{Strings.session.openThreadDispute}</Text>
                        <TouchableOpacity style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}
                            onPress={() => NavUtil.navUtil.navigateTo(this, Constants.routeName.disputeDetails, { disputeInfo: this.state.disputeInfo })}>
                            <View style={{ alignItems: 'flex-start', paddingTop: 10, flexDirection: 'row' }}>
                                <View>
                                    <Text style={{ fontSize: 16, fontWeight: '500', color: Color.textColor.otpInput, paddingVertical: 3 }}>
                                        {this.state.disputeDesc.includes('Other_') ? this.state.disputeDesc.replace('Other_', '') : this.state.disputeDesc}
                                    </Text>
                                    <Text style={{ color: Color.textColor.sessionProfileText, fontSize: 12, }}>
                                        {Utility.sharedInstance.formatDate(this.state.disputeTime)} | {Utility.sharedInstance.raiseDisputeTimeFormat(this.state.disputeTime)}
                                    </Text>
                                </View>
                            </View>
                            <View>
                                <Image style={{ width: 25, height: 25 }} source={Assets.settings.arrowForward} />
                            </View>

                        </TouchableOpacity>
                    </View>)

                }
                break
            default:
                break;
        }
        return (
            <View>
            </View>
        )
    }


    buttonViewer() {
        //console.log("Buttonviewerstatus ", this.state.data.status)
        switch (this.state.data.status) {
            case Constant.sessionType.active:
                if (Session.sharedInstance.userDetails[Constant.userDetailsFields.is_tutor] && Session.sharedInstance.userDetails[Constant.userDetailsFields.isVerified]) {
                    if (!this.state.bidPlaced) {
                        return (
                            <AppButton
                                buttonStyle={styles.actionButtonStyle}
                                onPress={() => {
                                    if ('isPreviousSessionRated' in this.state.previousSessionObj) {
                                        if (!this.state.previousSessionObj.isPreviousSessionRated && this.state.previousSessionObj != {}) {
                                            NavUtil.navUtil.navigateTo(this, Constants.routeName.ratetutorScreen,
                                                {
                                                    session_id: this.state.previousSessionObj.sessionId,
                                                    student_id: this.state.previousSessionObj.studentId,
                                                    name: this.state.previousSessionObj.name,
                                                    profile_pic: this.state.previousSessionObj.profile_pic,
                                                    qualification: this.state.previousSessionObj.qualification
                                                })
                                        } else {
                                            NavUtil.navUtil.navigateTo(this, Constants.routeName.BidPlace, { session_id: this.state.session_id, data: this.state.data })
                                        }
                                    } else {
                                        NavUtil.navUtil.navigateTo(this, Constants.routeName.BidPlace, { session_id: this.state.session_id, data: this.state.data })
                                    }
                                }
                                }
                                isEnabled={true}
                                camelCaseText={Strings.session.placeABid.toUpperCase()}
                                isUpperCase={true}
                                buttonTextStyle={{ fontSize: 14 }}
                            />
                        )
                    }
                } else {
                    return null
                }
                break;
            case Constant.sessionType.upcoming:

                if (Session.sharedInstance.userDetails[Constant.userDetailsFields.is_tutor] && Session.sharedInstance.userDetails[Constant.userDetailsFields.isVerified]) {
                    if (!this.state.bidPlaced) {
                        return (
                            <AppButton
                                buttonStyle={styles.actionButtonStyle}
                                onPress={() => {

                                    if ('isPreviousSessionRated' in this.state.previousSessionObj) {
                                        if (!this.state.previousSessionObj.isPreviousSessionRated && this.state.previousSessionObj != {}) {
                                            NavUtil.navUtil.navigateTo(this, Constants.routeName.ratetutorScreen,
                                                {
                                                    session_id: this.state.previousSessionObj.sessionId,
                                                    student_id: this.state.previousSessionObj.studentId,
                                                    name: this.state.previousSessionObj.name,
                                                    profile_pic: this.state.previousSessionObj.profile_pic,
                                                    qualification: this.state.previousSessionObj.qualification
                                                })
                                        } else {
                                            NavUtil.navUtil.navigateTo(this, Constants.routeName.BidPlace, { session_id: this.state.session_id, data: this.state.data })
                                        }
                                    } else {
                                        NavUtil.navUtil.navigateTo(this, Constants.routeName.BidPlace, { session_id: this.state.session_id, data: this.state.data })
                                    }
                                }}
                                isEnabled={true}
                                camelCaseText={Strings.session.placeABid.toUpperCase()}
                                isUpperCase={true}
                                buttonTextStyle={{ fontSize: 14 }}
                            />
                        )
                    } else {
                        // if bid placed 
                        return (
                            <AppButton
                                buttonStyle={styles.actionButtonStyle}

                                isEnabled={false}
                                camelCaseText={Strings.session.placeABid.toUpperCase()}
                                isUpperCase={true}
                                buttonTextStyle={{ fontSize: 14 }}
                            />
                        )
                    }
                } else {
                    return (

                        <AppButton
                            buttonStyle={styles.actionButtonStyle}
                            onPress={() => {
                                NavUtil.navUtil.navigateTo(this, Constants.routeName.bidList, { session_id: this.state.session_id, bid_id: this.state.bidDetails._id })
                            }
                            }
                            isEnabled={true}
                            camelCaseText={Strings.session.reviewBids.toUpperCase()}
                            isUpperCase={true}
                            buttonTextStyle={{ fontSize: 14 }}
                        />)
                }

                break;
            case Constant.sessionType.onGoing:
                if (Session.sharedInstance.userDetails[Constant.userDetailsFields.is_student]) {
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
                            NavUtil.navUtil.navigateTo(this, Constants.routeName.homeScreen)
                        }}
                    >
                        <Text style={[styles.textStyle, { fontWeight: '800', color: this.state.startCancelSession == Strings.session.startSession ? Color.secondayTextColor : Color.buttonColor.enableButton }]}>{Strings.session.startSession.toUpperCase()}</Text>
                    </TouchableOpacity>)
                }
                break;
            case Constant.sessionType.started:
                return (
                    <View style={{ width: '100%', paddingTop: 15, }}>
                        <View style={{ flex: 1 }}>
                            <AppButton
                                buttonStyle={styles.actionButtonStyle}
                                onPress={() => this.StartVideoCallSession()}
                                isEnabled={true}
                                camelCaseText={Strings.session.joinSession.toUpperCase()}
                                isUpperCase={true}
                                buttonTextStyle={{ fontSize: 14 }}
                            />
                        </View>
                        <View style={{ flex: 1, paddingTop: screenHeight > 667 ? 8 : 2 }}>
                            <AppButton
                                buttonStyle={styles.actionButtonStyle}
                                onPress={() => this.completeStatusApiHandler()}
                                isEnabled={true}
                                camelCaseText={Strings.session.maskasComplete.toUpperCase()}
                                isUpperCase={true}
                                buttonTextStyle={{ fontSize: 14 }}
                            />
                        </View>
                    </View>
                )
                break;
            case Constant.sessionType.completed:
                if (Session.sharedInstance.userDetails[Constants.userDetailsFields.is_tutor] && Session.sharedInstance.userDetails[Constant.userDetailsFields.isVerified]) {
                    if (this.state.bidPostedBy != undefined) {
                        if ('rating' in this.state.bidPostedBy) {
                            if (this.state.isCurrentSessionRated) {
                                return (
                                    <AppButton
                                        buttonStyle={styles.actionButtonStyle}
                                        onPress={() => {
                                            if (Session.sharedInstance.userDetails[Constant.userDetailsFields.is_student]) {
                                                NavUtil.navUtil.navigateTo(this, Constant.routeName.ratetutorScreen, {
                                                    tutor_id: this.state.bidDetails.tutor_id,
                                                    session_id: this.state.session_id,
                                                    name: this.state.bidPostedBy.name,
                                                    profile_pic: this.state.bidPostedBy.profile_picture,
                                                    qualification: this.state.bidPostedBy[Constant.userDetailsFields.qualification]
                                                })
                                            } else {
                                                NavUtil.navUtil.navigateTo(this, Constant.routeName.ratetutorScreen, {
                                                    student_id: this.state.data.student_id,
                                                    session_id: this.state.session_id,
                                                    name: this.state.bidPostedBy.name,
                                                    profile_pic: this.state.bidPostedBy.profile_picture,
                                                    qualification: this.state.bidPostedBy[Constant.userDetailsFields.qualification]
                                                })
                                            }
                                        }}
                                        isEnabled={true}
                                        camelCaseText={Strings.session.submitReview.toUpperCase()}
                                        isUpperCase={true}
                                        buttonTextStyle={{ fontSize: 14 }}
                                    />
                                )
                            } else if (this.state.isCurrentSessionDisputeRaised) {

                                return (
                                    <AppButton
                                        buttonStyle={styles.actionButtonStyle}
                                        onPress={() => {
                                            if (Session.sharedInstance.userDetails[Constant.userDetailsFields.is_student]) {
                                                NavUtil.navUtil.navigateTo(this, Constant.routeName.raiseDisputeScreen, {
                                                    tutor_id: this.state.bidDetails.tutor_id,
                                                    session_id: this.state.session_id,
                                                    name: this.state.bidPostedBy.name,
                                                    profile_pic: this.state.bidPostedBy.profile_picture,
                                                    qualification: this.state.bidPostedBy[Constant.userDetailsFields.qualification]
                                                })
                                            } else {
                                                NavUtil.navUtil.navigateTo(this, Constant.routeName.raiseDisputeScreen, {
                                                    student_id: this.state.data.student_id, session_id: this.state.session_id,
                                                    name: this.state.bidPostedBy.name,
                                                    profile_pic: this.state.bidPostedBy.profile_picture,
                                                    qualification: this.state.bidPostedBy[Constant.userDetailsFields.qualification]
                                                })
                                            }
                                        }}
                                        isEnabled={true}
                                        camelCaseText={Strings.session.raisedispute.toUpperCase()}
                                        isUpperCase={true}
                                        buttonTextStyle={{ fontSize: 14 }}
                                    />
                                )
                            } else {

                            }

                        }
                        // if (this.state.bidPostedBy.rating.length != undefined) {

                        // }
                    }



                } else {
                    if (this.state.isCurrentSessionRated) {
                        return (
                            <AppButton
                                buttonStyle={styles.actionButtonStyle}
                                onPress={() => {
                                    if (Session.sharedInstance.userDetails[Constant.userDetailsFields.is_student]) {
                                        NavUtil.navUtil.navigateTo(this, Constant.routeName.ratetutorScreen, {
                                            tutor_id: this.state.bidDetails.tutor_id,
                                            session_id: this.state.session_id,
                                            name: this.state.bidPostedBy.name,
                                            profile_pic: this.state.bidPostedBy.profile_picture,
                                            qualification: this.state.bidPostedBy.qualification
                                        })
                                    } else {
                                        NavUtil.navUtil.navigateTo(this, Constant.routeName.ratetutorScreen, {
                                            student_id: this.state.bidDetails.student_id,
                                            session_id: this.state.session_id,
                                            name: this.state.bidPostedBy.name,
                                            profile_pic: this.state.bidPostedBy.profile_picture,
                                            qualification: this.state.bidPostedBy.qualification
                                        })
                                    }
                                }}
                                isEnabled={true}
                                camelCaseText={Strings.session.submitReview.toUpperCase()}
                                isUpperCase={true}
                                buttonTextStyle={{ fontSize: 14 }}
                            />
                        )
                    } else
                        if (this.state.isCurrentSessionDisputeRaised) {
                            return (
                                <AppButton
                                    buttonStyle={styles.actionButtonStyle}
                                    onPress={() => {
                                        if (Session.sharedInstance.userDetails[Constant.userDetailsFields.is_student]) {
                                            NavUtil.navUtil.navigateTo(this, Constant.routeName.raiseDisputeScreen, {
                                                tutor_id: this.state.bidDetails.tutor_id,
                                                session_id: this.state.session_id,
                                                name: this.state.bidPostedBy.name,
                                                profile_pic: this.state.bidPostedBy.profile_picture,
                                                qualification: this.state.bidPostedBy[Constant.userDetailsFields.qualification]
                                            })
                                        } else {
                                            NavUtil.navUtil.navigateTo(this, Constant.routeName.raiseDisputeScreen, {
                                                student_id: this.state.bidDetails.student_id,
                                                session_id: this.state.session_id,
                                                name: this.state.bidPostedBy.name,
                                                profile_pic: this.state.bidPostedBy.profile_picture,
                                                qualification: this.state.bidPostedBy[Constant.userDetailsFields.qualification]
                                            })
                                        }
                                    }}
                                    isEnabled={true}
                                    camelCaseText={Strings.session.raisedispute.toUpperCase()}
                                    isUpperCase={true}
                                    buttonTextStyle={{ fontSize: 14 }}
                                />
                            )
                        } else {


                        }

                    // if (this.state.bidPostedBy.rating.length != undefined) {



                }
                break;
            default:
                break;
        }

    }

    StartVideoCallSession = async () => {

        // NavUtil.navUtil.navigateTo(this, Constants.routeName.VideoCall)
        let data = {}

        data.user_type = (Session.sharedInstance.userDetails[Constant.userDetailsFields.is_student]) ? "student" : "tutor";
        data.session_id = this.state.session_id
        data.user_id = Session.sharedInstance.userDetails[Constant.userDetailsFields._id];

        const res = await NetworkManager.networkManagerInstance.fetchRequest(URL.videoCallSessionStart, URL.postRequest, true, data, () => this.placeBid())
        console.log("video call res", JSON.stringify(res))
        if (res.statusCode == 200) {
            NavUtil.navUtil.navigateTo(this, Constants.routeName.VideoCall, {

                sessionId: res.data.opentokResponse.sessionId,
                token: res.data.opentokResponse.tokens.token1,
                ringerName: res.data.ringerName
            })
            //  NavUtil.navUtil.navigateTo(this, Constants.routeName.BidplaceSuccess)
            //  this.setState({ activeSession: res.data.result, scheduleSession: res.data.Ongoing })
        } else {
            console.log('Video call FAILED')
        }

    }

    cancelButton = () => {

        switch (this.state.data.status) {
            case Constant.sessionType.active:
                if (Session.sharedInstance.userDetails[Constant.userDetailsFields.is_student]) {
                    return (

                        <AppButton
                            buttonStyle={styles.cancelButtonStyle}
                            onPress={() => {
                                this.setState({ startCancelSession: Strings.session.cancelSession, isPopVisible: true })
                            }}
                            isEnabled={true}
                            camelCaseText={Strings.session.cancelSession.toUpperCase()}
                            isUpperCase={true}
                            buttonTextStyle={{ color: Color.buttonColor.enableButton, fontSize: 14 }}

                        />

                    )
                }
                break;
            case Constant.sessionType.started:
                if (Session.sharedInstance.userDetails[Constant.userDetailsFields.is_tutor] && Session.sharedInstance.userDetails[Constant.userDetailsFields.isVerified]) {
                    return (

                        <AppButton
                            buttonStyle={styles.cancelButtonStyle}
                            onPress={() => {
                                this.tutorVerifyCharges().
                                    then(() => this.setState({ startCancelSession: Strings.session.cancelSession }))
                                    .catch(() => console.log('Network Request Failed'))

                            }}
                            isEnabled={true}
                            camelCaseText={Strings.session.cancelSession.toUpperCase()}
                            isUpperCase={true}
                            buttonTextStyle={{ color: Color.buttonColor.enableButton, fontSize: 14 }}

                        />

                    )
                } else {
                    return (

                        <AppButton
                            buttonStyle={styles.cancelButtonStyle}
                            onPress={() => {
                                this.setState({ startCancelSession: Strings.session.cancelSession, isPopVisible: true })
                            }}
                            isEnabled={true}
                            camelCaseText={Strings.session.cancelSession.toUpperCase()}
                            isUpperCase={true}
                            buttonTextStyle={{ color: Color.buttonColor.enableButton, fontSize: 14 }}

                        />

                    )
                }
                break;
            case Constant.sessionType.onGoing:
                if (Session.sharedInstance.userDetails[Constant.userDetailsFields.is_tutor] && Session.sharedInstance.userDetails[Constant.userDetailsFields.isVerified]) {
                    return (
                        <AppButton
                            buttonStyle={styles.cancelButtonStyle}
                            onPress={() => {
                                this.setState({ startCancelSession: Strings.session.cancelSession })
                                this.tutorVerifyCharges()
                            }
                            }
                            isEnabled={true}
                            camelCaseText={Strings.session.cancelSession.toUpperCase()}
                            isUpperCase={true}
                            buttonTextStyle={{ color: Color.buttonColor.enableButton, fontSize: 14 }}

                        />
                    )
                }
                break;
            case Constant.sessionType.started:
                if (Session.sharedInstance.userDetails[Constant.userDetailsFields.is_student]) {
                    return (
                        <AppButton
                            buttonStyle={styles.cancelButtonStyle}
                            onPress={() => {
                                this.setState({ startCancelSession: Strings.session.cancelSession, isPopVisible: true })
                            }
                            }
                            isEnabled={true}
                            camelCaseText={Strings.session.cancelSession.toUpperCase()}
                            isUpperCase={true}
                            buttonTextStyle={{ color: Color.buttonColor.enableButton, fontSize: 14 }}

                        />
                    )
                }
                break;

            default:
                break;
        }
    }

    sessionDetailApiHandler = async () => {
        console.log('Session.sharedInstance.userDetails[Constant.userDetailsFields.is_tutor]' + Session.sharedInstance.userDetails[Constant.userDetailsFields._id])
        let data = {}
        let api = ''
        data.session_id = this.state.session_id
        if (Session.sharedInstance.userDetails[Constant.userDetailsFields.is_tutor] && Session.sharedInstance.userDetails[Constant.userDetailsFields.isVerified]) {
            // if (this.state.session_Type.localeCompare(Constants.sessionType.active) === 0) {
            //     api = URL.newlyAddedSessionDetail
            //     data.tutor_id = Session.sharedInstance.userDetails[Constant.userDetailsFields._id]
            //     // data.status = this.state.session_Type
            // } else if (this.state.session_Type.localeCompare(Constants.sessionType.upcoming) === 0) {
            //     api = URL.newlyAddedSessionDetail
            //     data.tutor_id = Session.sharedInstance.userDetails[Constant.userDetailsFields._id]
            //     // data.status = this.state.session_Type
            // } else {
            //     api = URL.getTutorSessionDetail
            //     data.tutor_id = Session.sharedInstance.userDetails[Constant.userDetailsFields._id]
            //     // data.status = this.state.session_Type
            // }
            api = URL.getTutorSessionDetail
            data.tutor_id = Session.sharedInstance.userDetails[Constant.userDetailsFields._id]

        } else {
            api = URL.sessionDetail
            data.student_id = Session.sharedInstance.userDetails[Constant.userDetailsFields._id]

        }
        console.log('this is checking api name', api)
        const res = await NetworkManager.networkManagerInstance.fetchRequest(api, URL.postRequest, true, data, () => this.sessionDetailApiHandler())
        if (res.statusCode == 200) {
            if (__DEV__) console.log("sessiondetailsasdfasdfsaf", JSON.stringify(res.data[0]))
            if (Session.sharedInstance.userDetails[Constants.userDetailsFields.is_tutor]) {
                if (this.state.session_Type == Constants.sessionType.active || this.state.session_Type == Constants.sessionType.upcoming) {
                    let budget = res.data[0].budget
                    let bidStatus = this.settingBidStatus(res)
                    this.setState({ data: res.data[0], budget: budget })

                } else if (this.state.session_Type == Constants.sessionType.completed) {
                    let bidAmount = ''
                    try {
                        let filterData = res.data[0].bidPosted.bid_amount
                        bidAmount = filterData
                    } catch (error) {
                        bidAmount = ''
                    }

                    // let filterData = res.data[0].bidPosted.filter((obj) => obj.status == 'Accept')
                    // let bidAmount = filterData[0].bid_amount != '' ?  filterData[0].bid_amount : '' 
                    //     console.log('JSON.stringify(filterData)==>>' + JSON.stringify(filterData))

                    console.log('==========>>>>>' + bidAmount)
                    this.setState({
                        data: res.data[0], budget: bidAmount,
                        bidPostedBy: res.data[0].BidPostedBy[0] != undefined ? res.data[0].BidPostedBy[0] : '', bidDetails: res.data[0].bidPosted != undefined ? res.data[0].bidPosted : '', session_Type: this.state.data.status
                    })
                }
                else {
                    let bidAmount = ''
                    try {
                        let filterData = res.data[0].bidPosted.filter((obj) => obj.status == 'Accept' || obj.status == 'Started' || obj.status == 'Completed')
                        bidAmount = filterData[0].bid_amount != '' ? filterData[0].bid_amount : ''
                    } catch (error) {
                        bidAmount = ''
                    }

                    // let filterData = res.data[0].bidPosted.filter((obj) => obj.status == 'Accept')
                    // let bidAmount = filterData[0].bid_amount != '' ?  filterData[0].bid_amount : '' 
                    //     console.log('JSON.stringify(filterData)==>>' + JSON.stringify(filterData))

                    console.log('==========>>>>>' + bidAmount)
                    this.setState({
                        data: res.data[0], budget: bidAmount,
                        bidPostedBy: res.data[0].BidPostedBy[0] != undefined ? res.data[0].BidPostedBy[0] : '', bidDetails: res.data[0].bidPosted != undefined ? res.data[0].bidPosted : '', session_Type: this.state.data.status
                    })
                }
            }
            else {
                if (this.state.session_Type == Constants.sessionType.active || this.state.session_Type == Constants.sessionType.upcoming) {
                    let budget = res.data[0].budget


                    this.setState({ data: res.data[0], budget: budget })
                } else if (this.state.session_Type == Constants.sessionType.completed) {
                    let bidAmount = ''
                    try {
                        let filterData = res.data[0].bidPosted.bid_amount
                        bidAmount = filterData
                    } catch (error) {
                        bidAmount = ''
                    }

                    // let filterData = res.data[0].bidPosted.filter((obj) => obj.status == 'Accept')
                    // let bidAmount = filterData[0].bid_amount != '' ?  filterData[0].bid_amount : '' 
                    //     console.log('JSON.stringify(filterData)==>>' + JSON.stringify(filterData))

                    console.log('==========>>>>>' + bidAmount)
                    this.setState({
                        data: res.data[0], budget: bidAmount,
                        bidPostedBy: res.data[0].BidPostedBy[0] != undefined ? res.data[0].BidPostedBy[0] : '', bidDetails: res.data[0].bidPosted != undefined ? res.data[0].bidPosted : '', session_Type: this.state.data.status
                    })
                }
                else {
                    let bidAmount = ''
                    try {
                        let filterData = res.data[0].bidPosted.filter((obj) => obj.status == 'Accept' || obj.status == 'Started' || obj.status == 'Completed')
                        bidAmount = filterData[0].bid_amount != '' ? filterData[0].bid_amount : ''
                    } catch (error) {
                        bidAmount = ''
                    }
                    this.setState({
                        data: res.data[0], budget: bidAmount,
                        bidPostedBy: res.data[0].BidPostedBy[0] != undefined ? res.data[0].BidPostedBy[0] : '', bidDetails: res.data[0].bidPosted != undefined ? res.data[0].bidPosted : '', session_Type: this.state.data.status
                    })
                }
            }
        }
        else {
            console.log('BOOKING FAILED')
        }
    }


    settingBidStatus(data) {
        try {
            if ('bidPosted' in data.data[0]) {
                if (data.data[0].bidPosted[0].status == 'Applied') {
                    this.setState({ bidPlaced: true })
                }

            }
        } catch (error) {

        }
    }

    startSessionApiHandler = async () => {

        let data = {}

        data.student_id = Session.sharedInstance.userDetails[Constant.userDetailsFields._id]
        data.session_id = this.state.session_id
        for (var isBidCheck in this.state.bidDetails) {
            if (this.state.bidDetails[isBidCheck].status == 'Accept') {
                data.bid_id = this.state.bidDetails[isBidCheck]._id
            }

        }

        const res = await NetworkManager.networkManagerInstance.fetchRequest(URL.startSession, URL.putRequest, true, data, () => this.startSessionApiHandler())
        if (res.statusCode == 200) {
            console.log('JSON.stringify(res.data)' + JSON.stringify(res.data))
            this.props.navigation.navigate(Constant.routeName.homeScreen)

        } else {
            console.log('START SESSION API FAILURE')
        }
    }

    rescheduleTutorApiHandler() {
        let session_id = this.state.session_id
        this.props.navigation.navigate('ReScheduleSession', { session_id: this.state.session_id })
    }

    async completeStatusApiHandler() {
        let data = {}
        data.session_id = this.state.session_id
        data.current_user_type = this.state.isCurrentUserStudent ? Constants.userType.lowerCaseStudent : Constants.userType.lowerCaseTutor
        const res = await NetworkManager.networkManagerInstance.fetchRequest(URL.completeSession, URL.postRequest, true, data, () => this.completeStatusApiHandler())
        if (res.statusCode == 200) {
            showToast('Session Completed')
            if (Session.sharedInstance.userDetails[Constant.userDetailsFields.is_tutor] && Session.sharedInstance.userDetails[Constant.userDetailsFields.isVerified]) {
                this.setState({ userDetails: res.data.student })
                NavUtil.navUtil.navigateTo(this, Constant.routeName.ratetutorScreen, {
                    student_id: res.data.student._id,
                    session_id: this.state.session_id,
                    profile_pic: this.state.bidPostedBy.profile_picture,
                    name: this.state.bidPostedBy.name,
                    qualification: this.state.bidPostedBy.qualification
                })
            } else {
                this.setState({ userDetails: res.data.tutor })
                NavUtil.navUtil.navigateTo(this, Constant.routeName.ratetutorScreen, { tutor_id: res.data.tutor._id, session_id: this.state.session_id, profile_pic: this.state.bidPostedBy.profile_picture, qualification: this.state.bidPostedBy.qualification, name: this.state.bidPostedBy.name })
            }
        } else {
            showToast(res.message)
            console.log('START SESSION API FAILURE')
        }
    }
    tutorVerifyCharges = async () => {
        let data = {}
        let api = ''

        if (Session.sharedInstance.userDetails[Constant.userDetailsFields.is_tutor] && Session.sharedInstance.userDetails[Constant.userDetailsFields.isVerified]) {
            api = URL.tutorVerifyCharges
            data.tutor_id = Session.sharedInstance.userDetails[Constant.userDetailsFields._id]
        } else {
            api = URL.studentVerifyCharges
            data.tutor_id = Session.sharedInstance.userDetails[Constant.userDetailsFields._id]
        }

        data.session_id = this.props.route.params.session_id != '' ? this.props.route.params.session_id : ''
        data.type = Constant.verifyCharges.reschedule
        // Do you want to cancel this session? You would be charged a cancelletion fee of $5.
        const res = await NetworkManager.networkManagerInstance.fetchRequest(api, URL.postRequest, true, data, () => this.tutorVerifyCharges())
        if (res.statusCode == 200) {
            if (res.data.displayMessage.percentage_value != '') {
                this.setState({ verifyChargesDes: `Do you want to reschedule this session? You would be charged a reschedule fee of ` + res.data.displayMessage.currency_code + ' ' + res.data.displayMessage.percentage_value, isPopVisible: true })
            } else {
                this.setState({
                    verifyChargesDes: `Do you want to reschedule this session?`, isPopVisible: true
                })
            }
        } else {
            console.log('TUTOR VERIFY CHARGES FAILED')
        }
    }

    renderUserDoubtImagesItem = ({ item, index }) => {
        return (
            <View style={{ paddingRight: 20 }}>
                <Image style={{ height: 80, width: 80, }} source={{ uri: item }} />

            </View>
        )
    }


    getPreviousSesionRatingApi = async () => {
        let data = {}
        data.tutor_id = Session.sharedInstance.userDetails[Constants.userDetailsFields._id]
        let res = await NetworkManager.networkManagerInstance.fetchRequest(URL.checkPreviousSessionRatedTutor, URL.postRequest, true, data, () => this.getPreviousSesionRatingApi())
        if (res.statusCode == 200) {
            this.setState({ previousSessionObj: res.data })
        }
    }
};

export default SessionDetailScreen;

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
    },
    cancelButtonStyle: { alignSelf: 'center', width: '95%', marginBottom: 20, backgroundColor: Color.appBackgroundColor, borderColor: Color.buttonColor.enableButton, borderWidth: 1, borderRadius: 25, },
    actionButtonStyle: { alignSelf: 'center', width: '95%', marginBottom: 20 },

});