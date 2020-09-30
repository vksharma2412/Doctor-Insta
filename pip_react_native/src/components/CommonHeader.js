import React from 'react';
import { View, TouchableOpacity, Image, Text } from 'react-native'
import { Color, Assets } from '../../res/index';
import { useNavigation } from '@react-navigation/native';

export const CommonHeader = props => {

    const navigation = useNavigation();
    return (
        <View style={[{ flexDirection: 'row', alignSelf: 'center', paddingBottom: 20, }, props.containerStyle]}>
            <View style={{ flex: 0.1, paddingVertical: 5, paddingRight: 5, justifyContent: 'center' }}>
                <TouchableOpacity
                    onPress={props.onPress != null ? props.onPress : () => navigation.goBack()}
                >
                    <Image
                        style={[props.leftIconStyle]}
                        source={props.backImage ? props.backImage : Assets.common.blackBackButton}>
                    </Image>
                </TouchableOpacity>
            </View>
            <View style={{ flex: 0.8, alignItems: 'center', justifyContent: 'center', paddingTop: 5 }}>
                <View style={{ alignItems: 'center' }}>
                    {props.headerTrue && <Text style={{ color: props.headerTitleColor ? props.headerTitleColor : Color.textColor.quarternary, fontSize: props.headerTitleFontsize, fontWeight: props.headerTtileFontWieght }}>{props.headerTrue}</Text>}
                    {props.pageCount && <Text style={{ color: Color.introColor.primaryColor, fontSize: 12, fontWeight: '700' }}>{props.pageCount}</Text>}
                </View>
            </View>
            <View style={{ flex: 0.1 }}>
                {props.skip && <TouchableOpacity style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
                    onPress={props.skiponPress}
                >
                    <Text style={{ color: Color.textColor.pentaColor }}>{props.skip}</Text>
                </TouchableOpacity>}
                {props.rightIcon && <TouchableOpacity style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
                    onPress={props.rightIconPress}>
                    <Image source={props.rightIcon} />
                </TouchableOpacity>}
            </View>
        </View >
    );
}

