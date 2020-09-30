import React from 'react';
import { Text, View, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { Utility } from '../../utils';
import Constants from '../../../res/Constants';
import { Dimen, Color, Constant } from '../../../res';
import String from '../../../res/String';
import Session from '../../utils/Session';

const ManageSessionListItem = ({ item, props, navifationFrom }) => {
    console.log('ManageSessionListItem==>>' + JSON.stringify(item))
    return (
        <TouchableOpacity style={{
            alignSelf: 'center',
            width: '90%', height: 200,
            margin: 8,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 5 },
            shadowOpacity: Platform.OS == "android" ? 1 : .3,
            shadowRadius: Platform.OS == "android" ? 10 : 5,
            borderRadius: 10,
            elevation: 5,
            backgroundColor: 'white'
        }}
            onPress={() =>
                Utility.sharedInstance.navigation.navigate(Constants.routeName.sessionDetail, { session_id: item._id, student_id: item.student_id, status: item.status, navifationFrom: navifationFrom != undefined ? navifationFrom : undefined })}
        >
            <View style={{ flex: 1, borderRadius: 10, marginHorizontal: '6%', }}>
                <View style={{ flex: 0.35, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                    <View style={{ flex: 0.8 }}>
                        <Text style={{ fontSize: Dimen.verySmallTextSize }}>{String.homeScreen.subject}</Text>
                        <Text style={{ fontSize: Dimen.smallTextSize, color: Color.black, fontWeight: '400', paddingTop: 5 }}>{item.subjects}</Text>
                    </View>
                    <View style={{ flex: 0.2, justifyContent: 'flex-end' }}>
                        <View style={{ padding: 3, borderRadius: 5, justifyContent: 'center', alignItems: 'center', height: 30, width: 70, backgroundColor: getStatuBackGroundColor(item), }}>
                            <Text style={{ color: getStatuColor(item), fontWeight: '400' }}>{getStatus(item)}</Text>
                        </View>
                    </View>
                </View>
                <View style={{ flex: 0.3, backgroundColor: '' }}>
                    <Text style={{ fontSize: Dimen.verySmallTextSize }}>{String.homeScreen.topic}</Text>
                    <Text style={{ fontSize: Dimen.smallTextSize, color: Color.black, fontWeight: '400', paddingTop: 5 }}>{item.topic}</Text>
                    <View></View>
                </View>
                <View style={{ flex: 0.35, flexDirection: 'row', }}>
                    <View style={{ flex: 0.5 }}>
                        <Text style={{ fontSize: Dimen.verySmallTextSize }}>{String.homeScreen.sessionDate}</Text>
                        <Text style={{ fontSize: Dimen.smallTextSize, color: Color.black, fontWeight: '400', paddingTop: 5 }}>{Utility.sharedInstance.formatDate(item.timestamp)}</Text>
                    </View>
                    <View style={{ flex: 0.5 }}>
                        <Text style={{ fontSize: Dimen.verySmallTextSize }}>{String.homeScreen.sessionTime}</Text>
                        <Text style={{ fontSize: Dimen.smallTextSize, color: Color.black, fontWeight: '400', paddingTop: 5 }}> {Utility.sharedInstance.formatTimeinHour(item.timestamp)}</Text>
                    </View>
                </View>
            </View>

        </TouchableOpacity>
    )
};

function getStatus(item) {
    if (Session.sharedInstance.userDetails[Constants.userDetailsFields.is_tutor]) {
        if (item.urgent_booking) {
            return 'Urgent'
        } else {
            return null
        }
    } else {
        if (item.status == Constants.sessionType.upcoming) {
            return 'Applied'
        } else {
            return item.status
        }
    }
}

function getStatuColor(item) {
    if (Session.sharedInstance.userDetails[Constants.userDetailsFields.is_tutor]) {
        if (item.urgent_booking) {
            return Color.textColor.pentaColor
        } else {
            return null
        }
    } else {
        if (item.status == Constants.sessionType.active) {
            return Color.textColor.activeTextColor
        } else {
            return Color.textColor.appliedText
        }
    }


}

function getStatuBackGroundColor(item) {
    if (Session.sharedInstance.userDetails[Constants.userDetailsFields.is_tutor]) {
        if (item.urgent_booking) {
            return Color.textColor.urgentTextColor
        } else {
            return null
        }
    } else {
        if (item.status == Constants.sessionType.active) {
            return Color.introColor.activeBackground
        } else {
            return Color.introColor.appliedBackgroundColor
        }
    }


}

const styles = StyleSheet.create({

});

export default ManageSessionListItem;