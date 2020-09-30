import React, { Component, createRef, } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, TextInput, ImageBackground, TouchableWithoutFeedback, KeyboardAvoidingView, ScrollView, Keyboard } from 'react-native'
import { AppButton, AppImageComponent, CommonHeader, SafeAreaComponent, InputTextField, AppTextInput, PopUp } from '../../components';
import { Strings, Assets, Dimen, Color, Styles, URL, Constant, AsyncStorageValues } from '../../../res/index';
import String from '../../../res/String';
import { Utility, NetworkManager } from '../../utils';





export default class TutorBidDetails extends Component {

    constructor(props) {
        super(props)
        this.state = {
            bidList: [],
            data: this.props.route.params.tutorDetails,
            updateBid: '',
            bid_id: this.props.route.params.bid_id != undefined ? this.props.route.params.bid_id : '',
            isPopVisible: false,
            skip: 0
        }
    }


    render() {
        console.log('this is data', this.state.data)
        return (
            <SafeAreaComponent>
                <ScrollView style={{ flexGrow: 1 }}>

                    <View style={{ flex: 1, height: Dimen.phoneHeight }}>
                        <View style={{ flex: 0.1, paddingTop: 10, marginHorizontal: 15 }}>
                            <CommonHeader
                                onPress={() => {
                                    this.props.navigation.goBack()
                                }}
                            />
                        </View>
                        {this.profileView()}
                        {this.tutorProposalDetails()}
                        {this.buttonView()}
                    </View>
                    <PopUp
                        isPopVisible={this.state.isPopVisible}
                        headerText={this.state.updateBid == Constant.updateBid.accept ? Strings.popUpMessage.acceptBid.header : Strings.popUpMessage.rejectBid.header}
                        descriptionText={this.state.updateBid == Constant.updateBid.accept ? Strings.popUpMessage.acceptBid.desc : Strings.popUpMessage.rejectBid.desc}
                        rightButtonText={Strings.session.yes}
                        leftButtonText={Strings.session.no}
                        rightButtonOnPress={this.updateBidApiHandler}
                        leftButtonOnPress={() => this.setState({ isPopVisible: false })}
                    />
                </ScrollView>


            </SafeAreaComponent>
        )
    }

    profileView() {
        return (
            <View style={{ flex: 0.25, }}>
                <View style={{ alignItems: 'center', }}>
                    <Image style={{ height: 100, width: 100, borderRadius: 50 }} source={{ uri: this.state.data.BidPostedBy[0].profile_picture }} />
                </View>
                <View style={{ alignItems: 'center', justifyContent: 'center', }}>
                    <View style={{ flexDirection: 'row', marginLeft: 20, paddingVertical: 10 }}>
                        <Text style={styles.primaryTextStyle}>{this.state.data.BidPostedBy[0].name}</Text>
                        <View style={{ left: 10, justifyContent: 'center' }}>
                            <Image source={Assets.tutorProfile.verifiedIcon} />
                        </View>
                    </View>
                </View>
                {this.state.data.BidPostedBy[0].rating.length > 0 && <View style={{ paddingVertical: 5, alignItems: 'center', justifyContent: 'center', flexDirection: 'row' }}>
                    <Image source={Assets.tutorProfile.star_icon} />
                    <Text style={styles.rating_text}>{Utility.sharedInstance.averageRating(this.state.data.BidPostedBy[0].rating)}</Text>
                </View>}


            </View>
        )
    }


    tutorProposalDetails() {
        return (
            <View style={{ flex: 0.25, justifyContent: 'space-evenly' }}>
                <View style={{ flex: 1, flexDirection: 'row', marginHorizontal: 30, justifyContent: 'space-between' }}>
                    <View>
                        <Text style={styles.textHeader}>{String.studentSignUp.education}</Text>
                        <Text style={styles.textDesc}>{this.state.data.BidPostedBy[0].tutor_education}</Text>
                    </View>
                    <View style={{ marginRight: '25%' }}>
                        <Text style={styles.textHeader}>{'Quoted'}</Text>
                        <Text style={styles.priceTextStyle}>{this.state.data.currency} {this.state.data.bid_amount}</Text>
                    </View>
                </View>
                <View style={{ flex: 1, marginHorizontal: 30 }}>
                    <Text style={styles.textHeader}>{'Teaching Subjects'}</Text>
                    <View style={{ flex: 0.1, marginRight: 40, flexWrap: 'wrap', flexDirection: 'row', }}>
                        {this.state.data.BidPostedBy[0].tutor_education_details &&
                            this.state.data.BidPostedBy[0].tutor_education_details.map(function (obj, index, arr) {
                                let str = index + 1 < arr.length ? `,` : ''
                                return (
                                    <View style={{ flexDirection: 'row', }}>
                                        <Text style={styles.textDesc}>{obj.tutor_teaching_subject}{str} </Text>
                                    </View>
                                )
                            })}
                    </View>
                </View>
                <View style={{ flex: 1, marginHorizontal: 30 }} >
                    <Text style={styles.textHeader}>{'Detail Proposal'}</Text>
                    <Text style={styles.textDesc}>{this.state.data.description}</Text>
                </View>
            </View>
        )
    }

    buttonView() {
        return (
            <View style={{ flex: 0.40, }}>

                <View style={{ flex: .38 }}>
                </View>
                <View style={{ flex: .02 }}>
                    <AppButton
                        buttonStyle={{ alignSelf: 'center', width: '90%', marginBottom: 20 }}
                        onPress={() => {
                            this.setState({ updateBid: Constant.updateBid.accept, isPopVisible: true })
                        }}
                        isEnabled={true}

                        buttonText={Strings.bidList.acceptBid}
                        buttonTextStyle={{ fontSize: 14 }}

                    />
                    <AppButton
                        buttonStyle={{ alignSelf: 'center', width: '90%', marginBottom: 20, backgroundColor: Color.appBackgroundColor, borderColor: Color.buttonColor.enableButton, borderWidth: 1, borderRadius: 25, }}
                        onPress={() => {
                            this.setState({ updateBid: Constant.updateBid.reject, isPopVisible: true })
                        }}
                        isEnabled={true}
                        // buttonText={Strings.bidList.rejectBid}
                        buttonText={Strings.bidList.rejectBid}
                        buttonTextStyle={{ color: Color.buttonColor.enableButton, fontSize: 14 }}

                    />
                </View>

            </View>
        )
    }

    updateBidApiHandler = async () => {
        NetworkManager.networkManagerInstance.progressBarRequest(true)
        try {
            let data = {}
            data = {
                "id": this.props.route.params.tutorDetails._id != undefined ? this.props.route.params.tutorDetails._id : '',
                "session_id": this.props.route.params.tutorDetails.session_id != '' ? this.props.route.params.tutorDetails.session_id : '',
                "status": this.state.updateBid
            }
            console.log('Chechking Data', JSON.stringify(data))
            const res = await NetworkManager.networkManagerInstance.fetchRequest(URL.updateBid, URL.putRequest, true, data, () => this.updateBidStatus())
            if (res.statusCode == 200) {
                this.setState({ isPopVisible: false })
                if (this.state.updateBid == 'Accept') {
                    this.props.navigation.navigate(Constant.routeName.bidAcceptSuccess, { session_id: this.props.route.params.session_id, status: res.data.status })
                    NetworkManager.networkManagerInstance.progressBarRequest(false)
                    return
                }
                if (Constant.updateBid.reject) {
                    this.bidListApiHandler(this.state.skip)
                    this.props.navigation.navigate(Constant.routeName.bidList, { session_id: this.props.route.params.tutorDetails.session_id, status: res.data.status })
                    NetworkManager.networkManagerInstance.progressBarRequest(false)
                    return
                }
            } else {
                this.setState({ isPopVisible: false })
                NetworkManager.networkManagerInstance.progressBarRequest(false)
            }
        } catch (error) {
            this.setState({ isPopVisible: false })
            NetworkManager.networkManagerInstance.progressBarRequest(false)
            if (__DEV__) console.log(error)
        }
    }

    bidListApiHandler = async (skips) => {
        NetworkManager.networkManagerInstance.progressBarRequest(true)
        try {
            let data = {}
            data = {
                "session_id": this.props.route.params.session_id != '' ? this.props.route.params.session_id : ''
            }
            const res = await NetworkManager.networkManagerInstance.fetchRequest(URL.bidList, URL.postRequest, true, data, () => this.bidListApiHandler())
            if (res.statusCode == 200) {
                if (__DEV__) console.log('JSON.stringify(res.data)' + JSON.stringify(res.data))
                this.setState({ bidList: res.data.bidPosted })
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



}


const styles = StyleSheet.create({
    primaryTextStyle: {
        fontSize: Dimen.veryLargeTextSize,
        color: Color.textColor.primaryColor
    },
    rating_text: {
        color: Color.buttonColor.enableButton,
        fontSize: Dimen.smallTextSize,
        left: 10
    },
    textHeader: {
        fontSize: Dimen.verySmallTextSize,
        color: '#AAAAAA',
        lineHeight: 25
    },
    textDesc: {
        fontSize: Dimen.smallTextSize,
        color: Color.textColor.quarternary,
        lineHeight: 25
    },
    priceTextStyle: {
        fontSize: Dimen.smallTextSize,
        color: Color.textColor.pentaColor,
        lineHeight: 25

    }
});