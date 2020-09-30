import React, { Component } from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet, KeyboardAvoidingView, ScrollView, TouchableWithoutFeedback, Keyboard, Image, Dimensions, ImageBackground } from 'react-native'
import { CommonHeader, SafeAreaComponent } from '../../components';
import { Color, Dimen, Strings, Assets } from '../../../res';
import { Utility } from '../../utils';
import Session from '../../utils/Session';
import Constants from '../../../res/Constants';



class Setting extends Component {

    constructor(props) {
        super(props)
        this.state = {
            refferal_Code_Share: this.isEmptyField(Session.sharedInstance.userDetails, Constants.userDetailsFields.sender_referral_id) ? this.isEmptyField(Session.sharedInstance.userDetails, Constants.userDetailsFields.sender_referral_id) : '',
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

    render() {
        // list of settings array
        const settingList = [
            { img: Assets.settings.referApp, title: 'Refer App', arrowIcon: Assets.settings.arrowForward, fileType: 'ReferAppScreen', header: 'Refer App' },
            { img: Assets.settings.aboutUs, title: 'About Us', arrowIcon: Assets.settings.arrowForward, fileType: 'About Us', header: 'About Us' },
            { img: Assets.settings.privacy, title: 'Privacy Policy', arrowIcon: Assets.settings.arrowForward, fileType: 'Privacy Policy', header: 'Privacy Policy' },
            { img: Assets.settings.contactUs, title: 'Contact Us', arrowIcon: Assets.settings.arrowForward, fileType: 'Contact Us', header: 'Contact Us' },
            { img: Assets.settings.faqs, title: 'FAQs', arrowIcon: Assets.settings.arrowForward, fileType: 'FAQs', header: 'FAQS' },
            { img: Assets.settings.agreement, title: 'Agreement ', arrowIcon: Assets.settings.arrowForward, fileType: 'Agreements', header: 'Agreement' },
            { img: Assets.settings.disclaimer, title: 'Disclaimer', arrowIcon: Assets.settings.arrowForward, fileType: 'Disclaimer', header: 'Disclaimer' },

        ];
        return (
            <SafeAreaComponent
                color={Color.textColor.pentaColor}
                StatusBarTextColor={'light-content'}
            >
                <View style={{ flex: 1, backgroundColor: Color.secondayTextColor }}>
                    <View style={{ flex: 1, height: Dimen.phoneHeight }}>
                        <View style={{ flex: 0.12, backgroundColor: Color.textColor.pentaColor, justifyContent: 'center' }}>
                            <CommonHeader
                                backImage={Assets.homeScreen.side_menu_icon}
                                onPress={() => this.props.navigation.openDrawer()}
                                containerStyle={{ marginHorizontal: '3%' }}
                                headerTrue={Strings.Settings.settings}
                                headerTitleFontsize={Dimen.mediumTextSize}
                                headerTitleColor={Color.secondayTextColor}
                                leftIconStyle={{ tintColor: Color.secondayTextColor }}
                            />
                        </View>
                        <View style={{ flex: 0.88, top: -20, borderTopLeftRadius: 20, borderTopRightRadius: 20, height: Dimen.phoneHeight, width: '100%', backgroundColor: Color.secondayTextColor }}>
                            <View style={{ flex: 0.9, marginHorizontal: '5%' }}>
                                <FlatList
                                    data={settingList}
                                    keyExtractor={(result) => result.key}
                                    renderItem={({ item }) => {
                                        return (
                                            <TouchableOpacity onPress={() => this.gotonextpage(item)}>
                                                <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', height: 42, marginTop: 10 }}>
                                                    <Image style={{ width: 25, height: 25 }} source={item.img} />
                                                    <Text style={{ flex: 1, fontSize: 16, fontWeight: "600", alignItems: 'center', marginLeft: 25 }}>{item.title}</Text>
                                                    <Image style={{ width: 25, height: 25 }} source={item.arrowIcon} />
                                                </View>
                                            </TouchableOpacity>
                                        )
                                    }}
                                />
                            </View>
                        </View>
                    </View>
                </View>
            </SafeAreaComponent>
        )
    };


    // navigation method for next page
    gotonextpage(item) {

        if (item.fileType == 'ReferAppScreen') {
            Utility.sharedInstance.share(`${'Download Funda E Learning App and proceed with this Refral code'} ${this.state.refferal_Code_Share} ${'for more Discount'}`)
            return
        }
        this.props.navigation.navigate('PdfScreen', { fileType: item.fileType, header: item.header });
    }
};

export default Setting;

const styles = StyleSheet.create({

});