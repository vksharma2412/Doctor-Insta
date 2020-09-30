import React, { Component } from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet, KeyboardAvoidingView, ScrollView, TouchableWithoutFeedback, Keyboard, Image, Dimensions, ImageBackground } from 'react-native'
import { CommonHeader, SafeAreaComponent, AppButton, PlaceholderComponent, AppTextComp, CommonDropDown } from '../../components';
import { Color, Dimen, Strings, Assets, Constant } from '../../../res';
import Constants from '../../../res/Constants';
import String from '../../../res/String';


class RequestSession extends Component {

    constructor(props) {
        super(props)
        this.state = {
            dropdown: false,
            selectedDate: '',
            selectedTime: '',
            selectedBudget: '',
            selectedTutorRating: '',
            data: [],
            dropdownHeader: '',
            isUrgent: false,
            userDoubtImages: [
                { url: 'https://funda-app-dev.storage.googleapis.com/1594918691327_1594918681737.jpg' },
                { url: "https://funda-app-dev.storage.googleapis.com/1594918682384_1594918681737.jpg", },
                { url: 'https://funda-app-dev.storage.googleapis.com/1594918691327_1594918681737.jpg' },
                { url: "https://funda-app-dev.storage.googleapis.com/1594918682384_1594918681737.jpg", },
                { url: 'https://funda-app-dev.storage.googleapis.com/1594918691327_1594918681737.jpg' },
                { url: "https://funda-app-dev.storage.googleapis.com/1594918682384_1594918681737.jpg", },
                { url: 'https://funda-app-dev.storage.googleapis.com/1594918691327_1594918681737.jpg' },
                { url: "https://funda-app-dev.storage.googleapis.com/1594918682384_1594918681737.jpg", },

            ],
            education: [{
                value: 'Primary',
            }, {
                value: 'Secondary',
            }, {
                value: 'Tertiary',
            }, {
                value: 'Other ',
            }],
            subject: [{
                value: 'Mathematics',
            }, {
                value: 'Physics',
            }, {
                value: 'Science',
            }],
            grade: [{
                value: '6 Grade',
            }, {
                value: '8 Grade',
            }, {
                value: '9 Grade',
            }]

        }

    }


    render() {
        return (

            <SafeAreaComponent>

                <View style={{ flex: 1, height: Dimen.phoneHeight }}>
                    <View style={{ flex: 0.12, backgroundColor: Color.textColor.pentaColor, }}>
                        <CommonHeader
                            containerStyle={{ marginHorizontal: '3%' }}
                            headerTrue={Strings.bookingSession.bookSession}
                            headerTitleFontsize={Dimen.mediumTextSize}
                            headerTitleColor={Color.secondayTextColor}
                            leftIconStyle={{ tintColor: Color.secondayTextColor }}

                        />
                    </View>
                    <View style={{ flex: 0.88, top: -20, paddingBottom: '13%', borderTopLeftRadius: 20, borderTopRightRadius: 20, height: Dimen.phoneHeight, width: '100%', backgroundColor: Color.secondayTextColor }}>
                        <ScrollView
                            contentContainerStyle={{ paddingTop: 20 }}>
                            <View style={{ flex: 1, }}>
                                {this.inputFields()}
                                {this.uploadImage()}
                                {this.state.dropdown != "" && <CommonDropDown
                                    isModalshow={this.state.dropdown}
                                    cancelModal={() => this.setState({ dropdown: false })}
                                    data={this.state.data}
                                    getCountry={this.updateData}
                                    dropdownHeader={Strings.studentSignUp.education}
                                    listItemField={'value'}
                                />}
                            </View>
                        </ScrollView>
                    </View>
                </View>


                {this.continueButton()}
            </SafeAreaComponent>



        )
    };


    inputFields() {
        return (
            <View style={{ flex: 0.6, marginHorizontal: '4%', }}>
                <TouchableOpacity
                    style={{ flex: 0.2, paddingTop: 10, width: '100%', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderBottomWidth: 1, borderBottomColor: Color.borderColor.primaryColor }}
                    onPress={() => this.setState({ dropdown: true, dropdownHeader: Strings.bookingSession.selectDate, data: this.state.education })}>
                    <AppTextComp
                        // style={{ backgroundColor: 'red' }}
                        value={this.state.selectedDate}
                        onChangeText={(text) => this.setState({ selectedDate: this.state.selectedDate })}
                        placeholder={Strings.bookingSession.selectDate}
                        fontSize={16}
                        editable={false}
                        autoCapitalize='none'
                        labelEnabled={true}
                        tintColor={Color.borderColor.secondaryColor}
                        lineWidth={0}
                        activeLineWidth={0}
                        width='90%'
                        // keyboardType='default'
                        materialTextInput
                    />
                    <Image style={{ marginLeft: 5 }} source={Assets.common.drop_down} />
                </TouchableOpacity>
                <TouchableOpacity
                    style={{ flex: 0.2, paddingTop: 20, width: '100%', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderBottomWidth: 1, borderBottomColor: Color.borderColor.primaryColor }}
                    onPress={() => this.setState({ dropdown: true, dropdownHeader: Strings.bookingSession.grades, data: this.state.grade })}>
                    <AppTextComp
                        // style={{ backgroundColor: 'red' }}
                        value={this.state.selectedTime}
                        onChangeText={(text) => this.setState({ selectedEducation: this.state.selectedTime })}
                        placeholder={Strings.bookingSession.selectTime}
                        fontSize={16}
                        editable={false}
                        autoCapitalize='none'
                        labelEnabled={true}
                        tintColor={Color.borderColor.secondaryColor}
                        lineWidth={0}
                        activeLineWidth={0}
                        width='90%'
                        // keyboardType='default'
                        materialTextInput
                    />
                    <Image style={{ marginLeft: 5 }} source={Assets.common.drop_down} />
                </TouchableOpacity>
                <View style={{ flex: 0.2, flexDirection: 'row', }}>
                    <View style={{ flex: 0.5, width: '20%', paddingRight: '15%', }}>
                        <TouchableOpacity
                            style={{ paddingTop: 20, width: '100%', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderBottomWidth: 1, borderBottomColor: Color.borderColor.primaryColor }}
                            onPress={() => this.setState({ dropdown: true, dropdownHeader: Strings.bookingSession.budget, data: this.state.subject })}>
                            <AppTextComp
                                // style={{ backgroundColor: 'red' }}
                                value={this.state.selectedBudget}
                                onChangeText={(text) => this.setState({ selectedEducation: this.state.selectedBudget })}
                                placeholder={Strings.bookingSession.budget}
                                fontSize={16}
                                editable={false}
                                autoCapitalize='none'
                                labelEnabled={true}
                                tintColor={Color.borderColor.secondaryColor}
                                lineWidth={0}
                                activeLineWidth={0}
                                width='90%'
                                // keyboardType='default'
                                materialTextInput
                            />
                            <Image style={{ marginLeft: 5 }} source={Assets.common.drop_down} />
                        </TouchableOpacity>
                    </View>
                    <View style={{ flex: 0.5, width: '40%', paddingRight: '15%' }}>
                        <TouchableOpacity
                            style={{ paddingTop: 20, width: '100%', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderBottomWidth: 1, borderBottomColor: Color.borderColor.primaryColor }}
                            onPress={() => this.setState({ dropdown: true, dropdownHeader: Strings.bookingSession.tutorRating, data: this.state.subject })}>
                            <AppTextComp
                                // style={{ backgroundColor: 'red' }}
                                value={this.state.selectedTutorRating}
                                onChangeText={(text) => this.setState({ selectedEducation: this.state.selectedTutorRating })}
                                placeholder={Strings.bookingSession.tutorRating}
                                fontSize={16}
                                editable={false}
                                autoCapitalize='none'
                                labelEnabled={true}
                                tintColor={Color.borderColor.secondaryColor}
                                lineWidth={0}
                                activeLineWidth={0}
                                width='90%'
                                // keyboardType='default'
                                materialTextInput
                            />
                            <Image style={{ marginLeft: 5 }} source={Assets.common.drop_down} />
                        </TouchableOpacity>

                    </View>
                </View>

            </View>
        )
    }

    uploadImage() {
        return (
            <View style={{ flex: 0.4, marginHorizontal: '4%', }}>
                <View style={{ flex: 0.3, flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 40 }}>
                    <Text>{String.bookingSession.urgentBooking}</Text>
                    <TouchableOpacity onPress={() => this.setState({ isUrgent: !this.state.isUrgent })}>
                        <Image source={this.state.isUrgent ? Assets.homeScreen.enableBox : Assets.homeScreen.disablebox} />
                    </TouchableOpacity>
                </View>

                <View style={{ flex: 0.7, alignItems: 'center' }}>
                    <TouchableOpacity style={{ flex: 0.5, height: 120, width: '100%', alignItems: 'center', justifyContent: 'center', backgroundColor: Color.introColor.activeBackground, borderWidth: 1, borderRadius: 5, borderStyle: 'dashed', borderColor: Color.borderColor.primaryColor }}>

                        <Text style={{ textAlign: 'center', marginHorizontal: 40 }}>{Strings.bookingSession.chargeExceeds}</Text>
                    </TouchableOpacity>
                </View>

            </View>
        )
    }


    continueButton() {
        return (
            <View style={{ width: '90%', flex: 1, position: 'absolute', bottom: 0, justifyContent: 'flex-end', alignItems: 'center', marginBottom: 20, alignSelf: 'center' }}>

                <AppButton
                    onPress={this.tutorApiHandler}
                    isEnabled={true}
                    buttonText={Strings.bookingSession.requestBooking}
                />
            </View>
        )
    }



    updateData = (item, isdropdownVisible) => {

        if (this.state.dropdownHeader == String.bookingSession.education)
            this.setState({
                dropdown: isdropdownVisible,
                selectedEducation: item.value,
            });
        if (this.state.dropdownHeader === String.bookingSession.grades)
            this.setState({
                dropdown: isdropdownVisible,
                selectedGrade: item.value,
            })

        if (this.state.dropdownHeader === String.bookingSession.subject)
            this.setState({
                dropdown: isdropdownVisible,
                selectedSubject: item.value,
            })



    }
};

export default RequestSession;

const styles = StyleSheet.create({
    container: {
        flex: 1,

    },
    buttonStyle: {
        padding: 10,
        borderWidth: 1,
        borderRadius: 5,
        margin: 20
    },
    textStyle: {
        fontSize: 14
    },
    responsiveImage: {
        width: Dimen.phoneWidth - 20,
        height: undefined,
        alignSelf: 'center',
        aspectRatio: 135 / 85,
        borderRadius: 10
    },
});