import React from 'react';
import { StyleSheet, View, Image, Text } from 'react-native';
import { Styles, Color, Dimen } from '../../res';



export const PlaceholderComponent = props => {
    const {
        placeholderHeader,
        placeholderMessage,
        placeHolderImage,
        containerStyle

    } = props;

    return (
        <View style={[styles.container, containerStyle]}>
            <Image source={placeHolderImage} />
            <Text style={[Styles.placeholderHeaderTextStyle,]}>{placeholderHeader || ''}</Text>
            <Text style={[styles.dataTime,]}>{placeholderMessage || ''}</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    dataTime: {
        fontSize: Dimen.smallTextSize,
        fontWeight: '600',
        color: Color.textColor.secondayTextColor,
        marginHorizontal: 60,
        textAlign: 'center',
        lineHeight: 30
    },


});
