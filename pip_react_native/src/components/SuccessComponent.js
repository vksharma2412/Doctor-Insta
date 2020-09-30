import React from 'react';
import { View, TouchableOpacity, Image, Text } from 'react-native'
import { Color, Assets } from '../../res/index';
import { AppButton } from './AppButton';

const SuccessComponent = props => {
    return (
        <View style={{ flex: 10.3 }}>
            <View style={{ flex: 3 }}>
            </View>

            <Image style={{ alignSelf: 'center' }} source={props.image}></Image>

            <View style={{ flex: 3, alignItems: 'center', paddingHorizontal: 38 }}>
                <Text style={{ fontSize: 24, fontWeight: 'bold', color: Color.textColor.quarternary, textAlign: 'center' }}>{props.sucessMessage ? props.sucessMessage : 'Enter Sucess Message'}</Text>
                <Text style={{ fontSize: 14, fontWeight: '700', color: Color.textColor.secondaryColor, lineHeight: 25, textAlign: 'center' }}>{props.successSubMessage ? props.successSubMessage : 'Enter Success SubMessge Text'}</Text>
            </View>

            <View style={{ flex: 1.3, justifyContent: 'center', width: '85%', alignSelf: 'center' }}>
                <AppButton
                    onPress={props.actionOnPress}
                    isEnabled={true}
                    buttonText={props.buttonTitle ? props.buttonTitle : 'Okay'}
                />
            </View>

        </View >
    );
}

export default SuccessComponent


