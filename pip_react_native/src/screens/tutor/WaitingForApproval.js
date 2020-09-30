import React, { Component } from 'react';
import { View, BackHandler } from 'react-native'
import { SuccessComponent, CommonHeader, SafeAreaComponent } from '../../components';
import { Strings, Assets, Constant, URL, AsyncStorageValues, Color, Dimen, } from '../../../res/index';
import Constants from '../../../res/Constants';
import Session from '../../utils/Session';
import { NetworkManager, Utility, NavUtil } from '../../utils';
import { showToast } from '../../utils/Utility';
import String from '../../../res/String';


export default class WaitingForApproval extends Component {

    constructor(props) {
        super(props)
        this.state = {

        }
    }



    async componentDidMount() {
        this.refreshApiHandler()
        BackHandler.addEventListener('hardwareBackPressScanning', this.handleBackButtonClick);
    }

    async componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPressScanning', () => { });
    }


    handleBackButtonClick = async () => {
        this.props.navigation.navigate('HomeScreen')

    }

    refreshApiHandler = async () => {

        NetworkManager.networkManagerInstance.progressBarRequest(true)

        let params = {}
        params.id = Session.sharedInstance.userDetails[Constants.userDetailsFields._id]
        try {
            const res = await NetworkManager.networkManagerInstance.fetchRequest(URL.updateTutor, URL.putRequest, true, params, () => { this.refreshApiHandler() });
            if (res.statusCode === 200) {
                if (res.data.isVerified == true) {
                    try {
                        let params = {}
                        params.id = Session.sharedInstance.userDetails[Constants.userDetailsFields._id]
                        params.is_tutor = true
                        params.is_student = false
                        const res = await NetworkManager.networkManagerInstance.fetchRequest(URL.updateTutor, URL.putRequest, true, params, () => { this.updateUserDetails() });
                        if (res.statusCode === 200) {
                            await Utility.sharedInstance._storeData(AsyncStorageValues.userDetails, res.data, String.asynstorageMsgs.updateStudentData)
                            Session.sharedInstance.userDetails = res.data
                            NetworkManager.networkManagerInstance.progressBarRequest(false)
                            NavUtil.navUtil.navigateTo(this, Constant.routeName.successScreenComponent, { butonTitle: `Let's Start`, header: String.profileVerified.header, desc: String.profileVerified.desc })
                        } else {
                            NetworkManager.networkManagerInstance.progressBarRequest(false)
                            showToast(res.message)
                        }

                    } catch (error) {
                        NetworkManager.networkManagerInstance.progressBarRequest(false)
                        console.log("STUDENT_API_HANDLER " + error)
                    }
                    // await Utility.sharedInstance._storeData(AsyncStorageValues.userDetails, res.data, Strings.asynstorageMsgs.updateTutorData)
                    // Session.sharedInstance.userDetails = res.data
                    // NetworkManager.networkManagerInstance.progressBarRequest(false)
                    // this.props.navigation.navigate(Constant.routeName.homeScreen,)
                } else {
                    showToast(Strings.toastMsgs.waitingForApproval.notApproved)
                }
            } else {
                showToast(Strings.toastMsgs.waitingForApproval.notApproved)
                NetworkManager.networkManagerInstance.progressBarRequest(false)
            }
        } catch (error) {
            NetworkManager.networkManagerInstance.progressBarRequest(false)
            console.log("TUTOR VERIFICATION APPROVAL HANDLER" + error)
        }

    }



    render() {
        return (
            <SafeAreaComponent StatusBarTextColor={'dark-content'}>

                <View style={{ flex: 1, }}>
                    <View style={{ flex: 0.12, }}>
                        <CommonHeader
                            backImage={Assets.homeScreen.side_menu_icon}
                            onPress={() => this.props.navigation.openDrawer()}
                            containerStyle={{ paddingTop: '3%', marginHorizontal: 20 }}
                            headerTrue={Strings.customerCare.customerCare}
                            headerTitleFontsize={Dimen.mediumTextSize}
                            headerTitleColor={Color.secondayTextColor}
                            leftIconStyle={{ tintColor: Color.black }}
                        />
                    </View>
                    <View style={{ flex: 0.88 }}>
                        <SuccessComponent
                            image={Assets.tutorProfile.waiting}
                            buttonTitle={'Refresh'}
                            sucessMessage={Strings.completeProfile.waitingforApproval}
                            successSubMessage={Strings.completeProfile.waitingForApprovalDesc}
                            actionOnPress={this.refreshApiHandler}
                        >
                        </SuccessComponent>
                    </View>
                </View>
            </SafeAreaComponent>
        )
    };


};

