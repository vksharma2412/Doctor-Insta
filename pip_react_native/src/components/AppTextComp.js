import React, { Component } from 'react'
import { StyleSheet, View, Image, TextInput, Text, TouchableOpacity, Dimensions, Platform } from 'react-native'
import { TextField } from 'react-native-material-textfield'


// import { colors, strings, assets, Fonts, constants } from '../res/index';

const window = Dimensions.get('window')


type Props = {}
export default class AppTextInput extends Component<Props> {
    constructor(props) {
        super(props)

        this.state = {
            isFocussed: this.props.isFocussed,
            text: (this.props.value && this.props.value.length) ? this.props.value : ''
        }
    }

    // inputRef = React.createRef();

    focus = () => this.refs.textInput.focus()



    componentDidUpdate() {
        this.refs.textInput.setValue(this.props.value);
    }

    render() {
        if (this.props.materialTextInput) {
            let height = 45
            return (
                <View style={[this.props.style, { flexDirection: 'row', alignItems: 'flex-end' }]}>
                    <TextField {...this.props}
                        // ref={this.inputRef}
                        editable={this.props.editable}
                        placeholder={this.props.placeholder}
                        placeholderTextColor="grey"
                        label={this.props.labelEnabled ? this.state.text.length > 0 || this.props.value.length > 0 ? this.props.placeholder : '' : ''}
                        ref={'textInput'}
                        lineWidth={(this.props.lineWidth != undefined) ? this.props.lineWidth : 1}
                        activeLineWidth={(this.props.activeLineWidth != undefined) ? this.props.activeLineWidth : 2}
                        disabledLineWidth={(this.props.disabledLineWidth != undefined) ? this.props.disabledLineWidth : 0}
                        inputContainerPadding={4}
                        onFocus={() => this.setState({ isFocussed: true }, this.props.onFocus)} onBlur={() => this.setState({ isFocussed: false }, this.props.onBlur)}
                        style={[{
                            fontSize: 14, backgroundColor: 'transparent',
                            // borderBottomWidth: 0.8,
                        }, this.props.inputStyleOverrides,]}
                        containerStyle={{ top: (this.props.topMarginOffset || -20), height, width: this.props.width || '100%', }}
                        onChangeText={(text) => {
                            this.setState({ text: text })
                            if (this.props.onChangeText) this.props.onChangeText(text)
                        }}
                    />
                </View>
            )
        } else {
            let height = 30
            let width = this.props.width || '100%'
            let defaultContainerStyle = {
                width,
                height,
                borderBottomWidth: (this.state.isFocussed ? this.props.activeLineWidth : this.props.lineWidth) || 1,

            }
            // return (
            //     <View style={[defaultContainerStyle, this.props.containerStyle]}>
            //         <TextInput {...this.props} width={undefined} ref={'textInput'}
            //             onFocus={() => this.setState({ isFocussed: true })} onBlur={() => this.setState({ isFocussed: false })} />
            //     </View>
            // )
        }
    }


    tooltipTapped = () => {
        this.setState({ visible: !this.state.visible })
    }

    componentDidMount() {
        if (this.props.isFocussed) this.focus()
    }

}
