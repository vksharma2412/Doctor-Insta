
import React, { Component } from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    Keyboard
} from 'react-native';
import Dates from 'react-native-dates';
import moment from 'moment';
import { TouchableOpacity, TouchableWithoutFeedback } from 'react-native-gesture-handler';
import { Color } from '../../res';

export default class RangeDatePickerComponent extends Component {
    state = {
        date: null,
        focus: 'startDate',
        startDate: null,
        endDate: null,
        oncancelPress: false
    }




    render() {
        const isDateBlocked = (date) =>
            date.isBefore(moment().subtract(30, 'days'), 'day');

        const onDatesChange = ({ startDate, endDate, focusedInput }) =>
            this.setState({ ...this.state, focus: focusedInput }, () => {
                this.setState({ ...this.state, startDate, endDate })
                this.props.onChange(startDate, endDate)
            }
            );

        const onDateChange = ({ date }) =>
            this.setState({ ...this.state, date });


        return (

            <View style={styles.container}>
                {/* <TouchableWithoutFeedback style={{ backgroundColor: 'green' }} onPress={Keyboard.dismiss}> */}
                <View style={{ backgroundColor: Color.textColor.pentaColor, width: '100%', height: 60, justifyContent: 'center', alignItems: 'center' }}><Text style={{ fontSize: 16, color: Color.secondayTextColor }}>Please Select Range</Text></View>
                <Dates
                    onDatesChange={onDatesChange}
                    isDateBlocked={isDateBlocked}
                    startDate={this.state.startDate}
                    endDate={this.state.endDate}
                    focusedInput={this.state.focus}
                    focusedMonth={moment('DD/MM/YYYY')}
                    range
                />
                {/* <View style={{
                    backgroundColor: ''
                }}>
                    <TouchableOpacity style={{ flex: 0.5, height: 100, width: 200, backgroundColor: 'white' }} onPress={() => this.setState({ oncancelPress: true })}>
                        <Text>Cancel</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={{ flex: 0.5, backgroundColor: 'white' }} onPress={() => this.setState({ oncancelPress: true })}>
                        <Text>Cancel</Text>
                    </TouchableOpacity>
                </View> */}
                <View style={{ flexDirection: 'row' }}>
                    {/* <View style={{ flex: 0.5 }}></View> */}
                    {/* <View style={{ flex: 0.5, flexDirection: 'row' }}> */}

                </View>
                {/* </View> */}
                {/* </TouchableWithoutFeedback> */}
            </View>

        );
    }
}

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        left: 0,
        top: 0,
        bottom: 0,
        right: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.75)',
        paddingHorizontal: 40,
        // alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
    },

    date: {
        marginTop: 50
    },
    focused: {
        color: 'blue'
    }
});

AppRegistry.registerComponent('ReactNativeDatesDemo', () => ReactNativeDatesDemo);