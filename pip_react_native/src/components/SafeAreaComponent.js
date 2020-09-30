import React from 'react';
import { SafeAreaView, View, StatusBar } from 'react-native'
import { Color } from '../../res/index'

export default SafeAreaCompoment = props => {
    StatusBar.setBarStyle(props.StatusBarTextColor, true); 
    return (
        <>
            <StatusBar barStyle='light-content' />
            <SafeAreaView style={[{ backgroundColor: props.color }]}>
            </SafeAreaView>
            <View style={{ flex: 1 }}  {...props} />
            <SafeAreaView style={{ backgroundColor: 'white' }}>
            </SafeAreaView>
        </>
    );
}