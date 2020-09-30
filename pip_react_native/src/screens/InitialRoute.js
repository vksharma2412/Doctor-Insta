import React, { Component } from 'react'
import { View, DeviceEventEmitter } from 'react-native'

import AsyncStorage from '@react-native-community/async-storage';
import { AsyncStorageValues } from "../../res/index";
import NetworkManager from '../utils/NetworkManager'
import Utility from "../utils/Utility";
import Session from "../utils/Session";
import Constants from '../../res/Constants';
import { useNavigationState } from '@react-navigation/native';


import { NavUtil } from '../utils';

let checkEvent = false;
export default class InitialRoute extends Component {


    constructor(props) {
        super(props)
        this.state = {
            eventReceived: false,
            eventData: {},
            nextScreen: ""
        }
    }



    getNativeEvent = () => {

        this.eventListener = DeviceEventEmitter.addListener('JS-Event', (event) => {
            // alert('Hello testing');
            if (event.CALL_STATUS === 'answer') {

                console.log("Call REceived HERE EEEEEE")

                this.props.navigation.navigate(Constants.routeName.VideoCall, {
                    sessionId: event.SESSION_ID,
                    token: event.TOKEN2,
                    ringerName: event.RINGERNAME

                })


            }

        });


    }




    getStartFunction = async () => {

        NetworkManager.networkManagerInstance.progressBarRequest(true)
        const getToken = async () => {
            try {
                return JSON.parse(await AsyncStorage.getItem(AsyncStorageValues.token));
            } catch (error) {
                return null
            }
        }
        let token = await getToken()


        const getCuntryName = async () => {
            try {
                return JSON.parse(await AsyncStorage.getItem(AsyncStorageValues.countryName));
            } catch (error) {
                return null
            }
        }
        let countryName = await getCuntryName()

        Session.sharedInstance.countryName = countryName

        const getCountryObj = async () => {
            try {
                return JSON.parse(await AsyncStorage.getItem(AsyncStorageValues.countryObj));
            } catch (error) {
                return null
            }
        }
        let countryObj = await getCountryObj()
        Session.sharedInstance.countryCodeObj = countryObj


        const getUserData = async () => {
            try {

                return JSON.parse(await AsyncStorage.getItem(AsyncStorageValues.userData))
            } catch (error) {
                console.log("====>>" + error)
                return null
            }
        }

        let userData = await getUserData()

        const getIsTotur = async () => {
            try {
                return JSON.parse(await AsyncStorage.getItem(AsyncStorageValues.isTutor))
            } catch (error) {
                return null
            }
        }

        let isTutor = await getIsTotur()
        Session.sharedInstance.isTutor = isTutor

        const getIntro = async () => {
            try {
                return JSON.parse(await AsyncStorage.getItem(AsyncStorageValues.intro));
            } catch (error) {
                return null
            }
        }

        let isIntroDone = await getIntro()

        const getuserDetails = async () => {
            try {
                return JSON.parse(await AsyncStorage.getItem(AsyncStorageValues.userDetails));
            } catch (error) {
                return null
            }
        }

        let userDetails = await getuserDetails()

        let nextScreen = 'IntroScreen';
        if (isIntroDone != null) {
            nextScreen = 'Login';

            Session.sharedInstance.userDetails = userDetails

        }


        if (userDetails != null) {
            let tutorProfileCompleted = true
            Session.sharedInstance.id = userDetails._id

            if (userDetails[Constants.userDetailsFields.is_student] == true) {
                Session.sharedInstance.isStudent = true
                NetworkManager.networkManagerInstance.token = token;
                nextScreen = Constants.routeName.homeScreen;
            }

            if (userDetails[Constants.userDetailsFields.is_tutor] == true) {
                Session.sharedInstance.isStudent = false
                if (userDetails[Constants.userDetailsFields.isVerified] == true && userDetails[Constants.userDetailsFields.isVerified] == true) {
                    nextScreen = Constants.routeName.homeScreen;
                }

                NetworkManager.networkManagerInstance.token = token;
                if (userDetails.hasOwnProperty('email')) {
                    tutorProfileCompleted = false
                    nextScreen = Constants.routeName.tutorBusiness;
                }
                if (userDetails.hasOwnProperty(Constants.userDetailsFields.identity_proof)) {
                    tutorProfileCompleted = false
                    nextScreen = Constants.routeName.tutorQualification;
                }
                if (userDetails.hasOwnProperty(Constants.userDetailsFields.tutor_education)) {
                    tutorProfileCompleted = false
                    nextScreen = Constants.routeName.waitingForApproval;
                }

                if (userDetails[Constants.userDetailsFields.is_student] == true && userDetails[Constants.userDetailsFields.is_tutor] == true && userDetails[Constants.userDetailsFields.isVerified] == false) {
                    nextScreen = Constants.routeName.homeScreen;
                }
                if (userDetails[Constants.userDetailsFields.is_student] == true && userDetails[Constants.userDetailsFields.is_tutor] == false && userDetails[Constants.userDetailsFields.isVerified] == false) {
                    nextScreen = Constants.routeName.homeScreen;
                }
                if (userDetails[Constants.userDetailsFields.is_student] == false && userDetails[Constants.userDetailsFields.is_tutor] == true && userDetails[Constants.userDetailsFields.isVerified] == true) {
                    nextScreen = Constants.routeName.homeScreen;
                }

                if (tutorProfileCompleted) {
                    if (userDetails[Constants.userDetailsFields.is_student] == false && userDetails[Constants.userDetailsFields.is_tutor] == true && userDetails[Constants.userDetailsFields.isVerified] == false) {
                        nextScreen = Constants.routeName.waitingForApproval;
                    }
                }

            } else if (!userDetails.hasOwnProperty('email')) {
                NetworkManager.networkManagerInstance.token = token;
                nextScreen = 'UserTypeScreen';
            }
            else {
                nextScreen = Constants.routeName.homeScreen
                NetworkManager.networkManagerInstance.token = token;


            }
        }

        NetworkManager.networkManagerInstance.progressBarRequest(false)
        Utility.sharedInstance.navigation = await this.props.navigation

        this.setState({ nextScreen: nextScreen })

        this.Nextscreen()


    }


    componentDidMount() {
        console.log("this.propsscreepProps" + JSON.stringify(this.props))
        this.getNativeEvent()
        this.getStartFunction()
    }


    Nextscreen = () => {

        if (this.state.eventReceived) {
            this.setState({ eventReceived: false }, () => {

                this.props.navigation.navigate(Constants.routeName.VideoCall, {
                    sessionId: this.state.eventData.sessionId,
                    token: this.state.eventData.token,
                    ringerName: this.state.eventData.ringerName

                })
            })
        } else {
            this.props.navigation.navigate(this.state.nextScreen)
        }

    }

    render() {
        return (
            <View></View>
        )
    }
}