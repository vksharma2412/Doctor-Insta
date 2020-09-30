import React, { Component } from 'react';
import { View, BackHandler } from 'react-native'
import { SuccessComponent, CommonHeader } from '../../components';
import { Strings, Assets, Constant, Color, Dimen, } from '../../../res/index';
import Constants from '../../../res/Constants';
import Session from '../../utils/Session';


export default class CompleteProfileScreen extends Component {

    constructor(props) {
        super(props)
        this.state = {

        }
    }



    async componentDidMount() {
        BackHandler.addEventListener('hardwareBackPressScanning', this.handleBackButtonClick);
    }

    async componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPressScanning', () => { });
    }


    handleBackButtonClick = async () => {
        this.props.navigation.navigate('HomeScreen')

    }


    render() {
        return (
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
                        image={Assets.tutorProfile.educateStudents}
                        buttonTitle={Strings.completeProfile.completeProfile}
                        sucessMessage={Strings.completeProfile.completeProfileHeader}
                        successSubMessage={Strings.completeProfile.completeProfileDesc}
                        actionOnPress={() => this.props.navigation.navigate(Constants.routeName.tutorReg, { tutorDetails: Session.sharedInstance.userDetails })}
                    >
                    </SuccessComponent>
                </View>
            </View>
        )
    };


};

