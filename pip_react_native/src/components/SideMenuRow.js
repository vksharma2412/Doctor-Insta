import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native'
import { Color } from '../../res';


export const SideMenuRow = props => {
    return (
        <View>
            <TouchableOpacity
                onPress={props.onPress}
                style={{ flexDirection: 'row', margin: 5, alignItems: 'center' }}>
                <View
                    style={{
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: 50,
                        height: 50,
                        // backgroundColor: Color.secondaryColor,
                        borderRadius: 25,
                        marginHorizontal: 15,
                        marginVertical: 5,
                    }}>
                    <Image
                        source={props.source}>
                    </Image>
                </View>
                <Text style={{ fontSize: 16, color: Color.textColor.secondaryColor }}>{props.title}</Text>
            </TouchableOpacity>
        </View>
    );
}