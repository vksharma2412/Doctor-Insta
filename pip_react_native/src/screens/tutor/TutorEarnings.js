import React, { Component } from 'react';
import { View, Text, StyleSheet, FlatList, KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard, Image, Dimensions, ImageBackground, TouchableOpacity } from 'react-native'
import { SafeAreaComponent, AppTextComp } from '../../components';
import { HomeHeader, } from '../../components/HomeHeader';
import { Color, Dimen, Strings, Assets, URL } from '../../../res';
import { NetworkManager } from '../../utils';
import Utility, { showToast, validateEmailAddress, validateEmptyField, _storeData } from "../../utils/Utility";
import Session from '../../utils/Session';


class TutorEarnings extends Component {

    constructor(props) {
        super(props)
        this.state = {
            tutorEarningstData: [
                { subjecSessionName: 'English Session', date: '11 July, 2020', sessionCharged: '+$24',  penaltyCheck: false  },
                { subjecSessionName: 'Mathematics Session', date: '11 July, 2020', penaltyCheck: true, penaltyCharged: '-$15' },
                { subjecSessionName: 'English Session', date: '11 July, 2020', sessionCharged: '+$24',  penaltyCheck: false  },
                { subjecSessionName: 'English Session', date: '11 July, 2020', sessionCharged: '+$24',  penaltyCheck: false  },
                { subjecSessionName: 'English Session', date: '11 July, 2020', sessionCharged: '+$24',  penaltyCheck: false  },
                { subjecSessionName: 'English Session', date: '11 July, 2020', sessionCharged: '+$24',  penaltyCheck: false  },
                { subjecSessionName: 'English Session', date: '11 July, 2020', sessionCharged: '+$1224',  penaltyCheck: false  },
                { subjecSessionName: 'Mathematics Session', date: '11 July, 2020', penaltyCheck: true, penaltyCharged: '-$115' },
                { subjecSessionName: 'English Session', date: '11 July, 2020', sessionCharged: '+$24',  penaltyCheck: false  },
                { subjecSessionName: 'Mathematics Session', date: '11 July, 2020', penaltyCheck: true, penaltyCharged: '-$5' },
            ]
        }
    }

    componentDidMount() {
        // this.getTutorListData()
    }

    getTutorListData = async () => {
        const res = await NetworkManager.networkManagerInstance.fetchMultiPartRequest(URL.getTutorList, URL.getRequest, true, data, () => this.getTutorListData())
        if (res == 200) {
            setData = res
            this.setState({ tutorEarningstData: setData })
        } else {
            showToast(res.message)
        }
    }

    _renderItem = (item, index) => {
        return (
            <View
                style={{ 
                flex: 1,
                width: '90%',
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 5 },
                shadowOpacity: Platform.OS == "android" ? 1 : .3,
                shadowRadius:  Platform.OS == "android" ? 10 : 10,
                borderRadius: 10,
                elevation: 5,
                marginHorizontal: '5%',
                backgroundColor: 'white',
                marginTop: 15
             }}
             >
              <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 15, paddingLeft: 15, paddingRight: 20}}>
                  <View>
                        {item.penaltyCheck==true&&<Text style={{ fontSize: 12, fontWeight: '700', color: Color.textColor.pentaColor, lineHeight: 30}}>{'Penalty'}</Text>}
                        <Text style={{ fontSize: 16, fontWeight: '700', color: Color.textColor.quarternary, lineHeight: 30}}>{item.subjecSessionName}</Text>
                        <Text style={{ fontSize: 12, color: Color.textColor.resendOtp, lineHeight: 30}}>{item.date}</Text>
                  </View>
                  <View>
                        {item.penaltyCheck==true&&<Text style={{ fontSize: 20, fontWeight: '700', color: Color.textColor.decaColor}}>{item.penaltyCharged}</Text>}
                        <Text style={{ fontSize: 20, fontWeight: '700', color: Color.textColor.nonaColor}}>{item.sessionCharged}</Text>
                  </View>
              </View>
            </View>

        )

    }


    render() {
        return (
            <SafeAreaComponent
                StatusBarTextColor={'light-content'}
                color={Color.textColor.pentaColor}
            >
                <View style={{ flex: 1, }}>
                        <View style={{ flex: 0.12, backgroundColor: Color.textColor.pentaColor, justifyContent: 'center' }}>
                            <HomeHeader
                                containerStyle={{ backgroundColor: Color.textColor.pentaColor }}
                                OnPress={() => this.props.navigation.openDrawer()}
                                onNotificationPress={() => this.props.navigation.navigate('Login')}
                            />
                        </View>
                        <View style={{ flex: 0.88, borderTopLeftRadius: 20, borderTopRightRadius: 20, height: Dimen.phoneHeight, width: '100%' }}>
                            <View style={{flex: .20}}>
                                 <View style={{ flex: 1, backgroundColor: Color.buttonColor.enableButton, marginHorizontal: '5%', marginTop: '7%', borderRadius: 15, alignItems: 'center', justifyContent: 'center'}}>
                                     <Text style={{ fontSize: 14, color: Color.textColor.octaColor, lineHeight: 30}}>{'Your Earnings'}</Text>
                                     <Text style={{ fontSize: 24, fontWeight: 'bold', color: Color.secondayTextColor, lineHeight: 30}}>{'$13,350.50'}</Text>
                                </View>
                            </View>
                            <View style={{ flex: .68, paddingTop: 7}}>
                                <FlatList
                                    numColumns={1}
                                    data={this.state.tutorEarningstData}
                                    renderItem={({ item, index }) => this._renderItem(item, index)}
                                    keyExtractor={(item, index) => `${index}_users`}
                                />
                            </View>
                        </View>
                </View>
            </SafeAreaComponent>
        )
    };
};

export default TutorEarnings;

const styles = StyleSheet.create({
    ProfilePic: {
        width: 100,
        height: 100,
        alignItems: 'center',
        justifyContent: 'center',
    },

});