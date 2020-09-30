import React, { Component } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, TouchableWithoutFeedback, KeyboardAvoidingView, ScrollView, Keyboard, ImageBackground, BackHandler } from 'react-native'
import { AppButton, AppImageComponent, SafeAreaComponent, CommonHeader, SuccessComponent } from '../../components';
import { Strings, Assets, Dimen, Color, Styles, Constant } from '../../../res/index';
import { TextInput } from 'react-native-gesture-handler';
import Constants from '../../../res/Constants';



class BookingSuccessFull extends React.Component {

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
        if (this.props.navigation.dangerouslyGetState().routes[this.props.navigation.dangerouslyGetState().routes.length - 1].name == 'BookingSuccessFull') {

            return false
        } else {
            this.props.navigation.goBack()
        }
    }



    render() {
        return (
            <View style={styles.container}>
                <SuccessComponent
                    image={Assets.session.sucess}
                    buttonTitle={Strings.session.okay}
                    sucessMessage={Strings.session.bookingSuccessFullHeader}
                    successSubMessage={Strings.session.bookinSuccessFulDesc}
                    actionOnPress={() => this.props.navigation.navigate('HomeScreen')}
                >
                </SuccessComponent>
            </View>
        )
    };
};

export default BookingSuccessFull;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});
