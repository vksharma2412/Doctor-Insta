import React, { Component } from 'react';
import {
    StyleSheet,
    View,
    Modal,
    Image,
    Text,
    TextInput,
    TouchableWithoutFeedback,
    Keyboard,
    TouchableOpacity,
    SafeAreaView,
    StatusBar,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Color, Dimen } from '../../res';


export const PopUp = ({
    isPopVisible,
    boxWrapperContainer,
    headerWrapper,
    headerStyle,
    descriptionWrapper,
    descriptionStyle,
    buttonTextStyle,
    leftButtonOnPress,
    rightButtonOnPress,
    headerText,
    descriptionText,
    rightButtonText,
    leftButtonText,
}) => {


    return (
        <View>
            <StatusBar barStyle='dark-content' />
            <Modal
                transparent={true}
                animationType={'none'}
                visible={isPopVisible}
                onRequestClose={() => { }}>
                <TouchableWithoutFeedback >
                    <View style={styles.modalBackground}>
                        <View style={[{ height: '25%', width: '70%', backgroundColor: 'white', borderRadius: 10 }, boxWrapperContainer]}>

                            <View style={[styles.headerWrapper, { flex: 0.4 }, headerWrapper]}>
                                <Text style={[styles.headerStyle, {}, headerStyle]}>{headerText}</Text>
                            </View>
                            <View style={[styles.descriptionWrapper, { flex: 0.3 }, descriptionWrapper,]}>
                                <Text style={[styles.descriptionStyle, descriptionStyle]}>{descriptionText}</Text>
                            </View>
                            <View style={{ flex: 0.3, flexDirection: 'row', marginHorizontal: 20 }}>

                                <View style={{ flex: 0.6 }}></View>
                                <TouchableOpacity
                                    style={styles.button}
                                    onPress={leftButtonOnPress}>
                                    <Text style={[styles.buttonTextStyle, buttonTextStyle]}>{leftButtonText}</Text>
                                </TouchableOpacity>

                                <View style={{ height: '100%', width: 1, }}></View>

                                <TouchableOpacity
                                    onPress={rightButtonOnPress}
                                    style={styles.button}>
                                    <Text style={[styles.buttonTextStyle, buttonTextStyle]}>{rightButtonText}</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </TouchableWithoutFeedback>
            </Modal>
        </View >
    )
}

const styles = StyleSheet.create({
    modalBackground: {
        flex: 1,
        backgroundColor: '#00000080',
        justifyContent: 'center',
        alignItems: 'center',
    },

    searchStyle: {
        flex: 0.8,
        height: 80,
        backgroundColor: "#FFFFFF",
        color: 'black'


    },
    searchBackButton: {
        flex: 0.1,
        justifyContent: 'center',
        alignItems: 'center',
        height: 80,
        // backgroundColor: colors.secondaryColor
    },
    headerWrapper: {
        paddingHorizontal: 20,
        justifyContent: 'center',
        // alignItems: 'center'
    },
    headerStyle: {
        fontSize: Dimen.largeTextSize,
        fontWeight: '600'
    },
    descriptionWrapper: {
        paddingHorizontal: 20,
        // justifyContent: 'center',
        // alignItems: 'center',
    },
    descriptionStyle: {
        fontSize: Dimen.smallTextSize
    },

    button: {
        flex: 0.2,
        justifyContent: 'center',
        alignItems: 'center'
    },
    buttonTextStyle: {
        color: '#0B61AF',
        fontSize: Dimen.mediumTextSize,
        fontWeight: '500'
    },
});

// import React, { Component } from 'react';
// import { View, StatusBar } from 'react-native';
// import Dialog from "react-native-dialog";

// class PopUp extends Component {
//     constructor(props) {
//         super(props)
//     }
//     render() {
//         return (
//             <View>
//                 <StatusBar barStyle="light-content" />
//                 <Dialog.Container
//                     visible={this.props.showDialog}
//                 >
//                     {this.props.title &&
//                         <Dialog.Title>{this.props.title}</Dialog.Title>
//                     }
//                     <Dialog.Description>{this.props.description}
//                     </Dialog.Description>
//                     {
//                         this.props.showCancel &&
//                         <Dialog.Button label={this.props.cancel ? this.props.cancel : "Cancel"} onPress={this.props.handleCancel} />
//                     }
//                     <Dialog.Button label={this.props.doneText ? this.props.doneText : "Yes"} onPress={this.props.handleDone} />
//                 </Dialog.Container>
//             </View>
//         );
//     }
// };

export default PopUp;