import React from 'react';
import { View, Text, StyleSheet } from 'react-native'




class TestScreen extends React.Component {


    render() {
        return (

                <View style={styles.container}>
                  <Text>Test Running</Text>
                </View>
        )
    };

};

export default TestScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    }
});
