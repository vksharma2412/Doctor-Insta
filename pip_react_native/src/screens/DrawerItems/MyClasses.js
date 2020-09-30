import React, { Component } from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet, KeyboardAvoidingView, ScrollView, TouchableWithoutFeedback, Keyboard, Image, Dimensions, ImageBackground } from 'react-native'
import { CommonHeader, SafeAreaComponent, AppButton, PlaceholderComponent, AppTextComp, CommonDropDown } from '../../components';
import { Color, Dimen, Strings, Assets, Constant, URL } from '../../../res';
import Constants from '../../../res/Constants';
import String from '../../../res/String';
import { NetworkManager, Utility, NavUtil } from '../../utils';
import Session from '../../utils/Session';
class MyClasses extends Component {

    constructor(props) {
        super(props)
        this.state = {
            showDialog: false,
            colorSet: false,
            classList: []
        }
    }

    async componentDidMount() {
        await this.myClassListApiHandler()
    }


    PlayVideo(videoId, Title ="No title ")
    {

        if(videoId)
        {
            NavUtil.navUtil.navigateTo(this, Constants.routeName.VideoPlayer, { videoId: videoId, title: Title })
        }else{
            alert("No Video Found")
        }
       
    }

    renderItem = (item) => {

        if(item.completed_session_details.length > 0 )
        {
            let VideoId = null
            if(item.completed_session_details[0].hasOwnProperty('archives') && item.completed_session_details[0].archives.length>0)
            {
                VideoId = item.completed_session_details[0].archives[0].url;
            }

            return (

                <View style={{ flex: 1 }}>
                    <TouchableOpacity style={{ flex: 1, flexDirection: 'row', paddingHorizontal: 10, paddingVertical: 15, alignItems: 'center' }}
                        onPress={() => this.PlayVideo(VideoId)}
                    >
                        <View>
                            <ImageBackground
                                source={{ uri: item.tutorProfilePicture.toString() }}
                                style={{ width: 70, height: 70, justifyContent: 'center', borderRadius: 5 }}
                            >
                                <Image
                                    style={{ alignSelf: 'center' }}
                                    source={Assets.openTok.videoPlayer}
                                ></Image>
                            </ImageBackground>
                        </View>
                        <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                            <View style={{ paddingVertical: 5 }}>
                                <Text style={{ fontSize: 16, fontWeight: '700', color: Color.textColor.hexaColor, paddingLeft: 15, lineHeight: 30 }}>{item.tutorName}</Text>
                                <Text style={{ fontSize: 14, color: Color.textColor.sessionProfileText, paddingLeft: 15 }}>{item.subjects}</Text>
                            </View>
                        </View>
                    </TouchableOpacity>
                </View>
            )
        }else{
            return null;
        }
        
    
    }

    render() {

        // list of myclass array

        return (
            <SafeAreaComponent
                StatusBarTextColor={'light-content'}
                color={Color.textColor.pentaColor}
            >
                <View style={{ flex: 1, height: Dimen.phoneHeight, backgroundColor: Color.secondayTextColor }}>
                    <View style={{ flex: 0.12, backgroundColor: Color.textColor.pentaColor, justifyContent: 'center' }}>
                        <CommonHeader
                            containerStyle={{ marginHorizontal: '3%' }}
                            headerTrue={Strings.sideMenu.myClasses}
                            headerTitleFontsize={Dimen.mediumTextSize}
                            headerTitleColor={Color.secondayTextColor}
                            leftIconStyle={{ tintColor: Color.secondayTextColor }}
                        />
                    </View>
                    <View style={{ flex: 0.88, top: -20, borderTopLeftRadius: 20, borderTopRightRadius: 20, height: Dimen.phoneHeight, width: '100%', backgroundColor: Color.secondayTextColor }}>

                        <View style={{ flex: 1, marginHorizontal: '5%', marginTop: 15 }}>
                            <FlatList
                                showsVerticalScrollIndicator={false}
                                data={this.state.classList}
                                keyExtractor={(result) => result.key}
                                renderItem={({ item }) => this.renderItem(item)}
                            />
                        </View>

                    </View>
                </View>
            </SafeAreaComponent>
        )
    };

    myClassListApiHandler = async () => {
        let data = {}
        data.student_id = Session.sharedInstance.userDetails[Constant.userDetailsFields._id];
        data.skip = 0;
        data.limit = 50;
        const res = await NetworkManager.networkManagerInstance.fetchRequest(URL.myClass, URL.postRequest, true, data, () => this.myClassListApiHandler())
        if (res.statusCode == 200) {
            this.setState({ classList: res.data })
        } else {
            console.log('Class List API FAILED')
        }
    }
};

export default MyClasses;

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
});