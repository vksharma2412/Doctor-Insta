import React, { Component } from 'react';
import { View, StyleSheet, BackHandler } from 'react-native'
import { SuccessComponent } from '../../components';
import { Strings, Assets } from '../../../res/index';




class BidplaceSuccess extends React.Component {

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
        if (this.props.navigation.dangerouslyGetState().routes[this.props.navigation.dangerouslyGetState().routes.length - 1].name == 'BidplaceSuccess') {
            this.setState({ isPopVisible: true })
            return false
        } else {
            this.props.navigation.goBack()
        }
    }




    render() {
        return (
            <View style={styles.container}>
                <SuccessComponent
                    image={Assets.payment.paymentSucess}
                    buttonTitle={Strings.bid.returnToHome}
                    sucessMessage={Strings.bid.bidSuccessMessage}
                    successSubMessage={Strings.bid.bidSuccessSubMessage}
                    actionOnPress={() => this.props.navigation.navigate('HomeScreen')}
                >
                </SuccessComponent>
            </View>
        )
    };
};

export default BidplaceSuccess;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});