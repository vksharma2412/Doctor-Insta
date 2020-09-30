import React, { useRef } from 'react';
import { View } from 'react-native'
import { TextField } from 'react-native-material-textfield';
import { Color } from '../../res/index';

export const InputTextField = props => {

    return (
        <View>
            <TextField
                placeholder={props.placeholder}
                keyboardType={props.keyboardType}
                autoCapitalize={props.autoCapitalize}   // characters | sentences |  words  
                label={props.label}
                value={props.value}
                onChangeText={(text) => props.onChangeText(text)}
                tintColor={Color.borderColor.secondaryColor}
                labelFontSize={14}
                secureTextEntry={props.isSecure}
                maxLength={props.maxLength}
                baseColor={Color.borderColor.primaryColor}
                textColor={Color.black}
                error={props.errorText}
                disabled={props.disabled}
                containerStyle={props.containerStyle}
                errorColor={Color.borderColor.primaryColor}
            />
        </View>
    );




}