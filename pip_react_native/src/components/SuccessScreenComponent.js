import React, { Component } from 'react';
import { View, StyleSheet, BackHandler } from 'react-native'
import { SuccessComponent } from './';
import { Assets, } from '../../res/index';



class SuccessScreenComponent extends React.Component {

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
                    image={Assets.session.sucess}
                    buttonTitle={this.props.route.params.butonTitle}
                    sucessMessage={this.props.route.params.header}
                    successSubMessage={this.props.route.params.desc}
                    actionOnPress={() => this.props.navigation.navigate('HomeScreen')}
                >
                </SuccessComponent>
            </View>
        )
    };
};

export default SuccessScreenComponent;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});
