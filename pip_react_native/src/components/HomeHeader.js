import React from 'react';
import { View, TouchableOpacity, Image, Text } from 'react-native'
import { Color, Assets } from '../../res/index';
import { useNavigation } from '@react-navigation/native';

export const HomeHeader = props => {
    const navigation = useNavigation();
    return (
        <View style={[{ flex: 1, flexDirection: 'row', paddingTop: 10, justifyContent: 'space-between' }, props.containerStyle]}>
            <View style={{ paddingVertical: 5, paddingRight: 5, flexDirection: 'row' }}>
                <TouchableOpacity
                    style={{ padding: 10 }}
                    onPress={props.OnPress}
                >
                    <Image

                        source={Assets.homeScreen.side_menu_icon}>
                    </Image>
                </TouchableOpacity>
                <View style={{ paddingVertical: 10, paddingHorizontal: 13 }}>
                    <Image source={Assets.homeScreen.small_logo} />
                </View>
                {/* <View style={{ paddingVertical: 18, alignSelf: 'auto', paddingHorizontal: 3 }}>
                    <Image source={Assets.common.logo} />
                </View> */}
            </View>
            <View style={{ paddingVertical: 5, paddingRight: 5, flexDirection: 'row' }}>
                <TouchableOpacity
                    style={{ padding: 10 }}
                    onPress={props.onNotificationPress}

                >
                    {/* <Image source={Assets.homeScreen.notificationIcon} /> */}
                    <Image source={props.newNotification ? Assets.homeScreen.notificationIcon: Assets.homeScreen.notification} />
                    
                </TouchableOpacity>

            </View>
        </View >
    );
}

