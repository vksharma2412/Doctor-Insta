import React, { Component } from 'react';
import { View, Keyboard } from 'react-native'
import { NavigationContainer } from "@react-navigation/native";
import { MainStackNavigator, MyDrawer } from "../navigation/MainStackNavigator";
import ProgressView from '../components/ProgressView'
import NoNetwork from '../components/NoNetwork'
import { Utility, NetworkManager } from '../utils/index'
import firebase from 'react-native-firebase';
import { Constant, AsyncStorageValues } from '../../res/index'
import { _retrieveData, showToast } from '../utils/Utility';
import AsyncStorage from '@react-native-community/async-storage';

console.disableYellowBox = true;

export default class App extends Component {
  constructor(props) {
    super(props);
    Utility.sharedInstance.HOC = this
    this.state = {
      isOverlayVisible: false,
      showProgressBar: false,
      routing: ''

    }
  }

  showHideProgressBar = (status) => {
    Keyboard.dismiss()
    this.setState({
      showProgressBar: status,
    })
  }

  showOverlay(parameter = {}) {
    this.onRetryClicked = parameter.onRetryClicked
    Keyboard.dismiss()
    this.setState({
      isOverlayVisible: true,
    })
  }


  instantiateReachability() {
    if (__DEV__) console.log('instantiateReachability')
    const reachabilityCallback = (isConnected) => null
    NetworkManager.networkManagerInstance.reachabilityListener(reachabilityCallback)
  }

  async componentDidMount() {
    this.instantiateReachability()
    await this.checkPermission();
    this.onTokenRefreshListener()
    // this.channelMethod()

  }


  async checkPermission() {
    this.onTokenRefreshListener = firebase.messaging().onTokenRefresh(fcmToken => console.log("[FCM][Token]\n" + fcmToken))

    const channel = new firebase.notifications.Android.Channel('funda-channel', 'Funda Channel', firebase.notifications.Android.Importance.Max).setDescription('Funda Channel')    // Create the channel
    firebase.notifications().android.createChannel(channel)
    const enabled = await firebase.messaging().hasPermission();
    if (enabled) {
      // this.getToken();
    } else {
      this.requestPermission();
    }
  }

  async requestPermission() {
    try {
      await firebase.messaging().requestPermission();

    } catch (error) {
      // User has rejected permissions

    }
  }

  render() {
    return (
      <View style={{ flex: 1 }}>

        <NavigationContainer

        >
          <MyDrawer
            routeName={'InitialRoute'}
          // routeName={'VerifyOtp'}
          />
        </NavigationContainer>

        {this.onRetryClicked && this.state.isOverlayVisible &&
          <NoNetwork onRetryClicked={() => {
            if (NetworkManager.networkManagerInstance.isInternetConnected) {
              this.setState({ isOverlayVisible: false })
              this.onRetryClicked
            } else {
              showToast(Constant.common.noInternetError);
            }
          }} />
        }
        <ProgressView animate={this.state.showProgressBar} />
      </View>
    )
  };
};