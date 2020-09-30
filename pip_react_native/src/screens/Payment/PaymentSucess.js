import React, { Component } from 'react';
import { View,  StyleSheet } from 'react-native'
import {  SuccessComponent } from '../../components';
import { Strings, Assets } from '../../../res/index';




class PaymentSucess extends React.Component {

    constructor(props) {
        super(props)
        this.state = {

        }
    }

    render() {
        return (
            <View style={styles.container}>
                <SuccessComponent
                    image={Assets.payment.paymentSucess}
                    buttonTitle={Strings.payment.joinSession}
                    sucessMessage={Strings.payment.paymentSucessMessage}
                    successSubMessage={Strings.payment.paymentSucessSubMessage}
                    actionOnPress={() => this.props.navigation.navigate('HomeScreen')}
                >
                </SuccessComponent>
            </View>
        )
    };
};

export default PaymentSucess;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});
