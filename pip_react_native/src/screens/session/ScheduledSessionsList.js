import React, { Component } from 'react';
import { View, TouchableOpacity, StyleSheet, FlatList, ActivityIndicator, KeyboardAvoidingView, ScrollView, Keyboard, Platform } from 'react-native'
import { SafeAreaComponent, CommonHeader } from '../../components';
import { Strings, Dimen, Color, Constant } from '../../../res/index';
import { NetworkManager } from '../../utils/index';
import URL from '../../../res/URL';
import Session from '../../utils/Session';
import ScheduledSessionsListItem from "./ScheduledSessionsListItem";


class ScheduledSessionList extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            scheduledSessionList: [],
            skip: 0,
            pageNo: 0,
            loading: false,
        }
    }



    componentDidMount() {
        this.scheduledSessionList(this.state.skip)
    }

    renderFooter = () => {
        return (

            this.state.loading ?
                <View style={{ marginTop: 10, alignItems: "center" }}>
                    <ActivityIndicator size="large" />
                </View> : null
        )
    }

    handleLoadMore = () => {
        this.setState({ skip: this.state.skip + 1, loading: true }, () => { this.scheduledSessionList(this.state.skip) })
    }
    render() {
        return (
            <SafeAreaComponent
                color={Color.textColor.pentaColor}
            >

                <View style={{ flex: 1, backgroundColor: Color.textColor.pentaColor }}>
                    <View style={{ flex: 0.12, }}>
                        <CommonHeader
                            containerStyle={{ marginHorizontal: '3%', paddingTop: 15 }}
                            headerTrue={Strings.scheduledSession.scheduledSessions}
                            headerTitleFontsize={Dimen.mediumTextSize}
                            headerTitleColor={Color.secondayTextColor}
                            headerTtileFontWieght={'700'}
                            headerTitleFontsize={16}
                            leftIconStyle={{ tintColor: Color.secondayTextColor }} />
                    </View>
                    <View style={{
                        flex: 0.88, paddingBottom: '13%', borderTopLeftRadius: 20, borderTopRightRadius: 20, width: '100%',
                        backgroundColor: Color.secondayTextColor
                    }}>

                        <FlatList
                            style={{ marginTop: 10 }}
                            data={this.state.scheduledSessionList}
                            // refreshControl={
                            //     <RefreshControl
                            //         refreshing={this.state.refreshing}
                            //         onRefresh={this._onRefresh}
                            //         tintColor={colors.primaryColor}
                            //     />
                            // }
                            // showsVerticalScrollIndicator={false}

                            //onEndReached={this.handleLoadMore}
                            onEndReachedThreshold={0.1}
                            ListFooterComponent={this.renderFooter}
                            renderItem={({ item }) =>
                                <TouchableOpacity
                                    onPress={() =>
                                        this.props.navigation.navigate(Constant.routeName.sessionDetail, { session_id: item._id, status: item.status })
                                    }
                                    activeOpacity={0.5}
                                >
                                    <ScheduledSessionsListItem
                                        isList={true}
                                        item={item} />
                                </TouchableOpacity>
                            }
                            keyExtractor={item => item._id}

                            onEndReached={() => this.callOnScrollEnd = true}
                            onMomentumScrollEnd={() => {
                                this.callOnScrollEnd && this.handleLoadMore()
                                this.callOnScrollEnd = false
                            }}
                        />
                    </View>
                </View>
            </SafeAreaComponent >
        )
    };


    // handleLoadMore = () => {
    //     if (this.state.currentPage <= this.state.total_page) {
    //         this.setState({ currentPage: this.state.currentPage + 1 }, () => { this.props.events(this.state.currentPage) })

    //     }
    // }

    scheduledSessionList = async (skips) => {

        NetworkManager.networkManagerInstance.progressBarRequest(true)


        try {
            let data = {}
            data = {

                "skip": skips * 10,
                "limit": 10
            }

            if (Session.sharedInstance.userDetails[Constant.userDetailsFields.is_student]) {
                data.student_id = Session.sharedInstance.userDetails[Constant.userDetailsFields._id]
                data.status = [
                    Constant.sessionType.onGoing, Constant.sessionType.started
                ]


            } else {
                data.tutor_id = Session.sharedInstance.userDetails[Constant.userDetailsFields._id]
            }
            const res = await NetworkManager.networkManagerInstance.fetchRequest(Session.sharedInstance.userDetails[Constant.userDetailsFields.is_student] ? URL.getSessions : URL.getAllScheduledSessions, URL.postRequest, true, data, () => this.scheduledSessionList())
            if (res.statusCode == 200) {
                if (__DEV__) console.log('JSON.stringify(res.data)' + JSON.stringify(res.data))
                if ((Session.sharedInstance.userDetails[Constant.userDetailsFields.is_student])) {
                    this.setState({ loading: false, scheduledSessionList: [...res.data.Ongoing, ...this.state.scheduledSessionList] })
                } else {
                    this.setState({ scheduledSessionList: this.state.scheduledSessionList.concat(res.data), loading: false })

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






};


export default ScheduledSessionList;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Color.textColor.pentaColor
    },
});
