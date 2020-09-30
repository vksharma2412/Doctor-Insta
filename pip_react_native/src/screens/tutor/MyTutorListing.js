import React, { Component } from 'react';
import { View, Text, StyleSheet, KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard, Image, Dimensions, ImageBackground, FlatList, TouchableOpacity } from 'react-native'
import { CommonHeader, SafeAreaComponent, AppTextComp } from '../../components';
import { Color, Dimen, Strings, Assets, URL } from '../../../res';
import { NetworkManager } from '../../utils';
import Constants from '../../../res/Constants';
import Session from '../../utils/Session';
import Utility, { showToast, validateEmailAddress, validateEmptyField, _storeData } from "../../utils/Utility";
import { PlaceholderComponent } from '../../components/PlaceholderComponent';




class MyTutorListing extends Component {

    constructor(props) {
        super(props)
        this.state = {
            studentId: this.isEmptyField(Session.sharedInstance.userDetails, Constants.userDetailsFields._id) ? this.isEmptyField(Session.sharedInstance.userDetails, Constants.userDetailsFields._id) : '',
            tutorListData: []
        }
    }

    componentDidMount() {
        this.getTutorListData()
    }

    getTutorListData = async () => {
        let data = {
            student_id: this.state.studentId,
            skip: 0,
            limit: 100
        }
        const res = await NetworkManager.networkManagerInstance.fetchRequest(URL.getTutorList, URL.postRequest, true, data, () => this.getTutorListData())
        if (res.statusCode == 200) {
            this.setState({ tutorListData: res.data })
        } else {
            showToast(res.message)
        }
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

    isValidURL = (string) => {


        console.log("+++>>>>string" + string)
        let res
        try {
            res = string.match(/(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g);
        } catch (e) {
            return false
        }
        return (res !== null)
    };

    _renderItem = (item, index) => {
        return (
            <View style={{ flex: 1 }}>
                <TouchableOpacity style={{ flexDirection: 'row', paddingHorizontal: 25, paddingVertical: 15, alignItems: 'center' }}
                    onPress={() => { this.props.navigation.navigate('MyTutorDetails', { student_Id: item._id.student_id, session_Id: item._id.session_id, tutor_Id: item._id._id, subject: item._id.subjects, passIndex: index }) }}
                >
                    <Image
                        style={{ height: 50, width: 50, borderRadius: 25, marginTop: 10 }}
                        source={{ uri: item._id.profile_picture, cache: 'force-cache' }}
                    >
                    </Image>
                    <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                        <View style={{ paddingVertical: 5 }}>
                            <Text style={{ fontSize: 16, fontWeight: '700', color: Color.textColor.hexaColor, paddingLeft: 15, lineHeight: 30 }}>{item._id.name}</Text>
                            <Text style={{ fontSize: 14, color: Color.textColor.sessionProfileText, paddingLeft: 15 }}>{item._id.subjects}</Text>
                        </View>
                        <Image
                            source={Assets.tutor.forwardArrow}
                        >
                        </Image>
                    </View>
                </TouchableOpacity>
                <View style={{ flex: 1, height: 0.5, backgroundColor: 'black', marginLeft: 90 }}></View>
            </View>

        )

    }

    render() {
        return (
            <SafeAreaComponent
                StatusBarTextColor={'light-content'}
                color={Color.textColor.pentaColor}
            >
                <View style={{ flex: 1, backgroundColor: Color.secondayTextColor }}>
                    <View style={{ flex: 1, height: Dimen.phoneHeight }}>
                        <View style={{ flex: 0.12, backgroundColor: Color.textColor.pentaColor, justifyContent: 'center' }}>
                            <CommonHeader
                                backImage={Assets.homeScreen.side_menu_icon}
                                onPress={() => this.props.navigation.openDrawer()}
                                containerStyle={{ marginHorizontal: '3%' }}
                                headerTrue={Strings.tutor.myTutors}
                                headerTitleFontsize={Dimen.mediumTextSize}
                                headerTitleColor={Color.secondayTextColor}
                                leftIconStyle={{ tintColor: Color.secondayTextColor }}
                            />
                        </View>
                        <View style={{ flex: 0.88, top: -20, borderTopLeftRadius: 20, borderTopRightRadius: 20, height: Dimen.phoneHeight, width: '100%', backgroundColor: Color.secondayTextColor }}>

                            {this.state.tutorListData.length == 0 && this.placeholder()}
                            {this.state.tutorListData.length > 0 && <FlatList
                                numColumns={1}
                                data={this.state.tutorListData}
                                renderItem={({ item, index }) => this._renderItem(item, index)}
                                keyExtractor={(item, index) => `${index}_users`}
                            />}
                        </View>
                    </View>
                </View>
            </SafeAreaComponent>
        )
    };




    placeholder() {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>

                <PlaceholderComponent
                    containerStyle={{ borderTopRightRadius: 20, borderTopLeftRadius: 20 }}
                    placeHolderImage={Assets.homeScreen.no_session_illust}
                    placeholderHeader={this.state.tutorListData.length == 0 ? 'No Toutor Found' : ''}
                    placeholderMessage={this.state.tutorListData.length == 0 ? '' : ''}
                />
            </View>

        )
    }
};

export default MyTutorListing;

const styles = StyleSheet.create({
    ProfilePic: {
        width: 100,
        height: 100,
        alignItems: 'center',
        justifyContent: 'center',
    },

});
