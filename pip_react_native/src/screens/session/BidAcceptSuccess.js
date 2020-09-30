import React, { Component } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, TouchableWithoutFeedback, KeyboardAvoidingView, ScrollView, Keyboard, ImageBackground, BackHandler } from 'react-native'
import { AppButton, AppImageComponent, SafeAreaComponent, CommonHeader, SuccessComponent } from '../../components';
import { Strings, Assets, Dimen, Color, Styles, Constant } from '../../../res/index';
import { TextInput } from 'react-native-gesture-handler';
import Constants from '../../../res/Constants';



class BidAcceptSuccess extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            session_id: this.props.route.params.session_id != '' ? this.props.route.params.session_id : '',
            status: this.props.route.params.status != '' ? this.props.route.params.status : ''
        }
    }




    async componentDidMount() {
        BackHandler.addEventListener('hardwareBackPressScanning', this.handleBackButtonClick);
    }

    async componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPressScanning', () => { });
    }


    handleBackButtonClick = async () => {
        if (this.props.navigation.dangerouslyGetState().routes[this.props.navigation.dangerouslyGetState().routes.length - 1].name == 'BidAcceptSuccess') {

            return false
        } else {
            this.props.navigation.goBack()
        }
    }



    render() {
        console.log('this is checking BidAcceptSucsess', this.state.session_id)
        console.log('this is checking BidAcceptSucsess', this.state.status)
        return (
            <View style={styles.container}>
                <SuccessComponent
                    image={Assets.payment.paymentSucess}
                    buttonTitle={Strings.session.viewDetails}
                    sucessMessage={Strings.session.bookingSuccessFullHeader}
                    successSubMessage={'Lorem Ipsum is simply dummy text of printing and typesetting industry.'}
                    actionOnPress={() => this.props.navigation.navigate('HomeScreen', { session_id: this.state.session_id, status: this.state.status })}
                >
                </SuccessComponent>
            </View>
        )
    };
};

export default BidAcceptSuccess;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});
