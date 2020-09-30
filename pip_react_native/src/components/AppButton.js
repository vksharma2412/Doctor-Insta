import React from 'react'
import {
    Text,
    StyleSheet,
    View,
    TouchableOpacity,
} from 'react-native'
import { Color } from '../../res'

export const AppButton = (
    {
        isEnabled,
        buttonStyle,
        buttonTextStyle,
        buttonText,
        isUpperCase,
        camelCaseText,
        onPress
    }) => {
    return (
        <TouchableOpacity
            style={[styles.container,
            {
                backgroundColor: isEnabled ?
                    Color.buttonColor.enableButton : Color.buttonColor.disableButton
            }, buttonStyle,]}
            activeOpacity={0.8}
            onPress={() => {
                return isEnabled ? onPress() : null
            }}
        >
            {buttonText && <Text style={[styles.textStyle, {
                fontWeight: '800',
                color: Color.secondayTextColor
            }, buttonTextStyle]}>{buttonText.toUpperCase() || 'Dummy'}</Text>}
            {isUpperCase && <Text style={[styles.textStyle, {
                fontWeight: '800',
                color: Color.secondayTextColor
            }, buttonTextStyle]}>{camelCaseText || 'Dummy'}</Text>}
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        height: 50,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 25,
    },
    textStyle: {
        fontSize: 16
    }
});
