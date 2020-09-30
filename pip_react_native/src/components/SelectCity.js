import React, { Component } from "react";
import { Text, StyleSheet, View, TouchableOpacity, TextInput, FlatList, ScrollView, KeyboardAvoidingView } from "react-native";
import Modal from 'react-native-modal';
import { Dimen, Color } from '../../res';
import Flag from 'react-native-flags';



export default class SelectCity extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isModalVisible: false,
            filterData: '',
            mainCountryList: this.props.data
        };
    }

    cancelModal = () => {
        this.props.cancelModal();
        this.setState({
            filterData: this.state.mainCountryList
        })
    }

    render() {
        let { isModalshow } = this.props;
        return (
            <Modal isVisible={isModalshow} style={{ flex: 1, justifyContent: 'flex-start' }} hasBackdrop={true} onBackButtonPress={this.props.cancelModal} coverScreen={true} onBackdropPress={this.props.cancelModal} >

                <View style={styles.selectCountryContainer}>
                    <Text style={styles.selectCountry}>SELECT COUNTRY</Text>
                    <View style={{ marginTop: 20, height: 46, alignItems: 'center', width: '90%', marginHorizontal: 20 }}>
                        <TextInput
                            style={styles.textInput}
                            placeholder={"SEARCH"}
                            onChangeText={(text) => { this.setState({ seachedItem: text }) }}
                            onChangeText={this.getSearchData}
                        />
                    </View>
                    <FlatList
                        contentContainerStyle={{ flexGrow: 1, marginTop: 25, marginHorizontal: 20, paddingBottom: 30 }}
                        data={this.state.filterData == '' ? this.state.mainCountryList : this.state.filterData}
                        renderItem={({ item }) => this._renderItem(item)}
                        showsVerticalScrollIndicator={false}
                        keyExtractor={item => item.id} />
                </View>
            </Modal>
        )
    }

    getSearchData = value => {

        let filterData = [];

        this.state.mainCountryList.map(data => {
            if (data.country.toLowerCase().includes(value.toLowerCase())) {
                filterData.push(data);
            }
        });
        this.setState({ filterData });
    }

    _renderItem = (item) => {

        return (
            <TouchableOpacity onPress={() => this.handleClick(item)}>
                <View style={{ flexDirection: 'row', paddingHorizontal: 10, paddingVertical: 10, alignItems: 'center' }}>
                    <Flag
                        code={item.country_code}
                        size={24}
                    />
                    <View style={{ paddingHorizontal: 10, flexDirection: 'row' }}>
                        <Text>{item.country}</Text>
                        <View style={{}}><Text> ({item.code})</Text></View>
                    </View>
                </View>
            </TouchableOpacity>
        )
    }

    handleClick(item, isModalVisible) {

        this.props.getCountry(item, isModalVisible);
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    selectCountryContainer: {
        height: '75%',
        width: '100%',
        backgroundColor: Color.appBackgroundColor,
        paddingBottom: 20,
        borderRadius: 10,
    },
    textInput: {
        flex: 1,
        height: 46,
        borderRadius: 10,
        width: '100%',
        marginHorizontal: 20,
        borderWidth: 1,

        borderColor: Color.borderColor.primaryColor,
        paddingHorizontal: 10
    },
    selectCountry: {
        fontSize: Dimen.veryLargeTextSize,
        fontWeight: '500',
        color: Color.textColor.pentaColor,
        textAlign: 'center',
        marginTop: 35
    }
});