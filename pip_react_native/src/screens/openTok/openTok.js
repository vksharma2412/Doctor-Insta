import React, { Component } from 'react';
import { View, TouchableOpacity, Text, Image, Dimensions, SafeAreaView, StyleSheet, ImageBackground, Platform } from 'react-native';
import { OTSession, OTPublisher, OTSubscriber, OT } from 'opentok-react-native';
import { connect } from "react-redux";

import { Color, Dimen, Strings, Assets, URL } from '../../../res';
import { StackActions, CommonActions } from '@react-navigation/native';
import { Utility } from '../../utils';
const uuid = require('uuid/v4');
const height = Dimensions.get('window').height
const width = Dimensions.get('window').width
var totalSeconds = 0;
let findur = 0;
class VideoCall extends React.Component {

    constructor(props) {
        super(props);
        this.videoDuration = 0
        this.interval = 0

        this.state = {
            apiKey: '46898994',
            sessionId: this.props.route.params ? this.props.route.params.sessionId : '',
            //sessionId:"1_MX40Njg5NzY4NH5-MTU5ODgwNzkwMTI5OH5KUHcyc2FXL2V6QjR3eTl1TEwrWUFqVkV-fg",
            token: this.props.route.params ? this.props.route.params.token : '',
            //token: "T1==cGFydG5lcl9pZD00Njg5NzY4NCZzaWc9YWFkNGM4YThmODQ2YWIwNjZjZDE2YmFmOTFhYmJjOWY2NDUyNGM1YzpzZXNzaW9uX2lkPTFfTVg0ME5qZzVOelk0Tkg1LU1UVTVPRGd3Tnprd01USTVPSDVLVUhjeWMyRlhMMlY2UWpSM2VUbDFURXdyV1VGcVZrVi1mZyZjcmVhdGVfdGltZT0xNTk4ODA3OTIzJm5vbmNlPTAuNzYyNzkwMTIyOTEzMjIwNiZyb2xlPXB1Ymxpc2hlciZleHBpcmVfdGltZT0xNTk4ODExNTIyJmluaXRpYWxfbGF5b3V0X2NsYXNzX2xpc3Q9",
            ringerName: this.props.route.params ? this.props.route.params.ringerName : 'No Name',
            sessionStatus: false,
            duration: 'Connecting...',
            jobberJobbeeConnected: false,
            mute: false,
            publisherId: uuid(),
            publisherProperties: {
                publishAudio: true,
                videoSource: 'camera'
            },
            signal: {
                type: ''
            },
            screenshare:false
        }


        this.publisherProperties = {
            publishAudio: false,
            videoSource: 'camera'
          };
      


        this.sessionEventHandlers = {
            connectionCreated: event => {
                console.log("connection created", event);
            },
            connectionDestroyed: event => {
                this.disconnectSession()
                this.cancelAndgoBack()
                console.log("connection destroyed", event);
            },
            sessionConnected: event => {
                console.log("Client connect to a session")
            },
            sessionDisconnected: event => {
                this.cancelAndgoBack()
                console.log("Client disConnect to a session")
            },
            sessionReconnected: event => {
                console.log("session reconnected")
            },
        };

        this.publisherEventHandlers = {
            streamCreated: event => {
                console.log('Publisher stream created!', event);
            },
            streamDestroyed: event => {
                this.cancelAndgoBack()
                console.log('Publisher stream destroyed!', event);
            }
        };

        this.subscriberEventHandlers = {
            videoDataReceived: event => {

                if (event && !this.state.jobberJobbeeConnected) {
                    this.interval = setInterval(this.countTimer, 1000);
                    this.setState({ jobberJobbeeConnected: true })
                    //start timer
                }
                // console.log('videoDataReceived subscriber:', event);
            },
            error: (error) => {
                console.log(`There was an error with the subscriber: ${error}`);
            },
        };

        if (Platform.OS == "android") {
            this.sessionOptions = {
                // connectionEventsSuppressed: true, // default is false
                androidZOrder: 'onTop', // Android only - valid options are 'mediaOverlay' or 'onTop'
                androidOnTop: 'publisher',  // Android only - valid options are 'publisher' or 'subscriber'
                // useTextureViews: true,  // Android only - default is false
                // isCamera2Capable: false, // Android only - default is false
                // ipWhitelist: false, // https://tokbox.com/developer/sdks/js/reference/OT.html#initSession - ipWhitelist
            };
        }

    }

    componentDidMount = () => {
        // setTimeout(() => {
        //     if (this.state.jobberJobbeeConnected === false) {
        //         this.disconnectSession()
        //     }
        // }, 45000)
    }
    componentWillUnmount() {
        totalSeconds = 0;
        findur = 0;
        clearInterval(this.interval)
    }

    countTimer = () => {
        ++totalSeconds;
        var hour = Math.floor(totalSeconds / 3600);
        var minute = Math.floor((totalSeconds - hour * 3600) / 60);
        var seconds = totalSeconds - (hour * 3600 + minute * 60);
        if (hour < 10)
            hour = "0" + hour;
        if (minute < 10)
            minute = "0" + minute;
        if (seconds < 10)
            seconds = "0" + seconds;
        findur = hour + ":" + minute + ":" + seconds;
        this.setState({ duration: findur })

    }

    sendSignal() {
        this.setState({
            signal: {
                type: 'disconnected'
            }
        });
    }

    render() {
        const { sessionId, token } = this.state

        console.log("session == ", sessionId, " tokenid == ", token)
        return (
            <View style={{ flex: 1, backgroundColor: "black" }}>


                <View style={{ position: "absolute", zIndex: 1000, width: width, alignItems: "center", marginTop: "20%" }}>
                    <Text style={{
                        paddingTop: 10,
                        fontSize: 16, fontWeight: '400', color: 'white', alignSelf: 'center'
                    }}>{this.state.ringerName}</Text>
                    <Text style={{
                        paddingTop: 10,
                        fontSize: 16, color: 'white', alignSelf: 'center'
                    }}>{this.state.duration}</Text>

                </View>

                <OTSession
                    apiKey={this.state.apiKey}
                    sessionId={this.state.sessionId}
                    token={this.state.token}
                    eventHandlers={this.sessionEventHandlers}
                    signal={this.state.signal}
                    options={this.sessionOptions}
                >

                    <OTPublisher
                        publisherID={this.state.publisherId}
                        // style={{ width: '100%', height: '50%' }}
                        style={{ position: "absolute", zIndex: 1000, top: 20, right: 20, width: 100, height: 150 }}
                        properties={this.state.publisherProperties}
                       
                        eventHandlers={this.publisherEventHandlers}
                       

                    />

                    <OTSubscriber
                        style={{ position: 'absolute', width: width, height: height }}
                        eventHandlers={this.subscriberEventHandlers}
                    />

                </OTSession>


                <TouchableOpacity
                    style={{
                        position: 'absolute', top: height - 100, left: 20, width: 50, height: 50,
                        borderRadius: 75, backgroundColor: 'grey', alignItems: 'center', justifyContent: 'center'
                    }}
                    onPress={this.screenShare}>
                     <Text>{this.state.screenshare?"Stop Sharing" :"Share screen"  }</Text>   
                    {/* <Image style={{ height: 40, width: 40 }} resizeMode='contain' source={this.state.mute ? assets.ringer.mute : assets.ringer.unmute} /> */}
                </TouchableOpacity>

                <TouchableOpacity
                    style={{

                        position: 'absolute', top: height - 120, left: width / 2 - 25, right: width / 2, borderRadius: 75, width: 70, height: 70,
                        backgroundColor: '#C94B4F', justifyContent: 'center', alignItems: 'center'
                    }}
                    onPress={() => {
                        this.disconnectSession()
                        Utility.sharedInstance.EventEmitter.emit('HOME', { action: 'REFRESH' })
                    }}>
                    <Image style={{}} resizeMode='contain' source={Assets.openTok.disconnect_call} />
                </TouchableOpacity>




            </View>
        );
    }

    mute = () => {
        this.setState({ mute: !this.state.mute }, () => {
            OT.publishAudio(this.state.publisherId, !this.state.mute);
            
        })
    }

    screenShare =() => {


        // OT.destroyPublisher(this.state.publisherId, (error) => { 

        //     if(error)
        //     {

        //     }else{
        //         //start again
        //         OT.initPublisher()
        //     }

        // })

       // OT.videoSource(this.state.publisherId, "screen"); 
        if(this.state.screenshare)
        {  // OT.videoSource(this.state.publisherId, "camera")
            this.setState({ publisherProperties: {
                                                        publishAudio: true,
                                                        videoSource: 'camera'
                                                    },
                             screenshare: false
                        }, () => {
                            OT.destroyPublisher(this.state.publisherId, (error) => { 

                                if(error)
                                {
                    
                                }else{
                                    //start again
                                   
                                }
                    
                            })

                        })
        }else{
           // OT.videoSource(this.state.publisherId, "screen")
           this.setState({ publisherProperties: {
                                            publishAudio: true,
                                            videoSource: 'screen'
                                        },
                                screenshare: true
                                }, () => {
                                    OT.destroyPublisher(this.state.publisherId, (error) => { 

                                        if(error)
                                        {
                            
                                        }else{
                                            //start again
                                           // OT.initPublisher()
                                        }
                            
                                    })

                                })
        }
    }

    disconnectSession = () => {

        OT.disconnectSession(this.state.sessionId, (disconnectError) => {
            //  this.cancelAndgoBack()
            clearInterval(this.interval)
            this.setState({ duration: '' })
            this.interval = 0
            totalSeconds = 0
            findur = 0
            if (disconnectError) {
                console.log('disconnected error');
            }
        });
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
    // disconnectSession() {
    //     totalSeconds = 0;
    //     findur = 0;
    //     clearInterval(this.interval)
    //     OT.disconnectSession(this.state.sessionId, (disconnectError) => {
    //         this.cancelAndgoBack()
    //         clearInterval(this.interval)
    //         this.setState({ duration: '' })
    //         this.interval = 0
    //         totalSeconds = 0
    //         findur = 0
    //         if (disconnectError) {
    //             console.log('disconnected error');
    //         }
    //     });
    // }

    cancelAndgoBack() {
        clearInterval(this.interval)
        // const resetAction = StackActions.reset({
        //     index: 0,
        //     actions: [NavigationActions.navigate({
        //         routeName: "HomeDetailsScreen", params: {


        //             job_id: this.state.job_id
        //         }
        //     })],
        // });
        this.props.navigation.navigate('HomeScreen')
    }

}



const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    CircleShapeView: {
        width: 150,
        height: 150,
        // borderRadius: 150/2,
        // backgroundColor: '#00BCD4'
    },
    ProfilePic: {
        width: 100,
        height: 100,
        alignItems: 'center',
        justifyContent: 'center',
    },
})

const mapStateToProps = state => {
    return {
        newNotification: state.userDetailsReducer.newNotification,
        isJobbie: state.userDetailsReducer.isJobbie,
        locationLatFromStore: state.userDetailsReducer.locationLat,
        locationLngFromStore: state.userDetailsReducer.locationLng
    };
};

export default connect(null, null)(VideoCall)