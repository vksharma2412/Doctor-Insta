import React, { Component } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, NativeModules } from 'react-native'
import { connect } from "react-redux";
import { apis } from '../../res/URL';
import { API_CALL, DUMMY_API_CALL } from "../redux/Actions"
import { NetworkManager, Utility } from '../utils/index'
import { Constant, AsyncStorageValues } from '../../res';
import AsyncStorage from '@react-native-community/async-storage';
import { LoginManager, AccessToken } from 'react-native-fbsdk'
var ApplozicChat = NativeModules.ApplozicChat;

// tina@gmail.com

// vaibhav@gmail.com
var alUser = {
    'userId': "ashish.mohan@affle.com",   //Replace it with the userId of the logged in user NOTE : userId need to be string and  +,*,? are not allowed chars in userId.
    'password': "Nitrogen_18",  //Put password here
    'authenticationTypeId': 1,
    'deviceApnsType': 0    //Set 0 for Development and 1 for Distribution (Release)
};
class LandingScreen extends Component {



    async componentDidMount() {
        // await Utility.sharedInstance.isApplogicLogin()
        //await Utility.sharedInstance.loginApplozic(alUser, 'Ashish')

    }




    apiHandler = async () => {

        // await AsyncStorage.setItem(AsyncStorageValues.token, "")
        // await AsyncStorage.setItem(AsyncStorageValues.userData, "")
        // await AsyncStorage.setItem(AsyncStorageValues.isTutor, "")

        // AsyncStorageValues.isTutor

        // this.props.navigation.navigate('Login')
        await Utility.sharedInstance.appLogoutHandler()
        const res = await NetworkManager.networkManagerInstance.fetchRequest(apis.dummy_api, apis.getRequest, true, null, () => this.apiHandler())
        return
        let data = {
            api: apis.dummy_api,
            requestType: apis.getRequest,
            type: DUMMY_API_CALL
        }
        this.props.apiDispatcher(data);
    }

    render() {
        Utility.sharedInstance.navigation = this.props.navigation
        return (
            <View style={styles.container}>

                <TouchableOpacity
                    style={styles.buttonStyle}
                    onPress={() =>
                        //  ApplozicChat.openChat()
                        ApplozicChat.openChat()
                    }>
                    <Text style={styles.textStyle}>Chat</Text>
                </TouchableOpacity>


                <TouchableOpacity
                    style={styles.buttonStyle}
                    onPress={async () =>
                        //  ApplozicChat.openChat()
                        await Utility.sharedInstance.logoutApplozic()
                    }>
                    <Text style={styles.textStyle}>CHAT LOGOUT</Text>
                </TouchableOpacity>
                <Text>HOME Screen Will be displayed soon </Text>

                <TouchableOpacity
                    style={styles.buttonStyle}
                    onPress={() => this.props.navigation.navigate(Constants.routeName.homeScreen)}>
                    <Text style={styles.textStyle}>Press to Go HomeScree</Text>
                </TouchableOpacity>


            </View >
        )
    };
};
const mapStateToProps = state => {
    return {
        data: state.apiReducer.testResponse,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        apiDispatcher: (data) => dispatch({ type: API_CALL, data }),
    };
};
export default connect(mapStateToProps, mapDispatchToProps)(LandingScreen);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    buttonStyle: {
        padding: 10,
        borderWidth: 1,
        borderRadius: 5,
        margin: 20
    },
    textStyle: {
        fontSize: 14
    }
});