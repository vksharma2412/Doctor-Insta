import React, { Component } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, TouchableWithoutFeedback, KeyboardAvoidingView, ScrollView, Keyboard, ImageBackground, BackHandler } from 'react-native'
import { AppButton, AppImageComponent, SafeAreaComponent, CommonHeader, SuccessComponent } from '../../components';
import { Strings, Assets, Dimen, Color, Styles, Constant } from '../../../res/index';
import { TextInput } from 'react-native-gesture-handler';
import Constants from '../../../res/Constants';



class SuccessScreen extends React.Component {

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
            <View style={styles.container}>
                <SuccessComponent
                    image={Assets.payment.paymentSucess}
                    buttonTitle={Strings.session.okay}
                    sucessMessage={Strings.session.sessionSucessMessage}
                    successSubMessage={Strings.session.sessionSubSuccesMessage}
                    actionOnPress={() => this.props.navigation.navigate('HomeScreen')}
                >
                </SuccessComponent>
            </View>
        )
    };
};

export default SuccessScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});
