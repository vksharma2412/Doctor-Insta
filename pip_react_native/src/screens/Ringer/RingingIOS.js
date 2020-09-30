/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */ 

import React from 'react';
import { StyleSheet, NativeModules, View, TouchableOpacity, Text, Alert, Vibration, Image,SafeAreaView,ImageBackground } from 'react-native';
import { Color, Dimen, Strings, Assets, URL,Constant } from '../../../res';
import { StackActions, CommonActions } from '@react-navigation/native';
import { NetworkManager, NavUtil } from '../../utils';

import Session from '../../utils/Session';
const duration = 5000
const pattern = [1000, 2000, 3000, 4000];


startVibration = () => {
    Vibration.vibrate(pattern)
}

stopVibration = () => {
    Vibration.cancel()
}



class RingingView extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            activeSessionList: [],
            skip: 0,
            sessionId: this.props.route.params ? this.props.route.params.sessionId : '',
            token: this.props.route.params ? this.props.route.params.token : '',
            ringerName : this.props.route.params ? this.props.route.params.ringerName : '',
        }
    }

    render(){
    return (
            <SafeAreaView style={{ flex: 1 ,   backgroundColor: 'grey'}}>

                
                {/* <ImageBackground source={Assets.tutorProfile.educateStudents} style={{flex:1 ,width:'100%', marginVertical:'20%', overflow: "hidden"}}>  */}
                 
                <View style={{marginVertical:"10%", flex:1, flexDirection:"column", justifyContent:"space-between"}}>

                
                    <View style={{ alignItems:"center"}}>
                        <View style={styles.CircleShapeView,{alignItems: 'center', justifyContent: 'center',}}>

                            <ImageBackground
                                     source={Assets.studentRegistration.uploadProfile}
                                    //source ={Assets.tutor.tutorSample} 
                                    style={styles.ProfilePic}
                                    borderRadius={50}
                                    borderColor={Color.borderColor.primaryColor}
                                    borderWidth={1}
                                    resizeMode={'cover'}>
                                </ImageBackground>
                           
                        </View>
                      
                        <Text style={{fontSize:24,color:"#FFFFFF"}}>
                        {this.state.ringerName}
                        </Text>
                        <Text style={{color:"#FFFFFF"}}>Ringing</Text>
                    </View>         

                <View style={{flexDirection:"row", justifyContent:"space-between", marginHorizontal:'10%'}}>

                <TouchableOpacity
                        style={{ 
                        alignItems:"center",


                        }}
                        onPress={() => { this.acceptCall() }}>
                        <Image style={{ }} resizeMode='contain' source={Assets.openTok.answer} />
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={{ 
                        alignItems:"center",


                        }}
                        onPress={() => { this.disconnectSession() }}>
                        <Image style={{ }} resizeMode='contain' source={Assets.openTok.decline} />
                    </TouchableOpacity>


                </View>
                    
                </View>
              

            {/* <Image
            style={{ position: 'absolute', top: height - 100, right: 20, height: 50, width: 100 }}
            resizeMode='contain'
            source={Assets.sideDrawer.settings}
            /> */}

            {/* </ImageBackground>       */}

            </SafeAreaView>
    )
}


    disconnectSession = () =>{
        this.props.navigation.dispatch(
            CommonActions.reset({
                index: 1,
                routes: [
                  { name: 'HomeScreen' },
                //   {
                //     name: 'Profile',
                //     params: { user: 'jane' },
                //   },
                ],
              })
          );
    }

    acceptCall = async() => {

        this.props.navigation.dispatch(
            CommonActions.reset({
                index: 1,
                routes: [
                 // { name: 'VideoCall' },
                  {
                    name: 'VideoCall',
                    params: { sessionId: this.state.sessionId , token: this.state.token, ringerName:this.state.ringerName },
                  },
                ],
              })
          );

      //  NavUtil.navUtil.navigateTo(this, Constants.routeName.VideoCall)
        // let data = {}
 
        // data.user_type  =  "tutor";
        // data.session_id ="5f48aeb17a952f053f3edeca",
        // data.user_id    = Session.sharedInstance.userDetails[Constant.userDetailsFields._id];
    
        // const res = await NetworkManager.networkManagerInstance.fetchRequest(URL.videoCallSessionStart, URL.postRequest, true, data, () => this.placeBid())
        // console.log("video call res",JSON.stringify(res))
        // if (res.statusCode == 200) {
        //     NavUtil.navUtil.navigateTo(this, Constants.routeName.VideoCall)
        //   //  this.setState({ activeSession: res.data.result, scheduleSession: res.data.Ongoing })
        // } else {
        //     console.log('Video call FAILED')
        // }


        // this.props.navigation.dispatch(
        //     CommonActions.reset({
        //         index: 1,
        //         routes: [
        //           {
        //             name: 'VideoCall',
        //             params: { user: 'jane' },
        //           },
        //         ],
        //       })
        //   );

    }

}

export default RingingView;
const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    CircleShapeView: {
        width: 150,
        height: 150,
        borderRadius: 150/2,
        backgroundColor: '#00BCD4'
    },
    ProfilePic: {
        width: 100,
        height: 100,
        alignItems: 'center',
        justifyContent: 'center',
    },
})
