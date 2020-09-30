import React, { Component } from "react";
import { Text, StyleSheet, View, TouchableOpacity, TextInput, FlatList, KeyboardAvoidingView, TouchableWithoutFeedback, ScrollView, Keyboard } from "react-native";
import Modal from 'react-native-modal';
import { Dimen, Color } from '../../res';
import Flag from 'react-native-flags';



export default class SelectCity extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isModalVisible: false,
            filterData: '',
            mainList: [],
        };
    }

    componentDidMount() {
        this.setState({ mainList: this.props.data })
    }

    cancelModal = () => {
        this.props.cancelModal();
        this.setState({
            filterData: []
        })
    }

    render() {
        console.log("this.props.data" + JSON.stringify(this.props.data) + "====>>>  isModalshow")
        let { isModalshow } = this.props;
        return (
            <Modal isVisible={isModalshow} style={{ flex: 1, justifyContent: 'flex-start' }} hasBackdrop={true} onBackButtonPress={this.props.cancelModal} coverScreen={true} onBackdropPress={this.props.cancelModal} >
                {/* <KeyboardAvoidingView enabled behavior={Platform.OS === "android" ? undefined : "position"}
                    keyboardShouldPersistTaps="always"
                > */}
                {/* <ScrollView
                    contentContainerStyle={{ flexGrow: 1 }}
                    scrollEnabled={false} keyboardShouldPersistTaps="always">
                    <TouchableWithoutFeedback onPress={Keyboard.dismiss}> */}
                <View style={styles.selectCountryContainer}>
                    <Text style={styles.selectCountry}>{this.props.dropdownHeader}</Text>
                    <View style={{ marginTop: 20, height: 46, alignItems: 'center', width: '90%', marginHorizontal: 20 }}>
                        <TextInput
                            style={styles.textInput}
                            placeholder={"SEARCH"}
                            onChangeText={(text) => { this.setState({ seachedItem: text }) }}
                            onChangeText={this.getSearchData}
                        />
                    </View>
                    {this.state.mainList.length > 0 && <FlatList
                        style={{ flex: 1, marginTop: 25, marginHorizontal: 20 }}
                        data={this.state.filterData.length == 0 ? this.state.mainList : this.state.filterData}
                        renderItem={({ item }) => this._renderItem(item)}
                        extraData={this.state}
                        keyExtractor={item => item.id} />}
                </View>
                {/* </TouchableWithoutFeedback>
                </ScrollView> */}
                {/* </KeyboardAvoidingView> */}

            </Modal>
        )

    }

    getSearchData = value => {

        let filterData = [];
        if (this.state.mainList) {
            this.state.mainList.map(data => {
                if (data.toString().toLowerCase().includes(value.toLowerCase())) {
                    filterData.push(data);
                }
            });
            this.setState({ filterData });
        }
    }

    _renderItem = (item) => {

        return (
            <TouchableOpacity onPress={() => this.handleClick(item)}>
                <View style={{ flexDirection: 'row', paddingHorizontal: 10, paddingVertical: 10, alignItems: 'center' }}>

                    <View style={{ paddingHorizontal: 10, flexDirection: 'row' }}>
                        <Text>{item}</Text>
                    </View>
                </View>
            </TouchableOpacity>
        )
    }

    handleClick(item, isModalVisible) {
        this.setState({ mainList: [], filterData: [] })
        this.props.getCountry(item, isModalVisible);
    }


    // UNSAFE_componentWillReceiveProps = nextProps => {
    //     this.setState({ mainList: this.props.data })
    // }

}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    selectCountryContainer: {
        height: '80%',
        width: '100%',
        backgroundColor: Color.appBackgroundColor,
        paddingBottom: 20,
        borderRadius: 10
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