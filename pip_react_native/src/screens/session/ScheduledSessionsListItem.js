import React from 'react';
import { Text, View, StyleSheet, TouchableOpacity, Image, Dimensions, NativeModules } from 'react-native';
import { Utility } from '../../utils';
import Constants from '../../../res/Constants';
import { Dimen, Color, Assets } from '../../../res';
import String from '../../../res/String';
var ApplozicChat = NativeModules.ApplozicChat;


const ScheduledSessionsListItem = ({ item, isList, props }) => {
    return (
        <View style={{
            width: isList == false ? Dimensions.get('screen').width - 100 : '90%', height: 150,
            margin: 8,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 5 },
            shadowOpacity: Platform.OS == "android" ? 1 : .3,
            shadowRadius: Platform.OS == "android" ? 10 : 5,
            borderRadius: 10,
            elevation: 5,
            marginHorizontal: 20,
            backgroundColor: 'white'
        }}>
            <View style={{ flex: 1, borderRadius: 10, marginHorizontal: '6%' }}>
                <View style={{ flex: 0.4, justifyContent: 'flex-end' }}>
                    <Text style={{ fontSize: Dimen.mediumTextSize, fontWeight: '400', color: Color.textColor.quarternary }}>{item.subjects}</Text>
                    <Text style={{ fontSize: 12, fontWeight: '400', color: Color.textColor.resendOtp }}> {Utility.sharedInstance.formatDate(item.timestamp)} | {Utility.sharedInstance.formatTimeinHour(item.timestamp)}</Text>
                </View>
                <View style={{ flex: 0.6, justifyContent: 'center' }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                        <View style={{ flexDirection: 'row' }}>
                            {item.BidPostedBy != undefined && item.BidPostedBy.length > 0 && <Image style={{ height: 40, width: 40, borderRadius: 20 }} source={{ uri: item.BidPostedBy != undefined ? item.BidPostedBy[0].profile_picture : '' }} />}
                            <View style={{ paddingHorizontal: 5 }}>
                                <Text style={{ fontSize: Dimen.smallTextSize, fontWeight: '400', color: Color.textColor.quarternary }}>{item.BidPostedBy != undefined && item.BidPostedBy.length > 0 ? item.BidPostedBy[0].name : ''}</Text>
                                {item.BidPostedBy != undefined && item.BidPostedBy.length > 0 && <Text style={{ fontSize: 12, fontWeight: '400', color: Color.textColor.resendOtp }}>{item.BidPostedBy[0].tutor_education_details.length == 0 ? '' : item.BidPostedBy[0].tutor_education_details[0].tutor_teaching_subject}</Text>}
                            </View>
                        </View>
                        {item.BidPostedBy != undefined && item.BidPostedBy.length > 0 && <TouchableOpacity style={{ justifyContent: 'flex-end', padding: 2 }}
                            onPress={async () => await ApplozicChat.openChatWithUser(item.BidPostedBy[0].name)}>
                            <Image
                                source={Assets.homeScreen.msgIcon}
                            />
                        </TouchableOpacity>}
                    </View>
                </View>
            </View>

        </View>
    )


};



const styles = StyleSheet.create({

});

export default ScheduledSessionsListItem;