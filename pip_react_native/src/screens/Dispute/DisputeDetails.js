import React, { Component } from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet, KeyboardAvoidingView, ScrollView, TouchableWithoutFeedback, Keyboard, Image, Dimensions, ImageBackground } from 'react-native'
import { CommonHeader, SafeAreaComponent, AppButton, PlaceholderComponent, AppTextComp, CommonDropDown } from '../../components';
import { Color, Dimen, Strings, Assets, Constant, URL } from '../../../res';
import Constants from '../../../res/Constants';
import String from '../../../res/String';
import { TextInput } from 'react-native-gesture-handler';
import Session from '../../utils/Session';
import { NetworkManager, Utility } from '../../utils';
import { showToast } from '../../utils/Utility';


class DisputeDetails extends Component {

    constructor(props) {
        super(props)
        this.state = {
            disputeInfo: this.props.route.params.disputeInfo ? this.props.route.params.disputeInfo : ''
        }
    }


    render() {
        console.log("this.state.disputeInfo ==>> " + JSON.stringify(this.state.disputeInfo))
        return (

            <SafeAreaComponent
                StatusBarTextColor={'light-content'}
                color={Color.textColor.pentaColor}
            >

                <KeyboardAvoidingView
                    style={{ flex: 1, flexDirection: 'column', }}
                    behavior={Platform.OS === 'ios' ? 'padding' : null}
                    enabled>

                    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                        <ScrollView
                            contentContainerStyle={{ flexGrow: 1, }}
                            keyboardShouldPersistTaps='always'
                            showsVerticalScrollIndicator={false}>
                            <View style={{ flex: 1 }}>
                                <View style={{ flex: 1, height: Dimen.phoneHeight }}>
                                    <View style={{ flex: 0.12, backgroundColor: Color.textColor.pentaColor, justifyContent: 'center' }}>
                                        <CommonHeader
                                            // backImage={Assets.homeScreen.side_menu_icon}
                                            // onPress={() => this.props.navigation.openDrawer()}
                                            containerStyle={{ marginHorizontal: '3%' }}
                                            headerTrue={String.disputeDetails.disputeDetails}
                                            headerTitleFontsize={Dimen.mediumTextSize}
                                            headerTitleColor={Color.secondayTextColor}
                                            leftIconStyle={{ tintColor: Color.secondayTextColor }}
                                        />
                                    </View>
                                    <View style={{ flex: 0.88, top: -20, borderTopLeftRadius: 20, borderTopRightRadius: 20, height: Dimen.phoneHeight, width: '100%', backgroundColor: Color.secondayTextColor }}>
                                        <View style={{ flex: 0.05, marginHorizontal: '5%', paddingTop: 20 }}>
                                            <View style={{ padding: 3, borderRadius: 5, justifyContent: 'center', alignItems: 'center', height: 30, width: 70, backgroundColor: Utility.sharedInstance.getStatuBackGroundColor(this.state.disputeInfo), }}>
                                                <Text style={{ color: Utility.sharedInstance.getStatuColor(this.state.disputeInfo), fontWeight: '400' }}>{Utility.sharedInstance.getStatus(this.state.disputeInfo)}</Text>
                                            </View>
                                        </View>
                                        <View style={{ flex: 0.9, marginHorizontal: '5%', }}>
                                            <View style={{ paddingTop: 5, paddingBottom: 2 }}>
                                                <Text style={{ paddingVertical: 10, color: Color.textColor.quarternary, fontSize: 20 }}>{this.state.disputeInfo.description.includes('Other_') ? this.state.disputeInfo.description.split('_')[0] : this.state.disputeInfo.description}</Text>

                                            </View>
                                            <Text style={{ color: Color.textColor.sessionProfileText, fontSize: 12, }}>
                                                {Utility.sharedInstance.formatDate(this.state.disputeInfo.createdAt)} | {Utility.sharedInstance.raiseDisputeTimeFormat(this.state.disputeInfo.createdAt)}
                                            </Text>
                                            <View style={{ paddingTop: 20, }}>
                                                <Text style={{ paddingVertical: 10 }}>Detail description of dispute</Text>

                                            </View>
                                            <View style={{ paddingTop: 2, }}>
                                                <Text style={{ paddingVertical: 10 }}>{this.state.disputeInfo.description.includes('Other_') ? this.state.disputeInfo.description.split('_')[1] : this.state.disputeInfo.description}</Text>

                                            </View>
                                        </View>
                                    </View>
                                </View>
                            </View>
                        </ScrollView>
                    </TouchableWithoutFeedback>
                </KeyboardAvoidingView>


            </SafeAreaComponent>



        )
    };





};

export default DisputeDetails;

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