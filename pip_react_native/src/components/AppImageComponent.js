import React, { Component } from 'react'
import {
    Text,
    StyleSheet,
    TouchableOpacity,
    View,
    Image
} from 'react-native'
import { Color, Dimen } from '../../res'

export const AppImageComponent = (
    {
        src,
        bottomImg,
        backgroundColor,
    }) => {
    return (
        <View style={{ flex: 1, borderBottomEndRadius:60,  backgroundColor: backgroundColor,alignItems: 'center', justifyContent: 'center' }}>

            {/*<View style={{ flex: .7,*/}

                {/*alignItems: 'center', justifyContent: 'center' }}>*/}
                <Image source={src} />
            {/*</View>*/}

           {/*<View style={{ flex: 0.3,}}>*/}
                {/*<Image*/}
                    {/*style={{ resizeMode: 'stretch', width: '100%' }}*/}
                    {/*source={bottomImg} />*/}
            {/*</View>*/}
        </View>
    )

    function isOnPress() {
        return true
    }
}

const styles = StyleSheet.create({
    container: {
        height: 50,
        alignItems: 'center',
        justifyContent: 'center',
        width: '80%',
        borderRadius: 5,
    },
    textStyle: {
        fontSize: 16
    },
    responsiveImage: {
        width: Dimen.phoneWidth - 30,
        height: undefined,
        alignSelf: 'center',
        aspectRatio: 135 / 100,
        borderRadius: 10,
        backgroundColor: 'red'
    },

});
