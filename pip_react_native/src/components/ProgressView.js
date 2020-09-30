import React, { Component } from "react"
import { View, StyleSheet } from "react-native"
import LottieView from 'lottie-react-native'

export default class ProgressView extends Component {

    render() {
        if (this.props.animate)
            return (
                <View style={styles.container}>
                    <LottieView source={require('../../res/assets/loader/LoaderAnimation.json')}
                        autoPlay
                        loop
                        style={styles.loader} />
                </View>
            )
        else return null
    }
}

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        left: 0,
        top: 0,
        bottom: 0,
        right: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.75)',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
    },
    loader: {
        width: '20%'
    }
});