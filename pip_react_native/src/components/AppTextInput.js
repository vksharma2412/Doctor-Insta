import React, { Component } from 'react'
import {
    StyleSheet,
    View,
    Image,
    TouchableOpacity,
    Text,
    TextInput,
    Dimensions,
    ActivityIndicator,
    Animated,
    Platform
} from 'react-native'
import { TextField } from 'react-native-material-textfield';
// import { assets as a } from "../../Res/assets"

// import { colors as c } from "../../Res/colors";

// import Tooltip from './tooltip'

const window = Dimensions.get('window')

const MATERIAL_TEXTFIELD_OFFSET = -20

type Props = {}
export default class AppTextInput extends Component<Props> {
    constructor(props) {
        super(props)

        let offSetValue = (this.props.value && this.props.value.length) ? 0 : MATERIAL_TEXTFIELD_OFFSET
        // if(Platform.OS == 'android' && this.props.value && this.props.value.length) offSetValue += 0
        this.state = {
            text: (this.props.value && this.props.value.length) ? this.props.value : '',
            visible: false,
            adjustedTopMarginForMaterialTextField: new Animated.Value(offSetValue)
        }
    }

    focus() {
        if (this.refs.textInput && this.refs.textInput.focus) this.refs.textInput.focus();
    }

    isFocussed() {
        if (this.refs.textInput && this.refs.textInput.isFocussed) this.refs.textInput.isFocussed();
    }

    render() {
        let height = 60;

        return (
            <View style={this.props.containerStyle || { marginTop: 18 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginHorizontal: 20 }}>
                    <View style={{
                        flex: 1,
                        flexDirection: 'row',
                        height,
                        borderWidth: .5,
                        borderRadius: 2,
                        borderColor: 'red',
                        alignItems: 'center',
                        backgroundColor: (this.props.disabled ? 'lightgrey' : undefined)
                    }}>
                        <TextInput
                            {...this.props}
                            ref={'textInput'}
                            style={{ flex: 1, height: height, fontSize: 16, marginLeft: 10, color: 'black' }}
                        /> :
                            <Animated.View style={{
                            flex: 1,
                            paddingLeft: 10,
                            marginTop: this.state.adjustedTopMarginForMaterialTextField
                        }}>
                            <TextField
                                {...this.props}
                                onChangeText={(text) => {
                                    text = text.replace(/^\s+/g, '');
                                    this.setState({ text: text })
                                    if (this.props.onChangeText)
                                        this.props.onChangeText(text)
                                }}
                                placeholder={undefined}
                                placeholderTextColor="grey"
                                label={this.props.placeholder}
                                ref={'textInput'}
                                fontSize={16}

                                lineWidth={0}
                                activeLineWidth={0}
                                disabledLineWidth={0}
                                tintColor={'green'}
                                onFocus={() => {
                                    if (this.props.onFocus) this.props.onFocus()
                                    this.setState({ isFocussed: true }, () => this.triggerAnimation())
                                }}
                                onBlur={() => {
                                    if (this.props.onBlur)
                                        this.props.onBlur()
                                    let text = this.state.text;
                                    this.setState({ isFocussed: false, text: text }, () => this.triggerAnimation())
                                    if (!this.props.skipTextChangeOnBlur)
                                        if (this.props.onChangeText && text != text.trim()) {

                                            this.props.onChangeText(this.state.text.trim());
                                        }
                                }

                                }
                                style={{ fontSize: 16, marginTop: -33, paddingLeft: 0, color: 'black' }}
                            />
                        </Animated.View>

                        {/* {this.props.info2 ? <TouchableOpacity onPress={this.props.infoPred2}
                                                              style={{
                                                                  marginRight: 3,
                                                                  justifyContent: 'center',
                                                                  alignItems: 'center',
                                                                  padding: 15
                                                              }}>
                            {this.props.info2Type == 'text' ?
                                <Text style={{fontFamily: Platform.select({ android: 'SourceSansPro-600', ios: 'SourceSansPro-Semibold' }), color: this.props.info2Color}}>{this.props.info2Text}</Text> :
                                <Image source={this.props.info2ico} resizeMode='contain'/>
                            }

                        </TouchableOpacity> : null}

                        {!this.state.isFocussed && this.props.info2 === false && this.state.text.length > 0 &&
                        <Image source={a.ico.wrong_entry} resizeMode='contain' style={{marginRight: 15}}/>} */}

                    </View>
                </View>

            </View>
        )
    }

    tooltipTapped = () => {
        this.setState({ visible: !this.state.visible })
        /*  Un comment to enable auto-hide tooltips
            if(this.timeOut) clearTimeout(this.timeOut)
            let autoDismissTooltipTimeout = this.props.dimissTimeout || 2000
            this.setState({ visible: !this.state.visible }, () => {
                if(this.state.visible) this.timeOut = setTimeout(() => this.setState({ visible: false }), autoDismissTooltipTimeout)
            })
        */
    }

    triggerAnimation = () => {
        if (this.props.useDefaultTextInput) return   // no need to trigger top margin adjustment animation on default text field.
        let value = (this.state.isFocussed || this.state.text.length > 0) ? 0 : MATERIAL_TEXTFIELD_OFFSET

        // if(Platform.OS == 'android' && this.state.text.length && this.state.isFocussed) value += 0
        Animated.timing(this.state.adjustedTopMarginForMaterialTextField, {
            toValue: value,
            duration: 225,
        }).start()
    }

}
