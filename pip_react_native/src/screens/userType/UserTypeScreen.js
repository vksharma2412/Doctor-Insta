import React, { Component } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, Platform, BackAndroid, TouchableWithoutFeedback, KeyboardAvoidingView, ScrollView, Keyboard, ImageBackground, BackHandler } from 'react-native'
import { AppButton, AppImageComponent, SafeAreaComponent, PopUp } from '../../components';
import { Strings, Assets, Dimen, Color, Styles, Constant } from '../../../res/index';
import { TextInput } from 'react-native-gesture-handler';
import Constants from '../../../res/Constants';
import Session from "../../utils/Session";
import Utility from '../../utils/Utility';
import RNExitApp from 'react-native-exit-app';



class UserTypeScreen extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            colorSet: false,
            setStudent: Strings.userType.student,
            userId: Session.sharedInstance.id != '' ? Session.sharedInstance.id : '',
            isPopVisible: false
        }
    }


    async componentDidMount() {
        BackHandler.addEventListener('hardwareBackPressScanning', this.handleBackButtonClick);
    }

    async componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPressScanning', () => { });
    }


    handleBackButtonClick = async () => {
        if (this.props.navigation.dangerouslyGetState().routes[this.props.navigation.dangerouslyGetState().routes.length - 1].name == 'UserTypeScreen') {
            this.setState({ isPopVisible: true })
            return false
        } else {
            this.props.navigation.goBack()
        }
    }





    render() {
        Utility.sharedInstance.navigation = this.props.navigation

        return (
            <SafeAreaComponent>
                <View style={styles.container}>
                    <ScrollView
                        contentContainerStyle={{ flexGrow: 1 }}
                        keyboardShouldPersistTaps='always'>
                        <ImageBackground
                            source={Assets.userType.userTypeBackground}
                            style={{ flex: 1 }}
                            resizeMode={"stretch"}
                        >
                            <View style={styles.topView}>
                                <TouchableOpacity onPress={() => this.setState({ isPopVisible: true })} style={{ flex: 1 }}>
                                    <Image style={styles.backImage} source={Assets.common.back}></Image>
                                </TouchableOpacity>
                            </View>
                            <View style={styles.middleView}>
                                <View style={{ flex: .5 }}></View>
                                <Text style={styles.lookingForTxt}>{Strings.userType.what} {'\n'} {Strings.userType.you}</Text>
                            </View>
                            <View style={styles.bottomView}>
                                <TouchableOpacity
                                    style={[styles.buttonContainer,
                                    {
                                        backgroundColor: this.state.setStudent == Strings.userType.student ? Color.buttonColor.enableButton : Color.secondayTextColor,
                                        borderWidth: 1,
                                        borderColor: this.state.setStudent == Strings.userType.student ? Color.secondayTextColor : Color.buttonColor.enableButton,
                                    }]}
                                    activeOpacity={0.8}
                                    onPress={() => {
                                        this.setState({ setStudent: Strings.userType.student })
                                        this.props.navigation.navigate(Constant.routeName.studentReg, { userType: Constants.userType.student, userId: this.state.userId })
                                    }
                                    }
                                >
                                    <Text style={[styles.textStyle, { fontWeight: '800', color: this.state.setStudent == Strings.userType.student ? Color.secondayTextColor : Color.buttonColor.enableButton }]}>{Strings.userType.student}</Text>
                                </TouchableOpacity>
                                <View style={styles.buttonSeprateView}></View>
                                <TouchableOpacity
                                    style={[styles.buttonContainer,
                                    {
                                        backgroundColor: this.state.setStudent == Strings.userType.teacher ? Color.buttonColor.enableButton : Color.secondayTextColor,
                                        borderWidth: 1,
                                        borderColor: this.state.setStudent == Strings.userType.teacher ? Color.secondayTextColor : Color.buttonColor.enableButton,
                                    }]}
                                    activeOpacity={0.8}
                                    onPress={() => {
                                        this.setState({ setStudent: Strings.userType.teacher })
                                        this.props.navigation.navigate(Constant.routeName.tutorReg, { userType: Constants.userType.tutor, userId: this.state.userId })
                                    }
                                    }
                                >
                                    <Text style={[styles.textStyle, { fontWeight: '800', color: this.state.setStudent == Strings.userType.teacher ? Color.secondayTextColor : Color.buttonColor.enableButton }]}>{Strings.userType.teacher}</Text>
                                </TouchableOpacity>
                            </View>
                        </ImageBackground>
                    </ScrollView>
                </View>
                {this.popUpView()}
            </SafeAreaComponent>
        )
    };


    popUpView() {

        return (
            <PopUp
                isPopVisible={this.state.isPopVisible}
                headerText={Strings.popUpMessage.exitApp.header}
                descriptionText={Strings.popUpMessage.exitApp.desc}
                rightButtonText={Strings.popUpMessage.button.yes}
                leftButtonText={Strings.popUpMessage.button.no}
                rightButtonOnPress={async () => {
                    this.setState({ isPopVisible: false })

                    if(Platform.OS == "ios")
                    {
                        RNExitApp.exitApp()
                    }else{
                        BackHandler.exitApp()
                    }

                }}
                leftButtonOnPress={() => this.setState({ isPopVisible: false })}
            />
        )
    }
};

export default UserTypeScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },

    topView: {
        flex: .05,
    },

    backImage: {
        marginLeft: 15,
        marginTop: 10,
        height: 35,
        width: 35
    },

    middleView: {
        flex: .4,
        justifyContent: 'center'
    },

    lookingForTxt: {
        fontSize: 30,
        fontWeight: 'bold',
        paddingLeft: 27,
        color: Color.textColor.quarternaryColor
    },

    bottomView: {
        alignItems: 'center',
        flex: .55,
    },

    buttonSeprateView: {
        flex: .07
    },

    buttonContainer: {
        height: 50,
        alignItems: 'center',
        justifyContent: 'center',
        width: '80%',
        borderRadius: 25,
    },

    textStyle: {
        fontSize: 16
    }
});
