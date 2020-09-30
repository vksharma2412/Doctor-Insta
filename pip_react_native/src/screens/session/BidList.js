import React, { Component } from 'react';
import { View, TouchableOpacity, StyleSheet, FlatList, TouchableWithoutFeedback, KeyboardAvoidingView, ScrollView, Keyboard, Image } from 'react-native'
import { SafeAreaComponent, CommonHeader, PopUp } from '../../components';
import { Strings, Dimen, Color, Constant, Assets } from '../../../res/index';
import { NetworkManager, NavUtil } from '../../utils/index';
import URL from '../../../res/URL';
import Session from '../../utils/Session';
import BidListItem from "./BidListItem";
import { PlaceholderComponent } from '../../components/PlaceholderComponent';


class BidList extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            bidList: [],
            skip: 0,
            updateBid: '',
            isPopVisible: false,
            bid_id: this.props.route.params.bid_id != undefined ? this.props.route.params.bid_id : '',
        }
    }



    async componentDidMount() {
        await this.bidListApiHandler(this.state.skip)
    }




    render() {
        console.log("JSON.stringify(this.state.bidList)" + JSON.stringify(this.state.bidList.length))
        return (
            <SafeAreaComponent
                color={Color.textColor.pentaColor}

            >

                <View style={{ flex: 1, backgroundColor: 'red' }}>
                    {/* <Image style={{ backgroundColor: 'red', height: 40, width: 40 }}
                        source={{ uri: 'https://funda-elearning.s3.amazonaws.com/1598349458872_ScreenShot2020-08-25at3.27.16PM.png' }}

                    /> */}
                    <View style={{ flex: 0.12, backgroundColor: Color.textColor.pentaColor, paddingTop: 20 }}>
                        <CommonHeader
                            containerStyle={{ marginHorizontal: '3%' }}
                            headerTrue={Strings.bidList.bidReceived}
                            headerTitleFontsize={Dimen.mediumTextSize}
                            headerTitleColor={Color.secondayTextColor}
                            headerTtileFontWieght={'700'}
                            headerTitleFontsize={16}
                            leftIconStyle={{ tintColor: Color.secondayTextColor }} />
                    </View>
                    <View style={{ flex: 0.88, marginBottom: -60, top: -20, paddingBottom: '13%', borderTopLeftRadius: 20, borderTopRightRadius: 20, width: '100%', backgroundColor: Color.secondayTextColor }}>

                        {this.state.bidList.length == 0 && this.placeholder()}

                        {this.state.bidList.length > 0 && <FlatList
                            style={{ paddingTop: 20 }}
                            contentContainerStyle={{
                                flexGrow: 1,
                                width: '100%', alignItems: 'center'
                            }}
                            data={this.state.bidList}
                            showsVerticalScrollIndicator={false}
                            onEndReachedThreshold={0.1}
                            renderItem={({ item }) =>
                                <BidListItem item={item}
                                    props={this.props}
                                    onPressCallback={this.updateBidStatus}
                                    bid_id={this.state.bid_id}
                                />

                            }
                            keyExtractor={item => item._id}
                        />}
                    </View>
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
            </SafeAreaComponent >
        )
    };

    placeholder() {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>

                <PlaceholderComponent
                    containerStyle={{ borderTopRightRadius: 20, borderTopLeftRadius: 20 }}
                    placeHolderImage={Assets.homeScreen.no_session_illust}
                    placeholderHeader={'No Bids Found'}
                    placeholderMessage={''}
                />
            </View>

        )
    }

    updateBidStatus = async (status, item) => {
        this.setState({ updateBid: status, isPopVisible: true, bid_id: item._id })
    }


    updateBidApiHandler = async () => {
        NetworkManager.networkManagerInstance.progressBarRequest(true)
        try {
            let data = {}
            data = {
                "id": this.state.bid_id,
                "session_id": this.props.route.params.session_id != '' ? this.props.route.params.session_id : '',
                "status": this.state.updateBid
            }
            const res = await NetworkManager.networkManagerInstance.fetchRequest(URL.updateBid, URL.putRequest, true, data, () => this.updateBidStatus())
            console.log('this is checking resopnse data', res.data)
            if (res.statusCode == 200) {
                this.setState({ isPopVisible: false })
                if (this.state.updateBid == 'Accept') {
                    this.props.navigation.navigate(Constant.routeName.bidAcceptSuccess, { session_id: this.props.route.params.session_id, status: res.data.status, bid_id: this.state.bid_id })
                } else {
                    this.props.navigation.navigate('HomeScreen')
                }
                if (Constant.updateBid.reject) {
                    this.bidListApiHandler(this.state.skip)
                } else {
                    NavUtil.navUtil.navigateTo(this, Constant.routeName.bidAcceptSuccess, { session_id: this.props.route.params.session_id, status: res.data.status, bid_id: this.state.bid_id })
                    NetworkManager.networkManagerInstance.progressBarRequest(false)
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






};


export default BidList;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Color.textColor.pentaColor
    },
});
