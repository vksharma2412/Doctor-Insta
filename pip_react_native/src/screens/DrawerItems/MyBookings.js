import React, { Component } from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet, KeyboardAvoidingView, ScrollView, TouchableWithoutFeedback, Keyboard, Image, Dimensions, ImageBackground } from 'react-native'
import { CommonHeader, SafeAreaComponent, AppButton, PlaceholderComponent, AppTextComp, CommonDropDown } from '../../components';
import { Color, Dimen, Strings, Assets, Constant } from '../../../res';
import Constants from '../../../res/Constants';
import String from '../../../res/String';


class MyBooking extends Component {
    render() {
        return (

            <SafeAreaComponent
                StatusBarTextColor={'light-content'}
                color={Color.textColor.pentaColor}
            >

                <View style={{ flex: 1, height: Dimen.phoneHeight }}>
                    <View style={{ flex: 0.12, backgroundColor: Color.textColor.pentaColor, }}>
                        <CommonHeader
                            containerStyle={{ marginHorizontal: '3%' }}
                            headerTrue={Strings.bookingSession.bookSession}
                            headerTitleFontsize={Dimen.mediumTextSize}
                            headerTitleColor={Color.secondayTextColor}
                            leftIconStyle={{ tintColor: Color.secondayTextColor }}
                        />
                    </View>
                    <View style={{ flex: 0.88, top: -20, paddingBottom: '13%', borderTopLeftRadius: 20, borderTopRightRadius: 20, height: Dimen.phoneHeight, width: '100%', backgroundColor: Color.secondayTextColor }}>
                        <ScrollView
                            contentContainerStyle={{ paddingTop: 20 }}>
                            <View style={{ flex: 1 }}>
                                <Text> MyBookings Development in Progress......</Text>
                            </View>
                        </ScrollView>
                    </View>
                </View>



            </SafeAreaComponent>



        )
    };



};

export default MyBooking;

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